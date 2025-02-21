import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, Linkedin } from 'lucide-react';
import axiosInstance from '../../config/axios';
import DeleteConfirmModal from '../../components/ui/modal/DeleteConfirmModal';
import { toast, } from 'react-toastify';

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    linkedin: '',
    email: '',
    order: '',
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/team/all-team');
      setTeamMembers(response.data.team);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setIsLoading(false);;
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleAdd = () => {
    setFormData({
      name: '',
      position: '',
      bio: '',
      linkedin: '',
      email: '',
      order: '',
      isActive: true
    });
    setSelectedFile(null);
    setIsEditing(false);
    setIsDrawerOpen(true);
  };

  const handleEdit = (member) => {
    setFormData(member);
    setIsEditing(true);
    setIsDrawerOpen(true);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(`/team/delete-team/${memberToDelete.id}`);
      await fetchTeamMembers();
      setIsModalOpen(false);
      setMemberToDelete(null);
      setIsLoading(false);
      toast.success(`Deleted ${memberToDelete.name} successfully!`);
    } catch (error) {
      console.error('Error deleting team member:', error);
      setIsLoading(false);
      toast.error('Failed to delete team member.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    if (selectedFile) {
      formDataToSend.append('image', selectedFile);
    }

    try {
      setIsLoading(true);
      if (isEditing) {
        await axiosInstance.put(`/team/update-team/${formData.id}`, formDataToSend);
        toast.success('Team member updated successfully!');
      } else {
        await axiosInstance.post('/team/add-team', formDataToSend);
        toast.success('Team member added successfully!');
      }
      await fetchTeamMembers();
      setIsDrawerOpen(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error saving team member:', error);
      setIsLoading(false);
      toast.error('Failed to save team member.');
    }
  };

  const TeamMemberCard = ({ member }) => (
    <div className="relative bg-base-200 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 flex flex-col space-y-4">
        <div className="flex gap-4 items-center">
          <img
            src={member.image}
            alt={member.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h3 className="text-xl font-bold">{member.name}</h3>
            <p className="text-sm">{member.position}</p>
          </div>
        </div>
        <p className="text-sm">{member.bio}</p>
        <div className="flex justify-between items-center">
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          <div className="flex gap-2">
            <button
              className="btn btn-sm"
              onClick={() => handleEdit(member)}
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              className="btn btn-sm btn-error"
              onClick={() => {
                setMemberToDelete(member);
                setIsModalOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <button className="btn btn-primary" onClick={handleAdd} disabled={isLoading}>
          <Plus className="h-5 w-5" />
          {isLoading ? 'Loading...' : 'Add Member'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>

      {/* Add/Edit Form Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-200 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Member' : 'Add Member'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                placeholder="Position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="input input-bordered w-full"
                required
              />
              <textarea
                placeholder="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="textarea textarea-bordered w-full"
                required
              />
              <input
                type="text"
                placeholder="LinkedIn URL"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="input input-bordered w-full"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input input-bordered w-full"
              />
              <input
                type="number"
                placeholder="Order"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="input input-bordered w-full"
              />
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="file-input file-input-bordered w-full"
                accept="image/*"
                required={!isEditing}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title={`Delete ${memberToDelete?.name}?`}
        message={`Are you sure you want to delete ${memberToDelete?.name}? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TeamManagement;
