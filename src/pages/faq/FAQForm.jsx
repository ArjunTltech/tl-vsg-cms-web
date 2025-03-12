import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios';
import playNotificationSound from '../../utils/playNotification';

function FAQForm({ onFAQCreated, initialData, mode, setIsDrawerOpen, faqs }) {
  const [faq, setFaq] = useState({
    question: '',
    answer: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Log faqs prop to check if it's being properly passed
  useEffect(() => {

    if (mode === "edit" && initialData) {
      setFaq({
        question: initialData.question || '',
        answer: initialData.answer || ''
      });
      console.log("Edit mode initialData:", initialData);
    } else if (mode === "add") {
      setFaq({
        question: '',
        answer: ''
      });
    }
    // Reset errors and submission state
    setErrors({});
    setIsSubmitting(false);
  }, [mode, initialData, faqs]);

  const validateField = (name, value) => {
    console.log(`Validating ${name} with value: "${value}"`);
    console.log("Available FAQs for validation:", faqs);
    
    const wordCount = value.trim().split(/\s+/).length; // Count words
    
    switch (name) {
      case 'question':
        if (value.trim().length < 5) {
          return "Question must be at least 5 characters long";
        }
        
        // Check if the question is a duplicate (only for new FAQs or if the question has changed)
        if (faqs && Array.isArray(faqs)) {
          console.log("Checking for duplicates among", faqs.length, "existing FAQs");
          
          const duplicates = faqs.filter(
            (existingFAQ) => 
              existingFAQ.question.trim().toLowerCase() === value.trim().toLowerCase() &&
              // Don't flag as duplicate if it's the same FAQ being edited
              (mode !== "edit" || existingFAQ.id !== initialData?.id)
          );
          
          if (duplicates.length > 0) {
            console.log("Duplicate found:", duplicates);
            return "This question already exists. Please enter a different question.";
          }
        } else {
          console.log("Cannot check for duplicates - faqs is not available or not an array");
        }
        
        return null;
  
      case 'answer':
        return wordCount >= 10 && wordCount <= 45
          ? null
          : "Answer must be between 10 and 45 words long";
  
      default:
        return null;
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submission initiated");

    // Validate all fields
    const newErrors = {};
    
    const questionError = validateField('question', faq.question);
    if (questionError) newErrors.question = questionError;

    const answerError = validateField('answer', faq.answer);
    if (answerError) newErrors.answer = answerError;

    // If there are any errors, set them and prevent submission
    if (Object.keys(newErrors).length > 0) {
      console.log("Validation errors found:", newErrors);
      setErrors(newErrors);
      return;
    }

    // Prevent multiple submissions
    if (isSubmitting) {
      console.log("Submission already in progress");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Submitting FAQ:", faq);

      let response;
      if (mode === "add") {
        // First get the current FAQs to determine the next order
        const faqsResponse = await axiosInstance.get('/qna/get-faqs');
        const currentFAQs = faqsResponse.data.data || [];
        const nextOrder = currentFAQs.length + 1;

        const newFAQ = {
          ...faq,
          order: nextOrder
        };

        console.log("Creating new FAQ with order:", nextOrder);
        response = await axiosInstance.post("/qna/create-faq", newFAQ);
        playNotificationSound()
        toast.success("FAQ created successfully!");
      } else if (mode === "edit" && initialData) {
        const updatedFAQ = {
          ...faq,
          order: initialData.order
        };
        console.log("Updating FAQ with ID:", initialData.id);
        response = await axiosInstance.put(`/qna/update-faq/${initialData.id}`, updatedFAQ);
        playNotificationSound()
        toast.success("FAQ updated successfully!");
      }

      if (onFAQCreated) {
        console.log("Calling onFAQCreated callback");
        onFAQCreated();
      }

      setFaq({
        question: '',
        answer: ''
      });
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error handling FAQ:", error);
      const errorMessage = error.response?.data?.message || "Failed to save FAQ. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Question <span className="text-error">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter FAQ question"
          className={`input input-bordered w-full ${errors.question ? 'input-error' : ''}`}
          value={faq.question}
          onChange={(e) => {
            const newQuestion = e.target.value;
            setFaq({ ...faq, question: newQuestion });
            
            // Validate and clear error if valid
            const questionError = validateField('question', newQuestion);
            setErrors(prev => ({
              ...prev,
              question: questionError
            }));
          }}
        />
        {errors.question && <p className="text-error text-sm mt-1">{errors.question}</p>}
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Answer <span className="text-error">*</span>
        </label>
        <textarea
          placeholder="Enter FAQ answer"
          className={`textarea textarea-bordered w-full ${errors.answer ? 'textarea-error' : ''}`}
          rows="4"
          value={faq.answer}
          onChange={(e) => {
            const newAnswer = e.target.value;
            setFaq({ ...faq, answer: newAnswer });
            
            // Validate and clear error if valid
            const answerError = validateField('answer', newAnswer);
            setErrors(prev => ({
              ...prev,
              answer: answerError
            }));
          }}
        ></textarea>
        {errors.answer && <p className="text-error text-sm mt-1">{errors.answer}</p>}
      </div>
      
      <button 
        type="submit" 
        className="btn btn-primary w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="loading loading-spinner"></span>
            {mode === "add" ? "Creating FAQ..." : "Updating FAQ..."}
          </>
        ) : (
          mode === "add" ? "Create FAQ" : "Update FAQ"
        )}
      </button>
    </form>
  );
}

export default FAQForm;