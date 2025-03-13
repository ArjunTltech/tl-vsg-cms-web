import React, { useEffect, useState } from 'react';
import StatCard from '../ui/StatCard';
import { FileText } from 'lucide-react';
import axiosInstance from '../../config/axios';
import { SkeletonCard } from '../skeleton/Skeleton';

const TotalServiceStats = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("/stats/total-services");
                const result = response.data.data;
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
        <div className="w-full  animate-fade-in-down">
            {loading ? (
                <SkeletonCard />
            ) : (
                <StatCard
                    title="Total Services"
                    value={data}
                    description="Published"
                    icon={FileText}
                    iconColor="text-green-500"
                />
            )}
        </div>
    );
};

export default TotalServiceStats;
