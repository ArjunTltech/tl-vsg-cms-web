import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios';

function TestimonialForm({ onTestimonialCreated, initialData, mode, setIsDrawerOpen }) {
  const [testimonial, setTestimonial] = useState({
    text: '',
    author: '',
    position: '',
    rating: 5
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTestimonial({
        text: initialData.text || '',
        author: initialData.author || '',
        position: initialData.position || '',
        rating: initialData.rating || 5
      });
    } else if (mode === "add") {
      setTestimonial({
        text: '',
        author: '',
        position: '',
        rating: 5
      });
    }
  }, [mode, initialData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!testimonial.text?.trim() || !testimonial.author?.trim() || !testimonial.position?.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      let response;
      if (mode === "add") {
        response = await axiosInstance.post("/contents/testimonial", testimonial);
        toast.success("Testimonial created successfully!");
      } else if (mode === "edit" && initialData) {
        response = await axiosInstance.put(`/contents/testimonial/${initialData.id}`, testimonial);
        toast.success("Testimonial updated successfully!");
      }

      if (onTestimonialCreated) {
        onTestimonialCreated();
      }

      setTestimonial({
        text: '',
        author: '',
        position: '',
        rating: 5
      });
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error handling testimonial:", error);
      const errorMessage = error.response?.data?.message || "Failed to save testimonial. Please try again.";
      toast.error(errorMessage);
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-6 h-6 cursor-pointer ${
          index < testimonial.rating ? 'fill-warning text-warning' : 'text-gray-300'
        }`}
        onClick={() => setTestimonial({ ...testimonial, rating: index + 1 })}
      />
    ));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Author Name</label>
        <input
          type="text"
          placeholder="Enter author name"
          className="input input-bordered w-full"
          value={testimonial.author}
          onChange={(e) => setTestimonial({ ...testimonial, author: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Position</label>
        <input
          type="text"
          placeholder="Enter position"
          className="input input-bordered w-full"
          value={testimonial.position}
          onChange={(e) => setTestimonial({ ...testimonial, position: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Rating</label>
        <div className="flex space-x-1">
          {renderStars()}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Testimonial Text</label>
        <textarea
          placeholder="Enter testimonial text"
          className="textarea textarea-bordered w-full"
          rows="4"
          value={testimonial.text}
          onChange={(e) => setTestimonial({ ...testimonial, text: e.target.value })}
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary w-full">
        {mode === "add" ? "Create Testimonial" : "Update Testimonial"}
      </button>
    </form>
  );
}

export default TestimonialForm;