import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios';
import playNotificationSound from '../../utils/playNotification';

function CareerForm({ onCareerCreated, initialData, mode, setIsDrawerOpen, careers }) {
  const [career, setCareer] = useState({
    position: '',
    positionCount: '',
    location: '',
    shortdescription: '',
    jobType: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setCareer({
        position: initialData.position || '',
        positionCount: initialData.positionCount || '',
        location: initialData.location || '',
        shortdescription: initialData.shortdescription || '',
        jobType: initialData.jobType || ''
      });
    } else if (mode === "add") {
      setCareer({
        position: '',
        positionCount: '',
        location: '',
        shortdescription: '',
        jobType: ''
      });
      setErrors({});  // Reset errors when switching to "add" mode
    }
    setIsSubmitting(false); // Reset submitting state
  }, [mode, initialData, careers]);

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
        const len = value.trim().length;
        if (len === 0) {
          return "Short description is required";
        }
        if (len < 10 || len > 2000) {
          return "Short description must be between 10 and 2000 characters long";
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
    Object.keys(career).forEach((field) => {
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
      setCareer({ position: '', positionCount: '', location: '', shortdescription: '', jobType: '' });
      setIsDrawerOpen(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to save career. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setCareer({ position: '', positionCount: '', location: '', shortdescription: '', jobType: '' }); // Reset career state
    setErrors({}); // Clear errors
    setIsDrawerOpen(false); // Close the drawer or modal
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
            <span className={`text-xs ${career.shortdescription.length >= 2000 ? 'text-error' :
                career.shortdescription.length >= 1800 ? 'text-warning' :
                  career.shortdescription.length < 10 ? 'text-gray-500' : 'text-green-500'

              }`}>Limit:</span>
            <span className={`text-xs ${career.shortdescription.length >= 2000 ? 'text-error' :
                career.shortdescription.length >= 1800 ? 'text-warning' :
                  career.shortdescription.length < 10 ? 'text-gray-500' : 'text-green-500'
              }`}>
              {career.shortdescription.length}/2000
            </span>
          </div>
        </label>
        <textarea
          placeholder="Enter Short Description"
          className={`textarea textarea-bordered w-full ${errors.shortdescription ? 'textarea-error' : ''}`}
          rows="4"
          value={career.shortdescription}
          onChange={(e) => {
            // Optionally limit input to 2000 characters
            const value = e.target.value.slice(0, 2000);
            setCareer({ ...career, shortdescription: value });
            setErrors(prev => ({ ...prev, shortdescription: validateField('shortdescription', value) }));
          }}
        ></textarea>
        {career.shortdescription.length >= 1800 && (
          <p className={`text-xs mt-1 ${career.shortdescription.length >= 2000 ? 'text-error' : 'text-warning'}`}>
            {career.shortdescription.length >= 2000 ?
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


