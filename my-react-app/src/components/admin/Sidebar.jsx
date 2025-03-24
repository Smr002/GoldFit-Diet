import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, Dumbbell, Bell, MessageSquare, UserPlus, 
  Settings, Home, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';

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
  
  // Super admin only menu items
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
    <div className={`h-screen bg-purple-900 flex flex-col transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'} shadow-lg`}>
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <div className="text-white font-bold text-xl">Fitness Admin</div>
        )}
        <button 
          className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          onClick={toggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center text-white/80 hover:text-white px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path) 
                  ? 'bg-purple-700 text-white font-medium' 
                  : 'hover:bg-purple-800'
              } ${collapsed ? 'justify-center' : 'space-x-3'}`}
            >
              <item.icon size={collapsed ? 24 : 20} />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          ))}
          
          {isSuperAdmin && (
            <>
              {!collapsed && (
                <div className="text-white/60 uppercase text-xs font-semibold mt-6 mb-2 px-4">
                  Super Admin
                </div>
              )}
              {superAdminItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center text-white/80 hover:text-white px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path) 
                      ? 'bg-purple-700 text-white font-medium' 
                      : 'hover:bg-purple-800'
                  } ${collapsed ? 'justify-center' : 'space-x-3'}`}
                >
                  <item.icon size={collapsed ? 24 : 20} />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              ))}
            </>
          )}
        </nav>
      </div>
      
      <div className="p-4 border-t border-white/10">
        <Link 
          to="/logout" 
          className={`flex items-center text-white/80 hover:text-white px-4 py-3 rounded-lg transition-colors hover:bg-purple-800 ${collapsed ? 'justify-center' : 'space-x-3'}`}
        >
          <LogOut size={collapsed ? 24 : 20} />
          {!collapsed && <span className="truncate">Logout</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;