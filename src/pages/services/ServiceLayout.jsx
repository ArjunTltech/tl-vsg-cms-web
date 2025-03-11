import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import BlogPostForm from "./CreateForm";
import BlogCard from "./ServiceCard";
import axiosInstance from "../../config/axios";
import ServiceCard from "./ServiceCard";
import ServiceForm from "./CreateForm";

function ServiceLayout() {
  const [services, setServices] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editService, setEditService] = useState(null);
  const [mode, setMode] = useState("add");
  const [searchQuery, setSearchQuery] = useState("");

  const refreshServiceList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/service/get-all-service");
      setServices(response.data.data);  
    } catch (err) {
      setError("Failed to load services");
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshServiceList();
  }, [refreshServiceList]);

  const handleDeleteService = (serviceId) => {
    setServices((prevServices) => prevServices.filter((service) => service.id !== serviceId));
  };

  const handleEditService = (service) => {
    setEditService(service);
    setMode("edit");
    setIsDrawerOpen(true);
  };

  const handleAddNewService = () => {
    setEditService(null);
    setMode("add");
    setIsDrawerOpen(true);
  };
  const filteredServices = services.filter((service) =>
    service.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen relative">
      {/* Drawer */}
      <div className="drawer drawer-end">
        <input
          id="new-service-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={isDrawerOpen}
          onChange={() => setIsDrawerOpen(!isDrawerOpen)}
        />
        <div className="drawer-content">
          {/* Header Section */}
          <div className="md:flex space-y-2 md:space-y-0 block justify-between items-center mb-8">
            {/* <h1 className="text-3xl font-bold text-neutral-content">Services</h1> */}
            <div className=' space-y-2'>
       <h1 className="text-3xl font-bold text-neutral-content">Services </h1>
       <p >Total Services : {services.length}</p>
        </div>
            <button
              className="btn btn-primary text-white gap-2"
              onClick={handleAddNewService}
            >
              + Add new service
            </button>
          </div>

          {/* Search Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search service..."
                className="input input-bordered w-full focus:outline-none pl-10 bg-base-100 text-neutral-content"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Service Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="card bg-base-100 animate-pulse transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <div className="h-48 bg-base-100 rounded-3xl transition-colors duration-300"></div>
                  <div className="card-body p-4 space-y-3">
                    <div className="h-4 bg-base-200 w-1/2 transition-colors duration-300"></div>
                    <div className="h-6 bg-base-200 w-3/4 transition-colors duration-300"></div>
                    <div className="h-4 bg-base-200 w-full transition-colors duration-300"></div>
                    <div className="flex gap-4 mt-4">
                      <div className="h-4 bg-base-200 w-1/4 transition-colors duration-300"></div>
                      <div className="h-4 bg-base-200 w-1/4 transition-colors duration-300"></div>
                      <div className="h-4 bg-base-200 w-1/4 transition-colors duration-300"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}  
                  onDelete={handleDeleteService}
                  onEdit={() => handleEditService(service)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Drawer Sidebar */}
        <div className="drawer-side">
          <label htmlFor="new-service-drawer" className="drawer-overlay"></label>
          <div className="p-4 md:w-[40%] w-full sm:w-1/2 overflow-y-scroll bg-base-100 h-[85vh] text-base-content absolute bottom-4 right-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              {editService ? "Edit Service" : "Add New Service"}
            </h2>
            <ServiceForm
              onServiceCreated={refreshServiceList}
              initialData={editService}
              mode={mode}
              setIsDrawerOpen={setIsDrawerOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceLayout;