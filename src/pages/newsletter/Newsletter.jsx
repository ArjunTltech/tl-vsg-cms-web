import { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import SubscriberTable from "../../components/newsletter/SubscriberTable";
import { toast } from "react-toastify";
import * as Yup from "yup";
import playNotificationSound from "../../utils/playNotification";

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
    const [errors, setErrors] = useState({});

    const limitOptions = [5, 10, 20, 50];

    // Define Yup validation schema
    const newsletterSchema = Yup.object().shape({
        emailSubject: Yup.string()
            .required("Email subject is required")
            .min(3, "Subject must be at least 3 characters")
            .max(100, "Subject cannot exceed 100 characters"),
        emailMessage: Yup.string()
            .required("Email message is required")
            .min(10, "Message must be at least 10 characters")
    });

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

    const validateForm = async () => {
        try {
            await newsletterSchema.validate(
                { emailSubject, emailMessage },
                { abortEarly: false }
            );
            setErrors({});
            return true;
        } catch (error) {
            const validationErrors = {};
            error.inner.forEach((err) => {
                validationErrors[err.path] = err.message;
            });
            setErrors(validationErrors);
            return false;
        }
    };

    const handleSendNewsletter = async () => {
        const isValid = await validateForm();
        
        if (!isValid) {
            return;
        }

        try {
            setIsModalOpen(false);
            const response = await axiosInstance.post("/newsletter/send-newsletter", {
                subject: emailSubject,
                content: emailMessage,
            });
            // playNotificationSound()
            toast.success("Bulk mail sent successfully");
        } catch (error) {
            console.error("Error sending bulk email:", error);
            toast.error("Error sending bulk email");
        } finally {
            setIsModalOpen(false);
            setEmailSubject("");
            setEmailMessage("");
            setErrors({});
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
                                className={`input input-bordered w-full ${errors.emailSubject ? "input-error" : ""}`}
                                placeholder="Enter email subject"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                            />
                            {errors.emailSubject && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.emailSubject}</span>
                                </label>
                            )}
                        </div>

                        {/* Message Textarea */}
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text font-medium">Message</span>
                            </label>
                            <textarea
                                className={`textarea textarea-bordered w-full ${errors.emailMessage ? "textarea-error" : ""}`}
                                placeholder="Enter your message here..."
                                value={emailMessage}
                                onChange={(e) => setEmailMessage(e.target.value)}
                            />
                            {errors.emailMessage && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.emailMessage}</span>
                                </label>
                            )}
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