import React from 'react';
import CountUp from 'react-countup';

function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  iconColor = "text-blue-500",
  trend,
  trendValue,
  isLoading = false
}) {
  return (
    <div className="relative overflow-hidden bg-base-100 rounded-xl shadow-sm  hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className={`p-2 rounded-lg ${iconColor} bg-opacity-10`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </span>
            <h3 className="text-xl font-medium text-neutral-content">
              {title}
            </h3>
          </div>
          
          {trend && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${trend === 'up' ? 'text-success' : 'text-error'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}%
            </span>
          )}
        </div>

        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold text-neutral-content">
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              <CountUp
                end={value}
                duration={2}
                separator=","
                decimal="."
                decimals={value % 1 !== 0 ? 2 : 0}
              />
            )}
          </span>
          {description && (
            <span className="text-sm text-neutral-content">
              {description}
            </span>
          )}
        </div>

        <div className="mt-4">
          <div className="relative h-1 w-full bg-gray-100 dark:bg-gray-700 rounded">
            <div
              style={{ width: `${Math.min(100, (value / 100) * 100)}%` }}
              className="absolute h-full rounded transition-all duration-500 ease-out bg-accent"
            />
          </div>
        </div>
      </div>

      {/* Decorative background pattern */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 opacity-10">
        <svg className={`transform rotate-45 ${iconColor}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 12h4v8h12v-8h4L12 2z" />
        </svg>
      </div>
    </div>
  );
}

export default StatCard;