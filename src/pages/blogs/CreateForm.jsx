import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axios";
import playNotificationSound from "../../utils/playNotification";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function BlogPostForm({ onBlogCreated, initialData, mode, setIsDrawerOpen }) {
  // Form fields
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  // We'll keep this state but not display it in the UI
  const [formattedDate, setFormattedDate] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageWasRemoved, setImageWasRemoved] = useState(false);
  const [theme, setTheme] = useState("light");
  
  // New state to store individual date components for custom display
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  
  const MAX_WORD_COUNT = 5000;
  const MIN_WORD_COUNT = 10;
  
  // Validation errors
  const [errors, setErrors] = useState({
    title: "",
    author: "",
    date: "",
    excerpt: "",
    content: "",
    image: ""
  });

  const inputRef = useRef(null);
  const quillRef = useRef(null);
  const isResetting = useRef(false);

  // Month options for grammatical display
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  // Days array for day selection
  const generateDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push({
        value: i < 10 ? `0${i}` : `${i}`,
        label: `${i}`
      });
    }
    return days;
  };
  
  const days = generateDays();

  // Years array for year selection
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 100; i--) {
      years.push({
        value: `${i}`,
        label: `${i}`
      });
    }
    return years;
  };
  
  const years = generateYears();

  // Quill editor modules and formats configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
    ],
    clipboard: {
      // Toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link',
    'align', 'color', 'background', 'font',
    'blockquote', 'code-block',
  ];

  // Format date for display with month name
  const formatDateWithMonth = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Convert date to YYYY-MM-DD format for input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    // Format as YYYY-MM-DD for the date input
    return date.toISOString().split('T')[0];
  };

  // Parse date string into individual components
  const parseDateToComponents = (dateString) => {
    if (!dateString) return { day: "", month: "", year: "" };
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return { day: "", month: "", year: "" };
    
    const monthValue = (date.getMonth() + 1).toString().padStart(2, '0');
    const dayValue = date.getDate().toString().padStart(2, '0');
    const yearValue = date.getFullYear().toString();
    
    return {
      day: dayValue,
      month: monthValue,
      year: yearValue
    };
  };

  // Function to strip HTML tags and count words
  const getWordCountFromHTML = (html) => {
    if (!html) return 0;
    
    // Remove HTML tags and get plain text
    const plainText = html.replace(/<[^>]*>/g, '').trim();
    
    // Count words by splitting on whitespace and filtering empty strings
    const words = plainText.split(/\s+/).filter(word => word.length > 0);
    
    return words.length;
  };

  // Calculate word count from content
  useEffect(() => {
    if (content) {
      const count = getWordCountFromHTML(content);
      setWordCount(count);
      
      // Update content validation error
      let contentError = "";
      if (!content.trim()) {
        contentError = "Content is required.";
      } else if (count < MIN_WORD_COUNT) {
        contentError = `Content must be at least ${MIN_WORD_COUNT} words (currently ${count}).`;
      } else if (count > MAX_WORD_COUNT) {
        contentError = `Content cannot exceed ${MAX_WORD_COUNT} words (currently ${count}).`;
      }
      
      setErrors(prev => ({
        ...prev,
        content: contentError
      }));
    } else {
      setWordCount(0);
      setErrors(prev => ({
        ...prev,
        content: "Content is required."
      }));
    }
  }, [content]);

  // Load theme from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setTheme(localStorage.getItem("theme") || "light");
    }
  }, []);

  // Update the date value when day, month, or year changes
  useEffect(() => {
    if (day && month && year) {
      const newDate = `${year}-${month}-${day}`;
      setDate(newDate);
      
      // Validate the new date
      const dateError = validateDate(newDate);
      setErrors(prev => ({
        ...prev,
        date: dateError
      }));
    }
  }, [day, month, year]);

  // Validation functions
  const validateTitle = (value) => {
    if (!value.trim()) {
      return "Title is required";
    }
    if (value.trim().length < 5) {
      return "Title must be at least 5 characters long";
    }
    if (value.trim().length > 100) {
      return "Title cannot exceed 100 characters";
    }
    return "";
  };

  const validateAuthor = (value) => {
    if (!value.trim()) {
      return "Author name is required";
    }
    if (value.trim().length < 2) {
      return "Author name must be at least 2 characters long";
    }
    if (value.trim().length > 50) {
      return "Author name cannot exceed 50 characters";
    }
    return "";
  };

  const validateDate = (value) => {
    if (!value) {
      return "Date is required";
    }
    const selectedDate = new Date(value);
    const currentDate = new Date();
    if (selectedDate > currentDate) {
      return "Date cannot be in the future";
    }
    return "";
  };

  const validateExcerpt = (value) => {
    if (!value.trim()) {
      return "Excerpt is required";
    }
    if (value.trim().length < 20) {
      return "Excerpt must be at least 20 characters long";
    }
    if (value.trim().length > 300) {
      return "Excerpt cannot exceed 300 characters";
    }
    return "";
  };

  const validateContent = (value) => {
    if (!value || !value.trim()) {
      return "Content is required";
    }
    
    // Count words using our HTML stripping method
    const count = getWordCountFromHTML(value);
    
    if (count < MIN_WORD_COUNT) {
      return `Content must be at least ${MIN_WORD_COUNT} words (currently ${count}).`;
    }
    
    if (count > MAX_WORD_COUNT) {
      return `Content cannot exceed ${MAX_WORD_COUNT} words (currently ${count}).`;
    }
    
    return "";
  };

  const validateImage = (file) => {
    // For add mode, image is always required
    if (mode === "add" && !file) {
      return "Image is required";
    }
    
    // For edit mode, image is required if original was removed
    if (mode === "edit" && imageWasRemoved && !file) {
      return "Image is required";
    }
    
    // Validate file type and size if a file is selected
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        return "Invalid image type. Allowed types: JPEG, PNG, GIF, WebP";
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return "Image size cannot exceed 5MB";
      }
    }
    
    return "";
  };

  // Validation handler
  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        return validateTitle(value);
      case 'author':
        return validateAuthor(value);
      case 'date':
        return validateDate(value);
      case 'excerpt':
        return validateExcerpt(value);
      case 'content':
        return validateContent(value);
      case 'image':
        return validateImage(value);
      default:
        return "";
    }
  };

  // Handle date component changes
  const handleDateComponentChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'day') {
      setDay(value);
    } else if (name === 'month') {
      setMonth(value);
    } else if (name === 'year') {
      setYear(value);
    }
  };

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    let errorMessage = "";

    if (name === 'image') {
      const file = files[0];
      if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setImageWasRemoved(false);
      }
      errorMessage = validateField('image', file);
    } else {
      // For other text inputs
      switch (name) {
        case 'title':
          setTitle(value);
          break;
        case 'author':
          setAuthor(value);
          break;
        case 'excerpt':
          setExcerpt(value);
          break;
      }
      errorMessage = validateField(name, value);
    }

    // Update errors state
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: errorMessage
    }));
  };
  
  // Handle ReactQuill content change
  const handleContentChange = (value) => {
    setContent(value);
    // validation is handled in the useEffect
  };
  
  const resetForm = () => {
    if (isResetting.current) return; // Prevent multiple resets
    
    isResetting.current = true;
    
    setTitle("");
    setAuthor("");
    setDate("");
    setDay("");
    setMonth("");
    setYear("");
    setFormattedDate("");
    setExcerpt("");
    setContent("");
    setImageFile(null);
    setImagePreview(null);
    setImageWasRemoved(false);
    setWordCount(0);
    setErrors({
      title: "",
      author: "",
      date: "",
      excerpt: "",
      content: "",
      image: ""
    });
    
    // Reset the flag after a short delay to prevent double reset
    setTimeout(() => {
      isResetting.current = false;
    }, 100);
  }

  // Form submission validation
  const validateForm = () => {
    const titleError = validateTitle(title);
    const authorError = validateAuthor(author);
    const dateError = validateDate(date);
    const excerptError = validateExcerpt(excerpt);
    const contentError = validateContent(content);
    const imageError = validateImage(imageFile);

    const newErrors = {
      title: titleError,
      author: authorError,
      date: dateError,
      excerpt: excerptError,
      content: contentError,
      image: imageError
    };
    
    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error);
    return !hasErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate entire form before submission
    if (!validateForm()) {
      toast.error("Please fix all errors before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("date", date);
    formData.append("excerpt", excerpt);
    formData.append("content", content);

    // Include image removed flag for edit mode
    if (mode === "edit" && imageWasRemoved) {
      formData.append("imageRemoved", "true");
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setLoading(true);
      let response;
      
      if (mode === "add") {
        response = await axiosInstance.post("/blog/create-blog", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success(response.data.message || "Blog post created successfully!");

      } else if (mode === "edit" && initialData) {
        response = await axiosInstance.put(
          `/blog/update-blog/${initialData.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        playNotificationSound();
        toast.success(response.data.message || "Blog post updated successfully!");
      }

      if (onBlogCreated) {
        onBlogCreated();
      }

      // Close drawer first, then reset the form to avoid double reset
      setIsDrawerOpen(false);
      
    } catch (error) {
      console.error("Error handling blog post:", error);
      toast.error("Failed to save blog post. Please try again.");
    } finally {
      setLoading(false); // Hide loader after submission
    }
  };

  // Handle image removal
  const handleRemoveImage = (e) => {
    // Prevent click event from bubbling up to the container
    e.stopPropagation();
    
    setImageFile(null);
    setImagePreview(null);
    setImageWasRemoved(true);
    
    // Validate image field after removal
    const imageError = validateImage(null);
    setErrors(prevErrors => ({
      ...prevErrors,
      image: imageError
    }));
    
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Populate form in edit mode
  useEffect(() => {
    // Skip if we're in the process of resetting
    if (isResetting.current) return;
    
    if (mode === "edit" && initialData) {
      setTitle(initialData.title || "");
      setAuthor(initialData.author || "");
      
      // Format the date for the input field (YYYY-MM-DD)
      const formattedInputDate = formatDateForInput(initialData.date);
      setDate(formattedInputDate);
      
      // Parse the date to update individual components
      const { day, month, year } = parseDateToComponents(initialData.date);
      setDay(day);
      setMonth(month);
      setYear(year);
      
      setExcerpt(initialData.excerpt || "");
      setContent(initialData.content || "");
      setImagePreview(initialData.image || null);
      setImageWasRemoved(false);
      
      // Make sure to update word count for initial content
      if (initialData.content) {
        const count = getWordCountFromHTML(initialData.content);
        setWordCount(count);
      }
      
    } else if (mode === "add") {
      // Reset all fields
      setTitle("");
      setAuthor("");
      setDate("");
      setDay("");
      setMonth("");
      setYear("");
      setFormattedDate("");
      setExcerpt("");
      setContent("");
      setImageFile(null);
      setImagePreview(null);
      setImageWasRemoved(false);
      setWordCount(0);
      // Completely clear all error messages
      setErrors({
        title: "",
        author: "",
        date: "",
        excerpt: "",
        content: "",
        image: ""
      });
    }
  }, [mode, initialData]);

  const onCancel = () => {
    // Only close the drawer, don't call resetForm() here
    setIsDrawerOpen(false);
    setErrors({
      title: "",
      author: "",
      date: "",
      excerpt: "",
      content: "",
      image: ""
    });
  }

  // Calculate word count status for styling
  const getWordCountStatus = () => {
    if (wordCount > MAX_WORD_COUNT) {
      return "text-error";
    } else if (wordCount < MIN_WORD_COUNT) {
      return "text-error";
    } else if (wordCount > MAX_WORD_COUNT * 0.9) {
      return "text-warning";
    }
    return "text-success";
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Title Input */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Title <span className="text-error"> *</span></span>
        </label>
        <input
          type="text"
          name="title"
          placeholder="Post title"
          className={`input input-bordered ${errors.title ? 'input-error' : 'border-accent'}`}
          value={title}
          onChange={handleInputChange}
        />
        {errors.title && <p className="text-error text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Author Input */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Author <span className="text-error"> *</span></span>
        </label>
        <input
          type="text"
          name="author"
          placeholder="Author name"
          className={`input input-bordered ${errors.author ? 'input-error' : 'border-accent'}`}
          value={author}
          onChange={handleInputChange}
        />
        {errors.author && <p className="text-error text-sm mt-1">{errors.author}</p>}
      </div>

      {/* Custom Date Input with Grammatical Month */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Date <span className="text-error"> *</span></span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {/* Day dropdown */}
          <select
            name="day"
            className={`select select-bordered ${errors.date ? 'select-error' : 'border-accent'}`}
            value={day}
            onChange={handleDateComponentChange}
          >
            <option value="" disabled>Day</option>
            {days.map(dayOption => (
              <option key={dayOption.value} value={dayOption.value}>
                {dayOption.label}
              </option>
            ))}
          </select>
          
          {/* Month dropdown with grammatical names */}
          <select
            name="month"
            className={`select select-bordered ${errors.date ? 'select-error' : 'border-accent'}`}
            value={month}
            onChange={handleDateComponentChange}
          >
            <option value="" disabled>Month</option>
            {months.map(monthOption => (
              <option key={monthOption.value} value={monthOption.value}>
                {monthOption.label}
              </option>
            ))}
          </select>
          
          {/* Year dropdown */}
          <select
            name="year"
            className={`select select-bordered ${errors.date ? 'select-error' : 'border-accent'}`}
            value={year}
            onChange={handleDateComponentChange}
          >
            <option value="" disabled>Year</option>
            {years.map(yearOption => (
              <option key={yearOption.value} value={yearOption.value}>
                {yearOption.label}
              </option>
            ))}
          </select>
        </div>
        {errors.date && <p className="text-error text-sm mt-1">{errors.date}</p>}
      </div>

      {/* Excerpt Input */}
      <div className="form-control mb-4">
      <label className="label">
  <span className="label-text flex items-center gap-1 group relative">
    Excerpt <span className="text-error">*</span>
    
    <span className="w-4 h-4 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center cursor-pointer">
      ℹ️
    </span>

    {/* Tooltip */}
    <span className="absolute top-full left-1/2 -translate-x-1/2 sm:left-full sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 mt-2 sm:mt-0 p-2 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-[90vw] sm:w-max max-w-xs sm:max-w-sm md:max-w-sm lg:max-w-sm whitespace-normal break-words z-50">
    A short summary or introduction of the blog post, typically one or two sentences long. It helps users quickly understand what the post is about when browsing through multiple blog entries.
    </span>
  </span>
</label>

        <textarea
          name="excerpt"
          className={`textarea textarea-bordered ${errors.excerpt ? 'textarea-error' : ''}`}
          placeholder="Short summary of the blog post..."
          value={excerpt}
          onChange={handleInputChange}
        ></textarea>
        {errors.excerpt && <p className="text-error text-sm mt-1">{errors.excerpt}</p>}
      </div>

      {/* Image Upload */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Image <span className="text-error"> *</span></span>
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer ${errors.image ? 'border-error' : 'border-neutral'}`}
          onClick={() => inputRef.current?.click()}
        >
          {!imagePreview ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-primary mb-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M4 3a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v3.586l-1.293-1.293a1 1 0 00-1.414 0L10 12l-2.293-2.293a1 1 0 00-1.414 0L4 12V5zm0 10v-1.586l2.293-2.293a1 1 0 011.414 0L10 13l3.293-3.293a1 1 0 011.414 0L16 12.414V15H4z" />
              </svg>
              <p className="text-neutral-content">Drag and drop or click to upload</p>
            </>
          ) : (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <button
                type="button"
                className="absolute top-2 right-2 btn btn-xs btn-error"
                onClick={handleRemoveImage}
              >
                Remove
              </button>
            </div>
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            className="hidden"
            ref={inputRef}
            onChange={handleInputChange}
          />
        </div>
        {errors.image && <p className="text-error text-sm mt-1">{errors.image}</p>}
      </div>

      {/* Content Input with ReactQuill */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Content <span className="text-error"> *</span></span>
          <span className={`label-text-alt ${getWordCountStatus()}`}>
            {wordCount}/{MAX_WORD_COUNT} words
          </span>
        </label>
        <div className={`quill-container ${theme === "dark" ? "dark-mode" : "light-mode"}`}>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={handleContentChange}
            modules={quillModules}
            formats={quillFormats}
            className={`custom-quill ${errors.content ? 'quill-error' : ''}`}
            placeholder="Write your post content..."
          />
          <style jsx global>{`
            .quill-container {
              border-radius: 0.5rem;
              overflow: hidden;
            }
            
            .quill-container .ql-container {
              min-height: 200px;
              max-height: 500px;
              overflow-y: auto;
              font-size: 16px;
              font-family: inherit;
            }
            
            .quill-container .ql-editor {
              min-height: 200px;
              padding: 1rem;
            }
            
            .quill-container .ql-toolbar {
              border-top-left-radius: 0.5rem;
              border-top-right-radius: 0.5rem;
              flex-wrap: wrap;
            }
            
            /* Error state styling */
            .quill-error .ql-toolbar {
              border-color: #f56565;
            }
            
            .quill-error .ql-container {
              border-color: #f56565;
            }
            
            /* Light Mode Styles */
            .light-mode .ql-editor::before {
              color: gray !important; /* Light mode placeholder color */
              opacity: 0.6;
            }

            /* Dark Mode Styles */
            .dark-mode .ql-editor::before {
              color: white !important; /* Dark mode placeholder color */
              opacity: 0.6;
            }
            
            /* Toolbar button styles */
            .dark-mode .ql-toolbar button {
              color: #e2e8f0;
            }
            
            .dark-mode .ql-toolbar button svg path {
              stroke: #e2e8f0;
            }
            
            .dark-mode .ql-toolbar .ql-stroke {
              stroke: #e2e8f0;
            }
            
            .dark-mode .ql-toolbar .ql-fill {
              fill: #e2e8f0;
            }
            
            .dark-mode .ql-toolbar .ql-picker {
              color: #e2e8f0;
            }
            
            /* Improve button styling in toolbar */
            .ql-toolbar button {
              margin: 2px;
            }
            
            /* Make sure images are responsive within the editor */
            .ql-editor img {
              max-width: 100%;
              height: auto;
            }
            
            /* Better table styling */
            .ql-editor table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 1rem;
            }
            
            .ql-editor td {
              border: 1px solid #ced4da;
              padding: 8px;
            }
            
            /* Code block styling */
            .ql-editor pre {
              background-color: #f1f1f1;
              color: #333;
              padding: 0.75rem;
              border-radius: 4px;
              font-family: monospace;
              white-space: pre-wrap;
            }
            
            .dark-mode .ql-editor pre {
              background-color: #2d3748;
              color: #e2e8f0;
            }
          `}</style>
        </div>
        {errors.content && <p className="text-error text-sm mt-1">{errors.content}</p>}
      </div>

      {/* Publish Button */}
      <div className="form-control mt-6 flex flex-col gap-2">
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading || wordCount < MIN_WORD_COUNT || wordCount > MAX_WORD_COUNT}
        >
          {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
          {loading ? (mode === "add" ? "Creating..." : "Updating...") : mode === "add" ? "Create" : "Update"}
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default BlogPostForm;