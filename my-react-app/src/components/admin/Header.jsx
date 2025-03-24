import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, ChevronDown } from 'lucide-react';
import 'admin.css';

const Header = ({ username = "Admin User", userRole = "Administrator" }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="admin-header">
      {/* Icons and User Dropdown */}
      <div className="admin-header-actions">
        {/* Notification Bell */}
        <button className="admin-notification-btn">
          <Bell size={20} />
          <span className="admin-notification-badge"></span>
        </button>

        {/* User Dropdown */}
        <div className="admin-dropdown" ref={dropdownRef}>
          <button 
            className="admin-dropdown-trigger"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="admin-avatar">
              <User size={20} />
            </div>
            <div className="admin-user-info">
              <span className="admin-username">{username}</span>
              <span className="admin-user-role">{userRole}</span>
            </div>
            <ChevronDown size={16} className="admin-dropdown-arrow" />
          </button>

          {showDropdown && (
            <div className="admin-dropdown-menu">
              <a href="#" className="admin-dropdown-item">Your Profile</a>
              <a href="#" className="admin-dropdown-item">Settings</a>
              <div className="admin-dropdown-divider"></div>
              <a href="#" className="admin-dropdown-item">Sign out</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;