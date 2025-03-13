import { useEffect, useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import axiosInstance from "../../config/axios";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import { toast } from "react-toastify";
import {
  Mail,
  Clock,
  ChevronDown,
  Filter,
  RefreshCw,
  Phone,
  Inbox,
  Download,
  FileSpreadsheet,
  FileText,
  Trash2,
  AlertTriangle
} from "lucide-react";
import playNotificationSound from "../../utils/playNotification";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-xl max-w-sm w-full">
        <div className="flex items-center mb-4 text-error">
          <AlertTriangle className="w-8 h-8 mr-3" />
          <h2 className="text-lg font-bold">Confirm Deletion</h2>
        </div>
        <p className="mb-6">
          Are you sure you want to delete this enquiry from {itemName}?
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="btn btn-ghost"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-error text-white"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const EnquiryItem = ({ enquiry, onStatusChange, onDelete }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = async () => {
    if (enquiry.status === "unread") {
      try {
        await axiosInstance.patch(`/enquiries/update-status/${enquiry.id}`, {
          status: "read"
        });
        onStatusChange(enquiry.id, "read");
      } catch (error) {
        console.error("Failed to update status", error);
        toast.error("Failed to mark enquiry as read");
      }
    }
    setShowMessage(!showMessage);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/enquiries/delete-enquiry/${enquiry.id}`);
      onDelete(enquiry.id);
      playNotificationSound()
      toast.success("Enquiry deleted successfully!");
    } catch (error) {
      console.error("Error deleting Enquiry:", error);
      toast.error("Failed to delete the Enquiry. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-200 relative">
        <div className="card-body p-4">
          <div
            className="cursor-pointer"
            onClick={handleClick}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className={`text-lg ${enquiry.status === 'unread' ? 'font-bold' : 'font-medium'}`}>
                    {enquiry.name}
                  </h3>
                  {enquiry.status === 'unread' && (
                    <span className="badge badge-secondary text-white badge-sm py-2">New</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-content flex-wrap">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {enquiry.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    +{enquiry.phoneNumber}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {format(new Date(enquiry.createdAt), 'PPp')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-ghost btn-sm text-error"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteModal(true);
                  }}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button className="btn btn-ghost btn-sm">
                  <ChevronDown
                    className={`h-5 w-5 transition-transform duration-200 ${showMessage ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>
          {showMessage && (
            <div className="mt-4">
              <div className="divider my-2"></div>
              <div className="bg-base-200 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{enquiry.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        itemName={enquiry.name}
      />
    </>
  );
};

const EnquiriesFilter = ({ onFilterChange, onDateRangeChange, filters, isVisible }) => {
  const [localStartDate, setLocalStartDate] = useState(
    filters.startDate ? parseISO(filters.startDate) : null
  );
  const [localEndDate, setLocalEndDate] = useState(
    filters.endDate ? parseISO(filters.endDate) : null
  );
  const [status, setStatus] = useState(filters.status || "");
  const [error, setError] = useState("");
  const infoMessage = "Example: If you select March 3, the end date will be automatically set to March 4.";

  useEffect(() => {
    // Update local state when filters prop changes
    setLocalStartDate(filters.startDate ? parseISO(filters.startDate) : null);
    setLocalEndDate(filters.endDate ? parseISO(filters.endDate) : null);
    setStatus(filters.status || "");
  }, [filters]);

  const handleStartDateChange = (date) => {
    setLocalStartDate(date);
    // Only trigger date range change if the date is valid
    if (isValid(date)) {
      onDateRangeChange("startDate", format(date, "yyyy-MM-dd"));
    }
  };

  const handleEndDateChange = (date) => {
    
    setLocalEndDate(date);
    // Only trigger date range change if the date is valid
    if (isValid(date)) {
      onDateRangeChange("endDate", format(date, "yyyy-MM-dd"));
    }
  };

  const handleStatusChange = (statusValue) => {
    setStatus(statusValue);
    onFilterChange(statusValue);
  };

  const handleApplyFilter = () => {
    // Ensure both dates are valid before applying
    if (!localStartDate || !localEndDate) {
      setError("Please select both start and end dates.");
      return;
    }    
    if (new Date(localStartDate).getTime() === new Date(localEndDate).getTime()) {
      setError("Start date and end date cannot be the same.");
      return;
    }
    
    const startDateFormatted = localStartDate && isValid(localStartDate)
      ? format(localStartDate, "yyyy-MM-dd")
      : "";
    const endDateFormatted = localEndDate && isValid(localEndDate)
      ? format(localEndDate, "yyyy-MM-dd")
      : "";
setError("")
    onDateRangeChange("startDate", startDateFormatted);
    onDateRangeChange("endDate", endDateFormatted);
  };

  const handleClearFilter = () => {
    
    setLocalStartDate(null);
    setLocalEndDate(null);
    setStatus("");
    onDateRangeChange("startDate", "");
    onDateRangeChange("endDate", "");
    onFilterChange("");
  };

  if (!isVisible) return null;

  return (
    <div className="bg-base-200 p-4 rounded-lg mb-6 animate-in slide-in-from-top duration-200">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 md:max-w-xs">
          <label className="label">
            <span className="label-text">Filter by Status</span>
          </label>
          <select
            className="select select-bordered select-sm w-full"
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="label">
            <span className="label-text">Date Range</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <ReactDatePicker
              selected={localStartDate}
              onChange={handleStartDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Start Date"
              className="input input-bordered input-sm w-full sm:flex-1 placeholder:text-neutral-content"
              wrapperClassName="w-full md:max-w-xs"
            />
            <span className="text-gray-500 hidden sm:inline">to</span>
            <ReactDatePicker
              selected={localEndDate}
              onChange={handleEndDateChange}
              dateFormat="yyyy-MM-dd"
              minDate={localStartDate}
              placeholderText="End Date"
              className="input input-bordered input-sm w-full sm:flex-1 placeholder:text-neutral-content"
              wrapperClassName="w-full md:max-w-xs"
            />
            <div className="flex gap-2 ">
              <button
                className="btn btn-primary btn-sm text-white"
                onClick={handleApplyFilter}
              >
                Apply
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={handleClearFilter}
              >
                Clear
              </button>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-2">
  Note: To get data for a day, set the start date to that day and the end date to the next day.
</p>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        </div>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    let pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, 5, '...', totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }
    return pages;
  };

  return (
    <div className="min-h-[100px] flex items-center justify-center mt-6 bg-base-200 rounded-lg py-4">
      <div className="join">
        <button
          className="join-item btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          «
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            className={`join-item btn btn-sm ${currentPage === page
              ? 'btn-primary'
              : page === '...'
                ? 'btn-disabled'
                : ''
              }`}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}

        <button
          className="join-item btn btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          »
        </button>
      </div>
    </div>
  );
};

const EnquiriesView = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [enquiryCount,setEnquiryCount]= useState()
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1
  });

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (filters.status) {
        queryParams.append('status', filters.status);
      }

      if (filters.startDate) {
        queryParams.append('startDate', filters.startDate);
      }

      if (filters.endDate) {
        queryParams.append('endDate', filters.endDate);
      }

      queryParams.append('page', filters.page.toString());
      queryParams.append('limit', filters.limit.toString());

      const response = await axiosInstance.get(`/enquiries/get-all-enquiries?${queryParams}`);
      
