import React, { useState } from 'react';
import { Search, Filter, UserPlus, MoreHorizontal } from 'lucide-react';
import 'admin.css';

const UserManagement = ({ isSuperAdmin = false }) => {
  const [filterOpen, setFilterOpen] = useState(false);

  const mockUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      goal: 'Weight Loss',
      level: 'Beginner',
      joinDate: 'Oct 15, 2023',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      goal: 'Muscle Gain',
      level: 'Intermediate',
      joinDate: 'Sep 22, 2023',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert@example.com',
      goal: 'Endurance',
      level: 'Advanced',
      joinDate: 'Aug 05, 2023',
      status: 'Inactive',
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      goal: 'Flexibility',
      level: 'Beginner',
      joinDate: 'Oct 10, 2023',
      status: 'Active',
    },
    {
      id: 5,
      name: 'Michael Brown',
      email: 'michael@example.com',
      goal: 'Weight Loss',
      level: 'Intermediate',
      joinDate: 'Sep 18, 2023',
      status: 'Active',
    },
  ];

  const getLevelBadgeClass = (level) => {
    switch (level) {
      case 'Beginner':
        return 'admin-badge-success';
      case 'Intermediate':
        return 'admin-badge-warning';
      case 'Advanced':
        return 'admin-badge-info';
      default:
        return 'admin-badge-secondary';
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">User Management</h1>
        {isSuperAdmin && (
          <button className="admin-btn admin-btn-primary">
            <UserPlus size={18} />
            <span>Promote to Admin</span>
          </button>
        )}
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <div className="admin-search">
            <Search className="admin-search-icon" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              className="admin-input"
            />
          </div>

          <button
            className="admin-btn admin-btn-secondary"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>

        {filterOpen && (
          <div className="admin-filter-panel">
            <div className="admin-filter-group">
              <label className="admin-label">Goal</label>
              <select className="admin-input">
                <option value="">All Goals</option>
                <option>Weight Loss</option>
                <option>Muscle Gain</option>
                <option>Endurance</option>
                <option>Flexibility</option>
              </select>
            </div>
            <div className="admin-filter-group">
              <label className="admin-label">Level</label>
              <select className="admin-input">
                <option value="">All Levels</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div className="admin-filter-group">
              <label className="admin-label">Status</label>
              <select className="admin-input">
                <option value="">All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="admin-filter-group">
              <label className="admin-label">Join Date</label>
              <select className="admin-input">
                <option value="">Any Time</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </div>
        )}

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Goal</th>
                <th>Level</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="admin-user-cell">
                      <div className="admin-avatar">
                        {user.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.goal}</td>
                  <td>
                    <span className={`admin-badge ${getLevelBadgeClass(user.level)}`}>
                      {user.level}
                    </span>
                  </td>
                  <td>{user.joinDate}</td>
                  <td>
                    <span className={`admin-badge ${
                      user.status === 'Active' ? 'admin-badge-success' : 'admin-badge-danger'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-btn">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-pagination">
          <span className="admin-pagination-info">Showing 1-5 of 100 users</span>
          <div className="admin-pagination-buttons">
            <button className="admin-btn admin-btn-secondary">Previous</button>
            <button className="admin-btn admin-btn-primary">1</button>
            <button className="admin-btn admin-btn-secondary">2</button>
            <button className="admin-btn admin-btn-secondary">3</button>
            <button className="admin-btn admin-btn-secondary">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;