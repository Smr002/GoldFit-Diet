import React, { useState } from 'react';
import { Crown, Shield, SearchIcon } from 'lucide-react';
import 'admin.css';

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      age: 28,
      gender: 'Male',
      height: 180,
      weight: 75,
      goal: 'Weight Loss',
      level: 'Intermediate',
      joinDate: '2024-03-26',
      isPremium: true
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      age: 32,
      gender: 'Female',
      height: 165,
      weight: 60,
      goal: 'Muscle Gain',
      level: 'Beginner',
      joinDate: '2024-03-25',
      isPremium: false
    },
    {
      id: 3,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@example.com',
      age: 29,
      gender: 'Female',
      height: 170,
      weight: 68,
      goal: 'Maintenance',
      level: 'Advanced',
      joinDate: '2024-03-20',
      isPremium: true
    },
    {
      id: 4,
      firstName: 'Bob',
      lastName: 'Brown',
      email: 'rand',
      age: 35,
      gender: 'Male',
      height: 175,
      weight: 80,
      goal: 'Muscle Gain',
      level: 'Intermediate',
      joinDate: '2024-03-18',
      isPremium: false
    },
    {
      id: 5,
      firstName: 'Charlie',
      lastName: 'Davis',
      email: 'charlie@example.com',
      age: 40,
      gender: 'Male',
      height: 178,
      weight: 85,
      goal: 'Weight Loss',
      level: 'Beginner',
      joinDate: '2024-03-15',
      isPremium: false
    }
  ]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const openEditModal = (user) => {
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setIsEditModalOpen(false);
  };

  const handleEditUser = () => {
    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    closeEditModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePromoteToAdmin = (userId) => {
    console.log(`Promoting user ${userId} to admin`);
  };

  const filteredUsers = users.filter(user => {
    const searchTerm = searchQuery.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchTerm) || 
           user.email.toLowerCase().includes(searchTerm);
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">User Management</h1>
        <div className="search-bar small">
          <SearchIcon size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input small"
          />
        </div>
      </div>
      
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Height</th>
              <th>Weight</th>
              <th>Goal</th>
              <th>Level</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="name-cell">
                  {user.isPremium && <Crown size={16} className="premium-icon" />}
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>{user.age}</td>
                <td>{user.gender}</td>
                <td>{user.height} cm</td>
                <td>{user.weight} kg</td>
                <td>{user.goal}</td>
                <td>{user.level}</td>
                <td>{user.joinDate}</td>
                <td>
                  <div className="table-actions">
                    <button 
                      className="action-btn edit"
                      onClick={() => openEditModal(user)}
                    >
                      Edit
                    </button>
                    <button className="action-btn delete">Delete</button>
                    <button 
                      className="action-btn promote"
                      onClick={() => handlePromoteToAdmin(user.id)}
                    >
                      <Shield size={14} />
                      Admin
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
};

export default UserManagement;