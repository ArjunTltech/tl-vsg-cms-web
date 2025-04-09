import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useTheme } from "../../context/ThemeContext";
import axiosInstance from "../../config/axios";

export default function CountryAnalytics() {
  const [data, setData] = useState([["Country", "Total users"]]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: "30daysAgo", endDate: "today" });
  const { theme } = useTheme(); // Access the theme from context

  // Common date range presets
  const dateRangeOptions = [
    { label: "Today", value: { startDate: "today", endDate: "today" } },
    { label: "Yesterday", value: { startDate: "yesterday", endDate: "yesterday" } },
    { label: "Last 7 days", value: { startDate: "7daysAgo", endDate: "today" } },
    { label: "Last 30 days", value: { startDate: "30daysAgo", endDate: "today" } },
    { label: "Last 90 days", value: { startDate: "90daysAgo", endDate: "today" } },
    { label: "Last 12 months", value: { startDate: "365daysAgo", endDate: "today" } }
  ];

  const fetchData = async (range = dateRange) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/stats/country-analytics", {
        params: {
          startDate: range.startDate,
          endDate: range.endDate
        }
      });
      
      const result = response.data.data;
      const chartData = [["Country", "Total users"]];
      
      result.forEach((item) => {
        chartData.push([item.country, Number(item.totalUsers)]);
      });
      
      setData(chartData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const handleDateRangeChange = (e) => {
    const selectedIndex = e.target.value;
    const newRange = dateRangeOptions[selectedIndex].value;
    setDateRange(newRange);
    fetchData(newRange);
  };

  const chartBackground = theme === "dark" ? "#191D23" : "#FFFFFF";
  const containerClasses = theme === "dark" ? "bg-base-200 text-neutral-content" : "bg-base-200 text-neutral-content";
  const datalessRegionColor = theme === "dark" ? "#FFFFFF" : "#191D23";
  return (
    <div className={`card-body shadow-lg w-full mx-auto mt-8 rounded-2xl ${containerClasses}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="card-title text-base md:text-2xl text-neutral-content flex items-center gap-2">
        Real-Time Active Users
        </h2>
        
        <div className="mt-2 md:mt-0">
          <select 
            className="select select-bordered select-sm w-full max-w-xs"
            onChange={handleDateRangeChange}
            defaultValue="3" // Default to "Last 30 days"
          >
            {dateRangeOptions.map((option, index) => (
              <option key={index} value={index}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="w-full h-[500px] relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 z-10">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        )}
        
        <Chart
          chartType="GeoChart"
          width="100%"
          height="100%"
          data={data}
          options={{
            colorAxis: { colors: ["#27e7f8", "#05909c"] },
            backgroundColor: chartBackground,
            displayMode: "regions",
            resolution: "countries",
            datalessRegionColor: datalessRegionColor,
          }}
        />
      </div>
    </div>
  );
}