import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, Dumbbell, Bell, MessageSquare, UserPlus, 
  UserCircle, Home, LogOut, ChevronLeft
} from 'lucide-react';
import 'admin.css';
// Import the logo
import goldFitLogo from '../../assets/goldfitlogo.png';

const Sidebar = ({ isSuperAdmin, collapsed, toggleCollapse }) => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const menuItems = [
    { 
      path: '/admin/dashboard', 
      name: 'Dashboard', 
      icon: Home 
    },
    { 
      path: '/admin/users', 
      name: 'User Management', 
      icon: Users 
    },
    { 
      path: '/admin/workouts', 
      name: 'Workouts', 
      icon: Dumbbell 
    },
    { 
      path: '/admin/notifications', 
      name: 'Notifications', 
      icon: Bell 
    },
    { 
      path: '/admin/faqs', 
      name: 'FAQs', 
      icon: MessageSquare 
    },
    { 
      path: '/admin/admin-management', 
      name: 'Admin Management', 
      icon: UserPlus 
    },
    { 
      path: '/admin/profile', 
      name: 'Profile', 
      icon: UserCircle 
    }
  ];

  return (
    <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="admin-sidebar-header">
        {collapsed ? (
          <div 
            className="admin-sidebar-logo-small clickable" 
            onClick={toggleCollapse}
            title="Expand sidebar"
          >
            <img src={goldFitLogo} alt="GoldFit Diet Logo" />
          </div>
        ) : (
          <>
            <span className="admin-sidebar-logo">GoldFit&Diet Admin</span>
            <button 
              className="admin-sidebar-toggle"
              onClick={toggleCollapse}
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={20} />
            </button>
          </>
        )}
      </div>
      
      <nav className="admin-flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <item.icon className="admin-nav-icon" size={collapsed ? 28 : 24} />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
        
        {/* Spacer div for extra padding */}
        <div className="sidebar-spacer"></div>
        
        {/* Logout link as part of the main navigation */}
        <Link 
          to="/logout" 
          className="admin-nav-item logout-item"
        >
          <LogOut className="admin-nav-icon" size={collapsed ? 28 : 24} />
          {!collapsed && <span>Logout</span>}
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;