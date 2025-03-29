import React, { useState } from "react";
import { Trash2, Edit, Pencil } from "lucide-react";
import axiosInstance from "../../config/axios";
import { toast } from "react-toastify";
import DeleteConfirmModal from "../../components/ui/modal/DeleteConfirmModal";

const CaseCard = ({ casestudy, onDelete, onEdit }) => {
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loading

  const handleDelete = async () => {
    setIsLoading(true);
    try {
     const response= await axiosInstance.delete(`casestudy/delete-casestudy/${casestudy.id}`);
      onDelete(casestudy.id);
      toast.success(response.data.message||"Client deleted successfully!");
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client.");
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="card bg-base-200 transition-all duration-300 overflow-hidden group relative">
        <figure className="relative h-48 overflow-hidden">
          <img
            src={casestudy?.image || "/api/placeholder/400/250"}
            alt={casestudy?.title}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </figure>

        <div className="card-body p-4">
          <h2 className="card-title text-neutral-content text-lg font-bold">
            {casestudy?.title}
          </h2>
          <p className="text-neutral-content text-sm line-clamp-2">
            {casestudy?.description}
          </p>
          {/* <div className="mt-2">
            <button
              className="text-blue-500 underline text-sm"
              onClick={() => window.open(client.website, "_blank")}
            >
              Visit Website
            </button>
          </div> */}
        </div>

        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            className="btn btn-sm btn-square btn-ghost"
            onClick={onEdit}
          >
            <Pencil className="w-6 h-6 text-success" />
          </button>
          <button
            className="btn btn-sm btn-square text-white btn-error"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={isLoading} // Pass loading state to the modal
        title="Delete Case"
        message="Are you sure you want to delete this case?"
      />
    </>
  );
};

export default CaseCard;
