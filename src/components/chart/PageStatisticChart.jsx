import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axiosInstance from "../../config/axios";
import { useTheme } from "../../context/ThemeContext";

const PageStatisticsChart = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null); // State to store error messages
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API call using Axios
        const response = await axiosInstance.get("/stats/full-page-data"); 
        
        const chartData = [
          ["Page Path", "Screen Page Views", "Sessions", "Active Users", "Event Count"],
          ...response.data.data.map((page) => [
            page.pageTitle, // Display the page title in the chart
            Number(page.screenPageViews),
            Number(page.sessions),
            Number(page.activeUsers),
            Number(page.eventCount),
          ]),
        ];
        setData(chartData);
      } catch (error) {
        // Catch any errors from the API call
        setError("Failed to fetch data. Please try again later.");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const options = {
    title: "Page Statistics Breakdown",
    is3D: true,
    slices: {
      0: { offset: 0.1 },
      1: { offset: 0.1 },
      2: { offset: 0.1 },
      3: { offset: 0.1 },
    },
    backgroundColor: theme === "dark" ? "#191D23" : "#FFFFFF", // Set background color based on theme
    titleTextStyle: {
      color: theme === "dark" ? "#FFFFFF" : "#000000", // Title text color
    },
    legend: {
      textStyle: {
        color: theme === "dark" ? "#FFFFFF" : "#000000",
      },
    },
    chartArea: {
      backgroundColor: theme === "dark" ? "#191D23" : "#FFFFFF",
    },
    hAxis: {
      textStyle: {
        color: theme === "dark" ? "#FFFFFF" : "#000000", 
      },
    },
    vAxis: {
      textStyle: {
        color: theme === "dark" ? "#FFFFFF" : "#000000",
      },
    },
  };

  const containerClasses = theme === "dark" 
    ? "bg-base-200 text-neutral-content" 
    : "bg-base-200 text-neutral-content";
  
  

  return (
    <div className={`w-full mx-auto mt-8 rounded-xl shadow-lg ${containerClasses}`}>
      <div className="card-body">
        <h2 className="card-title text-base md:text-2xl text-neutral-content flex items-center gap-2">
          Page Statistics
        </h2>
      <div className="w-full rounded-xl p-6">
        <Chart
          chartType="PieChart"
          width="100%"
          height="400px"
          data={data}

          options={options}
        />
      </div>
    </div>
    </div>
  );
};

export default PageStatisticsChart;
