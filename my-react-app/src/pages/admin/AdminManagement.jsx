import React, { useState, useEffect } from "react";
import {
  Search,
  Shield,
  Lock,
} from "lucide-react";
import "admin.css";
import { getAdmins } from "../../api";

const AdminManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");
        const data = await getAdmins(token);
        setAdmins(data);
      } catch (err) {
        setError(err.message || "Failed to fetch admins");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  // Map backend admin data to display shape with safe defaults
  const mappedAdmins = admins.map((admin) => ({
    id: admin.id,
    fullName: admin.fullName || admin.name || admin.email || "Admin",
    email: admin.email || "",
    role: admin.role || "Admin",
    permissions: admin.permissions || ["All Permissions"], // fallback
    status: admin.status || "Active",
    createdDate: admin.createdAt || new Date().toISOString(),
    lastActive: admin.lastActive || "Unknown",
    phone: admin.phone || "",
  }));

  const filteredAdmins = mappedAdmins.filter((admin) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      admin.fullName?.toLowerCase?.().includes(searchTerm) ||
      admin.email?.toLowerCase?.().includes(searchTerm)
    );
  });

  // Move permissionsList definition to the top-level of the component so it's in scope for all uses
  const permissionsList = [
    {
      id: "user_management",
      name: "User Management",
      description: "View and manage users",
    },
    {
      id: "workout_management",
      name: "Workout Management",
      description: "Create and manage workouts",
    },
    {
      id: "notification_management",
      name: "Notifications",
      description: "Send and manage notifications",
    },
    {
      id: "faq_management",
      name: "FAQ Management",
      description: "Manage FAQs",
    },
    {
      id: "admin_management",
      name: "Admin Management",
      description: "Manage other admins",
    },
  ];

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
        </div>
      </div>

      <div className="users-table-container">
        {filteredAdmins.length > 0 ? (
          <table
            className="users-table"
            key={searchQuery}
          >
            <thead>
              <tr>
                <th className="col-admin">Admin</th>
                <th className="col-role">Role</th>
                <th className="col-permissions">Permissions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin, index) => (
                <tr key={admin.id} className="animate-fade-in">
                  <td className="col-admin">
                    <div className="admin-user-cell">
                      <div className="admin-avatar">
                        <div className="avatar-initials">
                          {admin.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      </div>
                      <div className="admin-user-info">
                        <div className="admin-user-name">{admin.fullName}</div>
                        <div className="admin-user-email">{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="col-role">
                    <div className="admin-role-badge">
                      {admin.role === "Super Admin" ? (
                        <Shield size={16} />
                      ) : (
                        <Lock size={16} />
                      )}
                      <span>{admin.role}</span>
                    </div>
                  </td>
                  <td className="col-permissions">
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
              <p>Try adjusting your search</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;
