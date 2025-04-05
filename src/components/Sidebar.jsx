import {
    BarChart2,
    ChevronLeft,
    ChevronRight,
    FileText,
    Home,
    Settings,
    Users,
    X,
    Layout,
    Mail,
    MessageSquare,
    Globe,
    PenTool,
    Layers,
    MailIcon,
    BriefcaseBusiness,
    Info,
    UserCog,
    BookOpenCheck,
    ClipboardList,
    FileQuestion,
    Newspaper,
    YoutubeIcon,
    Briefcase,
    Image,
    FileImage,
    ShoppingCart,
    Calendar,
    Bell,
    BookOpen,
    Tag,
    Folder,
    HelpCircle,
    Lock,
    Database,
    Shield,
    MessageCircleQuestion,
    MailOpen,
    Inbox
} from "lucide-react";

import { NavLink } from "react-router-dom";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useEffect, useState } from "react";
import axiosInstance from "../config/axios";
import { useAuth } from "../context/AuthContext";


function Sidebar({ isOpen, onClose, isCollapsed, setIsCollapsed }) {

    const [count, setCount] = useState({
        enquiries: 0,
        comments: 0,
        notifications: 0,
        blogs: 0,
        cases: 0,
        carrers: 0,
        services: 0,
        youTubeVideo: 0,
        users: 0,
        faqs: 0,
        testimonials: 0,
        newsletters: 0,
        clients: 0,
        socialMedia: 0,
    });
    const { authState } = useAuth();
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const { data } = await axiosInstance.get('/stats/total-counts');
                setCount({
                    enquiries: data.counts.enquiries.unread || 0,
                    comments: 0,
                    notifications: data.counts.notifications.unread || 0,
                    blogs: data.counts.blogs.total || 0,
                    cases: data.counts.cases.total || 0,
                    carrers: data.counts.carrers.total || 0,
                    services: data.counts.services.total || 0,
                    youTubeVideo: data.counts.youTubeVideo.total || 0,
                    users: data.counts.users.total || 0,
                    faqs: data.counts.faqs.total || 0,
                    testimonials: data.counts.testimonials.total || 0,
                    newsletters: data.counts.newsletter.subscribers || 0,
                    clients: data.counts.clients.total || 0,
                    socialMedia: data.counts.social.active || 0,
                    team: data.counts.team.active || 0
                });
            } catch (error) {
                console.error('Error fetching sidebar counts:', error);
                // Keep the previous state on error
                setCount(prevCount => prevCount);
            }
        };

        fetchCounts();

        const interval = setInterval(fetchCounts, 60000); // Refresh every minute

        return () => clearInterval(interval);
    }, []);

    const navigation = [
        {
            section: "Dashboard",
            items: [
                { name: 'Dashboard', path: '/', icon: Home },
                { name: 'Analytics', path: '/analytics', icon: BarChart2 },
                { name: 'Enquiries', path: '/enquiries', icon: ClipboardList, count: count.enquiries },
            ]
        },
        {
            section: "Content Management",
            items: [
                { name: 'Pages', path: '/pages', icon: Layout },
                // { name: 'Blog Posts', path: '/posts', icon: PenTool, count: count.blogs },
                { name: 'Case Studies', path: '/case-study', icon: BookOpenCheck, count: count.cases },
                { name: 'Careers', path: '/career', icon: UserCog, count: count.carrers },
                { name: 'Blogs', path: '/blog', icon: PenTool, count: count.blogs },
                { name: 'Compliance', path: '/documents', icon: FileText },
                { name: 'SEO Editor', path: '/seo-editor', icon: Layers },
                { name: 'Video Management', path: '/youtube-videos', icon: YoutubeIcon, count: count.youTubeVideo },
                { name: 'Team Management', path: '/team', icon: Users, count: count.team },
                { name: 'FAQs', path: '/faqs', icon: FileQuestion, count: count.faqs },
                { name: 'Services', path: '/services', icon: BriefcaseBusiness, count: count.services },
                { name: 'Organization Details', path: '/organization-details', icon: Info, },
            ]
        },
        {
            section: "User Management",
            items: [
                { name: 'Users', path: '/users', icon: Users, role: 'superadmin', count: count.users },
                // { name: 'Roles & Permissions', path: '/roles', icon: Lock },
            ]
        },
        {
            section: "Marketing",
            items: [
                { name: 'Newsletters', path: '/newsletters', icon: Newspaper, count: count.newsletters },
                // { name: 'Comments', path: '/comments', icon: MessageSquare, count: count.comments },
                { name: 'Testimonials', path: '/testimonials', icon: MessageSquare, count: count.testimonials },
                { name: 'Social Media', path: '/social', icon: Globe, count: count.socialMedia },
            ]
        },
        {
            section: "System",
            items: [
                // { name: 'Notifications', path: '/notifications', icon: Bell, count: count.notifications },
                // // { name: 'SEO', path: '/seo', icon: Globe },
                { name: 'Mail Config', path: '/mail-config', icon: MailIcon },
                { name: 'Settings', path: '/settings', icon: Settings },
                // { name: 'Help & Docs', path: '/help', icon: HelpCircle }
            ]
        },
    ];

    const NavItem = ({ item, isActive }) => {
        const content = (
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <item.icon
                            className={`w-7 h-7 text-primary group-hover:text-white ${isActive ? 'text-white' : ''
                                }`}
                        />
                    </div>
                    <span
                        className={`ml-3 font-medium ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                            } ${isActive ? 'text-white' : ''}`}
                        style={{
                            transform: isCollapsed ? 'translateX(-20px)' : 'translateX(0)',
                            display: isCollapsed ? 'none' : 'block'
                        }}
                    >
                        {item.name}
                    </span>
                </div>
                {item.count > 0 && (
                    <div
                        className={`badge badge-primary ${isCollapsed ? 'hidden' : 'ml-2'
                            }`}
                    >
                        <span className="text-white">{item.count}</span>
                    </div>
                )}
            </div>
        );

        return isCollapsed ? (
            <Tippy
                content={
                    <div className="font-medium flex items-center">
                        {item.name}
                        {item.count && (
                            <div className="badge badge-primary ml-2">
                                {item.count}
                            </div>
                        )}
                    </div>
                }
                placement="right"
                arrow={true}
                className="tippy-box ml-2"
            >
                {content}
            </Tippy>
        ) : (
            content
        );
    };

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity lg:hidden ${isOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-base-200 
                transition-all duration-300 ease-in-out shadow-sm h-full 
                ${isCollapsed ? 'w-16' : 'w-64'} 
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="flex items-center justify-between h-16 px-3">
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? 'w-0' : 'w-40'
                        }`}>
                        <img src="https://www.vsgenxsolutions.com/_next/static/media/logo-1.ded65dd8.png" alt="" className="h-10 w-auto rounded-sm" />
                    </div>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 focus:outline-none text-white rounded-xl shadow-md transition-all duration-300 ease-in-out lg:flex hidden"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-5 h-5 text-neutral-content" />
                        ) : (
                            <ChevronLeft className="w-5 h-5 text-neutral-content" />
                        )}
                    </button>
                    <button onClick={onClose} className="lg:hidden p-1">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="px-2 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hidden pb-24">
                    {navigation.map((section, index) => {
                        // Filter items based on role requirements
                        const filteredItems = section.items.filter(item =>
                            !item.role || authState.role === item.role
                        );

                        // Skip rendering the entire section if no items remain after filtering
                        if (filteredItems.length === 0) {
                            return null;
                        }

                        return (
                            <div key={section.section} className={`${index > 0 ? 'mt-6' : 'mt-2'}`}>
                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? 'h-0 opacity-0' : 'h-6 opacity-100'
                                    }`}>
                                    <h2 className="text-xs font-semibold text-neutral-content/70 uppercase tracking-wider px-2 mb-2">
                                        {section.section}
                                    </h2>
                                </div>
                                {filteredItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => window.innerWidth < 1024 && onClose()}
                                        className={({ isActive }) =>
                                            `flex mx-auto px-2 py-2 mt-2 rounded-lg duration-300 ease-in-out group relative
                                        ${isActive
                                                ? 'bg-primary text-white'
                                                : 'text-neutral-content hover:bg-primary/30 hover:text-white'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <NavItem item={item} isActive={isActive} />
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        );
                    })}
                </nav>

            </aside>

            {/* Add custom styles for Tippy */}
            <style>{`
                .tippy-box {
                    background-color: rgb(17, 24, 39);
                }
                .tippy-arrow {
                    color: rgb(17, 24, 39);
                }
            `}</style>
        </>
    );
}

export default Sidebar;