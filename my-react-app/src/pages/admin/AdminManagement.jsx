import React, { useState, useRef, useEffect } from 'react';
import { UserPlus, Search, Edit, Trash2, Eye, MoreVertical, Shield, Lock } from 'lucide-react';
import 'admin.css';

const AdminManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    permission: ''
  });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDemoteModalOpen, setIsDemoteModalOpen] = useState(false);
  
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

  const mockAdmins = [
    {
      id: 1,
      name: 'John Admin',
      email: 'john.admin@example.com',
      role: 'Super Admin',
      permissions: ['All Permissions'],
      lastActive: '2 hours ago',
      createdDate: '2023-01-15',
      status: 'Active',
      phone: '+1 555-123-4567'
    },
    {
      id: 2,
      name: 'Sarah Manager',
      email: 'sarah.manager@example.com',
      role: 'Admin',
      permissions: ['Workout Management', 'User Management', 'Notifications'],
      lastActive: '1 day ago',
      createdDate: '2023-02-10',
      status: 'Active',
      phone: '+1 555-987-6543'
    },
    {
      id: 3,
      name: 'Mike Content',
      email: 'mike.content@example.com',
      role: 'Admin',
      permissions: ['Workout Management', 'FAQ Management'],
      lastActive: '5 days ago',
      createdDate: '2023-03-22',
      status: 'Inactive',
      phone: '+1 555-456-7890'
    },
  ];

  const mockPermissions = [
    { id: 'user_management', name: 'User Management', description: 'View and manage users' },
    { id: 'workout_management', name: 'Workout Management', description: 'Create and manage workouts' },
    { id: 'notification_management', name: 'Notifications', description: 'Send and manage notifications' },
    { id: 'faq_management', name: 'FAQ Management', description: 'Manage FAQs' },
    { id: 'admin_management', name: 'Admin Management', description: 'Manage other admins' },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewDetails = (admin) => {
    setSelectedAdmin(admin);
    setIsViewModalOpen(true);
    setActiveDropdown(null);
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    setIsEditModalOpen(true);
    setActiveDropdown(null);
  };

  const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin);
    setIsDeleteModalOpen(true);
    setActiveDropdown(null);
  };

  const handleCreateAdmin = () => {
    // Set an empty admin template
    const newAdminTemplate = {
      id: `temp-${Date.now()}`,
      name: "",
      email: "",
      role: "Admin",
      permissions: [],
      status: "Active",
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    setSelectedAdmin(newAdminTemplate);
    setIsEditModalOpen(true);
    setIsCreateModalOpen(true);
  };

  // Add this function with your other handler functions
  const handleDemoteAdmin = (admin) => {
    setSelectedAdmin(admin);
    setIsDemoteModalOpen(true);
    setActiveDropdown(null);
  };

  const filteredAdmins = mockAdmins.filter(admin => {
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = 
      admin.name.toLowerCase().includes(searchTerm) || 
      admin.email.toLowerCase().includes(searchTerm);
    
    const matchesRole = !filters.role || admin.role === filters.role;
    const matchesPermission = !filters.permission || 
      admin.permissions.includes(filters.permission) ||
      (filters.permission === "All Permissions" && admin.permissions.includes("All Permissions"));
    
    return matchesSearch && matchesRole && matchesPermission;
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Admin Management</h1>
        <div className="admin-header-actions">
          <div className="admin-search-box">
            <button className="admin-btn-search">
              <Search size={20} />
            </button>
            <input
              type="text"
              className="admin-input-search"
              placeholder="Search admins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button 
            className="create-admin-btn"
            onClick={handleCreateAdmin}
          >
            <UserPlus size={16} />
            <span>Add New Admin</span>
          </button>
        </div>
      </div>

      <div className="filters-container">
        <select
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Roles</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Admin">Admin</option>
        </select>

        <select
          name="permission"
          value={filters.permission}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Permissions</option>
          <option value="All Permissions">All Permissions</option>
          {mockPermissions.map(permission => (
            <option key={permission.id} value={permission.name}>{permission.name}</option>
          ))}
        </select>
      </div>

      <div className="users-table-container">
        {filteredAdmins.length > 0 ? (
          <table className="users-table" key={`${filters.role}-${filters.permission}-${searchQuery}`}>
            <thead>
              <tr>
                <th>Actions</th>
                <th>Admin</th>
                <th>Role</th>
                <th>Permissions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin, index) => (
                <tr key={admin.id} className="animate-fade-in">
                  <td>
                    <div 
                      className="actions-dropdown"
                      ref={activeDropdown === admin.id ? dropdownRef : null}
                    >
                      <button 
                        className="dropdown-trigger"
                        onClick={() => setActiveDropdown(activeDropdown === admin.id ? null : admin.id)}
                      >
                        <MoreVertical size={20} />
                      </button>
                      {activeDropdown === admin.id && (
                        <div className={`dropdown-menu ${shouldFlipDropdown(index, filteredAdmins.length) ? 'flip-up' : ''}`}>
                          <button 
                            className="dropdown-item"
                            onClick={() => handleViewDetails(admin)}
                          >
                            <Eye size={16} />
                            <span>View Details</span>
                          </button>
                          <button 
                            className="dropdown-item"
                            onClick={() => handleEditAdmin(admin)}
                          >
                            <Edit size={16} />
                            <span>Edit</span>
                          </button>
                          {admin.role !== 'Super Admin' && (
                            <>
                              <button 
                                className="dropdown-item warning"
                                onClick={() => handleDemoteAdmin(admin)}
                              >
                                <UserPlus size={16} />
                                <span>Demote to User</span>
                              </button>
                              <button 
                                className="dropdown-item delete"
                                onClick={() => handleDeleteClick(admin)}
                              >
                                <Trash2 size={16} />
                                <span>Delete</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="admin-user-cell">
                      <div className="admin-avatar">
                        <div className="avatar-initials">
                          {admin.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      <div className="admin-user-info">
                        <div className="admin-user-name">{admin.name}</div>
                        <div className="admin-user-email">{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="admin-role-badge">
                      {admin.role === 'Super Admin' ? (
                        <Shield size={16} />
                      ) : (
                        <Lock size={16} />
                      )}
                      <span>{admin.role}</span>
                    </div>
                  </td>
                  <td>
                    <div className="admin-permission-tags">
                      {admin.permissions.map((permission, idx) => (
                        <span key={idx} className="admin-tag">
                          {permission}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-results">
            <div className="no-results-content">
              <Shield size={48} className="no-results-icon" />
              <h3>No admins found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>

      {/* View Admin Modal */}
      {isViewModalOpen && selectedAdmin && (
        <div className="modal-overlay">
          <div className="modal admin-details-modal">
            <button 
              className="modal-close-btn" 
              onClick={() => {
                setIsViewModalOpen(false);
                setSelectedAdmin(null);
              }}
            >
              &times;
            </button>
            <h2>Admin Details</h2>
            
            <div className="admin-details">
              <div className="admin-details-header">
                <div className="admin-details-avatar">
                  <div className="avatar-initials large">
                    {selectedAdmin.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="admin-details-primary">
                  <h3>{selectedAdmin.name}</h3>
                  <div className="admin-role-badge">
                    {selectedAdmin.role === 'Super Admin' ? (
                      <Shield size={16} />
                    ) : (
                      <Lock size={16} />
                    )}
                    <span>{selectedAdmin.role}</span>
                  </div>
                  <span className={`status-badge ${selectedAdmin.status.toLowerCase()}`}>
                    {selectedAdmin.status}
                  </span>
                </div>
              </div>

              <div className="admin-info-grid">
                <div className="info-item">
                  <label>Email</label>
                  <span>{selectedAdmin.email}</span>
                </div>
                
                <div className="info-item">
                  <label>Phone</label>
                  <span>{selectedAdmin.phone || 'Not provided'}</span>
                </div>
                
                <div className="info-item">
                  <label>Added On</label>
                  <span>{new Date(selectedAdmin.createdDate).toLocaleDateString()}</span>
                </div>
                
                <div className="info-item">
                  <label>Last Active</label>
                  <span>{selectedAdmin.lastActive}</span>
                </div>
              </div>
              
              <div className="admin-permissions-section">
                <h4>Permissions</h4>
                <div className="admin-permission-tags large">
                  {selectedAdmin.permissions.map((permission, idx) => (
                    <span key={idx} className="admin-tag">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedAdmin(null);
                }} 
                className="close-btn"
              >
                Close
              </button>
              
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditAdmin(selectedAdmin);
                }} 
                className="edit-btn"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {isEditModalOpen && selectedAdmin && (
        <div className="modal-overlay">
          <div className="modal admin-edit-modal">
            <button 
              className="modal-close-btn" 
              onClick={() => {
                setIsEditModalOpen(false);
                setIsCreateModalOpen(false);
                setSelectedAdmin(null);
              }}
            >
              &times;
            </button>
            <h2>{isCreateModalOpen ? 'Create New Admin' : 'Edit Admin'}</h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              // In a real app, you would save the changes to your backend
              // This is just a mock implementation
              if (isCreateModalOpen) {
                mockAdmins.push({
                  ...selectedAdmin,
                  id: mockAdmins.length + 1,
                  lastActive: 'Just now'
                });
              } else {
                // Find and update the admin
                const index = mockAdmins.findIndex(admin => admin.id === selectedAdmin.id);
                if (index !== -1) {
                  mockAdmins[index] = selectedAdmin;
                }
              }
              setIsEditModalOpen(false);
              setIsCreateModalOpen(false);
              setSelectedAdmin(null);
            }}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="adminName">Full Name</label>
                  <input 
                    type="text"
                    id="adminName"
                    value={selectedAdmin.name}
                    onChange={(e) => setSelectedAdmin({
                      ...selectedAdmin, 
                      name: e.target.value
                    })}
                    placeholder="Full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="adminEmail">Email</label>
                  <input 
                    type="email"
                    id="adminEmail"
                    value={selectedAdmin.email}
                    onChange={(e) => setSelectedAdmin({
                      ...selectedAdmin, 
                      email: e.target.value
                    })}
                    placeholder="Email address"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="adminPhone">Phone</label>
                  <input 
                    type="text"
                    id="adminPhone"
                    value={selectedAdmin.phone || ''}
                    onChange={(e) => setSelectedAdmin({
                      ...selectedAdmin, 
                      phone: e.target.value
                    })}
                    placeholder="Phone number"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="adminRole">Role</label>
                  <select 
                    id="adminRole"
                    value={selectedAdmin.role}
                    onChange={(e) => setSelectedAdmin({
                      ...selectedAdmin, 
                      role: e.target.value,
                      permissions: e.target.value === 'Super Admin' ? ['All Permissions'] : selectedAdmin.permissions
                    })}
                    required
                  >
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
              </div>
              
          
              {selectedAdmin.role !== 'Super Admin' && (
                <div className="form-group">
                  <label>Permissions</label>
                  <div className="permission-checkboxes">
                    {mockPermissions.map(permission => (
                      <label 
                        key={permission.id} 
                        className={`checkbox-label ${selectedAdmin.permissions.includes(permission.name) ? 'selected' : ''}`}
                      >
                        <input 
                          type="checkbox"
                          checked={selectedAdmin.permissions.includes(permission.name)}
                          onChange={(e) => {
                            const newPermissions = e.target.checked
                              ? [...selectedAdmin.permissions, permission.name]
                              : selectedAdmin.permissions.filter(p => p !== permission.name);
                            
                            setSelectedAdmin({
                              ...selectedAdmin,
                              permissions: newPermissions
                            });
                          }}
                        />
                        <span className="checkbox-custom"></span>
                        <div className="permission-info">
                          <span className="permission-name">{permission.name}</span>
                          <span className="permission-description">{permission.description}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  <p className="helper-text">Select the permissions for this admin account.</p>
                </div>
              )}
              
              {isCreateModalOpen && (
                <div className="form-group">
                  <label htmlFor="adminPassword">Temporary Password</label>
                  <input 
                    type="password"
                    id="adminPassword"
                    placeholder="Set temporary password"
                    required={isCreateModalOpen}
                  />
                  <p className="password-note">The admin will be prompted to change this on first login.</p>
                </div>
              )}
              
              <div className="modal-footer">
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setIsCreateModalOpen(false);
                    setSelectedAdmin(null);
                  }} 
                  className="cancel-btn"
                >
                  Cancel
                </button>
                
                <button 
                  type="submit"
                  className="save-btn"
                >
                  {isCreateModalOpen ? 'Create' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedAdmin && (
        <div className="modal-overlay">
          <div className="modal confirmation-modal">
            <h2>Confirm Delete</h2>
            <p>
              Are you sure you want to delete this admin?<br />
              <strong className="delete-emphasis">{selectedAdmin.name} ({selectedAdmin.email})</strong>
              <br />
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedAdmin(null);
                }} 
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // In a real app, you would delete from your backend
                  // This is just a mock implementation
                  const index = mockAdmins.findIndex(admin => admin.id === selectedAdmin.id);
                  if (index !== -1) {
                    mockAdmins.splice(index, 1);
                  }
                  setIsDeleteModalOpen(false);
                  setSelectedAdmin(null);
                }} 
                className="delete-btn"
              >
                Delete Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Demote Confirmation Modal */}
      {isDemoteModalOpen && selectedAdmin && (
        <div className="modal-overlay">
          <div className="modal confirmation-modal">
            <h2>Confirm Demotion</h2>
            <p>
              Are you sure you want to demote this admin to a regular user?<br />
              <strong className="demote-emphasis">{selectedAdmin.name} ({selectedAdmin.email})</strong>
              <br />
              They will lose all admin privileges and access to the admin dashboard.
            </p>
            <div className="modal-actions">
              <button 
                onClick={() => {
                  setIsDemoteModalOpen(false);
                  setSelectedAdmin(null);
                }} 
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // In a real app, you would call your backend API to demote the admin
                  // This is just a mock implementation
                  const index = mockAdmins.findIndex(admin => admin.id === selectedAdmin.id);
                  if (index !== -1) {
                    // Remove from admin list (in a real app, you'd add them to users)
                    mockAdmins.splice(index, 1);
                  }
                  setIsDemoteModalOpen(false);
                  setSelectedAdmin(null);
                }} 
                className="warning-btn"
              >
                Demote to User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;