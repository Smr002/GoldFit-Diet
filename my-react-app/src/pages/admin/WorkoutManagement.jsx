import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Dumbbell, Clock, Calendar, 
  UserCheck, Edit, Trash, MoreHorizontal 
} from 'lucide-react';

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
        <h1 className="admin-page-title">Workout Management</h1>
        <button className="admin-btn admin-btn-primary">
          <Plus size={18} />
          <span>Create Workout</span>
        </button>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <div className="admin-stat-icon">
              <Dumbbell size={24} />
            </div>
            <div className="admin-stat-info">
              <p className="admin-stat-label">Total Workouts</p>
              <h3 className="admin-stat-value">24</h3>
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <div className="admin-stat-icon">
              <Clock size={24} />
            </div>
            <div className="admin-stat-info">
              <p className="admin-stat-label">Avg. Duration</p>
              <h3 className="admin-stat-value">45 min</h3>
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <div className="admin-stat-icon">
              <Calendar size={24} />
            </div>
            <div className="admin-stat-info">
              <p className="admin-stat-label">Avg. Frequency</p>
              <h3 className="admin-stat-value">3.8x/week</h3>
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <div className="admin-stat-icon">
              <UserCheck size={24} />
            </div>
            <div className="admin-stat-info">
              <p className="admin-stat-label">Active Users</p>
              <h3 className="admin-stat-value">1,260</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <div className="admin-search">
            <Search className="admin-search-icon" size={18} />
            <input
              type="text"
              placeholder="Search workouts..."
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
              <label className="admin-label">Level</label>
              <select className="admin-input">
                <option value="">All Levels</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div className="admin-filter-group">
              <label className="admin-label">Frequency</label>
              <select className="admin-input">
                <option value="">All Frequencies</option>
                <option>1-2x/week</option>
                <option>3-4x/week</option>
                <option>5x+/week</option>
              </select>
            </div>
            <div className="admin-filter-group">
              <label className="admin-label">Created Date</label>
              <select className="admin-input">
                <option value="">Any Time</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last year</option>
              </select>
            </div>
          </div>
        )}

        <div className="admin-table-container">
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
                  <td>
                    <div className="admin-workout-cell">
                      <div className="admin-workout-icon">
                        <Dumbbell size={18} />
                      </div>
                      <span className="admin-workout-name">{workout.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-badge ${getLevelBadgeClass(workout.level)}`}>
                      {workout.level}
                    </span>
                  </td>
                  <td>{workout.frequency}</td>
                  <td>{workout.exercises}</td>
                  <td>{workout.users}</td>
                  <td>{workout.createdDate}</td>
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

        <div className="admin-pagination">
          <span className="admin-pagination-info">Showing 1-4 of 24 workouts</span>
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

export default WorkoutManagement;