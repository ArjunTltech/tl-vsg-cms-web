import React, { useEffect, useState } from 'react'
import axiosInstance from '../../config/axios';
import { SkeletonCard } from '../skeleton/Skeleton';
import StatCard from '../ui/StatCard';
import { Eye } from 'lucide-react';

const TotalPageViews = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("/stats/total-page-views");
                const result = response.data.data.length > 0 ? response.data.data[0].screenPageViews : null;
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);

    return (
        <div className="w-full animate-fade-in-down">
            {loading ? (
                <SkeletonCard />
            ) : (
                <StatCard
                    title="Total Page Views"
                    value={data}
                    description="Last 30 days"
                    icon={Eye}
                    iconColor="text-teal-500"
                />
            )}
        </div>
    );
};

export default TotalPageViews