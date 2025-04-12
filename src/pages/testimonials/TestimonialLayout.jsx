import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Star, ChevronRight, ChevronLeft, Loader } from 'lucide-react';
import axiosInstance from '../../config/axios';
import TestimonialForm from './TestimonialForm';
import { toast } from 'react-toastify';

const TestimonialLayout = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editTestimonial, setEditTestimonial] = useState(null);
  const [mode, setMode] = useState("add");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const [testimonialData, setTestimonialData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 4;

  const refreshTestimonialList = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/contents/testimonials');   
      setTestimonialData(response.data.data);
      
      // Show the first page of testimonials
      const startIndex = (currentPage - 1) * itemsPerPage;
      const testimonialsToShow = response.data.data.slice(startIndex, startIndex + itemsPerPage);
      setTestimonials(testimonialsToShow);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      toast.error('Failed to load testimonials');
    }
  }, [currentPage]);

  useEffect(() => {
    refreshTestimonialList();
  }, [refreshTestimonialList]);

  // Calculate total pages correctly
  const totalPages = Math.ceil(testimonialData.length / itemsPerPage);

  const handleAddNew = () => {
    setEditTestimonial(null);
    setMode("add");
    setIsDrawerOpen(true);
  };

  const handleEdit = (testimonial) => {
    setEditTestimonial(testimonial);
    setMode("edit");
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/contents/testimonial/${id}`);
      // After deleting, refresh the list to update pagination
      await refreshTestimonialList();
      toast.success('Testimonial deleted successfully');
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      toast.error('Failed to delete testimonial');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Go to specific page
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  useEffect(() => {
    // Update displayed testimonials when page changes
    const startIndex = (currentPage - 1) * itemsPerPage;
    setTestimonials(testimonialData.slice(startIndex, startIndex + itemsPerPage));
  }, [currentPage, testimonialData]);
  
  return (
    <div className="min-h-screen relative">
      <div className="drawer drawer-end">
        <input
          id="testimonial-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={isDrawerOpen}
          onChange={() => setIsDrawerOpen(!isDrawerOpen)}
        />
        <div className="drawer-content">
          <div className="md:flex space-y-2 md:space-y-0 block justify-between items-center mb-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-neutral-content">Testimonials</h1>
              <p>Total Testimonials: {testimonialData.length}</p>
            </div>
            <button
              className="btn btn-primary gap-2"
              onClick={handleAddNew}
            >
              <Plus className="w-5 h-5" />
              Add Testimonial
            </button>
          </div>

          <div className="mx-auto space-y-4">
            {testimonials.length > 0 ? (
              <>
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-base-200 p-4 rounded-lg flex justify-between items-center">
                    <div className="flex-1 select-none">
                      <div className="text-xl font-bold text-accent">{testimonial.author}</div>
                      <p className="text-base-content">
                        {testimonial.text} - <span className="text-sm opacity-70 ml-2">{testimonial.position}</span>
                      </p>
                      
                      <div className="flex items-center space-x-1 mt-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="btn btn-sm btn-square btn-ghost"
                        onClick={() => handleEdit(testimonial)}
                      >
                        <Pencil className="w-5 h-5 text-success" />
                      </button>
                      <button
                        className="btn btn-sm btn-square btn-error"
                        onClick={() => {
                          setTestimonialToDelete(testimonial.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash2 className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Pagination controls */}
                {testimonialData.length > itemsPerPage && (
                  <div className="flex justify-center items-center space-x-2 mt-6">
                    <button 
                      onClick={goToPrevPage} 
                      disabled={currentPage === 1}
                      className={`btn btn-sm ${currentPage === 1 ? 'btn-disabled' : 'btn-primary'}`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <div className="flex space-x-1">
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToPage(index + 1)}
                          className={`btn btn-sm ${currentPage === index + 1 ? 'btn-primary' : 'btn-ghost'}`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      onClick={goToNextPage} 
                      disabled={currentPage === totalPages}
                      className={`btn btn-sm ${currentPage === totalPages ? 'btn-disabled' : 'btn-primary'}`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-96 flex justify-center items-center">
                <p>No Testimonials available</p>
              </div>
            )}
          </div>
        </div>

        <div className="drawer-side">
          <label htmlFor="testimonial-drawer" className="drawer-overlay"></label>
          <div className="p-4 md:w-[40%] w-full sm:w-1/2 overflow-y-scroll bg-base-100 h-[80vh] text-base-content absolute bottom-4 right-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">{mode === "edit" ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
            <TestimonialForm
              onTestimonialCreated={refreshTestimonialList}
              initialData={editTestimonial}
              mode={mode}
              setIsDrawerOpen={setIsDrawerOpen}
            />
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg">Are you sure you want to delete this testimonial?</h3>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={() => handleDelete(testimonialToDelete)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialLayout;