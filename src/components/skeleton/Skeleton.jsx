import React from 'react';

export const SkeletonCard = () => {
    return (
        <div className="w-full p-4 bg-base-200 rounded-lg shadow-lg space-y-4">
            {/* Skeleton Loader */}
            <div className="h-6 bg-base-100 rounded w-3/4 animate-pulse"></div>
            <div className="h-12 bg-base-100 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-base-100 rounded w-1/4 animate-pulse"></div>
        </div>
    );
};

