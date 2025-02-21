import React, { useEffect, useState } from 'react';
import axiosInstance from '../../config/axios';

const AnalyticsTable = () => {
    const [period, setPeriod] = useState('30days');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const getDateRange = (periodString) => {
        const endDate = new Date();
        const startDate = new Date();
        const days = parseInt(periodString);
        startDate.setDate(endDate.getDate() - days);

        return {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        };
    };

    const fetchData = async (selectedPeriod, customStartDate, customEndDate) => {
        setLoading(true);
        try {
            let start, end;
            if (selectedPeriod === 'custom') {
                // Only fetch if both dates are selected
                if (!customStartDate || !customEndDate) {
                    setError('Please select both start and end dates');
                    setLoading(false);
                    return;
                }
                start = customStartDate;
                end = customEndDate;
            } else {
                const { startDate, endDate } = getDateRange(selectedPeriod.replace('days', ''));
                start = startDate;
                end = endDate;
            }

            const response = await axiosInstance.get('/stats/full-page-data', {
                params: { startDate: start, endDate: end },
            });
            setData(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch analytics data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (period === 'custom') {
            // Skip fetching data if it's a custom date and no date is selected yet
            if (!startDate || !endDate) return;
            fetchData(period, startDate, endDate);
        } else {
            // Automatically fetch data for predefined periods (e.g., Last 7 days, 30 days)
            fetchData(period, startDate, endDate);
        }
    }, [period, startDate, endDate]);

    const handlePeriodChange = (e) => {
        const newPeriod = e.target.value;
        setPeriod(newPeriod);
        if (newPeriod !== 'custom') {
            setStartDate('');
            setEndDate('');
        }
    };

    const handleCustomDateChange = () => {
        fetchData('custom', startDate, endDate);
    };

    return (
        <div className="card bg-base-200 shadow-xl mt-8 w-full ">
             <div className="card-body gap-4 min-h-[600px] max-h-[800px] overflow-y-auto scrollbar-none">
                <div className="flex flex-wrap justify-between">
                    <h2 className="card-title text-2xl mb-4">Page Analytics Overview</h2>
                    <select
                        className="select select-bordered w-full max-w-xs"
                        value={period}
                        onChange={handlePeriodChange}
                    >
                        <option value="7days">Last 7 days</option>
                        <option value="14days">Last 14 days</option>
                        <option value="30days">Last 30 days</option>
                        <option value="60days">Last 60 days</option>
                        <option value="90days">Last 90 days</option>
                        <option value="180days">Last 6 months</option>
                        <option value="365days">Last 12 months</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>

                {period === 'custom' && (
                    <div className="flex  gap-4 mt-4">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="input input-sm input-bordered "
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="input input-sm input-bordered "
                        />
                    </div>
                )}

                    <div className="overflow-x-auto">
                        <table className="table w-full table-zebra ">
                            <thead>
                                <tr>
                                    <th>Page Path</th>
                                    <th className="text-right">Views</th>
                                    <th className="text-right">Sessions</th>
                                    <th className="text-right">Users</th>
                                    <th className="text-right">Events</th>
                                    <th className="text-right">Engagement</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    <tr key={index} className="hover">
                                        <td className="font-medium">{row.pagePath}</td>
                                        <td className="text-right">{row.screenPageViews}</td>
                                        <td className="text-right">{row.sessions}</td>
                                        <td className="text-right">{row.activeUsers}</td>
                                        <td className="text-right">{row.eventCount}</td>
                                        <td className="text-right">
                                            {(Number(row.engagementRate) * 100).toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
            </div>
        </div>
    );
};

export default AnalyticsTable;
