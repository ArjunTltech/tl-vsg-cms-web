import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import CareerForm from './CareerForm';
import axiosInstance from '../../config/axios';
import DeleteConfirmModal from '../../components/ui/modal/DeleteConfirmModal';

const CareerLayout = () => {
  const [careers, setCareers] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editCareer, setEditCareer] = useState(null);
  const [mode, setMode] = useState("add");
  const [careerToDelete, setCareerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewDescriptionCareer, setViewDescriptionCareer] = useState(null);

  const refreshCareers = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/career/get-all-career');      
      const result = response.data;
      if (result.success) {
        setCareers(result.data);
      }
    } catch (err) {
      console.error('Error fetching Careers:', err);
      toast.error('Failed to load Careers');
    }
  }, []);

  useEffect(() => {
    refreshCareers();
  }, [refreshCareers]);

  const handleAddNewCareer = () => {
    // Reset edit career first, then set mode, then open drawer
    setEditCareer(null);
    setMode("add");
    setTimeout(() => {
      setIsDrawerOpen(true);
    }, 0);
  };

  const handleEditCareer = (career) => {
    // Close drawer first if it's open
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
      
      // Use setTimeout to ensure drawer closes before reopening with new data
      setTimeout(() => {
        setEditCareer({ ...career }); // Make a copy to ensure React detects the change
        setMode("edit");
        setIsDrawerOpen(true);
      }, 100);
    } else {
      // If drawer is closed, we can set data and open immediately
      setEditCareer({ ...career });
      setMode("edit");
      setIsDrawerOpen(true);
    }
  };

  const handleDeleteCareer = async (id) => {
    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(`/career/delete-career/${id}`);
      const result = response.data;
      if (result.success) {
        setCareers(careers.filter(career => career.id !== id));
        setCareerToDelete(null);
        toast.success('Career deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting Careers:', err);
      toast.error('Failed to delete Career');
    } finally {
      setIsDeleting(false);
    }
  };

  // Function to truncate text and strip HTML tags for the table view
  const truncateText = (html, maxLength = 50) => {
    if (!html) return '';
    
    // Create a temporary element to parse HTML and get plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen relative">
    <div className="drawer drawer-end">
      <input
        id="career-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isDrawerOpen}
        onChange={() => setIsDrawerOpen(!isDrawerOpen)}
      />
      <div className="drawer-content">
        <div className="md:flex space-y-2 md:space-y-0 block justify-between items-center mb-8">
          <div className='space-y-2'>
            <h1 className="text-3xl font-bold text-neutral-content">Careers</h1>
            <p>Total Careers: {careers.length}</p>
          </div>
          <button className="btn btn-primary gap-2" onClick={handleAddNewCareer}>
            <Plus className="w-5 h-5" />
            Add Career
          </button>
        </div>
        
        {careers.length > 0 ? (
          <div className="mx-auto overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-base-100">
                  <th className="p-3 text-left">Positions</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Job Type</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Openings</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {careers.map((career) => (
                  <tr key={career.id} className="border-b border-base-300 bg-base-200">
                    <td className="p-3 font-semibold text-accent">{career.position}</td>
                    <td className="p-3 ">{career.location}</td>
                    <td className="p-3 ">{career.jobType}</td>
                    <td className="p-3 ">
                      <div className="flex items-center gap-2">
                        {truncateText(career.shortdescription)}
                       
                      </div>
                    </td>
                    <td className="p-3 ">{career.positionCount}</td>
                    <td className="p-3">
                      <div className="flex justify-center space-x-2">
                        <button 
                          className="btn btn-sm btn-square btn-ghost" 
                          onClick={() => setViewDescriptionCareer(career)}
                        >
                          <Eye className="w-5 h-5 text-info" />
                        </button>
                        <button 
                          className="btn btn-sm btn-square btn-ghost" 
                          onClick={() => handleEditCareer(career)}
                        >
                          <Pencil className="w-5 h-5 text-success" />
                        </button>
                        <button 
                          className="btn btn-sm btn-square text-white btn-error" 
                          onClick={() => setCareerToDelete(career.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full h-96 flex justify-center items-center">
            <p>No Careers available</p>
          </div>
        )}
      </div>
  
      <div className="drawer-side">
        <label htmlFor="career-drawer" className="drawer-overlay"></label>
        <div className="p-4 md:w-1/3 w-full sm:w-2/3 max-h-screen overflow-auto bg-base-100 h-[80vh] text-base-content absolute bottom-4 right-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">{mode === "edit" ? 'Edit Career' : 'Add New Career'}</h2>
          {isDrawerOpen && (
            <CareerForm
              onCareerCreated={refreshCareers}
              initialData={editCareer}
              mode={mode}
              careers={careers}
              setIsDrawerOpen={setIsDrawerOpen}
            />
          )}
        </div>
      </div>
    </div>
  
    {careerToDelete && (
      <DeleteConfirmModal
        isOpen={careerToDelete !== null}
        careers={careers}
        onClose={() => setCareerToDelete(null)}
        onConfirm={() => handleDeleteCareer(careerToDelete)}
        title="Delete Career?"
        message="Are you sure you want to delete this Career? This action cannot be undone."
        isLoading={isDeleting}
      />
    )}

    {/* Enhanced Description View Modal with HTML Rendering */}
    {viewDescriptionCareer && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col">
          <h3 className="text-xl font-bold mb-4 text-accent">{viewDescriptionCareer.position}</h3>
          
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <p className="text-sm mb-1">Location</p>
              <p>{viewDescriptionCareer.location}</p>
            </div>
            
            <div>
              <p className="text-sm mb-1">Job Type</p>
              <p>{viewDescriptionCareer.jobType}</p>
            </div>
            
            <div>
              <p className="text-sm mb-1">Number of Openings</p>
              <p>{viewDescriptionCareer.positionCount}</p>
            </div>
            
            <div>
              <p className="text-sm mb-1">Description</p>
              <div className="max-h-60 overflow-y-auto border border-base-300 rounded p-2 bg-base-200">
                {/* Using dangerouslySetInnerHTML to render the HTML content from Quill editor */}
                <div 
                  className="ql-content"
                  dangerouslySetInnerHTML={{ __html: viewDescriptionCareer.shortdescription }}
                ></div>
              </div>
            </div>

            {viewDescriptionCareer.requirements && (
              <div>
                <p className="text-sm mb-1">Requirements</p>
                <div className="max-h-40 overflow-y-auto border border-base-300 rounded p-2 bg-base-200">
                  <div
                    className="ql-content"
                    dangerouslySetInnerHTML={{ __html: viewDescriptionCareer.requirements }}
                  ></div>
                </div>
              </div>
            )}
            
            {viewDescriptionCareer.benefits && (
              <div>
                <p className="text-sm mb-1">Benefits</p>
                <div className="max-h-40 overflow-y-auto border border-base-300 rounded p-2 bg-base-200">
                  <div
                    className="ql-content"
                    dangerouslySetInnerHTML={{ __html: viewDescriptionCareer.benefits }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-2">
            <button 
              className="btn btn-primary" 
              onClick={() => setViewDescriptionCareer(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default CareerLayout;