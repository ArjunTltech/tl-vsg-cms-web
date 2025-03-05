import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axiosInstance from "../../config/axios"; // Assuming axiosInstance is already set up.
import { useTheme } from "../../context/ThemeContext"; // Assuming theme context is available.

function SessionChart() {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { theme } = useTheme();

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const response = await axiosInstance.get("/stats/session-duration"); // Replace with actual endpoint
                const data = response.data;

                if (data.success) {
                    const formattedData = [
                        ['Source', 'Avg Session Duration (seconds)'],
                        ...data.data.map(item => [
                            item.source,
                            parseFloat(item.avgSessionDuration) // Convert duration to number
                        ])
                    ];

                    setChartData(formattedData);
                } else {
                    setError("Failed to fetch session duration data.");
                }
            } catch (err) {
                console.error("Error fetching session data:", err);
                setError("Failed to fetch session data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchSessionData();
    }, []);

    // Generate a random set of colors
    const generateColors = (num) => {
        const colors = [];
        const colorPalette = ["#FF5733", "#33FF57", "#5733FF", "#FF33A1", "#33F0FF", "#F0FF33", "#FF8C00", "#8B00FF"]; // Add any custom color palette you want
        for (let i = 0; i < num; i++) {
            colors.push(colorPalette[i % colorPalette.length]);
        }
        return colors;
    };

    const options = {
        backgroundColor: {
            fill: theme === "dark" ? "#262C36" : "#F1F3F4", // Light/Dark Mode Support
        },
        colors: generateColors(chartData.length - 1), // Dynamically set colors based on data length
        title: "Average Session Duration by Source",
        titleTextStyle: {
            color: theme === "dark" ? "#FFFFFF" : "#000000",
        },
        hAxis: {
            title: "Avg Session Duration (seconds)",
            titleTextStyle: { color: theme === "dark" ? "#FFFFFF" : "#000000" },
            textStyle: { color: theme === "dark" ? "#FFFFFF" : "#000000" },
            gridlines: { color: theme === "dark" ? "#333333" : "#E0E0E0" },
            baselineColor: theme === "dark" ? "#FFFFFF" : "#000000",
        },
        vAxis: {
            title: "Source",
            titleTextStyle: { color: theme === "dark" ? "#FFFFFF" : "#000000" },
            textStyle: { color: theme === "dark" ? "#FFFFFF" : "#000000" },
            gridlines: { color: theme === "dark" ? "#333333" : "#E0E0E0" },
            baselineColor: theme === "dark" ? "#FFFFFF" : "#000000",
        },
        legend: {
            textStyle: { color: theme === "dark" ? "#FFFFFF" : "#000000" },
        }
    };

    const containerClasses = theme === "dark"
        ? "bg-base-100 text-neutral-content"
        : "bg-base-100 text-neutral-content";

    return (
        <div className={`mt-6 p-4 rounded-xl shadow-lg animate-fade-in-down  ${containerClasses}`}>
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title text-base md:text-2xl text-neutral-content flex items-center gap-2">
                        Session Duration by Source
                    </h2>
                </div>
                <div className="card-body h-[450px]">
                    {loading && <p>Loading session data...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && chartData.length > 0 && (
                        <Chart
                            chartType="BarChart"
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

export default SessionChart;
