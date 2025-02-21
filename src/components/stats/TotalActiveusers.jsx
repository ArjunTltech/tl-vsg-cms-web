import React, { useEffect, useState } from 'react'
import axiosInstance from '../../config/axios';
import { SkeletonCard } from '../skeleton/Skeleton';
import StatCard from '../ui/StatCard';
import { Eye, User } from 'lucide-react';

const TotalActiveUsers = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("/stats/active-users");
                
                const result = response.data.data.length > 0 ? response.data.data[0].activeUsers : null;
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
                    title="Active users"
                    value={data}
                    description="Last 30 days"
                    icon={User}
                    iconColor="text-teal-500"
                />
            )}
        </div>
    );
};

export default TotalActiveUsers