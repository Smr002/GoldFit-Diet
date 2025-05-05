import React, { useState, useEffect, useRef } from 'react';
import { Crown, Shield, Search, Pencil, Trash2, UserCog, MoreVertical, Trophy } from 'lucide-react';
import 'admin.css';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { getUsers, updateUser, deleteUser, promoteUser } from '../../api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [filters, setFilters] = useState({
    level: '',
    goal: '',
    premium: ''
  });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [selectedUserBadges, setSelectedUserBadges] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const dropdownRef = useRef(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const usersData = await getUsers(token);
      setUsers(usersData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  const openEditModal = (user) => {
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setIsEditModalOpen(false);
  };

  const handleEditUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Format the age range for the database
      const ageRange = editingUser.age.toString();
      
      // Prepare the update data
      const updateData = {
        fullName: `${editingUser.firstName} ${editingUser.lastName}`,
        email: editingUser.email,
        selectedAgeGroup: ageRange,
        selectedGender: editingUser.gender,
        selectedHeight: editingUser.height,
        selectedWeight: editingUser.weight,
        selectedGoal: editingUser.goal,
        selectedLevel: editingUser.level
      };

      // Call the updateUser API
      await updateUser(editingUser.id, updateData, token);

      // Update the local state
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      
      // Close the modal
      closeEditModal();
    } catch (error) {
      console.error('Error updating user:', error);
      alert(error.message || 'Failed to update user');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewBadges = (user) => {
    // Simulated badges data - replace with actual badges data
    const userBadges = [
      { id: 1, name: "Weight Loss Champion", description: "Lost 10kg", earnedDate: "2024-02-15" },
      { id: 2, name: "Workout Warrior", description: "Completed 30 workouts", earnedDate: "2024-03-01" },
      { id: 3, name: "Early Bird", description: "5 morning workouts", earnedDate: "2024-03-10" }
    ];
    setSelectedUserBadges({ user, badges: userBadges });
    setIsBadgesModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Call the deleteUser API
      await deleteUser(selectedUser.id, token);

      // Update the local state
      setUsers(users.filter(user => user.id !== selectedUser.id));
      
      // Close the modal and reset selected user
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.message || 'Failed to delete user');
    }
  };

  const handlePromoteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Call the promoteUser API
      await promoteUser(selectedUser.id, token);

      // Update the local state to reflect the promotion
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, isAdmin: true } : user
      ));
      
      // Close the modal and reset selected user
      setIsPromoteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error promoting user:', error);
      alert(error.message || 'Failed to promote user');
    }
  };

  const filteredUsers = users.filter(user => {
    const searchTerm = searchQuery.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm) || 
                         user.email.toLowerCase().includes(searchTerm);
    
    const matchesLevel = !filters.level || user.level === filters.level;
    const matchesGoal = !filters.goal || user.goal === filters.goal;
    const matchesPremium = !filters.premium || 
                          (filters.premium === 'premium' ? user.isPremium : !user.isPremium);
    
    return matchesSearch && matchesLevel && matchesGoal && matchesPremium;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);

  // Add this function inside your UserManagement component
  const shouldFlipDropdown = (index, total) => {
    // Flip the last 2 rows' dropdowns to prevent them being cut off
    return index >= total - 2;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAgeRange = (age) => {
    if (!age) return 'N/A';
    // Convert the number to string to handle both string and number inputs
    const ageStr = age.toString();
    // Check if the age is in the concatenated format (e.g., "1829")
    if (ageStr.length === 4) {
      const startAge = ageStr.substring(0, 2);
      const endAge = ageStr.substring(2);
      // Special case for 50 and above
      if (startAge === '50') {
        return '50+';
      }
      return `${startAge}-${endAge}`;
    }
    return 'N/A';
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">User Management</h1>
        <div className="admin-search-box">
          <button className="admin-btn-search">
            <Search size={40} />
          </button>
          <input
            type="text"
            className="admin-input-search"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
          name="goal"
          value={filters.goal}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Goals</option>
          <option value="Weight Loss">Weight Loss</option>
          <option value="Muscle Gain">Muscle Gain</option>
          <option value="Maintenance">Maintenance</option>
        </select>

        <select
          name="premium"
          value={filters.premium}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Users</option>
          <option value="premium">Premium</option>
          <option value="standard">Standard</option>
        </select>
      </div>

      <div className="users-table-container">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button 
              className="retry-button"
              onClick={() => {
                setError(null);
                fetchUsers();
              }}
            >
              Retry
            </button>
          </div>
        ) : filteredUsers.length > 0 ? (
          <table className="users-table" key={`${filters.level}-${filters.goal}-${filters.premium}-${searchQuery}`}>
            <thead>
              <tr>
                <th>Actions</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Height</th>
                <th>Weight</th>
                <th>Goal</th>
                <th>Join Date</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={user.id} className="animate-fade-in">
                  <td>
                    <div 
                      className="actions-dropdown" 
                      ref={activeDropdown === user.id ? dropdownRef : null}
                    >
                      <button 
                        className="dropdown-trigger"
                        onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                      >
                        <MoreVertical size={20} />
                      </button>
                      {activeDropdown === user.id && (
                        <div className={`dropdown-menu ${shouldFlipDropdown(index, currentUsers.length) ? 'flip-up' : ''}`}>
                          <button
                            onClick={() => {
                              openEditModal(user);
                              setActiveDropdown(null);
                            }}
                            className="dropdown-item"
                          >
                            <Pencil size={16} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              handleViewBadges(user);
                              setActiveDropdown(null);
                            }}
                            className="dropdown-item"
                          >
                            <Trophy size={16} />
                            <span>View Badges</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsPromoteModalOpen(true);
                              setActiveDropdown(null);
                            }}
                            className="dropdown-item"
                          >
                            <UserCog size={16} />
                            <span>Promote</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteModalOpen(true);
                              setActiveDropdown(null);
                            }}
                            className="dropdown-item delete"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="name-cell">
                      <span className={user.isPremium ? 'premium-name' : ''}>
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{formatAgeRange(user.age)}</td>
                  <td>{user.gender}</td>
                  <td>{user.height} cm</td>
                  <td>{user.weight} kg</td>
                  <td>{user.goal}</td>
                  <td>{formatDate(user.createdAt)}</td>
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

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close-btn" onClick={closeEditModal}>
              &times;
            </button>
            <h2>
              Edit User
              {editingUser.isPremium && (
                <span className="premium-badge">
                  <Crown size={16} /> Premium
                </span>
              )}
            </h2>
            <div>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={editingUser.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={editingUser.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={editingUser.age}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={editingUser.gender}
                  onChange={handleInputChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  
                </select>
              </div>
              <div className="form-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={editingUser.height}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={editingUser.weight}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Goal</label>
                <select
                  name="goal"
                  value={editingUser.goal}
                  onChange={handleInputChange}
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="form-group">
                <label>Level</label>
                <select
                  name="level"
                  value={editingUser.level}
                  onChange={handleInputChange}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={closeEditModal} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleEditUser} className="save-btn">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {isBadgesModalOpen && (
        <div className="modal-overlay">
          <div className="modal badges-modal">
            <button className="modal-close-btn" onClick={() => setIsBadgesModalOpen(false)}>
              &times;
            </button>
            <h2>
              {selectedUserBadges.user.firstName}'s Badges
              {selectedUserBadges.user.isPremium && (
                <span className="premium-badge">
                  <Crown size={16} /> Premium
                </span>
              )}
            </h2>
            <div className="badges-grid">
              {selectedUserBadges.badges.length > 0 ? (
                selectedUserBadges.badges.map(badge => (
                  <div key={badge.id} className="badge-card">
                    <div className="badge-icon">
                      <Trophy size={32} />
                    </div>
                    <h3>{badge.name}</h3>
                    <p>{badge.description}</p>
                    <span className="badge-date">Earned: {badge.earnedDate}</span>
                  </div>
                ))
              ) : (
                <p className="no-badges">No badges earned yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        item={selectedUser || {}}
        itemType="user"
      />

      {isPromoteModalOpen && (
        <div className="modal-overlay">
          <div className="modal confirmation-modal">
            <h2>Confirm Promotion</h2>
            <p>
              Are you sure you want to promote{' '}
              <strong>{selectedUser.firstName} {selectedUser.lastName}</strong> to admin?
              They will have full access to the admin dashboard and user management.
            </p>
            <div className="modal-actions">
              <button 
                onClick={() => setIsPromoteModalOpen(false)} 
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handlePromoteConfirm} 
                className="promote-btn"
              >
                Promote to Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;