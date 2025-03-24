import React, { useState } from 'react';

const WorkoutManagement = () => {
  const [filterOpen, setFilterOpen] = useState(false);

  const mockWorkouts = [
    {
      id: 1,
      name: 'Full Body Strength',
      level: 'Intermediate',
      frequency: '3x/week',
      exercises: 12,
      users: 458,
      createdDate: 'Aug 12, 2023',
    },
    {
      id: 2,
      name: 'Weight Loss Challenge',
      level: 'Beginner',
      frequency: '5x/week',
      exercises: 15,
      users: 312,
      createdDate: 'Sep 05, 2023',
    },
    {
      id: 3,
      name: 'High Intensity Interval',
      level: 'Advanced',
      frequency: '4x/week',
      exercises: 10,
      users: 289,
      createdDate: 'Jul 22, 2023',
    },
    {
      id: 4,
      name: 'Flexibility & Mobility',
      level: 'Beginner',
      frequency: '3x/week',
      exercises: 8,
      users: 201,
      createdDate: 'Oct 02, 2023',
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
        <h1 className="text-2xl font-bold">Workout Management</h1>
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
            <span>Create Workout</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="admin-card flex items-center">
          <div className="bg-fitness-purple/10 p-3 rounded-full mr-4">
            {/* Dumbbell Icon */}
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
              className="text-fitness-purple"
            >
              <path d="M6 6v12"></path>
              <path d="M18 6v12"></path>
              <rect x="3" y="9" width="18" height="6" rx="2"></rect>
            </svg>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Workouts</p>
            <h3 className="text-2xl font-bold">24</h3>
          </div>
        </div>
        <div className="admin-card flex items-center">
          <div className="bg-fitness-purple/10 p-3 rounded-full mr-4">
            {/* Clock Icon */}
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
              className="text-fitness-purple"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Avg. Duration</p>
            <h3 className="text-2xl font-bold">45 min</h3>
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
              className="text-fitness-purple"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Avg. Frequency</p>
            <h3 className="text-2xl font-bold">3.8x/week</h3>
          </div>
        </div>
        <div className="admin-card flex items-center">
          <div className="bg-fitness-purple/10 p-3 rounded-full mr-4">
            {/* UserCheck Icon */}
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
              className="text-fitness-purple"
            >
              <path d="M16 21v-2a4 4 0 0 0-8 0v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
              <polyline points="17 11 19 13 23 9"></polyline>
            </svg>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active Users</p>
            <h3 className="text-2xl font-bold">1,260</h3>
          </div>
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
              placeholder="Search workouts..."
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg animate-fade-in">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select className="admin-input">
                <option value="">All Frequencies</option>
                <option>1-2x/week</option>
                <option>3-4x/week</option>
                <option>5x+/week</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
              <select className="admin-input">
                <option value="">Any Time</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last year</option>
              </select>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Workout Name</th>
                <th>Level</th>
                <th>Frequency</th>
                <th>Exercises</th>
                <th>Users</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockWorkouts.map((workout) => (
                <tr key={workout.id}>
                  <td className="flex items-center space-x-3">
                    <div className="bg-fitness-purple/10 h-10 w-10 rounded-lg flex items-center justify-center">
                      {/* Dumbbell Icon */}
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
                        className="text-fitness-purple"
                      >
                        <path d="M6 6v12"></path>
                        <path d="M18 6v12"></path>
                        <rect x="3" y="9" width="18" height="6" rx="2"></rect>
                      </svg>
                    </div>
                    <div className="font-medium">{workout.name}</div>
                  </td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelBadgeClass(
                        workout.level
                      )}`}
                    >
                      {workout.level}
                    </span>
                  </td>
                  <td>{workout.frequency}</td>
                  <td>{workout.exercises}</td>
                  <td>{workout.users}</td>
                  <td>{workout.createdDate}</td>
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

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">Showing 1-4 of 24 workouts</div>
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

export default WorkoutManagement;