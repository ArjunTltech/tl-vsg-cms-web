
import React, { useState } from 'react'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const HomeLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="w-screen h-screen overflow-hidden  ">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div className={`h-screen overflow-auto bg-base-300 transition-all duration-300 
        ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <Header 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isCollapsed={isCollapsed}
        />
        
        <main className="pt-16 scrollbar-hidden">
          <div className="p-4 md:p-6 scrollbar-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default HomeLayout