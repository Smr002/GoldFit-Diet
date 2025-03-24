import React, { useState } from 'react';

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
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex space-x-4">
          {isSuperAdmin && (
            <button className="admin-button-primary flex items-center space-x-2">
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
              <span>Promote to Admin</span>
            </button>
          )}
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
              placeholder="Search users..."
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
              <select className="admin-input">
                <option value="">All Goals</option>
                <option>Weight Loss</option>
                <option>Muscle Gain</option>
                <option>Endurance</option>
                <option>Flexibility</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select className="admin-input">
                <option value="">All Levels</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="admin-input">
                <option value="">All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
              <select className="admin-input">
                <option value="">Any Time</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
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
                  <td className="flex items-center space-x-3">
                    <div className="bg-fitness-purple/10 h-10 w-10 rounded-full flex items-center justify-center">
                      <span className="text-fitness-purple font-medium">
                        {user.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <div>{user.name}</div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.goal}</td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelBadgeClass(
                        user.level
                      )}`}
                    >
                      {user.level}
                    </span>
                  </td>
                  <td>{user.joinDate}</td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="relative">
                      <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        {/* MoreHorizontal Icon */}
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
                          className="text-gray-500"
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

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">Showing 1-5 of 100 users</div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 rounded bg-fitness-purple text-white hover:bg-fitness-dark-purple">
              1
            </button>
            <button className="px-3 py-1 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;