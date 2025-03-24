import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import 'admin.css';

const AdminLayout = ({ isSuperAdmin = false }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="admin-layout">
      {/* Sidebar Component */}
      <Sidebar 
        isSuperAdmin={isSuperAdmin} 
        collapsed={sidebarCollapsed} 
        toggleCollapse={() => setSidebarCollapsed(prev => !prev)} 
      />
      
      {/* Main Content Area */}
      <div className="admin-main-container">
        {/* Header */}
        <Header 
          username={isSuperAdmin ? "Super Admin" : "Admin"} 
          userRole={isSuperAdmin ? "Super Administrator" : "Administrator"} 
        />

        {/* Page Content */}
        <main className="admin-content" aria-label="Admin Content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;