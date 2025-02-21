import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios';

function FAQForm({ onFAQCreated, initialData, mode, setIsDrawerOpen }) {
  const [faq, setFaq] = useState({
    question: '',
    answer: ''
  });

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
  }, [mode, initialData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!faq.question?.trim() || !faq.answer?.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
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
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Question</label>
        <input
          type="text"
          placeholder="Enter FAQ question"
          className="input input-bordered w-full"
          value={faq.question}
          onChange={(e) => setFaq({ ...faq, question: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Answer</label>
        <textarea
          placeholder="Enter FAQ answer"
          className="textarea textarea-bordered w-full"
          value={faq.answer}
          onChange={(e) => setFaq({ ...faq, answer: e.target.value })}
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary w-full">
        {mode === "add" ? "Create FAQ" : "Update FAQ"}
      </button>
    </form>
  );
}

export default FAQForm;