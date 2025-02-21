import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axiosInstance from "../../config/axios";
import { useTheme } from "../../context/ThemeContext";
import { BarChart2, Users } from "lucide-react";

const TrafficSourcesChart = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [period, setPeriod] = useState("30days");
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { theme } = useTheme();

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

    const fetchData = async () => {
        try {
            let start, end;
            if (period === "custom") {
                if (!startDate || !endDate) {
                    setError("Please select both start and end dates.");
                    return;
                }
                start = startDate;
                end = endDate;
            } else {
                const { startDate: fetchedStartDate, endDate: fetchedEndDate } = getDateRange(period.replace("days", ""));
                start = fetchedStartDate;
                end = fetchedEndDate;
            }

            const response = await axiosInstance.get("/stats/traffic-sources", {
                params: { startDate: start, endDate: end }
            });

            const chartData = [
                ["Channel", "Sessions", "Users"],
                ...response.data.data.map((source) => [
                    `${source.channel} (${source.percentage}%)`,
                    Number(source.sessions),
                    Number(source.users),
                ])
            ];

            setData(chartData);
            setError(null);
        } catch (error) {
            setError("Failed to fetch traffic sources data. Please try again later.");
            console.error("Error fetching traffic sources:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [period, startDate, endDate]);

    const options = {
        title: "Traffic Sources Distribution",
        is3D: true,
        pieSliceText: "percentage",
        slices: {
            0: { color: "#4285F4" },  // Blue for Organic Search
            1: { color: "#DB4437" },  // Red for Direct
            2: { color: "#F4B400" },  // Yellow for Paid Search
            3: { color: "#0F9D58" },  // Green for Referral
            4: { color: "#AA47BC" },  // Purple for Social
            5: { color: "#00ACC1" },  // Cyan for Email
            6: { color: "#FF7043" },  // Orange for Display
            7: { color: "#9E9E9E" }   // Grey for Others
        },
        backgroundColor: theme === "dark" ? "#191D23" : "#FFFFFF",
        titleTextStyle: {
            color: theme === "dark" ? "#FFFFFF" : "#000000",
            fontSize: 18,
            bold: true
        },
        legend: {
            textStyle: {
                color: theme === "dark" ? "#FFFFFF" : "#000000",
            },
            position: "right",
            alignment: "center"
        },
        tooltip: {
            showColorCode: true,
            text: "percentage"
        },
        chartArea: {
            backgroundColor: theme === "dark" ? "#191D23" : "#FFFFFF",
            left: "10%",
            top: "10%",
            width: "80%",
            height: "80%"
        },
        animation: {
            startup: true,
            duration: 1000,
            easing: "out"
        }
    };

    const containerClasses = theme === "dark"
        ? "bg-base-200 text-neutral-content"
        : "bg-base-200 text-neutral-content";

    const handlePeriodChange = (e) => {
        const newPeriod = e.target.value;
        setPeriod(newPeriod);
        if (newPeriod !== "custom") {
            setStartDate('');
            setEndDate('');
        }
    };

    const handleCustomDateChange = () => {
        fetchData();
    };

    return (
        <div className={`w-full mx-auto mt-8 rounded-xl shadow-lg ${containerClasses}`}>
            <div className="card-body">
                <div className="flex flex-wrap justify-between">
                    <h2 className="card-title text-2xl mb-4">Traffic Sources</h2>
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

                {period === "custom" && (
                    <div className="flex gap-4 mt-4">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="input input-sm input-bordered"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="input input-sm input-bordered"
                        />
                    </div>
                )}

                <div className="w-full rounded-xl p-6">
                    <Chart
                        chartType="PieChart"
                        width="100%"
                        height="400px"
                        data={data}
                        options={options}
                    />
                    {data && data.length > 1 && (
                        // <div className="mt-4 text-sm text-center">
                        //     Total Sessions: 
                        //     <br />
                        //     Total Users: 
                        // </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {/* Sessions Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm opacity-70">Total Sessions</p>
              <h3 className="text-2xl font-bold">
              {data.slice(1).reduce((sum, item) => sum + item[1], 0).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Users Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm opacity-70">Total Users</p>
              <h3 className="text-2xl font-bold">
              {data.slice(1).reduce((sum, item) => sum + item[2], 0).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrafficSourcesChart;
