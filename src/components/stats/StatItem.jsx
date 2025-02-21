import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import axiosInstance from "../../config/axios";

const StatItem = ({ endpoint, title, description, icon, iconColor }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(endpoint);
          const result = response.data;
          setData({
            value: result.value,
            trend: result.trend,
            trendValue: result.trendValue,
          });
        } catch (err) {
          console.error(`Error fetching ${title}:`, err);
          setError("Failed to load data.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [endpoint]);
  
    if (loading) {
      return <div>Loading {title}...</div>;
    }
  
    if (error) {
      return <div className="text-red-500">{error}</div>;
    }
  
    return (
      <StatCard
        title={title}
        value={data.value}
        description={description}
        icon={icon}
        iconColor={iconColor}
        trend={data.trend}
        trendValue={data.trendValue}
      />
    );
  };
  
  export default StatItem;