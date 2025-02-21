import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import ClientForm from "./ClientForm";
import ClientCard from "./ClientCard";
import axiosInstance from "../../config/axios";

function ClientsLayout() {
  const [clients, setClients] = useState([]);
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
      const response = await axiosInstance.get("/client/get-all-clients");
      setClients(response.data.data);
    } catch (err) {
      setError("Failed to load clients");
      console.error("Error fetching clients:", err);
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
  const handleDeleteClient = (clientId) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== clientId)
    );
  };

  // Filter clients based on search query
  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-3xl font-bold text-neutral-content">Clients</h1>
            <button
              className="btn btn-primary text-white gap-2"
              onClick={handleAddNewClient}
            >
              + New Client
            </button>
          </div>

          {/* Search Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search client..."
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
              {filteredClients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onEdit={() => handleEditClient(client)}
                  onDelete={() => handleDeleteClient(client.id)}
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
              {mode === "edit" ? "Edit Client" : "Add New Client"}
            </h2>
            <ClientForm
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

export default ClientsLayout;