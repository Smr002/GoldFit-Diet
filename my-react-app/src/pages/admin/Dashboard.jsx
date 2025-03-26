import React, { useState } from 'react';
import { Users, Dumbbell, Bell, Crown, UserPlus } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import 'admin.css';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleDeleteUser = () => {
    console.log(`Deleting user: ${selectedUser.name}`);
    closeModal();
  };

  const handleSaveChanges = () => {
    console.log(`Saving changes for user: ${selectedUser.name}`);
    closeModal();
  };

  const handlePromoteToAdmin = () => {
    console.log(`Promoting user: ${selectedUser.firstName} ${selectedUser.lastName} to admin`);
    closeModal();
  };

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

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
      </div>
      
      <div className="dashboard-grid">
        <DashboardCard 
          title="Total Users"
          value={stats.totalUsers}
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
        <div className="modal-overlay">
          <div className="modal">
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
              <button onClick={handleDeleteUser} className="delete-btn">
                Delete User
              </button>
              <button onClick={handlePromoteToAdmin} className="promote-btn">
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
