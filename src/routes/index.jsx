import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from '../layout/HomeLayout';  // Assuming HomeLayout is your dashboard layout
import Overview from '../pages/dashboard/Overview';
import Analytics from '../pages/dashboard/Analytics';
import Reports from '../pages/dashboard/Reports';
import UserList from '../pages/users/UserList';
import UserProfile from '../pages/users/UserProfile';
import Settings from '../pages/settings/Settings';
import LoginPage from '../pages/auth/Login';
import BlogsLayout from '../pages/blogs/BlogsLayout';
import TestimonialLayout from '../pages/testimonials/TestimonialLayout';
import SocialMediaLayout from '../pages/socialmedia/SocialMediaLayout';
import EnquiriesView from '../components/enquiry/EnquiriesView';
import Notification from '../pages/notification/Notification';
import TeamManagement from "../pages/teams/TeamsLayout";
import PageLayout from '../pages/webpages/PageLayout';
import HelpDocumentation from '../pages/help/Help';
import Newsletter from '../pages/newsletter/Newsletter';
import ProtectedRoute from '../routes/ProtectedRoute'
import ForgotPassword from '../pages/auth/ForgotPassword';
import MailConfig from '../components/mail-config/MailConfig';
import DocumentPage from '../pages/documents/documentPage.jsx'
import SeoLayout from '../pages/seo/SEOLayout.jsx';
import Profile from '../pages/profile/Profile.jsx';
import Error404 from '../pages/error/Error404.jsx';
import Error400 from '../pages/error/Error400.jsx';
import Error401 from '../pages/error/Error401.jsx';
import Error403 from '../pages/error/Error403.jsx';
import Error500 from '../pages/error/Error500.jsx';
import Error503 from '../pages/error/Error503.jsx';
import FAQPage from '../pages/faq/FAQPage.jsx';
import OrganizationDetails from '../pages/organization-details/OrganizationDetails.jsx';
import ServiceLayout from '../pages/services/ServiceLayout.jsx';
import SpecialSymbol from './SpecialSymbol.jsx';
import CaseLayout from '../pages/clients/CaseLayout.jsx';
import VideoReorderPage from '../pages/youTube-Videos/VideoReorderPage.jsx';
import CareerLayout from '../pages/career/CareerLayout.jsx';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,  // This is the layout for your dashboard
    children: [
      {
        index: true,
        element: <ProtectedRoute><Overview /></ProtectedRoute>,
      },
      {
        path: 'analytics',
        element: <ProtectedRoute><Analytics /></ProtectedRoute>,
      },
      {
        path: 'reports',
        element: <ProtectedRoute><Reports /></ProtectedRoute>,
      },
      {
        path: 'users',
        element: <ProtectedRoute role={['superadmin']}><UserList /></ProtectedRoute>,
      },
      {
        path: 'users/:id',
        element: <ProtectedRoute><UserProfile /></ProtectedRoute>,
      },
      {
        path: 'settings',
        element: <ProtectedRoute><Settings /></ProtectedRoute>,
      },
      {
        path: '/blog',
        element: <ProtectedRoute><BlogsLayout /></ProtectedRoute>,
      },
      {
        path: '/testimonials',
        element: <ProtectedRoute><TestimonialLayout /></ProtectedRoute>,
      },
      {
        path: '/social',
        element: <ProtectedRoute><SocialMediaLayout /></ProtectedRoute>,
      },
      {
        path: '/case-study',
        element: <ProtectedRoute><CaseLayout /></ProtectedRoute>,
      },
      {
        path: '/career',
        element: <ProtectedRoute><CareerLayout /></ProtectedRoute>,
      },
      {
        path: '/enquiries',
        element: <ProtectedRoute><EnquiriesView /></ProtectedRoute>,
      },
      {
        path: '/notifications',
        element: <ProtectedRoute><Notification /></ProtectedRoute>,
      },
      {
        path: '/team',
        element: <ProtectedRoute><TeamManagement /></ProtectedRoute>,
      },
      {
        path: '/pages',
        element: <ProtectedRoute><PageLayout /></ProtectedRoute>,
      },
      {
        path: '/help',
        element: <ProtectedRoute><HelpDocumentation /></ProtectedRoute>,
      },
      {
        path: '/newsletters',
        element: <ProtectedRoute><Newsletter /></ProtectedRoute>,
      },
      {
        path: 'mail-config',
        element: <ProtectedRoute><MailConfig /></ProtectedRoute>,
      },
      {
        path: '/documents',
        element: <ProtectedRoute><DocumentPage /></ProtectedRoute>,
      },
      {
        path: '/seo-editor',
        element: <ProtectedRoute><SeoLayout /></ProtectedRoute>,
      },
      {
        path: 'profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      {
        path: 'faqs',
        element: <ProtectedRoute><FAQPage /></ProtectedRoute>,
      },
      {
        path: 'organization-details',
        element: <ProtectedRoute><OrganizationDetails /></ProtectedRoute>,
      },
      {
        path: 'services',
        element: <ProtectedRoute><ServiceLayout /></ProtectedRoute>,
      },
      {
        path: 'youtube-videos',
        element: <ProtectedRoute><VideoReorderPage /></ProtectedRoute>,
      }
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/error/400',
    element: <Error400 />
  },
  {
    path: '/error/401',
    element: <Error401 />
  },
  {
    path: '/error/403',
    element: <Error403 />
  },
  {
    path: '/error/500',
    element: <Error500 />
  },
  {
    path: '/error/503',
    element: <Error503 />
  },
  {
    path: '*',
    element: <SpecialSymbol><Error404 /></SpecialSymbol> 
  },
]);
