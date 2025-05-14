import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Pencil, Trash2, Eye, Plus, Search } from 'lucide-react';
import 'admin.css';
import WorkoutDetailsModal from '../../components/admin/WorkoutDetailsModal';
import WorkoutEditModal from '../../components/admin/WorkoutEditModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { getWorkouts, createWorkout, updateWorkout, deleteWorkout } from '../../api';

const WorkoutManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    level: '',
    createdBy: '',
    isPremade: ''
  });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const workoutsPerPage = 10;
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Add this ref to track dropdown containers
  const dropdownRef = useRef(null);
  
  // Add this useEffect to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    // Add event listener when dropdown is open
    if (activeDropdown !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup function to remove the listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);
  
  // Add this function to determine which dropdowns should flip up
  const shouldFlipDropdown = (index, total) => {
    // Always flip the last 2 rows' dropdowns
    return index >= total - 2;
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const data = await getWorkouts(token);
        setWorkouts(data);
      } catch {
        setError('Failed to load workouts');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewDetails = (workout) => {
    setSelectedWorkout(workout);
    setIsEditModalOpen(false);
    setActiveDropdown(null);
  };

  const handleEditWorkout = (workout) => {
    setSelectedWorkout(workout);
    setIsEditModalOpen(true);
    setActiveDropdown(null);
  };

  const handleSaveWorkout = async (updatedWorkout) => {
    const token = localStorage.getItem('token');
    try {
      if (isCreateModalOpen) {
        const newWorkout = await createWorkout(updatedWorkout, token);
        setWorkouts([...workouts, newWorkout]);
        setIsCreateModalOpen(false);
      } else {
        const savedWorkout = await updateWorkout(updatedWorkout.id, updatedWorkout, token);
        setWorkouts(prevWorkouts =>
          prevWorkouts.map(workout =>
            workout.id === savedWorkout.id ? savedWorkout : workout
          )
        );
      }
      setIsEditModalOpen(false);
      setSelectedWorkout(null);
    } catch {
      setError('Failed to save workout');
    }
  };

  const handleDeleteClick = (workout) => {
    setSelectedWorkout(workout);
    setIsDeleteModalOpen(true);
    setActiveDropdown(null);
  };

  // eslint-disable-next-line no-unused-vars
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedWorkout(null);
  };

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem('token');
    try {
      await deleteWorkout(selectedWorkout.id, token);
      setWorkouts(prevWorkouts =>
        prevWorkouts.filter(workout => workout.id !== selectedWorkout.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedWorkout(null);
    } catch {
      setError('Failed to delete workout');
    }
  };

  const handleCreateWorkout = () => {
    const newWorkoutTemplate = {
      name: '',
      level: 'Beginner',
      timesPerWeek: 3,
      createdBy: 'Admin',
      isPremade: true,
      createdAt: new Date().toISOString().split('T')[0],
      coverImage: null,
      exercises: []
    };
    setSelectedWorkout(newWorkoutTemplate);
    setIsEditModalOpen(true);
    setIsCreateModalOpen(true);
  };

  const filteredWorkouts = workouts.filter(workout => {
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = workout.name.toLowerCase().includes(searchTerm);
    
    const matchesLevel = !filters.level || workout.level === filters.level;
    const matchesCreatedBy = !filters.createdBy || workout.createdBy === filters.createdBy;
    const matchesPremade = !filters.isPremade || 
                          (filters.isPremade === 'yes' ? workout.isPremade : !workout.isPremade);
    
    return matchesSearch && matchesLevel && matchesCreatedBy && matchesPremade;
  });

  const indexOfLastWorkout = currentPage * workoutsPerPage;
  const indexOfFirstWorkout = indexOfLastWorkout - workoutsPerPage;
  const currentWorkouts = filteredWorkouts.slice(indexOfFirstWorkout, indexOfLastWorkout);
  const pageCount = Math.ceil(filteredWorkouts.length / workoutsPerPage);

  if (loading) return <div>Loading workouts...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Workout Management</h1>
        <div className="admin-header-actions">
          <div className="admin-search-box">
            <button className="admin-btn-search">
              <Search size={20} />
            </button>
            <input
              type="text"
              className="admin-input-search"
              placeholder="Search workouts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button 
            className="create-workout-btn"
            onClick={handleCreateWorkout}
          >
            <Plus size={16} />
            <span>Create Workout</span>
          </button>
        </div>
      </div>

      <div className="filters-container">
        <select
          name="level"
          value={filters.level}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <select
          name="createdBy"
          value={filters.createdBy}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Sources</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>

        <select
          name="isPremade"
          value={filters.isPremade}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="yes">Premade</option>
          <option value="no">Custom</option>
        </select>
      </div>

      <div className="users-table-container">
        {filteredWorkouts.length > 0 ? (
          <table className="users-table" key={`${filters.level}-${filters.createdBy}-${filters.isPremade}-${searchQuery}`}>
            <thead>
              <tr>
                <th>Actions</th>
                <th>Name</th>
                <th>Level</th>
                <th>Times/Week</th>
                <th>Created By</th>
                <th>Premade</th>
              </tr>
            </thead>
            <tbody>
              {currentWorkouts.map((workout, index) => (
                <tr key={workout.id} className="animate-fade-in">
                  <td>
                    <div 
                      className="actions-dropdown"
                      ref={activeDropdown === workout.id ? dropdownRef : null}
                    >
                      <button 
                        className="dropdown-trigger"
                        onClick={() => setActiveDropdown(activeDropdown === workout.id ? null : workout.id)}
                      >
                        <MoreVertical size={20} />
                      </button>
                      {activeDropdown === workout.id && (
                        <div className={`dropdown-menu ${shouldFlipDropdown(index, currentWorkouts.length) ? 'flip-up' : ''}`}>
                          <button 
                            className="dropdown-item"
                            onClick={() => handleViewDetails(workout)}
                          >
                            <Eye size={16} />
                            <span>View Details</span>
                          </button>
                          <button 
                            className="dropdown-item"
                            onClick={() => handleEditWorkout(workout)}
                          >
                            <Pencil size={16} />
                            <span>Edit</span>
                          </button>
                          <button 
                            className="dropdown-item delete"
                            onClick={() => handleDeleteClick(workout)}
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{workout.name}</td>
                  <td>{workout.level}</td>
                  <td>{workout.timesPerWeek}</td>
                  <td>
                    {workout.createdByAdmin
                      ? `Admin #${workout.createdByAdmin}`
                      : workout.createdByUser
                        ? `User #${workout.createdByUser}`
                        : 'Unknown'}
                  </td>
                  <td>{workout.isPremade ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-results">
            <div className="no-results-content">
              <Search size={48} className="no-results-icon" />
              <h3>No results found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          </div>
        )}
        
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {pageCount}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
            disabled={currentPage === pageCount}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>

      {/* Conditionally render either the details or edit modal */}
      {selectedWorkout && !isEditModalOpen && !isDeleteModalOpen && (
        <WorkoutDetailsModal
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
          onEdit={() => setIsEditModalOpen(true)}
        />
      )}
      
      {selectedWorkout && isEditModalOpen && !isDeleteModalOpen && (
        <WorkoutEditModal
          workout={selectedWorkout}
          onClose={() => {
            setIsEditModalOpen(false);
            setIsCreateModalOpen(false);
            setSelectedWorkout(null);
          }}
          onSave={handleSaveWorkout}
          isCreating={isCreateModalOpen}
        />
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        item={selectedWorkout || {}}
        itemType="workout"
      />
    </div>
  );
};

export default WorkoutManagement;