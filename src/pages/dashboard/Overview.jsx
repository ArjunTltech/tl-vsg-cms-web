import React from 'react';
import StatCard from '../../components/ui/StatCard.jsx'
import { Users, FileText, MessageSquare, Eye, BarChart, Mail, Clipboard } from 'lucide-react'; // Import relevant icons
import TotalEnquiryStat from '../../components/stats/TotalEnquiryStat.jsx';
import TotalSubscribers from '../../components/stats/TotalSubscribers.jsx';
import TotalPageViews from '../../components/stats/TotalPageViews.jsx';
import TotalActiveUsers from '../../components/stats/TotalActiveusers.jsx';
import TotalBounceRate from '../../components/stats/TotalbounceRate.jsx';
import EnquiryChart from '../../components/chart/EnquiryChart.jsx';
import SessionChart from '../../components/chart/SessionChart.jsx';
import TotalServiceStats from '../../components/stats/TotalServiceStats.jsx';

function Overview() {
  // Define the CMS-related stats data in an array
  // const stats = [
  //   {
  //     title: 'Comments',
  //     value: 320, // Example number of comments
  //     description: 'Total Comments',
  //     icon: MessageSquare,
  //     iconColor: 'text-purple-500',
  //     trend: 'down',
  //     trendValue: 2.1, // Example percentage decrease in comments
  //   },
  //   {
  //     title: 'Visitors',
  //     value: 5000, // Example number of visitors
  //     description: 'this month',
  //     icon: Users,
  //     iconColor: 'text-orange-500',
  //     trend: 'up',
  //     trendValue: 15.8, // Example percentage increase in visitors
  //   },
  //   {
  //     title: 'Content Views',
  //     value: 15000, // Example number of views
  //     description: 'this month',
  //     icon: Eye,
  //     iconColor: 'text-teal-500',
  //     trend: 'up',
  //     trendValue: 10.3, // Example percentage increase in content views
  //   },
  //   {
  //     title: 'Active Users',
  //     value: 10, // Example number of active users or admins
  //     description: 'Managing content',
  //     icon: Users,
  //     iconColor: 'text-red-500',
  //     trend: 'up',
  //     trendValue: 20.5, // Example percentage increase in active users
  //   },
  //   {
  //     title: 'Total Subscribers',
  //     value: 500, // Example number of newsletters
  //     description: 'Sent',
  //     icon: Mail,
  //     iconColor: 'text-yellow-500',
  //     trend: 'up',
  //     trendValue: 7.8, // Example percentage increase in newsletters sent
  //   },
  // ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-6">

        <TotalPageViews />
        <TotalServiceStats />
        <TotalEnquiryStat />
        <TotalSubscribers />
        <TotalActiveUsers />
        <TotalBounceRate />
      </div>
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        <SessionChart/>
        <EnquiryChart/>

      </div>

    </>

  );
}

export default Overview;
