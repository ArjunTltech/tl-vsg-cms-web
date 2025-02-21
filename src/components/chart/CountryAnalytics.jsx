import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useTheme } from "../../context/ThemeContext";
import axiosInstance from "../../config/axios";

export default function CountryAnalytics() {
  const [data, setData] = useState([["Country", "Total users"]]);
  const { theme } = useTheme(); // Access the theme from context

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/stats/country-analytics");
      const result = response.data.data;
        const chartData = [["Country", "Total users"]];
        result.forEach((item) => {
          chartData.push([item.country, Number(item.totalUsers)]);
        });
        setData(chartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const chartBackground = theme === "dark" ? "#191D23" : "#FFFFFF";
  const containerClasses = theme === "dark" ? "bg-base-200 text-neutral-content" : "bg-base-200 text-neutral-content";
  const datalessRegionColor = theme === "dark" ? "#FFFFFF" : "#191D23";

  return (
    // <div className={`w-full mx-auto p-6 rounded-xl shadow-lg ${containerClasses}`}>
      <div className={`card-body shadow-lg w-full mx-auto mt-8 rounded-2xl ${containerClasses}`}>
        <h2 className="card-title text-base md:text-2xl text-neutral-content flex items-center gap-2">
         Real-Time Active Users
        </h2>
      <div className="w-full h-[500px]">
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
    // </div>
  );
}