// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import axiosInstance from '../../config/axios';

// function FAQForm({ onFAQCreated, initialData, mode, setIsDrawerOpen }) {
//   const [faq, setFaq] = useState({
//     question: '',
//     answer: ''
//   });

//   useEffect(() => {
//     if (mode === "edit" && initialData) {
//       setFaq({
//         question: initialData.question || '',
//         answer: initialData.answer || ''
//       });
//     } else if (mode === "add") {
//       setFaq({
//         question: '',
//         answer: ''
//       });
//     }
//   }, [mode, initialData]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!faq.question?.trim() || !faq.answer?.trim()) {
//       toast.error("Please fill in all fields.");
//       return;
//     }

//     try {
//       let response;
//       if (mode === "add") {
//         // First get the current FAQs to determine the next order
//         const faqsResponse = await axiosInstance.get('/qna/get-faqs');
//         const currentFAQs = faqsResponse.data.data || [];
//         const nextOrder = currentFAQs.length + 1;

//         const newFAQ = {
//           ...faq,
//           order: nextOrder
//         };
        
//         response = await axiosInstance.post("/qna/create-faq", newFAQ);
//         toast.success("FAQ created successfully!");
//       } else if (mode === "edit" && initialData) {
//         const updatedFAQ = {
//           ...faq,
//           order: initialData.order
//         };
//         response = await axiosInstance.put(`/qna/update-faq/${initialData.id}`, updatedFAQ);
//         toast.success("FAQ updated successfully!");
//       }

//       if (onFAQCreated) {
//         onFAQCreated();
//       }

//       setFaq({
//         question: '',
//         answer: ''
//       });
//       setIsDrawerOpen(false);
//     } catch (error) {
//       console.error("Error handling FAQ:", error);
//       const errorMessage = error.response?.data?.message || "Failed to save FAQ. Please try again.";
//       toast.error(errorMessage);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-1">Question</label>
//         <input
//           type="text"
//           placeholder="Enter FAQ question"
//           className="input input-bordered w-full"
//           value={faq.question}
//           onChange={(e) => setFaq({ ...faq, question: e.target.value })}
//         />
//       </div>
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-1">Answer</label>
//         <textarea
//           placeholder="Enter FAQ answer"
//           className="textarea textarea-bordered w-full"
//           value={faq.answer}
//           onChange={(e) => setFaq({ ...faq, answer: e.target.value })}
//         ></textarea>
//       </div>
//       <button type="submit" className="btn btn-primary w-full">
//         {mode === "add" ? "Create FAQ" : "Update FAQ"}
//       </button>
//     </form>
//   );
// }

// export default FAQForm;
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios';

function FAQForm({ onFAQCreated, initialData, mode, setIsDrawerOpen }) {
  const [faq, setFaq] = useState({
    question: '',
    answer: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFaq({
        question: initialData.question || '',
        answer: initialData.answer || ''
      });
    } else if (mode === "add") {
      setFaq({
        question: '',
        answer: ''
      });
    }
    // Reset errors and submission state
    setErrors({});
    setIsSubmitting(false);
  }, [mode, initialData]);

  const validateField = (name, value) => {
    const wordCount = value.trim().split(/\s+/).length; // Count words
    
    switch (name) {
      case 'question':
        return value.trim().length >= 5
          ? null
          : "Question must be at least 5 characters long";
        
      case 'answer':
        return wordCount >= 10 && wordCount <= 45
          ? null
          : "Answer must be between 10 and 45 words long"; // Updated message
        
      default:
        return null;
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate all fields
    const newErrors = {};
    
    const questionError = validateField('question', faq.question);
    if (questionError) newErrors.question = questionError;

    const answerError = validateField('answer', faq.answer);
    if (answerError) newErrors.answer = answerError;

    // If there are any errors, set them and prevent submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prevent multiple submissions
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

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

        response = await axiosInstance.post("/qna/create-faq", newFAQ);
        toast.success("FAQ created successfully!");
      } else if (mode === "edit" && initialData) {
        const updatedFAQ = {
          ...faq,
          order: initialData.order
        };
        response = await axiosInstance.put(`/qna/update-faq/${initialData.id}`, updatedFAQ);
        toast.success("FAQ updated successfully!");
      }

      if (onFAQCreated) {
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