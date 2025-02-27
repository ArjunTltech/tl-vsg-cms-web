import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axios";

function ServiceForm({ onServiceCreated, initialData, mode, setIsDrawerOpen }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagline, setTagline] = useState("");
  const [points, setPoints] = useState([""]); // Array for bullet points
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setTagline(initialData.tagline || "");
      setPoints(initialData.points || [""]);
      setImagePreview(initialData.image || null);
    } else {
      setTitle("");
      setDescription("");
      setTagline("");
      setPoints([""]);
      setImageFile(null);
      setImagePreview(null);
    }
  }, [mode, initialData]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };
  

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handlePointChange = (index, value) => {
    const newPoints = [...points];
    newPoints[index] = value;
    setPoints(newPoints);
  };

  const addPoint = () => setPoints([...points, ""]);

  const removePoint = (index) => {
    if (points.length > 1) {
      setPoints(points.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !description || !tagline || points.some((p) => !p)) {
      toast.error("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tagline", tagline);
    formData.append("points", JSON.stringify(points));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      let response;
      if (mode === "add") {
        response = await axiosInstance.post("/services/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Service added successfully!");
      } else if (mode === "edit" && initialData) {
        response = await axiosInstance.put(
          `/services/update/${initialData.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Service updated successfully!");
      }

      if (onServiceCreated) onServiceCreated();

      // Reset form
      setTitle("");
      setDescription("");
      setTagline("");
      setPoints([""]);
      setImageFile(null);
      setImagePreview(null);
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error handling service:", error);
      toast.error("Failed to save service. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block font-medium">Title</label>
        <input
          type="text"
          placeholder="Service title"
          className="input input-bordered w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium">Description</label>
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Service description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      {/* Tagline */}
      <div>
        <label className="block font-medium">Tagline</label>
        <input
          type="text"
          placeholder="Short tagline..."
          className="input input-bordered w-full"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
        />
      </div>

      {/* Bullet Points */}
      <div>
        <label className="block font-medium">Bullet Points</label>
        {points.map((point, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder={`Point ${index + 1}`}
              value={point}
              onChange={(e) => handlePointChange(index, e.target.value)}
            />
            {points.length > 1 && (
              <button
                type="button"
                className="btn btn-error btn-xs"
                onClick={() => removePoint(index)}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button type="button" className="btn btn-primary btn-sm" onClick={addPoint}>
          + Add Point
        </button>
      </div>

      {/* Image Upload */}
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
      <div>
        <button type="submit" className="btn btn-primary w-full">
          {mode === "add" ? "Add Service" : "Update Service"}
        </button>
      </div>
    </form>
  );
}

export default ServiceForm;
