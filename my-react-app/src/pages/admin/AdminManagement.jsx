import React, { useState } from 'react';

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
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Management</h1>
        <div className="flex space-x-4">
          <button
            className="admin-button-primary flex items-center space-x-2"
            onClick={() => setModalOpen(true)}
          >
            {/* UserPlus Icon */}
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
              <path d="M16 21v-2a4 4 0 0 0-8 0v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
              <line x1="22" y1="11" x2="18" y2="11"></line>
              <line x1="20" y1="9" x2="20" y2="13"></line>
            </svg>
            <span>Add New Admin</span>
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
          <div className="relative w-full md:w-72">
            {/* Search Icon */}
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search admins..."
              className="admin-input pl-10"
            />
          </div>

          <div className="flex space-x-4">
            <button
              className="admin-button-secondary flex items-center space-x-2"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              {/* Filter Icon */}
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
                <polygon points="22 3 16 3 12 10 8 3 2 3 10 16 10 21 14 21 14 16 22 3"></polygon>
              </svg>
              <span>Filter</span>
            </button>
          </div>
        </div>

        {filterOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select className="admin-input">
                <option value="">All Roles</option>
                <option>Super Admin</option>
                <option>Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
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

        <div className="overflow-x-auto">
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
                  <td className="flex items-center space-x-3">
                    <div className="bg-fitness-purple/10 h-10 w-10 rounded-full flex items-center justify-center">
                      {/* User Icon */}
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
                        <path d="M16 21v-2a4 4 0 0 0-8 0v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">{admin.name}</div>
                      <div className="text-sm text-gray-500">{admin.email}</div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      {admin.role === 'Super Admin' ? (
                        // Shield Icon
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                      ) : (
                        // Lock Icon
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      )}
                      <span>{admin.role}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {admin.permissions.map((permission, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{admin.lastActive}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button className="p-1.5 rounded text-blue-600 hover:bg-blue-50 transition-colors">
                        {/* Edit Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4h7a2 2 0 0 1 2 2v7"></path>
                          <path d="M18 2l4 4"></path>
                          <path d="M2 22l10-10"></path>
                        </svg>
                      </button>
                      <button className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors">
                        {/* Trash Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6l-2 14H7L5 6"></path>
                          <path d="M10 11v6"></path>
                          <path d="M14 11v6"></path>
                        </svg>
                      </button>
                      <button className="p-1.5 rounded text-gray-500 hover:bg-gray-100 transition-colors">
                        {/* MoreHorizontal Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="19" cy="12" r="1"></circle>
                          <circle cx="5" cy="12" r="1"></circle>
                        </svg>
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