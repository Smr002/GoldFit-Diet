import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = ({ isSuperAdmin = false }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-fitness-light-bg overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar 
        isSuperAdmin={isSuperAdmin} 
        collapsed={sidebarCollapsed} 
        toggleCollapse={() => setSidebarCollapsed(prev => !prev)} 
      />
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header 
          username={isSuperAdmin ? "Super Admin" : "Admin"} 
          userRole={isSuperAdmin ? "Super Administrator" : "Administrator"} 
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6" aria-label="Admin Content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
