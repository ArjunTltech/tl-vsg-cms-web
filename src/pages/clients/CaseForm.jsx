import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axios";
import playNotificationSound from "../../utils/playNotification";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function CaseForm({ onClientCreated, refreshClientList, initialData, mode, setIsDrawerOpen }) {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  const inputRef = useRef(null);
  const quillRef = useRef(null);
  const formMounted = useRef(true);
  const cancelTimeoutRef = useRef(null);
  const resetTimeoutRef = useRef(null);
  
  // Min and max word count constraints for description
  const MIN_WORD_COUNT = 10;
  const MAX_WORD_COUNT = 5000;
  
  const [errors, setErrors] = useState({});
  
  // Quill editor modules and formats configuration
  const quillModules = {
    toolbar: {
      container: [
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
      // Add tooltips for all buttons
      handlers: {},
    },
    clipboard: {
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

  // Component mount/unmount tracking
  useEffect(() => {
    formMounted.current = true;
    return () => {
      // Clear any pending timeouts on unmount
      if (cancelTimeoutRef.current) {
        clearTimeout(cancelTimeoutRef.current);
      }
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
      
      // Revoke any object URLs and set mounted flag to false
      cleanupImagePreview();
      formMounted.current = false;
    };
  }, []);

  // Helper function to cleanup image preview URL
  const cleanupImagePreview = () => {
    if (imagePreview && (!initialData || imagePreview !== initialData.image)) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  // Add tooltips to the toolbar buttons after component mounts
  useEffect(() => {
    if (!quillRef.current) return;
    
    const addTooltips = () => {
      try {
        const toolbar = quillRef.current.getEditor().getModule('toolbar');
        
        if (toolbar && toolbar.container) {
          // Add tooltips to all toolbar buttons
          const buttons = toolbar.container.querySelectorAll('button, .ql-picker');
          
          buttons.forEach(button => {
            // Get the class name which indicates the button type
            const className = Array.from(button.classList)
              .find(cls => cls.startsWith('ql-'));
              
            if (className) {
              // Extract the button type (bold, italic, etc.)
              const buttonType = className.replace('ql-', '');
              
              // Set tooltip based on button type
              const tooltipText = getTooltipText(buttonType);
              if (tooltipText) {
                button.setAttribute('title', tooltipText);
              }
            }
          });
        }
      } catch (err) {
        console.error("Error adding tooltips:", err);
      }
    };

    // Try immediately and also with a slight delay to ensure Quill is fully initialized
    addTooltips();
    const tooltipTimer = setTimeout(addTooltips, 500);
    
    return () => clearTimeout(tooltipTimer);
  }, [quillRef.current, description]); // Re-run when description changes to ensure toolbar is initialized
  
  // Function to get tooltip text based on button type
  const getTooltipText = (buttonType) => {
    const tooltips = {
      'bold': 'Bold',
      'italic': 'Italic',
      'underline': 'Underline',
      'strike': 'Strikethrough',
      'header': 'Heading',
      'blockquote': 'Blockquote',
      'code-block': 'Code Block',
      'link': 'Insert Link',
      'image': 'Insert Image',
      'clean': 'Clear Formatting',
      'list': 'List',
      'bullet': 'Bullet List',
      'indent': 'Indent',
      'color': 'Text Color',
      'background': 'Background Color',
      'font': 'Font Family',
      'align': 'Text Alignment',
      'ordered': 'Ordered List',
    };
    
    return tooltips[buttonType] || buttonType.charAt(0).toUpperCase() + buttonType.slice(1);
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

  // Calculate word count from description
  useEffect(() => {
    if (!formMounted.current || isSubmitting || isCancelling) return;
    
    if (description) {
      const count = getWordCountFromHTML(description);
      setWordCount(count);
      
      // Update description validation error
      let descriptionError = "";
      if (!description.trim()) {
        descriptionError = "Description is required.";
      } else if (count < MIN_WORD_COUNT) {
        descriptionError = `Description must be at least ${MIN_WORD_COUNT} words (currently ${count}).`;
      } else if (count > MAX_WORD_COUNT) {
        descriptionError = `Description cannot exceed ${MAX_WORD_COUNT} words (currently ${count}).`;
      }
      
      setErrors(prev => ({
        ...prev,
        description: descriptionError
      }));
    } else {
      setWordCount(0);
      setErrors(prev => ({
        ...prev,
        description: "Description is required."
      }));
    }
  }, [description, isSubmitting, isCancelling]);

  // Load theme from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setTheme(localStorage.getItem("theme") || "light");
    }
  }, []);
  
  const validateField = (name, value, mode) => {
    if (isSubmitting || isCancelling) return null;
    
    const containsNumbers = /\d/;
  
    switch (name) {
      case 'title':
        if (value.trim().length < 3) {
          return "Title must be at least 3 characters long";
        }
        if (containsNumbers.test(value)) {
          return "Title cannot contain numbers";
        }
        return null;
  
      case 'description':
        if (!value.trim()) {
          return "Description is required";
        }
        
        const wordCount = getWordCountFromHTML(value);
        
        if (wordCount < MIN_WORD_COUNT) {
          return `Description must be at least ${MIN_WORD_COUNT} words (currently ${wordCount})`;
        }
        
        if (wordCount > MAX_WORD_COUNT) {
          return `Description cannot exceed ${MAX_WORD_COUNT} words (currently ${wordCount})`;
        }
        
        return null;
  
      case 'subtitle':
        if (!value) return null; // optional
        if (value.trim().length < 3) {
          return "Subtitle must be at least 3 characters long";
        }
        if (containsNumbers.test(value)) {
          return "Subtitle cannot contain numbers";
        }
        return null;
  
      case 'image':
        if (mode === 'edit' && !value && imagePreview) {
          return null; // Using existing image in edit mode
        }
        return (value || imagePreview) ? null : "Image is required";
  
      case 'author':
        if (!value) return null; // optional
        return value.trim().length >= 3
          ? null
          : "Author must be at least 3 characters long";
  
      default:
        return null;
    }
  };
  
  // Load initial data when component mounts or mode changes
  useEffect(() => {
    // Clear any pending timeouts when mode changes
    if (cancelTimeoutRef.current) {
      clearTimeout(cancelTimeoutRef.current);
      cancelTimeoutRef.current = null;
    }
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
    
    // Reset cancelling state to prevent issues
    setIsCancelling(false);
    
    if (mode === "edit" && initialData) {
      // Always reload all data from initialData when in edit mode
      setTitle(initialData.title || "");
      setSubTitle(initialData.subTitle || "");
      setAuthor(initialData.author || "");
      setDescription(initialData.description || "");
      
      if (initialData.image) {
        setImagePreview(initialData.image);
      } else {
        setImagePreview(null);
      }
      
      // Make sure to update word count for initial description
      if (initialData.description) {
        const count = getWordCountFromHTML(initialData.description);
        setWordCount(count);
      }
      
      // Clear any previous errors when loading initial data
      setErrors({});
    } else if (mode === "add") {
      resetForm();
    }
  }, [mode, initialData, setIsDrawerOpen]); // Added setIsDrawerOpen as dependency

  const handleImageChange = (event) => {
    if (isCancelling) return;
    
    const file = event.target.files[0];
    if (file) {
      setErrors(prev => ({
        ...prev,
        image: ""
      }));
      setImageFile(file);
      
      // Revoke previous URL to prevent memory leaks
      cleanupImagePreview();
      
      setImagePreview(URL.createObjectURL(file));
    } else {
      handleRemoveImage();
    }
  };

  const handleRemoveImage = (e) => {
    if (e) {
      e.stopPropagation(); // Prevent event bubbling to parent
    }
    
    if (isCancelling) return;
    
    // Revoke URL to prevent memory leaks
    cleanupImagePreview();
    
    setImageFile(null);
    setImagePreview(null);
    
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    
    if (!isCancelling) {
      setErrors(prev => ({
        ...prev,
        image: "Image is required"
      }));
    }
  };

  const resetForm = () => {
    // Only run if the component is still mounted
    if (!formMounted.current) return;
    
    // Revoke URL to prevent memory leaks
    cleanupImagePreview();
    
    setTitle("");
    setSubTitle("");
    setDescription("");
    setAuthor("");
    setImageFile(null);
    setImagePreview(null);
    setWordCount(0);
    setErrors({});
    
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (isSubmitting || isCancelling) return;
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subTitle", subTitle);
      formData.append("author", author);
      formData.append("description", description);
      const newErrors = {};

      const titleError = validateField('title', title);
      if (titleError) newErrors.title = titleError;
      
      const subtitleError = validateField('subtitle', subTitle);
      if (subtitleError) newErrors.subtitle = subtitleError;

      const descriptionError = validateField('description', description, mode);
      if (descriptionError) newErrors.description = descriptionError;

      const authorError = validateField('author', author, mode);
      if (authorError) newErrors.author = authorError;

      const imageError = validateField('image', imageFile, mode);
      if (imageError) newErrors.image = imageError;
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }
      
      setLoading(true);
      
      if (mode === "add") {
        if (imageFile) {
          formData.append("image", imageFile);
        }

        let response = await axiosInstance.post("/casestudy/create-case-study", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success(response.data.message || "Casestudy created successfully!");
      } else if (mode === "edit" && initialData) {
        if(!imagePreview){
          setErrors(prev => ({
            ...prev,
            image: "Image is required"
          }));
          setIsSubmitting(false);
          setLoading(false);
          return;
        }

        if (imageFile) {
          formData.append("image", imageFile);
        }
        
        const response = await axiosInstance.put(
          `/casestudy/update-casestudy/${initialData.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        playNotificationSound();
        toast.success(response.data.message || "Client updated successfully!");
      }

      // Only run callback if still mounted
      if (formMounted.current) {
        if (refreshClientList) {
          refreshClientList();
        }
        
        // Only reset form after successful submission, not on cancel
        resetForm();
        setIsDrawerOpen(false);
      }
    } catch (error) {
      console.error("Error handling case studies:", error);
      toast.error("Failed to save case studies. Please try again.");
    } finally {
      if (formMounted.current) {
        setLoading(false);
        setIsSubmitting(false);
      }
    }
  };
  
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
  
  // Handle ReactQuill content change
  const handleContentChange = (value) => {
    if (isCancelling) return;
    setDescription(value);
    // validation is handled in the useEffect
  };
  
  const onCancel = () => {
    // Prevent multiple cancel button clicks
    if (isCancelling) return;
    
    // Set cancelling state to true to disable inputs and prevent further actions
    setIsCancelling(true);
    
    // Clear any existing timeouts to prevent race conditions
    if (cancelTimeoutRef.current) {
      clearTimeout(cancelTimeoutRef.current);
    }
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }
    
    // Clear errors immediately to prevent flashes
    setErrors({});
    
    // Close the drawer first
    setIsDrawerOpen(false);
    
    // Only reset cancelling state after the drawer has fully closed
    // But DON'T reset the form - let the useEffect handle loading data when drawer reopens
    resetTimeoutRef.current = setTimeout(() => {
      if (formMounted.current) {
        // Don't reset form here, just reset the cancelling state
        setIsCancelling(false);
      }
      resetTimeoutRef.current = null;
    }, 400); // Give enough time for drawer closing animation
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Title Input */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Title <span className="text-error">*</span></span>
        </label>
        <input
          type="text"
          placeholder="Client name"
          className={`input input-bordered ${errors.title ? 'input-error' : 'border-accent'}`}
          value={title}
          onChange={(e) => {
            if (isCancelling) return;
            setTitle(e.target.value);
            if (!isSubmitting && !isCancelling) {
              const titleError = validateField('title', e.target.value, mode);
              setErrors(prev => ({
                ...prev,
                title: titleError
              }));
            }
          }}
          disabled={isCancelling}
        />
        {errors.title && <p className="text-error text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Website Input */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">SubTitle</span>
        </label>
        <input
          type="text"
          placeholder="Enter subtitle"
          className={`input input-bordered ${errors.subtitle ? 'input-error' : 'border-accent'}`}
          value={subTitle}
          onChange={(e) => {
            if (isCancelling) return;
            setSubTitle(e.target.value);
            if (!isSubmitting && !isCancelling) {
              const subTitleError = validateField('subtitle', e.target.value, mode);
              setErrors(prev => ({
                ...prev,
                subtitle: subTitleError
              }));
            }
          }}
          disabled={isCancelling}
        />
        {errors.subtitle && <p className="text-error text-sm mt-1">{errors.subtitle}</p>}
      </div>
      
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Author</span>
        </label>
        <input
          type="text"
          placeholder="Enter author name"
          className={`input input-bordered ${errors.author ? 'input-error' : 'border-accent'}`}
          value={author}
          onChange={(e) => {
            if (isCancelling) return;
            setAuthor(e.target.value);
            if (!isSubmitting && !isCancelling) {
              const authorError = validateField('author', e.target.value, mode);
              setErrors(prev => ({
                ...prev,
                author: authorError
              }));
            }
          }}
          disabled={isCancelling}
        />
        {errors.author && <p className="text-error text-sm mt-1">{errors.author}</p>}
      </div>

      {/* Content Input with ReactQuill */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Description <span className="text-error">*</span></span>
          <span className={`label-text-alt ${getWordCountStatus()}`}>
            {wordCount}/{MAX_WORD_COUNT} words
          </span>
        </label>
        <div className={`quill-container ${theme === "dark" ? "dark-mode" : "light-mode"}`}>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={description}
            onChange={handleContentChange}
            modules={quillModules}
            formats={quillFormats}
            className={`custom-quill ${errors.description ? 'quill-error' : ''}`}
            placeholder="Write case study description..."
            readOnly={isCancelling}
          />
          <style jsx global>{`
            .quill-container {
              border-radius: 0.5rem;
              overflow: hidden;
            }
            
            .quill-container .ql-container {
              min-height: 200px;
              max-height: 400px;
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
            
            /* Add tooltips styling */
            .quill-container .ql-toolbar button {
              position: relative;
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
        {errors.description && <p className="text-error text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Image Upload */}
      <div className="form-control mb-4">
        <label className="label">
        <span className="label-text">Normal Image <span className="text-error"> *</span>
        <span> ( JPG/PNG,-1024×768 px, less than 2 MB, no high-res files.)</span>
        </span>
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center ${isCancelling ? '' : 'cursor-pointer'} ${errors.image ? 'border-error' : 'border-neutral'}`}
          onClick={() => !isCancelling && inputRef.current?.click()}
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
              {!isCancelling && (
                <button
                  type="button"
                  className="absolute top-2 right-2 btn btn-xs btn-error"
                  onClick={(e) => handleRemoveImage(e)}
                >
                  Remove
                </button>
              )}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={inputRef}
            onChange={handleImageChange}
            disabled={isCancelling}
          />
        </div>
        {errors.image && <p className="text-error text-sm mt-1">{errors.image}</p>}
      </div>

      {/* Submit Button */}
      <div className="form-control d-flex justify-content-end align-items-center gap-2">
        <button 
          type="submit" 
          className="btn btn-primary d-flex align-items-center" 
          disabled={loading || isCancelling || wordCount < MIN_WORD_COUNT || wordCount > MAX_WORD_COUNT}
        >
          {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
          {loading ? (mode === "add" ? "Creating..." : "Updating...") : mode === "add" ? "Create" : "Update"}
        </button>
        <button 
          type="button" 
          className="btn" 
          onClick={onCancel}
          disabled={isCancelling}
        >
          {isCancelling ? "Closing..." : "Cancel"}
        </button>
      </div>
    </form>
  );
}

export default CaseForm;