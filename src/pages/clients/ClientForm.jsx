import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axios";
import playNotificationSound from "../../utils/playNotification";

function ClientForm({ onClientCreated, refreshClientList, initialData, mode, setIsDrawerOpen }) {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [author, setAuthor] = useState("")
  const [description,setDescription]=useState("")
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const inputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const validateField = (name, value, mode) => {
    switch (name) {
      case 'title':
        return value.trim().length >= 3
          ? null
          : "Title must be at least 3 characters long";
      case 'description':
        return value.trim().length >= 10
          ? null
          : "Description must be at least 10 characters long";
      case 'subtitle':
        return value.trim().length >= 10
          ? null
          : "Subtitle  must be at least 3 characters long";
      case 'image':
        // Skip image validation in edit mode if no new image is provided
        if (mode === 'edit' && (value === undefined || value === null)) {
          return null;
        }
        return value
          ? null
          : "Image is required";
      case 'author':
        return value.trim().length === 0 || value.trim().length >= 3
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

      if (mode === "add") {        
        const titleError = validateField('title', title);
        if (titleError) newErrors.title = titleError;
        const subtitleError = validateField('title', subTitle);
        if (subtitleError) newErrors.subtitleError = subtitleError;

        const descriptionError = validateField('description', description, mode);
        if (descriptionError) newErrors.description = descriptionError;

        const authorError = validateField('author', author, mode);
        if (authorError) newErrors.points = pointsError;

        const imageError = validateField('image', imageFile, mode);
        if (imageError) newErrors.image = imageError;        
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }
        

    if (imageFile) {
      formData.append("image", imageFile);
    }


     let response =   await axiosInstance.post("/casestudy/create-case-study", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        toast.success(response.data.message||"Casestudy created successfully!");
      } else if (mode === "edit" && initialData) {
     const response=   await axiosInstance.put(
          `/casestudy/update-casestudy/${initialData.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        playNotificationSound()
        toast.success(response.data.message||"Client updated successfully!");
      }

      if (refreshClientList) {
        refreshClientList();
      }

      resetForm();
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error handling casestudy:", error);
      toast.error("Failed to save casestudy. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Title Input */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          placeholder="Client name"
          className="input input-bordered border-accent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
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
          onChange={(e) => setSubTitle(e.target.value)}
        />
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
          onChange={(e) =>{
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
          <span className="label-text">Description</span>
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
          <span className="label-text">Image</span>
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
      </div>

      {/* Submit Button */}
      <div className="form-control">
        <button type="submit" className="btn btn-primary">
          {mode === "add" ? "Create" : "Update"}
        </button>
      </div>
    </form>
  );
}

export default ClientForm;
