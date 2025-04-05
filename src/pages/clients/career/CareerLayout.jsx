import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'react-toastify';
import axiosInstance from '../../../config/axios';
import DeleteConfirmModal from '../../../components/ui/modal/DeleteConfirmModal';
import CareerForm from './CareerForm';
// import CareerForm from '../../career/CareerForm';

const CareerLayout = () => {
  const [careers, setCareers] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editCareer, setEditCareer] = useState(null);
  const [mode, setMode] = useState("add");
  const [careerToDelete, setCareerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    setEditCareer(null);
    setMode("add");
    setIsDrawerOpen(true);
  };

  const handleEditCareer = (career) => {
    setEditCareer(career);
    setMode("edit");
    setIsDrawerOpen(true);
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

//   const handleDragEnd = async (result) => {
//     const { source, destination } = result;
//     if (!destination) return;

//     const reorderedCareers = Array.from(careers);
//     const [removed] = reorderedCareers.splice(source.index, 1);
//     reorderedCareers.splice(destination.index, 0, removed);

//     const updatedCareers = reorderedCareers.map((career, index) => ({
//       ...career,
//       order: index + 1,
//     }));

//     setCareers(updatedCareers);

//     try {
//       for (const career of updatedCareers) {
//         await axiosInstance.put(`/career/update-career/${career.id}`, {
//           career
          
//         });
//       }
//     } catch (err) {
//       console.error('Error updating Career order:', err);
//       toast.error('Failed to update Career order');
//     }
//   };

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
                    <td className="p-3 text-gray-300"> {career.location}</td>
                    <td className="p-3 text-gray-300"> {career.jobType}</td>
                    <td className="p-3 text-gray-300">{career.shortdescription}</td>
                    <td className="p-3 text-gray-300">{career.positionCount}</td>
                    <td className="p-3">
                      <div className="flex justify-center space-x-2">
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
          <CareerForm
            onCareerCreated={refreshCareers}
            initialData={editCareer}
            mode={mode}
            careers={careers}
            setIsDrawerOpen={setIsDrawerOpen}
          />
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
  </div>
  );
};

export default CareerLayout;