const formattedEnquiries = response.data.enquiries.map((enquiry) => ({
  ...enquiry,
  phoneNumber: enquiry.phoneNumber.length > 2 
    ? enquiry.phoneNumber.slice(0, 2) + " " + enquiry.phoneNumber.slice(2) 
    : enquiry.phoneNumber,
}));

setEnquiries(formattedEnquiries);   
      setPagination(response.data.pagination);
      setEnquiryCount(response.data.totalEnquiryCount)
    } catch (error) {
      console.error("Failed to fetch enquiries", error);
      toast.error("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [filters]);

  const handleStatusChange = async (id, newStatus) => {
    setEnquiries((prev) =>
      prev.map((enquiry) =>
        enquiry.id === id ? { ...enquiry, status: newStatus } : enquiry
      )
    );
  };

  const handleDeleteEnquiry = (id) => {
    setEnquiries((prev) => prev.filter((enquiry) => enquiry.id !== id));

    // If this was the last item on the page, go back a page
    if (enquiries.length === 1 && pagination.currentPage > 1) {
      setFilters(prev => ({ ...prev, page: pagination.currentPage - 1 }));
    }
  };

  const handleFilterChange = (status) => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  };

  const handleDateRangeChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const exportData = async (format) => {
    try {
      const queryParams = new URLSearchParams({
        status: filters.status || "",
        startDate: filters.startDate || "",
        endDate: filters.endDate || "",
        format: format
      });

      const response = await axiosInstance.get(`/enquiries/export-enquiry?${queryParams}`, {
        responseType: "blob",
      });

      const fileExtension = {
        excel: '.xlsx',
        pdf: '.pdf',
      }[format];

      const mimeTypes = {
        excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        pdf: 'application/pdf',
      }[format];

      const blob = new Blob([response.data], { type: mimeTypes });
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Enquiry-report${fileExtension}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to export data");
    }
  };

  return (
    <div className="py-8 min-h-screen">
      <div className="bg-base-100 p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-start gap-3">
            <Inbox className="w-6 h-6 text-primary" />
            <div className="space-y-[0.5px]">
              <h1 className="text-2xl font-bold text-neutral-content">Enquiries</h1>
              <p >Total Enquiries : {enquiryCount}</p>
              <p className="text-sm text-gray-500 mt-1">Manage and respond to your enquiries</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="relative dropdown ">
              <a
                tabIndex={0}
                className="btn btn-accent text-neutral-content gap-2 hidden md:inline-flex"
                aria-label="Export Data"
              >
                <Download className="h-5 w-5" />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown className="h-4 w-4" />
              </a>

              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow mt-2"
              >
                <li>
                  <button
                    onClick={() => exportData("excel")}
                    className="text-neutral-content hover:bg-base-200"
                  >
                    <FileSpreadsheet className="inline-block mr-2" />
                    Excel
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => exportData("pdf")}
                    className="text-neutral-content hover:bg-base-200"
                  >
                    <FileText className="inline-block mr-2" />
                    PDF
                  </button>
                </li>
              </ul>
            </div>

            <button
              onClick={toggleFilters}
              className="btn btn-ghost gap-2"
              aria-label="Toggle Filters"
            >
              <Filter className="h-5 w-5" />
              <span className="hidden sm:inline">
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </span>
            </button>

            <button
              onClick={fetchEnquiries}
              className="btn btn-ghost btn-circle"
              aria-label="Refresh"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        <EnquiriesFilter
          onFilterChange={handleFilterChange}
          onDateRangeChange={handleDateRangeChange}
          filters={filters}
          isVisible={showFilters}
        />

        {loading ? (
          <div className="flex justify-center items-center min-h-[600px]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-base-200 rounded-lg min-h-[400px]">
            <Inbox className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No enquiries found</h3>
            <p className="text-gray-500">Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enquiries.map((enquiry) => (
              <EnquiryItem
                key={enquiry.id}
                enquiry={enquiry}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteEnquiry}
              />
            ))}
          </div>
        )}

        {enquiries.length > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default EnquiriesView;