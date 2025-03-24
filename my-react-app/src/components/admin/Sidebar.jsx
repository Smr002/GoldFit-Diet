import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, Dumbbell, Bell, MessageSquare, UserPlus, 
  Settings, Home, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import 'admin.css';

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
    }
  ];
  
  const superAdminItems = [
    { 
      path: '/admin/admin-management', 
      name: 'Admin Management', 
      icon: UserPlus 
    },
    { 
      path: '/admin/settings', 
      name: 'Settings', 
      icon: Settings 
    }
  ];

  return (
    <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="admin-sidebar-header">
        {!collapsed && (
          <span className="admin-sidebar-logo">Fitness Admin</span>
        )}
        <button 
          className="admin-sidebar-toggle"
          onClick={toggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="admin-flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <item.icon className="admin-nav-icon" size={collapsed ? 24 : 20} />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
        
        {isSuperAdmin && (
          <>
            {!collapsed && (
              <div className="admin-nav-section-title">
                Super Admin
              </div>
            )}
            {superAdminItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <item.icon className="admin-nav-icon" size={collapsed ? 24 : 20} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </>
        )}
      </nav>
      
      <div className="admin-sidebar-footer">
        <Link 
          to="/logout" 
          className="admin-nav-item"
        >
          <LogOut className="admin-nav-icon" size={collapsed ? 24 : 20} />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;