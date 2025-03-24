import React, { useState } from 'react';
import { Plus, Bell, Calendar, RefreshCw } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';

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
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Notification Management</h1>
        <button className="admin-btn admin-btn-primary">
          <Plus size={18} />
          <span>Create Notification</span>
        </button>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <div className="admin-stat-icon">
              <Bell size={24} />
            </div>
            <div className="admin-stat-info">
              <p className="admin-stat-label">Total Sent</p>
              <h3 className="admin-stat-value">1,348</h3>
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <div className="admin-stat-icon">
              <Calendar size={24} />
            </div>
            <div className="admin-stat-info">
              <p className="admin-stat-label">This Month</p>
              <h3 className="admin-stat-value">287</h3>
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <div className="admin-stat-icon">
              <RefreshCw size={24} />
            </div>
            <div className="admin-stat-info">
              <p className="admin-stat-label">Automated Active</p>
              <h3 className="admin-stat-value">5</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'manual' ? 'active' : ''}`}
            onClick={() => setActiveTab('manual')}
          >
            Manual Notifications
          </button>
          <button 
            className={`admin-tab ${activeTab === 'automated' ? 'active' : ''}`}
            onClick={() => setActiveTab('automated')}
          >
            Automated Rules
          </button>
        </div>

        {activeTab === 'manual' ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Sent To</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Reads</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockNotifications.map((notification) => (
                  <tr key={notification.id}>
                    <td>
                      <div className="admin-notification-title">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                      </div>
                    </td>
                    <td>{notification.sentTo}</td>
                    <td>{notification.sentDate}</td>
                    <td>
                      <span className="admin-badge admin-badge-success">
                        {notification.status}
                      </span>
                    </td>
                    <td>{notification.reads}</td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-action-btn">View</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Trigger</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockAutomated.map((rule) => (
                  <tr key={rule.id}>
                    <td>
                      <div className="admin-notification-title">
                        <h4>{rule.title}</h4>
                        <p>{rule.message}</p>
                      </div>
                    </td>
                    <td>{rule.trigger}</td>
                    <td>
                      <span className={`admin-badge ${
                        rule.status === 'Active' ? 'admin-badge-success' : 'admin-badge-warning'
                      }`}>
                        {rule.status}
                      </span>
                    </td>
                    <td>{rule.lastUpdated}</td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-action-btn">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationManagement;