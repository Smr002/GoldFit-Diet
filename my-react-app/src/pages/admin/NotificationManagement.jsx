import React, { useState } from 'react';

const NotificationManagement = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');

  const mockNotifications = [
    {
      id: 1,
      title: 'New Workout Available',
      message: 'Check out our new High Intensity Interval Training program!',
      sentTo: 'All Users',
      sentDate: 'Oct 15, 2023',
      status: 'Sent',
      reads: 845,
    },
    {
      id: 2,
      title: 'Holiday Special Offer',
      message: 'Get 25% off on premium plans for the holidays!',
      sentTo: 'Free Users',
      sentDate: 'Oct 12, 2023',
      status: 'Sent',
      reads: 623,
    },
    {
      id: 3,
      title: 'Complete Your Profile',
      message: 'Update your fitness goals to get personalized workouts.',
      sentTo: 'New Users',
      sentDate: 'Oct 10, 2023',
      status: 'Sent',
      reads: 312,
    },
  ];

  const mockAutomated = [
    {
      id: 1,
      title: 'Welcome Message',
      message: 'Welcome to our fitness platform! Start your journey today.',
      trigger: 'New User Registration',
      status: 'Active',
      lastUpdated: 'Sep 05, 2023',
    },
    {
      id: 2,
      title: 'Workout Reminder',
      message: "Don't forget your scheduled workout today!",
      trigger: 'Daily at 7 AM',
      status: 'Active',
      lastUpdated: 'Aug 20, 2023',
    },
    {
      id: 3,
      title: 'Progress Update',
      message: 'Check out your fitness progress this week!',
      trigger: 'Weekly on Sunday',
      status: 'Inactive',
      lastUpdated: 'Oct 01, 2023',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notification Management</h1>
        <div className="flex space-x-4">
          <button className="admin-button-primary flex items-center space-x-2">
            {/* Plus Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Create Notification</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="admin-card flex items-center">
          <div className="bg-fitness-purple/10 p-3 rounded-full mr-4">
            {/* Bell Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Sent</p>
            <h3 className="text-2xl font-bold">1,348</h3>
          </div>
        </div>
        <div className="admin-card flex items-center">
          <div className="bg-fitness-purple/10 p-3 rounded-full mr-4">
            {/* Calendar Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div>
            <p className="text-gray-500 text-sm">This Month</p>
            <h3 className="text-2xl font-bold">287</h3>
          </div>
        </div>
        <div className="admin-card flex items-center">
          <div className="bg-fitness-purple/10 p-3 rounded-full mr-4">
            {/* Repeat Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="17 1 21 5 17 9"></polyline>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
              <polyline points="7 23 3 19 7 15"></polyline>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
            </svg>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Automated Active</p>
            <h3 className="text-2xl font-bold">5</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationManagement;