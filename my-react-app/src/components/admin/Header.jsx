import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, ChevronDown } from 'lucide-react';

const Header = ({ username = "Admin User", userRole = "Administrator" }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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
    <header className="bg-white shadow-sm h-16 px-6 flex items-center justify-between animate-fade-in">
      {/* Search Input */}
      <div className="flex items-center w-1/3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="admin-input pl-10 w-64 bg-gray-50 focus:ring-2 focus:ring-fitness-purple focus:outline-none"
          />
        </div>
      </div>

      {/* Icons and User Dropdown */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <button className="p-2 rounded-full hover:bg-gray-100 transition relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-fitness-purple"></span>
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            className="flex items-center space-x-3 focus:outline-none" 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="bg-fitness-purple/10 p-2 rounded-full">
              <User size={20} className="text-fitness-purple" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{username}</span>
              <span className="text-xs text-gray-500">{userRole}</span>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 animate-fade-in">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
              <div className="border-t border-gray-100 my-1"></div>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
