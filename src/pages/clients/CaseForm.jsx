import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axios";
import playNotificationSound from "../../utils/playNotification";

function CaseForm({ onClientCreated, refreshClientList, initialData, mode, setIsDrawerOpen }) {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [author, setAuthor] = useState("")
  const [description, setDescription] = useState("")
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const inputRef = useRef(null);
  const [loading,setLoading]=useState(false)
  const [errors, setErrors] = useState({});
  const validateField = (name, value, mode) => {
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
        return value.trim().length >= 10
          ? null
          : "Description must be at least 10 characters long";
  
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
        if (mode === 'edit' && (value === undefined || value === null)) {
          return null;
        }
        return value ? null : "Image is required";
  
      case 'author':
        if (!value) return null; // optional
        return value.trim().length >= 3
          ? null
          : "Author must be at least 3 characters long";
  
      default:
        return null;
    }
  };
  
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTitle(initialData.title || "");
      setSubTitle(initialData.subTitle || "");
      setAuthor(initialData.author || "");
      setDescription(initialData.description || "");
      setImagePreview(initialData.image || null);
    } else if (mode === "add") {
      resetForm();
    }
  }, [mode, initialData]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setErrors(prev => ({
        ...prev,
        image: ""
      }));
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      handleRemoveImage();
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setTitle("");
    setSubTitle("");
    setDescription("");
    setAuthor("")
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        return;
      }
      if (mode === "add") {


        if (imageFile) {
          
          formData.append("image", imageFile);
        }
      setLoading(!loading)

        let response = await axiosInstance.post("/casestudy/create-case-study", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success(response.data.message || "Casestudy created successfully!");
        setLoading(false)

      } else if (mode === "edit" && initialData) {
        setLoading(!loading)
        if(!imagePreview){
          setErrors(prev => ({
            ...prev,
            image: "Image is required"
          }));
          return
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
        playNotificationSound()
        toast.success(response.data.message || "Client updated successfully!");
        
      }

      if (refreshClientList) {
        refreshClientList();
      }

      resetForm();
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error handling case studies:", error);
      toast.error("Failed to save case studies. Please try again.");
    }
    finally {
      setLoading(false); // Hide loader after submission
    }
  };
const onCancel= ()=>{
  setIsDrawerOpen(false);
  setErrors({})
  resetForm()
}
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
          className="input input-bordered border-accent"
          value={title}
          onChange={(e) => {setTitle(e.target.value)
            const titleError = validateField('title', e.target.value, mode);
            setErrors(prev => ({
              ...prev,
              title: titleError
            }));
          }}
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
          className="input input-bordered border-accent"
          value={subTitle}
          onChange={(e) => {
            setSubTitle(e.target.value)
            const subTitleError = validateField('subtitle', e.target.value, mode);
            setErrors(prev => ({
              ...prev,
              subtitle: subTitleError
            }));

          }}
        />
        {errors.subtitle&& <p className="text-error text-sm mt-1">{errors.subtitle}</p>}

      </div>
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Author</span>
        </label>
        <input
          type="text"
          placeholder="Enter author name"
          className="input input-bordered border-accent"
          value={author}
          onChange={(e) => {
            setAuthor(e.target.value)
            const authorError = validateField('author', e.target.value, mode);
            setErrors(prev => ({
              ...prev,
              author: authorError
            }));
          }}
        />
        {errors.author && <p className="text-error text-sm mt-1">{errors.author}</p>}

      </div>

      {/* Content Input */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Description <span className="text-error">*</span></span>
        </label>
        <textarea
          className="textarea textarea-bordered"
          placeholder="Write client description..."
          value={description}
          name="description"
          onChange={(e) => {
            setDescription(e.target.value)
            const descriptionError = validateField('description', e.target.value, mode);
            setErrors(prev => ({
              ...prev,
              description: descriptionError
            }));
          }
          }
        ></textarea>
        {errors.description && <p className="text-error text-sm mt-1">{errors.description}</p>}

      </div>

      {/* Image Upload */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Image <span className="text-error">*</span></span>
        </label>
        <div
          className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-base-100"
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
            accept="image/*"
            className="hidden"
            ref={inputRef}
            onChange={handleImageChange}
          />

        </div>
        {errors.image && <p className="text-error text-sm mt-1">{errors.image}</p>}
      </div>

      {/* Submit Button */}
      <div className="form-control d-flex justify-content-end align-items-center gap-2">
      <button type="submit" className="btn btn-primary d-flex align-items-center" disabled={loading}>
          {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
          {loading ? (mode === "add" ? "Creating..." : "Updating...") : mode === "add" ? "Create" : "Update"}
        </button>
  <button type="button" className="btn " onClick={onCancel}>
    Cancel
  </button>
  
</div>



    </form>
  );
}

export default CaseForm;
