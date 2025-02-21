import React from "react";
import CountryAnalytics from "../../components/chart/CountryAnalytics";
import PageStatisticsChart from "../../components/chart/PageStatisticChart";
import AnalyticsTable from "../../components/chart/AnalyticsTable";
import TrafficSourcesChart from "../../components/chart/TrafficSourcesChart";

function Analytics() {
  const metrics = [
    { label: 'Page Views', value: '125,432', change: '+12.3%' },
    { label: 'Bounce Rate', value: '32.4%', change: '-2.1%' },
    { label: 'Session Duration', value: '2m 45s', change: '+0.8%' },
    { label: 'Conversion Rate', value: '3.2%', change: '+1.4%' },
  ];

  return (
    <div className="w-full ">
      <h1 className="text-2xl font-bold mb-6 w-full text-neutral-content">Analytics</h1>



      <CountryAnalytics />

      <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-2 gap-6">

        <AnalyticsTable />
        <TrafficSourcesChart/>
      </div>

    </div>
  );
}

export default Analytics;