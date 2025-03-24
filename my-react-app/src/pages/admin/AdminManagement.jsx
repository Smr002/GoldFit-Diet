import React, { useState } from 'react';
import { UserPlus, Search, Filter, User, Shield, Lock, Edit, Trash, MoreHorizontal } from 'lucide-react';
import 'admin.css';

const AdminManagement = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const mockAdmins = [
    {
      id: 1,
      name: 'John Admin',
      email: 'john.admin@example.com',
      role: 'Super Admin',
      permissions: ['All Permissions'],
      lastActive: '2 hours ago',
    },
    {
      id: 2,
      name: 'Sarah Manager',
      email: 'sarah.manager@example.com',
      role: 'Admin',
      permissions: ['Workout Management', 'User Management', 'Notifications'],
      lastActive: '1 day ago',
    },
    {
      id: 3,
      name: 'Mike Content',
      email: 'mike.content@example.com',
      role: 'Admin',
      permissions: ['Workout Management', 'FAQ Management'],
      lastActive: '5 days ago',
    },
  ];

  const mockPermissions = [
    { id: 'user_management', name: 'User Management', description: 'View and manage users' },
    { id: 'workout_management', name: 'Workout Management', description: 'Create and manage workouts' },
    { id: 'notification_management', name: 'Notifications', description: 'Send and manage notifications' },
    { id: 'faq_management', name: 'FAQ Management', description: 'Manage FAQs' },
    { id: 'admin_management', name: 'Admin Management', description: 'Manage other admins' },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Admin Management</h1>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => setModalOpen(true)}
        >
          <UserPlus size={18} />
          <span>Add New Admin</span>
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <div className="admin-search">
            <Search className="admin-search-icon" size={18} />
            <input
              type="text"
              placeholder="Search admins..."
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
              <label className="admin-label">Role</label>
              <select className="admin-input">
                <option value="">All Roles</option>
                <option>Super Admin</option>
                <option>Admin</option>
              </select>
            </div>
            <div className="admin-filter-group">
              <label className="admin-label">Permissions</label>
              <select className="admin-input">
                <option value="">All Permissions</option>
                <option>User Management</option>
                <option>Workout Management</option>
                <option>Notifications</option>
                <option>FAQ Management</option>
              </select>
            </div>
          </div>
        )}

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Admin</th>
                <th>Role</th>
                <th>Permissions</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockAdmins.map((admin) => (
                <tr key={admin.id}>
                  <td>
                    <div className="admin-user-cell">
                      <div className="admin-avatar">
                        <User size={18} />
                      </div>
                      <div className="admin-user-info">
                        <div className="admin-user-name">{admin.name}</div>
                        <div className="admin-user-email">{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="admin-role-badge">
                      {admin.role === 'Super Admin' ? (
                        <Shield size={16} />
                      ) : (
                        <Lock size={16} />
                      )}
                      <span>{admin.role}</span>
                    </div>
                  </td>
                  <td>
                    <div className="admin-permission-tags">
                      {admin.permissions.map((permission, idx) => (
                        <span key={idx} className="admin-tag">
                          {permission}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{admin.lastActive}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-btn admin-action-edit">
                        <Edit size={16} />
                      </button>
                      <button className="admin-action-btn admin-action-delete">
                        <Trash size={16} />
                      </button>
                      <button className="admin-action-btn admin-action-more">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;