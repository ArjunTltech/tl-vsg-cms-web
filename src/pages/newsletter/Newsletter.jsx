import { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import SubscriberTable from "../../components/newsletter/SubscriberTable";

const Newsletter = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        total: 0,
        pages: 1,
        currentPage: 1,
    });
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [emailSubject, setEmailSubject] = useState("");
    const [emailMessage, setEmailMessage] = useState("");

    const limitOptions = [5, 10, 20, 50];

    const fetchSubscribers = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: filters.page.toString(),
                limit: filters.limit.toString(),
            });

            const response = await axiosInstance.get(
                `/newsletter/get-all-subscribers?${queryParams}`
            );
            setSubscribers(response.data.subscribers);
            setPagination({
                total: response.data.pagination.total,
                pages: response.data.pagination.totalPages,
                currentPage: response.data.pagination.page,
            });
        } catch (error) {
            console.error("Failed to fetch newsletter subscribers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, [filters]);

    const handlePageChange = (page) => {
        setFilters((prev) => ({ ...prev, page }));
    };

    const handleLimitChange = (limit) => {
        setFilters({ page: 1, limit });
    };

 

    const handleSendNewsletter = async () => {
        if (!emailSubject.trim() || !emailMessage.trim()) {
            alert("Both subject and message are required!");
            return;
        }

        try {
            setIsModalOpen(false)
            const response = await axiosInstance.post("/newsletter/send-newsletter", {
                subject: emailSubject,
                content: emailMessage,
            });

        } catch (error) {
            console.error("Error sending bulk email:", error);
            alert("Failed to send the newsletter. Please try again.");
        } finally {
            setIsModalOpen(false);
            setEmailSubject("");
            setEmailMessage("");
        }
    };

    return (
        <div className="min-h-screen">
            {loading ? (
                <div className="flex justify-center items-center min-h-[700px]">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : (
                <>
                    <SubscriberTable
                        subscribers={subscribers}
                        currentPage={pagination.currentPage}
                        limit={filters.limit}
                        totalSubscribers={pagination.total}
                        onSendMail={() => setIsModalOpen(true)}
                        onPageChange={handlePageChange}
                        limitOptions={limitOptions}
                        selectedLimit={filters.limit}
                        onLimitChange={handleLimitChange}
                        pagination={pagination}
                    />
                </>
            )}

            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h2 className="text-lg font-bold mb-4">Send Bulk Mail</h2>

                        {/* Subject Input */}
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text font-medium">Subject</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                placeholder="Enter email subject"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                            />
                        </div>

                        {/* Message Textarea */}
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text font-medium">Message</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered w-full"
                                placeholder="Enter your message here..."
                                value={emailMessage}
                                onChange={(e) => setEmailMessage(e.target.value)}
                            />
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn btn-primary"
                                onClick={() => handleSendNewsletter()}
                            >
                                Send
                            </button>
                            <button
                                className="btn"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Newsletter;
