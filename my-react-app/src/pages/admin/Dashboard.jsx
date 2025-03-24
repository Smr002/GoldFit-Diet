import React from 'react';
import StatCard from '../../components/admin/StatCard';
import { User, Activity, Bell, FileText } from 'lucide-react';
import 'admin.css';

const Dashboard = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <div className="admin-header-actions">
          <select className="admin-input">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="admin-btn admin-btn-primary">Export Data</button>
        </div>
      </div>

      <div className="admin-stats-grid">
        <StatCard
          title="Total Users"
          value="2,456"
          icon={<User className="admin-stat-icon" />}
          change="+12% from last month"
          changeType="increase"
        />
        <StatCard
          title="Active Workouts"
          value="128"
          icon={<Activity className="admin-stat-icon" />}
          change="+8% from last month"
          changeType="increase"
        />
        <StatCard
          title="Notifications Sent"
          value="1,348"
          icon={<Bell className="admin-stat-icon" />}
          change="+24% from last month"
          changeType="increase"
        />
        <StatCard
          title="FAQs"
          value="56"
          icon={<FileText className="admin-stat-icon" />}
          change="+3 added this month"
          changeType="increase"
        />
      </div>

      <div className="admin-dashboard-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Recent Sign-ups</h2>
            <a href="#" className="admin-link">View all</a>
          </div>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date Joined</th>
                  <th>Goal</th>
                  <th>Level</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="admin-user-cell">
                      <div className="admin-avatar">JD</div>
                      <span>John Doe</span>
                    </div>
                  </td>
                  <td>Oct 24, 2023</td>
                  <td>Weight Loss</td>
                  <td>
                    <span className="admin-badge admin-badge-success">Beginner</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="admin-user-cell">
                      <div className="admin-avatar">JS</div>
                      <span>Jane Smith</span>
                    </div>
                  </td>
                  <td>Oct 23, 2023</td>
                  <td>Muscle Gain</td>
                  <td>
                    <span className="admin-badge admin-badge-warning">Intermediate</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="admin-user-cell">
                      <div className="admin-avatar">RJ</div>
                      <span>Robert Johnson</span>
                    </div>
                  </td>
                  <td>Oct 22, 2023</td>
                  <td>Endurance</td>
                  <td>
                    <span className="admin-badge admin-badge-info">Advanced</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Popular Workouts</h2>
            <a href="#" className="admin-link">View all</a>
          </div>
          <div className="admin-workout-list">
            {popularWorkouts.map((workout, index) => (
              <div key={index} className="admin-workout-item">
                <div className="admin-workout-icon">
                  <Activity className="admin-icon" />
                </div>
                <div className="admin-workout-info">
                  <h3 className="admin-workout-title">{workout.name}</h3>
                  <p className="admin-workout-meta">{workout.level} • {workout.frequency}</p>
                </div>
                <div className="admin-workout-stats">
                  <div className="admin-stat-value">{workout.users}</div>
                  <div className="admin-stat-label">Users</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const popularWorkouts = [
  {
    name: 'Full Body Strength',
    level: 'Intermediate',
    frequency: '3x/week',
    users: 458
  },
  {
    name: 'Weight Loss Challenge',
    level: 'Beginner',
    frequency: '5x/week',
    users: 312
  },
  {
    name: 'High Intensity Interval',
    level: 'Advanced',
    frequency: '4x/week',
    users: 289
  }
];

export default Dashboard;