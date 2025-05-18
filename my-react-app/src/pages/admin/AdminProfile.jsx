import React, { useState, useEffect } from 'react';
import { UserCircle, Mail, Phone, Calendar, Shield, Lock, Edit, Camera, CheckCircle, XCircle } from 'lucide-react';
import 'admin.css';
// Import the default profile picture
import defaultProfilePic from '../../assets/pfp.jpg';
import mockData from '../../data/mockAdmin.json';
import { getUserById, getUserIdFromToken } from '../../api';

const AdminProfile = ({ 
  adminData: initialAdminData = null, 
  onSave = null, 
  onPasswordChange = null,
  userType = 'admin' // New parameter: 'admin' or 'user'
}) => {
  // Use provided admin data or fall back to mock data
  const [adminData, setAdminData] = useState(initialAdminData || mockData.currentUser);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({...adminData});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [animateContent, setAnimateContent] = useState(false);
  
  // Check if this profile is for an admin or a regular user
  const isAdmin = userType === 'admin';

  // Update form data if adminData prop changes
  useEffect(() => {
    if (initialAdminData) {
      setAdminData(initialAdminData);
      setFormData(initialAdminData);
    }
  }, [initialAdminData]);

  // Simulate loading and then show animations
  useEffect(() => {
    // Start loading
    setIsLoading(true);
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Trigger content animation after loading completes
      setTimeout(() => setAnimateContent(true), 100);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Fetch real admin data for the currently logged-in user
  useEffect(() => {
    const fetchAdminData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No auth token found');
        const userId = getUserIdFromToken(token);
        if (!userId) throw new Error('No user ID found in token');
        const user = await getUserById(userId, token);
        setAdminData(user);
        setFormData(user);
      } catch (err) {
        setErrorMessage(err.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
        setTimeout(() => setAnimateContent(true), 100);
      }
    };
    fetchAdminData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    // If an onSave callback was provided, use it
    if (onSave) {
      onSave(formData)
        .then(() => {
          setAdminData(formData);
          setIsEditMode(false);
          setIsLoading(false);
          setSuccessMessage('Profile updated successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        })
        .catch(error => {
          setIsLoading(false);
          setErrorMessage(error.message || 'Failed to update profile');
        });
    } else {
      // For demo/mock mode, simulate API call
      setTimeout(() => {
        setAdminData({...formData});
        setIsEditMode(false);
        setIsLoading(false);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }, 800);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    
    setIsLoading(true);
    
    // If an onPasswordChange callback was provided, use it
    if (onPasswordChange) {
      onPasswordChange(passwordData)
        .then(() => {
          setIsLoading(false);
          setSuccessMessage('Password updated successfully!');
          setShowPasswordForm(false);
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          setErrorMessage('');
          setTimeout(() => setSuccessMessage(''), 3000);
        })
        .catch(error => {
          setIsLoading(false);
          setErrorMessage(error.message || 'Failed to update password');
        });
    } else {
      // For demo/mock mode, simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMessage('Password updated successfully!');
        setShowPasswordForm(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setErrorMessage('');
        setTimeout(() => setSuccessMessage(''), 3000);
      }, 800);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      
      // In a real app, you would upload this file to your server
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          avatar: reader.result
        });
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title slide-in-left">My Profile</h1>
        {!isEditMode && !isLoading && (
          <button 
            className="edit-profile-btn slide-in-right"
            onClick={() => setIsEditMode(true)}
          >
            <Edit size={16} />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {successMessage && (
        <div className="success-message fade-in">
          <CheckCircle size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="error-message shake-animation">
          <XCircle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="profile-loading">
          <div className="profile-loading-spinner"></div>
          <p>Loading profile information...</p>
        </div>
      ) : (
        <div className={`profile-container ${animateContent ? 'fade-in' : ''}`}>
          <div className="profile-sidebar scale-in">
            <div className="profile-avatar-container">
              {formData.avatar ? (
                <img 
                  src={formData.avatar} 
                  alt={formData.name} 
                  className="profile-avatar pulse-animation"
                />
              ) : (
                <img 
                  src={defaultProfilePic} 
                  alt={formData.name} 
                  className="profile-avatar pulse-animation"
                />
              )}
              
              {isEditMode && (
                <label className="avatar-edit-label bounce-animation">
                  <Camera size={20} />
                  <span>Change</span>
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="avatar-input"
                  />
                </label>
              )}
            </div>
            
            {/* Only show role badge for admin users */}
            {isAdmin && adminData.role && (
              <div className="profile-role-badge slide-in-left">
                {adminData.role === 'Super Admin' ? (
                  <Shield size={16} />
                ) : (
                  <Lock size={16} />
                )}
                <span>{adminData.role}</span>
              </div>
            )}
            
            {/* Only show status for admin users */}
            {isAdmin && adminData.status && (
              <div className="profile-status slide-in-right">
                <span className={`status-badge ${adminData.status.toLowerCase()}`}>
                  {adminData.status}
                </span>
              </div>
            )}
            
            {!isEditMode && !showPasswordForm && (
              <button 
                className="change-password-btn slide-in-bottom"
                onClick={() => setShowPasswordForm(true)}
              >
                Change Password
              </button>
            )}
          </div>
          
          <div className="profile-content">
            {!isEditMode && !showPasswordForm ? (
              <div className="profile-details">
                <div className="profile-detail-item fade-in-up" style={{animationDelay: '0.1s'}}>
                  <div className="detail-icon">
                    <UserCircle size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Full Name</span>
                    <span className="detail-value">{(adminData.firstName || '') + (adminData.lastName ? ' ' + adminData.lastName : '')}</span>
                  </div>
                </div>
                
                <div className="profile-detail-item fade-in-up" style={{animationDelay: '0.2s'}}>
                  <div className="detail-icon">
                    <Mail size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{adminData.email}</span>
                  </div>
                </div>
                
                {/* Show account creation date for all users */}
                <div className="profile-detail-item fade-in-up" style={{animationDelay: '0.3s'}}>
                  <div className="detail-icon">
                    <Calendar size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Account Created</span>
                    <span className="detail-value">{adminData.createdAt ? new Date(adminData.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
                
                {/* Show last active date for all users */}
                <div className="profile-detail-item fade-in-up" style={{animationDelay: '0.4s'}}>
                  <div className="detail-icon">
                    <Calendar size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Last Active</span>
                    <span className="detail-value">{new Date().toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Only show permissions for admin users */}
                {isAdmin && adminData.permissions && adminData.permissions.length > 0 && (
                  <div className="profile-permissions fade-in-up" style={{animationDelay: '0.5s'}}>
                    <h3>My Permissions</h3>
                    <div className="permission-tags">
                      {adminData.permissions.map((permission, idx) => (
                        <span 
                          key={idx} 
                          className="permission-tag pop-in"
                          style={{animationDelay: `${0.6 + (idx * 0.1)}s`}}
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : isEditMode ? (
              <form onSubmit={handleProfileSubmit} className="profile-edit-form fade-in">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input 
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="input-animation"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="input-animation"
                    />
                  </div>
                </div>
                
                <div className="form-actions slide-in-bottom">
                  <button 
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setIsEditMode(false);
                      setFormData({...adminData});
                    }}
                  >
                    Cancel
                  </button>
                  
                  <button 
                    type="submit"
                    className="save-btn"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : showPasswordForm && (
              <form onSubmit={handlePasswordSubmit} className="password-change-form fade-in">
                <h3>Change Password</h3>
                
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input 
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="input-animation"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input 
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={8}
                    className="input-animation"
                  />
                  <p className="password-requirements">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input 
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="input-animation"
                  />
                </div>
                
                <div className="form-actions slide-in-bottom">
                  <button 
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                      setErrorMessage('');
                    }}
                  >
                    Cancel
                  </button>
                  
                  <button 
                    type="submit"
                    className="save-btn"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;