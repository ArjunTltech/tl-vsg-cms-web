import React, { useEffect, useState } from 'react'
import axiosInstance from '../../config/axios';
import { SkeletonCard } from '../skeleton/Skeleton';
import StatCard from '../ui/StatCard';
import { Eye, TrendingDown } from 'lucide-react';

const TotalBounceRate = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("/stats/bounce-rate");
                
                const result = response.data.data.length > 0 ? response.data.data[0].bounceRate : null;
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);
    const bounceRatePercentage = data ? `${(parseFloat(data) * 100).toFixed(2)}` : "0.00%";

    return (
        <div className="w-full animate-fade-in-down">
            {loading ? (
                <SkeletonCard />
            ) : (
                <StatCard
                    title="Total Bounce Rate"
                    value={bounceRatePercentage}
                    description="Percent in Last 30 days"
                    icon={TrendingDown }
                    iconColor="text-red-500"
                />
            )}
        </div>
    );
};

export default TotalBounceRate