import { Mail, RefreshCw, Send } from "lucide-react";
import { format } from "date-fns";

const SubscriberTable = ({
  subscribers,
  currentPage,
  limit,
  totalSubscribers,
  onRefresh,
  onSendMail,
  onPageChange,
  limitOptions,
  selectedLimit,
  onLimitChange,
  pagination,
}) => {
  const getPageNumbers = () => {
    let pages = [];
    const maxVisiblePages = 5;
    const totalPages = pagination.pages;

    if (totalPages <= maxVisiblePages) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (pagination.currentPage <= 3) {
        pages = [1, 2, 3, 4, 5, "...", totalPages];
      } else if (pagination.currentPage >= totalPages - 2) {
        pages = [
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        pages = [
          1,
          "...",
          pagination.currentPage - 1,
          pagination.currentPage,
          pagination.currentPage + 1,
          "...",
          totalPages,
        ];
      }
    }
    return pages;
  };

  return (
    <div className="min-h-[700px] bg-base-100 p-6 rounded-lg shadow-lg">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-start gap-3">
          <Mail className="w-6 h-6 text-primary" />
          <div className="space-y-[0.5px]">
            <h1 className="text-2xl font-bold text-neutral-content">
              Newsletters
            </h1>
              <p >Total Subscribers : {totalSubscribers}</p>
            <p className="text-sm text-gray-500 hover:text-gray-400 mt-1">
              Manage your newsletter subscriber list
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSendMail}
            className="btn btn-primary"
            aria-label="Send Bulk Mail"
          >
            <Send className="h-5 w-5 mr-2 " /> Send Bulk Mail
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto min-h-[600px]">
        {subscribers.length > 0 ? (
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Email</th>
                <th>Subscribed Date</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber, index) => {
                const serialNumber = (currentPage - 1) * limit + index + 1;
                return (
                  <tr key={subscriber.id} className="hover">
                    <td className="font-medium">{serialNumber}</td>
                    <td>{subscriber.email}</td>
                    <td>{format(new Date(subscriber.createdAt), "PPP")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-base-200 rounded-lg min-h-[600px]">
            <Mail className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">
              No subscribers found
            </h3>
            <p className="text-gray-500">
              Your newsletter list is currently empty
            </p>
          </div>
        )}
      </div>

      {/* Pagination Section */}
      <div className="flex flex-wrap items-center justify-between mt-6 bg-base-200 rounded-lg py-4 px-4">
        <div className="flex items-center gap-2">
          <button
            className="btn btn-sm"
            disabled={pagination.currentPage === 1}
            onClick={() => onPageChange(pagination.currentPage - 1)}
          >
            «
          </button>

          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              className={`btn btn-sm ${
                pagination.currentPage === page
                  ? "btn-primary"
                  : page === "..."
                  ? "btn-disabled"
                  : ""
              }`}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={page === "..."}
            >
              {page}
            </button>
          ))}

          <button
            className="btn btn-sm"
            disabled={pagination.currentPage === pagination.pages}
            onClick={() => onPageChange(pagination.currentPage + 1)}
          >
            »
          </button>
        </div>

        {/* Limit Selector */}
        <div className="flex items-center gap-6 pl-8">
          <label htmlFor="limit" className="text-sm text-gray-500">
            Items per page:
          </label>
          <select
            id="limit"
            className="select select-sm select-bordered"
            value={selectedLimit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
          >
            {limitOptions.map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SubscriberTable;
