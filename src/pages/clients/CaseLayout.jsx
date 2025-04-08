import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";

import axiosInstance from "../../config/axios";
import CaseCard from "./CaseCard";
import CaseForm from "./CaseForm";

function CaseLayout() {
  const [caseStudy, setCaseStudy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [mode, setMode] = useState("add");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Clients
  const refreshClientList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/casestudy/get-all-casestudy");      
      setCaseStudy(response.data.data);
    } catch (err) {
      setError("Failed to load case studies");
      console.error("Error fetching case studies:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshClientList();
  }, [refreshClientList]);

  // Handle Add New Client
  const handleAddNewClient = () => {
    setEditClient(null); // Clear edit data
    setMode("add");
    setIsDrawerOpen(true);
  };

  // Handle Edit Client
  const handleEditClient = (client) => {
    setEditClient(client); // Set client data to edit
    setMode("edit");
    setIsDrawerOpen(true);
  };

  // Handle Delete Client
  const handleDeleteClient = (caseId) => {
    setCaseStudy((prevCase) =>
      prevCase.filter((casestudy) => casestudy.id !== caseId)
    );
  };

  // Filter clients based on search query
  const filteredClients = caseStudy.filter((casestudy) =>
    casestudy.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  casestudy.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    casestudy.subTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen relative">
      {/* Drawer */}
      <div className="drawer drawer-end">
        <input
          id="new-client-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={isDrawerOpen}
          onChange={() => setIsDrawerOpen(!isDrawerOpen)}
        />
        <div className="drawer-content">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
          <div className=' space-y-2'>

            <h1 className="text-3xl font-bold text-neutral-content">Case Studies</h1>
            <p >Total Case Studies : {caseStudy.length}</p>
            </div>

            <button
              className="btn btn-primary text-white gap-2"
              onClick={handleAddNewClient}
            >
              + New Case Studies
            </button>
          </div>

          {/* Search Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search case..."
                className="input input-bordered w-full focus:outline-none pl-10 bg-base-100 text-neutral-content"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Client Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="card bg-base-100 animate-pulse transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  {/* Image Skeleton */}
                  <div className="h-48 bg-base-100 rounded-3xl transition-colors duration-300"></div>

                  {/* Content Skeleton */}
                  <div className="card-body p-4 space-y-3">
                    <div className="h-4 bg-base-200 w-1/2 transition-colors duration-300"></div>
                    <div className="h-6 bg-base-200 w-3/4 transition-colors duration-300"></div>
                    <div className="h-4 bg-base-200 w-full transition-colors duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((casestudy) => (
                <CaseCard
                  key={casestudy.id}
                  casestudy={casestudy}
                  onEdit={() => handleEditClient(casestudy)}
                  onDelete={() => handleDeleteClient(casestudy.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Drawer Sidebar */}
        <div className="drawer-side">
          <label htmlFor="new-client-drawer" className="drawer-overlay"></label>
          <div className="p-4 md:w-[40%] w-full sm:w-1/2 overflow-y-scroll bg-base-100 h-[85vh] text-base-content absolute bottom-4 right-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              {mode === "edit" ? "Edit Case" : "Add New Case"}
            </h2>
            <CaseForm
              onClientUpdated={refreshClientList}
              initialData={editClient}
              mode={mode}
              refreshClientList={refreshClientList}
              setIsDrawerOpen={setIsDrawerOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaseLayout;