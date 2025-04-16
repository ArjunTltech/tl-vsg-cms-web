import React, { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import axiosInstance from "../../config/axios";
import { toast } from "react-toastify";
import DeleteConfirmModal from "../../components/ui/modal/DeleteConfirmModal";

const CaseCard = ({ casestudy, onDelete, onEdit }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.delete(`casestudy/delete-casestudy/${casestudy.id}`);
      onDelete(casestudy.id);
      toast.success(response.data.message || "Case study deleted successfully!");
    } catch (error) {
      console.error("Error deleting case study:", error);
      toast.error("Failed to delete case study.");
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="card bg-base-200 transition-all duration-300 overflow-hidden group relative flex flex-col h-full">
        <figure className="relative h-48 overflow-hidden">
          <img
            src={casestudy?.image || "/api/placeholder/400/250"}
            alt={casestudy?.title}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </figure>

        <div className="card-body p-4 flex-grow">
          <h2 className="card-title text-neutral-content text-lg font-bold">
            {casestudy?.title}
          </h2>
          <p className="text-neutral-content text-sm overflow-hidden text-ellipsis line-clamp-2 mb-10">
            {casestudy?.subTitle}
          </p>
        </div>

        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            className="btn btn-sm btn-square btn-ghost"
            onClick={onEdit}
          >
            <Pencil className="w-5 h-5 text-success" />
          </button>
          <button
            className="btn btn-sm btn-square text-white btn-error"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={isLoading}
        title="Delete Case Study"
        message="Are you sure you want to delete this case study?"
      />
    </>
  );
};

export default CaseCard;