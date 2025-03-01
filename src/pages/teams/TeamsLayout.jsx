import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, Linkedin, Eye } from 'lucide-react';
import axiosInstance from '../../config/axios';
import DeleteConfirmModal from '../../components/ui/modal/DeleteConfirmModal';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
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

  // Quill editor modules and formats configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  };
  
  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/team/all-team');
      setTeamMembers(response.data.team);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setIsLoading(false);
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

  const openDetailModal = (member) => {
    setSelectedMember(member);
    setIsDetailModalOpen(true);
  };

  const truncateBio = (bio, maxLength = 80) => {
    // Remove HTML tags for card display
    const textOnly = bio?.replace(/<[^>]*>/g, '') || '';
    if (textOnly.length <= maxLength) return textOnly;
    return textOnly.substring(0, maxLength) + '...';
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
        <p className="text-sm line-clamp-2">{truncateBio(member.bio)}</p>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-circle">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            <button
              className="btn btn-sm btn-circle btn-primary"
              onClick={() => openDetailModal(member)}
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
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

  const DetailModal = ({ member, isOpen, onClose }) => {
    if (!isOpen || !member) return null;

    // Prevent body scrolling when modal is open
    useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, []);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-6">
        <div className="bg-base-200 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Header with close button */}
          <div className="p-4 border-b border-base-300 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Team Member Details</h2>
            <button className="btn btn-sm btn-circle" onClick={onClose}>
              ✕
            </button>
          </div>
          
          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 p-4">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left column - Profile */}
              <div className="lg:w-1/3 flex flex-col items-center">
                <div className="bg-base-300 p-6 rounded-lg w-full">
                  <div className="flex flex-col items-center">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mb-4"
                    />
                    <h3 className="text-xl md:text-2xl font-bold text-center">{member.name}</h3>
                    <p className="text-md md:text-lg text-center">{member.position}</p>
                    
                    <div className="flex gap-3 mt-4">
                      {member.linkedin && (
                        <a 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-sm btn-circle"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {member.email && (
                        <a 
                          href={`mailto:${member.email}`} 
                          className="btn btn-sm btn-circle"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Additional details table */}
                  <div className="mt-6 bg-base-200 p-3 rounded">
                    <h4 className="font-semibold mb-2 text-sm">Member Details</h4>
                    <table className="w-full text-sm">
                      <tbody>
                        {member.email && (
                          <tr>
                            <td className="font-medium pr-2 py-1">Email</td>
                            <td className="truncate">{member.email}</td>
                          </tr>
                        )}
                        {member.order !== undefined && (
                          <tr>
                            <td className="font-medium pr-2 py-1">Display Order</td>
                            <td>{member.order}</td>
                          </tr>
                        )}
                        <tr>
                          <td className="font-medium pr-2 py-1">Status</td>
                          <td>
                            <span className={`px-2 py-1 rounded text-xs ${member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {member.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {/* Right column - Biography and other details */}
              <div className="lg:w-2/3">
                <div className="bg-base-300 p-6 rounded-lg h-full">
                  <h3 className="text-lg font-semibold mb-3">Biography</h3>
                  <div 
                    className="bg-base-200 p-4 rounded-lg mb-6 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: member.bio }}
                  />
                  
                  {/* Additional sections can go here */}
                  {member.linkedin && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-3">Social Media</h3>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">LinkedIn</h4>
                        <a 
                          href={member.linkedin}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {member.linkedin}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer with action buttons */}
          <div className="p-4 border-t border-base-300 flex justify-end gap-2">
            <button
              className="btn btn-primary btn-sm md:btn-md"
              onClick={() => {
                onClose();
                handleEdit(member);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Member
            </button>
            <button 
              className="btn btn-sm md:btn-md"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-200 p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {isEditing ? 'Edit Member' : 'Add Member'}
              </h2>
              <button 
                className="btn btn-sm btn-circle" 
                onClick={() => setIsDrawerOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <input
                  type="text"
                  placeholder="Position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              
              {/* ReactQuill Editor for Bio with contained styling */}
              <div className="quill-container">
                <label className="block text-sm font-medium mb-1">Bio</label>
                <div className="rounded-md border border-gray-300">
                  <ReactQuill
                    theme="snow"
                    value={formData.bio || ''}
                    onChange={(content) => setFormData({ ...formData, bio: content })}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Enter team member biography..."
                  />
                </div>
                <style jsx global>{`
                  .quill-container .ql-container {
                    min-height: 150px;
                    max-height: 300px;
                    overflow-y: auto;
                  }
                  .quill-container .ql-editor {
                    min-height: 150px;
                  }
                  /* Fix responsive issues */
                  .quill-container .ql-toolbar {
                    flex-wrap: wrap;
                  }
                  /* Add margin to separate from next field */
                  .quill-container {
                    margin-bottom: 2rem;
                  }
                `}</style>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  placeholder="LinkedIn URL"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="input input-bordered w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input input-bordered w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Display Order</label>
                <input
                  type="number"
                  placeholder="Order"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="input input-bordered w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Profile Image</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="file-input file-input-bordered w-full"
                  accept="image/*"
                  required={!isEditing}
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" className="btn" onClick={() => setIsDrawerOpen(false)}>
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

      {/* Detail View Modal */}
      <DetailModal 
        member={selectedMember}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

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