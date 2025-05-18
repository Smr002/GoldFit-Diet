import React, { useState, useEffect } from 'react';
import { Users, Dumbbell, Bell, Crown, UserPlus, LogOut } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import 'admin.css';
import { fetchTotalUserCount } from '../../api';

const DashboardCard = ({ title, value, icon: Icon, description }) => (
  <div className="dashboard-card">
    <div className="dashboard-card-icon">
      <Icon size={28} />
    </div>
    <div className="dashboard-card-content">
      <h3 className="dashboard-card-title">{title}</h3>
      <p className="dashboard-card-value">{value}</p>
      <p className="dashboard-card-description">{description}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate for redirection
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isPromoteConfirmOpen, setIsPromoteConfirmOpen] = useState(false);
  const [modalLeavingClass, setModalLeavingClass] = useState('');
  const [deleteModalLeavingClass, setDeleteModalLeavingClass] = useState('');
  const [promoteModalLeavingClass, setPromoteModalLeavingClass] = useState('');
  const [totalUsers, setTotalUserCount] = useState(0);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const getTotalUsers = async () => {
      try {
        if (token) {
          const count = await fetchTotalUserCount(token);
          setTotalUserCount(count);
        }
      } catch (error) {
        console.error("Failed to fetch total user count:", error);
      }
    };

    getTotalUsers();
  }, [token]);
  
  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalLeavingClass('leaving');
    setTimeout(() => {
      setSelectedUser(null);
      setIsModalOpen(false);
      setModalLeavingClass('');
    }, 300); // Match this with animation duration
  };

  const handleDeleteUser = () => {
    closeModal();
  };

  const handleSaveChanges = () => {
    closeModal();
  };

  const handlePromoteToAdmin = () => {
    closeModal();
  };

  const handleDeleteClick = () => {
    // Store a reference to the current user before closing the modal
    const currentUser = selectedUser;
    
    setModalLeavingClass('leaving');
    setTimeout(() => {
      setIsModalOpen(false);
      setModalLeavingClass('');
      
      // Use the stored reference to ensure we still have the user data
      if (currentUser) {
        setSelectedUser(currentUser);
        setIsDeleteConfirmOpen(true);
      }
    }, 300);
  };

  const handlePromoteClick = () => {
    // Store a reference to the current user before closing the modal
    const currentUser = selectedUser;
    
    setModalLeavingClass('leaving');
    setTimeout(() => {
      setIsModalOpen(false);
      setModalLeavingClass('');
      
      // Use the stored reference to ensure we still have the user data
      if (currentUser) {
        setSelectedUser(currentUser);
        setIsPromoteConfirmOpen(true);
      }
    }, 300);
  };

  const handleDeleteConfirm = () => {
    setDeleteModalLeavingClass('leaving');
    setTimeout(() => {
      setIsDeleteConfirmOpen(false);
      setDeleteModalLeavingClass('');
      setSelectedUser(null);
    }, 300);
  };

  const handlePromoteConfirm = () => {
    setPromoteModalLeavingClass('leaving');
    setTimeout(() => {
      setIsPromoteConfirmOpen(false);
      setPromoteModalLeavingClass('');
      setSelectedUser(null);
    }, 300);
  };

  // Update the closeDeleteConfirm function
  const closeDeleteConfirm = () => {
    setDeleteModalLeavingClass('leaving');
    setTimeout(() => {
      setIsDeleteConfirmOpen(false);
      setDeleteModalLeavingClass('');
      
      // Add a small delay before reopening the user modal
      // This prevents state conflicts during transitions
      if (selectedUser) {
        setTimeout(() => {
          setIsModalOpen(true);
        }, 50);
      }
    }, 300);
  };

  // Similarly update the closePromoteConfirm function
  const closePromoteConfirm = () => {
    setPromoteModalLeavingClass('leaving');
    setTimeout(() => {
      setIsPromoteConfirmOpen(false);
      setPromoteModalLeavingClass('');
      
      // Add a small delay before reopening the user modal
      if (selectedUser) {
        setTimeout(() => {
          setIsModalOpen(true);
        }, 50);
      }
    }, 300);
  };

  useEffect(() => {
    let timeout;
    if (isModalOpen || isDeleteConfirmOpen || isPromoteConfirmOpen) {
      timeout = setTimeout(() => {
        const overlays = document.querySelectorAll('.modal-overlay');
        overlays.forEach(overlay => overlay.classList.add('active'));
      }, 10);
    }
    
    return () => clearTimeout(timeout);
  }, [isModalOpen, isDeleteConfirmOpen, isPromoteConfirmOpen]);

  const stats = {
    totalUsers: 150,
    totalWorkouts: 45,
    totalNotifications: 28
  };

  const userActivityData = [
    { name: 'Mon', users: 20 },
    { name: 'Tue', users: 25 },
    { name: 'Wed', users: 30 },
    { name: 'Thu', users: 22 },
    { name: 'Fri', users: 28 },
    { name: 'Sat', users: 35 },
    { name: 'Sun', users: 32 }
  ];

  const workoutDistributionData = [
    { name: 'Weight Loss', value: 45 },
    { name: 'Muscle Gain', value: 35 },
    { name: 'Maintenance', value: 20 }
  ];

  const topWorkoutsData = [
    { name: 'Full Body Workout', value: 35 },
    { name: 'Upper Body Focus', value: 25 },
    { name: 'Core Strength', value: 20 },
    { name: 'Lower Body Power', value: 12 },
    { name: 'HIIT Training', value: 8 }
  ];

  const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#8b5cf6', '#ec4899'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p>{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Add new mock data for recent users
  const recentUsers = [
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
      joinDate: '2024-03-26',
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
      joinDate: '2024-03-25',
    },
    {
      id: 3,
      firstName: 'Engjell',
      lastName: 'Abazaj',
      email: 'jane@example.com',
      age: 20,
      gender: 'Male',
      height: 173,
      weight: 100,
      goal: 'Muscle Gain',
      joinDate: '2024-03-26',
    }
    // Add more users as needed
  ];

  const recentPremiumUsers = [
    {
      id: 1,
      firstName: 'Alex',
      lastName: 'Wilson',
      email: 'alex@example.com',
      age: 30,
      gender: 'Male',
      height: 175,
      weight: 70,
      goal: 'Muscle Gain',
      joinDate: '2024-03-26',
      isPremium: true
    },
    { id: 1,
      firstName: 'Alex',
      lastName: 'Wilson',
      email: 'alex@example.com',
      age: 30,
      gender: 'Male',
      height: 175,
      weight: 70,
      goal: 'Muscle Gain',
      joinDate: '2024-03-26',
      isPremium: true },
    { id: 1,
      firstName: 'Alex',
      lastName: 'Wilson',
      email: 'alex@example.com',
      age: 30,
      gender: 'Male',
      height: 175,
      weight: 70,
      goal: 'Muscle Gain',
      joinDate: '2024-03-26',
      isPremium: true }
  ];

  // Add this function to your component
  const closeModalWithAnimation = (setModalState) => {
    // First add the leaving class
    document.querySelector('.modal-overlay').classList.add('leaving');
    document.querySelector('.modal').classList.add('leaving');
    
    // After animation completes, close the modal
    setTimeout(() => {
      setModalState(false);
    }, 300); // Match this with your animation duration
  };
  


  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        
      </div>
      
      <div className="dashboard-grid">
        <DashboardCard 
          title="Total Users"
          value= {totalUsers}
          icon={Users}
          description="All registered users"
        />
        <DashboardCard 
          title="Total Workouts"
          value={stats.totalWorkouts}
          icon={Dumbbell}
          description="All created workouts"
        />
        <DashboardCard 
          title="Total Notifications"
          value={stats.totalNotifications}
          icon={Bell}
          description="All notifications sent"
        />
      </div>

      <div className="dashboard-charts">
        <div className="chart-container">
          <h2 className="chart-title">Weekly User Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2 className="chart-title">Most Popular Workouts</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topWorkoutsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={false}
              >
                {topWorkoutsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-bottom-section">
        <div className="users-card">
          <div className="users-card-header">
            <h2 className="users-card-title">
              <Crown size={20} />
              New Premium Users
            </h2>
            <span className="users-card-count">{recentPremiumUsers.length} new</span>
          </div>
          <div className="users-list">
            {recentPremiumUsers.map(user => (
              <div
                key={user.id}
                className="user-item"
                onClick={() => openModal(user)}
              >
                <div className="user-info">
                  <h3 className="user-name">{user.firstName} {user.lastName}</h3>
                  <p className="user-email">{user.email}</p>
                </div>
                <span className="user-date">{user.joinDate}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="users-card">
          <div className="users-card-header">
            <h2 className="users-card-title">
              <UserPlus size={20} />
              New Users
            </h2>
            <span className="users-card-count">{recentUsers.length} new</span>
          </div>
          <div className="users-list">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="user-item"
                onClick={() => openModal(user)} // Open modal on click
              >
                <div className="user-info">
                  <h3 className="user-name">{user.firstName} {user.lastName}</h3>
                  <p className="user-email">{user.email}</p>
                </div>
                <span className="user-date">{user.joinDate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={`modal-overlay ${modalLeavingClass}`}>
          <div className={`modal ${modalLeavingClass}`}>
            <button className="modal-close-btn" onClick={closeModal}>
              &times;
            </button>
            <h2>
              {selectedUser.isPremium && (
                <span className="premium-badge">
                  <Crown size={16} /> Premium
                </span>
              )}
              User Details
            </h2>
            <div className="modal-content">
              <p>
                <strong>First Name</strong>
                {selectedUser.firstName}
              </p>
              <p>
                <strong>Last Name</strong>
                {selectedUser.lastName}
              </p>
              <p>
                <strong>Email</strong>
                {selectedUser.email}
              </p>
              <p>
                <strong>Age</strong>
                {selectedUser.age} years
              </p>
              <p>
                <strong>Gender</strong>
                {selectedUser.gender}
              </p>
              <p>
                <strong>Height</strong>
                {selectedUser.height} cm
              </p>
              <p>
                <strong>Weight</strong>
                {selectedUser.weight} kg
              </p>
              <p>
                <strong>Goal</strong>
                {selectedUser.goal}
              </p>
            </div>
            <div className="modal-actions">
              <button onClick={handleDeleteClick} className="delete-btn">
                Delete User
              </button>
              <button onClick={handlePromoteClick} className="promote-btn">
                Promote to Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && selectedUser && (
        <div className={`modal-overlay ${deleteModalLeavingClass}`}>
          <div className={`modal confirmation-modal ${deleteModalLeavingClass}`}>
            <h2>Confirm Delete</h2>
            <p>
              Are you sure you want to delete this user?<br />
              <strong className="delete-emphasis">{selectedUser.firstName} {selectedUser.lastName} ({selectedUser.email})</strong>
              <br />
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button 
                onClick={() => closeModalWithAnimation(setIsDeleteConfirmOpen)} 
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm} 
                className="delete-btn"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promote Confirmation Modal */}
      {isPromoteConfirmOpen && selectedUser && (
        <div className={`modal-overlay ${promoteModalLeavingClass}`}>
          <div className={`modal confirmation-modal ${promoteModalLeavingClass}`}>
            <h2>Confirm Promotion</h2>
            <p>
              Are you sure you want to promote this user to an admin?<br />
              <strong className="promote-emphasis">{selectedUser.firstName} {selectedUser.lastName} ({selectedUser.email})</strong>
              <br />
              They will have access to the admin dashboard and permissions according to their assigned role.
            </p>
            <div className="modal-actions">
              <button 
                onClick={() => closeModalWithAnimation(setIsPromoteConfirmOpen)} 
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

export default Dashboard;
