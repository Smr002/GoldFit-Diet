import React, { useState, useRef, useEffect } from 'react';
import { Bell, UserCircle, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import 'admin.css';
// Import the default profile picture
import defaultProfilePic from '../../assets/pfp.jpg';

const Header = ({ username = "Admin User", userRole = "Administrator", userAvatar = null }) => {
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
      <div className="admin-header-content">
        <div className="admin-header-actions">
          {/* Notification Bell */}
          

          {/* User Dropdown */}
          <div className="admin-dropdown" ref={dropdownRef}>
            <button
              className="admin-dropdown-trigger"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="admin-avatar">
                <img
                  src={userAvatar || defaultProfilePic}
                  alt={username}
                  className="admin-avatar-img"
                  loading="eager" // Force eager loading
                />
              </div>
              <div className="admin-user-info">
                <span className="admin-username">{username}</span>
                <span className="admin-user-role">{userRole}</span>
              </div>
              <ChevronDown size={16} className="admin-dropdown-arrow" />
            </button>

            {showDropdown && (
              <div className="admin-dropdown-menu">
                <Link 
                  to="/admin/profile" 
                  className="admin-dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  Your Profile
                </Link>
                <div className="admin-dropdown-divider"></div>
                <Link 
                  to="/logout" 
                  className="admin-dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  Sign out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;