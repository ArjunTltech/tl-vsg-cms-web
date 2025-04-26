import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axiosInstance from '../../config/axios';
import playNotificationSound from '../../utils/playNotification';

function CareerForm({ onCareerCreated, initialData, mode, setIsDrawerOpen, careers }) {
  // Initialize state with default empty values or initialData if available
  const [career, setCareer] = useState({
    position: initialData?.position || '',
    positionCount: initialData?.positionCount?.toString() || '',
    location: initialData?.location || '',
    shortdescription: initialData?.shortdescription || '',
    jobType: initialData?.jobType || ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Set initial character count on component mount
  useEffect(() => {
    if (career.shortdescription) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = career.shortdescription;
      setCharCount(tempDiv.textContent.length);
    }
  }, []);

  // This useEffect will run only when mode or initialData reference changes
  useEffect(() => {
    if (mode === "edit" && initialData) {
      // Update form data without setTimeout
      setCareer({
        position: initialData.position || '',
        positionCount: initialData.positionCount?.toString() || '',
        location: initialData.location || '',
        shortdescription: initialData.shortdescription || '',
        jobType: initialData.jobType || ''
      });
      
      // Update character count for rich text
      if (initialData.shortdescription) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = initialData.shortdescription;
        setCharCount(tempDiv.textContent.length);
      }
    } else if (mode === "add") {
      // Reset form for add mode
      setCareer({
        position: '',
        positionCount: '',
        location: '',
        shortdescription: '',
        jobType: ''
      });
      setCharCount(0);
      setErrors({});
    }
    
    setIsSubmitting(false);
  }, [mode, initialData]);

  const validateField = (name, value) => {
    switch (name) {
      case 'position':
        return value.trim().length < 3
          ? "Position must be at least 3 characters long"
          : null;

      case 'positionCount':
        return isNaN(value) || value < 1
          ? "Position count must be a valid number greater than 0"
          : null;

      case 'location':
        return value.trim().length < 3
          ? "Location must be at least 3 characters long"
          : null;

      case 'shortdescription':
        // Check if value is truly empty first
        if (!value) {
          return "Short description is required";
        }
        
        // Check for empty editor content patterns
        const emptyPatterns = ['<p><br></p>', '<p></p>', ''];
        if (emptyPatterns.includes(value)) {
          return "Short description is required";
        }
        
        // For rich text, we check the stripped text length
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = value;
        const textLength = tempDiv.textContent.trim().length;
        
        if (textLength < 10) {
          return "Short description must be at least 10 characters long";
        }
        
        if (textLength > 5000) {
          return "Short description exceeds maximum length of 5000 characters";
        }
        
        return null;

      case 'jobType':
        return value === ''
          ? "Job type is required"
          : null;

      default:
        return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};
    
    // Special validation for short description to handle ReactQuill content
    const shortDescError = validateField('shortdescription', career.shortdescription);
    if (shortDescError) {
      newErrors.shortdescription = shortDescError;
    }
    
    // Validate other fields
    ['position', 'positionCount', 'location', 'jobType'].forEach((field) => {
      const error = validateField(field, career[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      let response;
      if (mode === "add") {
        response = await axiosInstance.post("/career/create-career", career);
        playNotificationSound();
        toast.success("Career created successfully!");
      } else if (mode === "edit" && initialData) {
        response = await axiosInstance.put(`/career/update-career/${initialData.id}`, career);
        playNotificationSound();
        toast.success("Career updated successfully!");
      }

      if (onCareerCreated) onCareerCreated();
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error submitting career form:", error);
      const errorMessage = error.response?.data?.message || "Failed to save career. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsDrawerOpen(false);
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  const handleQuillChange = (content) => {
    // Update the shortdescription in career state
    setCareer({ ...career, shortdescription: content });
    
    // Calculate plain text character count
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const textLength = tempDiv.textContent.length;
    setCharCount(textLength);
    
    // Clear the error for this field when the user is typing
    if (errors.shortdescription) {
      setErrors(prev => ({ 
        ...prev, 
        shortdescription: null
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Position <span className="text-error">*</span></label>
        <input
          type="text"
          placeholder="Enter Position"
          className={`input input-bordered w-full ${errors.position ? 'input-error' : ''}`}
          value={career.position}
          onChange={(e) => {
            setCareer({ ...career, position: e.target.value });
            setErrors(prev => ({ ...prev, position: validateField('position', e.target.value) }));
          }}
        />
        {errors.position && <p className="text-error text-sm mt-1">{errors.position}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Position Count <span className="text-error">*</span></label>
        <input
          type="number"
          placeholder="Enter Position Count"
          className={`input input-bordered w-full ${errors.positionCount ? 'input-error' : ''}`}
          value={career.positionCount}
          onChange={(e) => {
            setCareer({ ...career, positionCount: e.target.value });
            setErrors(prev => ({ ...prev, positionCount: validateField('positionCount', e.target.value) }));
          }}
        />
        {errors.positionCount && <p className="text-error text-sm mt-1">{errors.positionCount}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Location <span className="text-error">*</span></label>
        <input
          type="text"
          placeholder="Enter Location"
          className={`input input-bordered w-full ${errors.location ? 'input-error' : ''}`}
          value={career.location}
          onChange={(e) => {
            setCareer({ ...career, location: e.target.value });
            setErrors(prev => ({ ...prev, location: validateField('location', e.target.value) }));
          }}
        />
        {errors.location && <p className="text-error text-sm mt-1">{errors.location}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Job Type <span className="text-error">*</span></label>
        <select
          className={`select select-bordered w-full ${errors.jobType ? 'select-error' : ''}`}
          value={career.jobType}
          onChange={(e) => {
            setCareer({ ...career, jobType: e.target.value });
            setErrors(prev => ({ ...prev, jobType: validateField('jobType', e.target.value) }));
          }}
        >
          <option value="">Select Job Type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
        </select>
        {errors.jobType && <p className="text-error text-sm mt-1">{errors.jobType}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Short Description
          <span className="text-error">*</span>
          <div className="float-right flex items-center gap-1">
            <span className={`text-xs ${charCount >= 5000 ? 'text-error' :
                charCount >= 1800 ? 'text-warning' :
                  charCount < 10 ? 'text-gray-500' : 'text-green-500'
              }`}>Limit:</span>
            <span className={`text-xs ${charCount >= 5000 ? 'text-error' :
                charCount >= 1800 ? 'text-warning' :
                  charCount < 10 ? 'text-gray-500' : 'text-green-500'
              }`}>
              {charCount}/5000
            </span>
          </div>
        </label>
        <div className={`quill-container ${errors.shortdescription ? 'border border-error rounded' : ''}`}>
          <ReactQuill
            theme="snow"
            value={career.shortdescription}
            onChange={handleQuillChange}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Enter Short Description"
            className="quill-editor"
            style={{ height: '250px' }}
          />
        </div>
        <style jsx>{`
          .quill-container .ql-container {
            height: 200px;
            overflow-y: auto;
          }
            
        `}</style>
        {charCount >= 1800 && (
          <p className={`text-xs mt-1 ${charCount >= 5000 ? 'text-error' : 'text-warning'}`}>
            {charCount >= 5000 ?
              "Character limit reached." :
              "Approaching character limit."}
          </p>
        )}
        {errors.shortdescription && <p className="text-error text-sm mt-1">{errors.shortdescription}</p>}
      </div>

      <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="loading loading-spinner"></span> {mode === "add" ? "Creating Career..." : "Updating Career..."}
          </>
        ) : mode === "add" ? "Create Career" : "Update Career"}
      </button>
      <button onClick={handleCancel} type="button" className="btn btn-ghost w-full mt-2">
        Cancel
      </button>
    </form>
  );
}

export default CareerForm;