import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axiosInstance from "../../config/axios";
import { useTheme } from "../../context/ThemeContext";

function EnquiryChart() {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { theme } = useTheme();

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await axiosInstance.get("/stats/enquiries/last-7-days");
                let data = response.data;

                if (data[data.length - 1][0] === "Date" && data[data.length - 1][1] === "Enquiries") {
                    data = [data.pop(), ...data];
                }

                // Format dates to MMM DD
                const formattedData = data.map((row, index) => {
                    if (index === 0) return row; // Skip header row
                    const date = new Date(row[0]);
                    const formattedDate = date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    });
                    return [formattedDate, row[1]];
                });

                setChartData(formattedData);
            } catch (err) {
                console.error("Error fetching chart data:", err);
                setError("Failed to fetch chart data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, []);

    const options = {
        backgroundColor: {
            fill: theme === "dark" ? "#262C36" : "#F1F3F4",
        },
        colors: ["#05eeff"],
        title: "Enquiries Over the Last 7 Days",
        titleTextStyle: {
            color: theme === "dark" ? "#FFFFFF" : "#000000",
        },
        hAxis: {
            title: "Date",
            titleTextStyle: { color: theme === "dark" ? "#FFFFFF" : "#000000" },
            textStyle: { color: theme === "dark" ? "#FFFFFF" : "#000000" },
            gridlines: { color: theme === "dark" ? "#333333" : "#E0E0E0" },
            baselineColor: theme === "dark" ? "#FFFFFF" : "#000000"
        },
        vAxis: {
            title: "Enquiries",
            titleTextStyle: { color: theme === "dark" ? "#FFFFFF" : "#000000" },
            textStyle: { color: theme === "dark" ? "#FFFFFF" : "#000000" },
            gridlines: { color: theme === "dark" ? "#333333" : "#E0E0E0" },
            baselineColor: theme === "dark" ? "#FFFFFF" : "#000000"
        },
        legend: {
            textStyle: { color: theme === "dark" ? "#FFFFFF" : "#000000" }
        }
    };

    const containerClasses = theme === "dark"
        ? "bg-base-100 text-neutral-content"
        : "bg-base-100 text-neutral-content";

    return (
        <div className={`mt-6 p-4 rounded-xl shadow-lg ${containerClasses}`}>
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title text-base md:text-2xl text-neutral-content flex items-center gap-2">
                        Enquiry Statistics
                    </h2>
                </div>
                <div className="card-body h-[450px]">
                    {loading && <p>Loading chart data...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && chartData.length > 0 && (
                        <Chart
                            chartType="ColumnChart"
                            width="100%"
                            height="400px"
                            data={chartData}
                            options={options}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default EnquiryChart;