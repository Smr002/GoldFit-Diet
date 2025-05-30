import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  Calendar,
  Clock,
  Plus,
  MoreVertical,
  SendHorizontal,
  History,
  CalendarClock,
  Filter,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import "admin.css";
import DeleteConfirmModal from "../../components/admin/DeleteConfirmModal";
import {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  getUserById,
} from "../../api";
import axios from "axios";

const NotificationManagement = () => {
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filtering and search
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // State for active tab and modal controls
  const [activeTab, setActiveTab] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Refs for outside click handling
  const dropdownRef = useRef(null);

  // Stats calculation
  const totalNotifications = notifications.length;
  const sentNotifications = notifications.filter(
    (n) => n.status === "Sent"
  ).length;
  const scheduledNotifications = notifications.filter(
    (n) => n.status === "Scheduled"
  ).length;

  // State for user names mapping
  const [userNames, setUserNames] = useState({});

  // Function to fetch user details
  const fetchUserDetails = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Fetching user details for ID:", userId);
      const user = await getUserById(userId, token);
      console.log("Fetched user:", user);
      return user;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  // Fetch notifications and user details
  useEffect(() => {
    const fetchNotificationsAndUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        if (!token) {
          throw new Error("No authentication token found");
        }

        const notifs = await getNotifications(token);
        setNotifications(notifs);

        const uniqueUserIds = [
          ...new Set(notifs.map((n) => n.createdByUserId)),
        ];
        console.log("Unique user IDs:", uniqueUserIds);

        const namesMap = {};
        await Promise.all(
          uniqueUserIds.map(async (userId) => {
            try {
              const user = await getUserById(userId, token);
              namesMap[userId] = user ? user.firstName : "Unknown";
            } catch (err) {
              console.error(`Failed to fetch user with ID ${userId}:`, err);
              namesMap[userId] = "Unknown";
            }
          })
        );

        console.log("User names map:", namesMap);
        setUserNames(namesMap);
        setError(null);
      } catch (err) {
        console.error("Error fetching notifications or users:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotificationsAndUsers();
  }, []);

  // Filter notifications based on search
  const filteredNotifications = notifications.filter((notification) => {
    const message = notification.message || "";
    const type = notification.type || "";

    const matchesSearch =
      message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Filter by tab
  const displayedNotifications =
    activeTab === "all"
      ? filteredNotifications
      : activeTab === "sent"
      ? filteredNotifications.filter((n) => n.status === "Sent")
      : activeTab === "scheduled"
      ? filteredNotifications.filter((n) => n.status === "Scheduled")
      : filteredNotifications.filter((n) => n.status === "Draft");

  // Click outside handler for dropdowns
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  // Determine if dropdown should flip up
  const shouldFlipDropdown = (index, total) => {
    return index >= total - 2;
  };

  // Handle notification actions
  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setIsViewModalOpen(true);
    setActiveDropdown(null);
  };

  const handleEditNotification = (notification) => {
    setSelectedNotification(notification);
    setIsEditModalOpen(true);
    setActiveDropdown(null);
  };

  const handleDeleteClick = (notification) => {
    setSelectedNotification(notification);
    setIsDeleteModalOpen(true);
    setActiveDropdown(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await deleteNotification(selectedNotification.id, token);
      setNotifications(
        notifications.filter((n) => n.id !== selectedNotification.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedNotification(null);
    } catch (error) {
      console.error("Error deleting notification:", error);
      alert(error.message || "Failed to delete notification");
    }
  };

  const handleCreateNotification = () => {
    setSelectedNotification({
      id: "new",
      type: "System",
      status: "Draft",
      frequency: "One-time",
    });
    setIsCreateModalOpen(true);
  };

  const handleScheduleAutomated = () => {
    setIsScheduleModalOpen(true);
  };

  const handleSaveNotification = async (updatedNotification) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Sanitize notification object for backend
      const sanitizedNotification = { ...updatedNotification };
      delete sanitizedNotification.id;
      delete sanitizedNotification.status;
      delete sanitizedNotification.nextSend;
      // Map frontend type to backend type if needed
      if (sanitizedNotification.type === "System")
        sanitizedNotification.type = "SYSTEM_ALERT";
      if (sanitizedNotification.type === "Reminder")
        sanitizedNotification.type = "WORKOUT_REMINDER";
      if (sanitizedNotification.type === "Promotion")
        sanitizedNotification.type = "ADMIN_MESSAGE";
      if (sanitizedNotification.type === "Update")
        sanitizedNotification.type = "PROGRESS_UPDATE";
      // Map recipients to backend targetUsers
      if (sanitizedNotification.sentTo === "All Users")
        sanitizedNotification.targetUsers = "ALL_USERS";
      if (sanitizedNotification.sentTo === "Premium Users")
        sanitizedNotification.targetUsers = "PREMIUM_USERS";
      if (sanitizedNotification.sentTo === "Specific Users")
        sanitizedNotification.targetUsers = "SPECIFIC_USERS";
      delete sanitizedNotification.sentTo;
      // Map frequency to backend enum
      if (sanitizedNotification.frequency === "One-time")
        sanitizedNotification.frequency = "ONCE";
      if (sanitizedNotification.frequency === "Daily")
        sanitizedNotification.frequency = "DAILY";
      if (sanitizedNotification.frequency === "Weekly")
        sanitizedNotification.frequency = "WEEKLY";
      if (sanitizedNotification.frequency === "Monthly")
        sanitizedNotification.frequency = "MONTHLY";
      // Ensure isAutomated is set (default to false for manual/system)
      if (typeof sanitizedNotification.isAutomated !== "boolean") {
        sanitizedNotification.isAutomated = false;
      }
      // Ensure targetUsers is set (default to ALL_USERS)
      if (!sanitizedNotification.targetUsers) {
        sanitizedNotification.targetUsers = "ALL_USERS";
      }

      if (isCreateModalOpen) {
        const newNotification = await createNotification(
          sanitizedNotification,
          token
        );
        setNotifications([...notifications, newNotification]);
      } else {
        const updatedNotif = await updateNotification(
          updatedNotification.id,
          sanitizedNotification,
          token
        );
        setNotifications(
          notifications.map((n) =>
            n.id === updatedNotification.id ? updatedNotif : n
          )
        );
      }

      setIsEditModalOpen(false);
      setIsCreateModalOpen(false);
      setSelectedNotification(null);
    } catch (error) {
      console.error("Error saving notification:", error);
      alert(error.message || "Failed to save notification");
    }
  };

  // State for automation settings
  const [automationType, setAutomationType] = useState("reminder");
  const [automationMessage, setAutomationMessage] = useState("");
  const [automationRecipients, setAutomationRecipients] = useState("All Users");
  const [automationFrequency, setAutomationFrequency] = useState("Weekly");
  const [automationTime, setAutomationTime] = useState("09:00");
  const [automationTimezone, setAutomationTimezone] = useState("UTC");
  const [selectedDays, setSelectedDays] = useState([1, 3, 5]); // Mon, Wed, Fri
  const [monthlyDay, setMonthlyDay] = useState(1); // 1st of the month

  // Toggle selected days for weekly automation
  const toggleSelectedDay = (dayIndex) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayIndex));
    } else {
      setSelectedDays([...selectedDays, dayIndex].sort());
    }
  };

  // Get default message based on automation type
  const getDefaultMessageForType = (type) => {
    switch (type) {
      case "reminder":
        return "Hey {user_name}, don't forget to log your meals today to stay on track!";
      case "digest":
        return "Your weekly progress summary is ready, {user_name}! Click to see how you're doing.";
      case "milestone":
        return "Congratulations {user_name}! You're getting closer to {next_milestone}. Keep up the great work!";
      case "inactivity":
        return "We miss you, {user_name}! It's been {last_active} since your last visit. Come back to continue your progress!";
      default:
        return "";
    }
  };



  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Notification Management</h1>
        <div className="admin-header-actions">
          <div className="admin-search-box">
            <button className="admin-btn-search">
              <Search size={20} />
            </button>
            <input
              type="text"
              className="admin-input-search"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="admin-buttons">
            <button
              className="create-notification-btn"
              onClick={handleCreateNotification}
            >
              <SendHorizontal size={16} />
              <span>Send New Notification</span>
            </button>
          </div>
        </div>
      </div>

      <div className="users-table-container">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : displayedNotifications.length > 0 ? (
          <table
            className="users-table"
            key={`${searchQuery}`}
          >
            <thead>
              <tr>
                <th>Actions</th>
                <th>Type</th>
                <th>Message</th>
                <th>Targeted Users</th>
                <th>Frequency</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {displayedNotifications.map((notification, index) => (
                <tr key={notification.id} className="animate-fade-in">
                  <td>
                    <div
                      className="actions-dropdown"
                      ref={
                        activeDropdown === notification.id ? dropdownRef : null
                      }
                    >
                      <button
                        className="dropdown-trigger"
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === notification.id
                              ? null
                              : notification.id
                          )
                        }
                      >
                        <MoreVertical size={20} />
                      </button>
                      {activeDropdown === notification.id && (
                        <div
                          className={`dropdown-menu ${
                            shouldFlipDropdown(
                              index,
                              displayedNotifications.length
                            )
                              ? "flip-up"
                              : ""
                          }`}
                        >
                          <button
                            className="dropdown-item"
                            onClick={() => handleViewDetails(notification)}
                          >
                            <Eye size={16} />
                            <span>View Details</span>
                          </button>

                          <button
                            className="dropdown-item delete"
                            onClick={() => handleDeleteClick(notification)}
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`notification-type ${notification.type.toLowerCase()}`}
                    >
                      {notification.type}
                    </span>
                  </td>
                  <td className="notification-message">
                    {notification.message}
                  </td>
                  <td>{notification.targetUsers}</td>
                  <td>{notification.frequency}</td>
                  <td>
                    {userNames[notification.createdByUserId] || "Unknown User"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-results">
            <div className="no-results-content">
              <Bell size={48} className="no-results-icon" />
              <h3>No notifications found</h3>
              <p>Try adjusting your search</p>
            </div>
          </div>
        )}
      </div>

      {/* View Notification Details Modal */}
      {isViewModalOpen && selectedNotification && (
        <div className="modal-overlay">
          <div className="modal notification-details-modal">
            <button
              className="modal-close-btn"
              onClick={() => {
                setIsViewModalOpen(false);
                setSelectedNotification(null);
              }}
            >
              ×
            </button>
            <h2>Notification Details</h2>

            <div className="notification-details">
              <div className="notification-header">
                <span
                  className={`notification-type-large ${selectedNotification.type.toLowerCase()}`}
                >
                  {selectedNotification.type}
                </span>
                <span
                  className={`status-badge ${selectedNotification.status?.toLowerCase()}`}
                >
                  {selectedNotification.status}
                </span>
              </div>

              <div className="notification-message-container">
                <p className="notification-message-large">
                  {selectedNotification.message}
                </p>
              </div>

              <div className="notification-info-grid">
                <div className="info-item">
                  <label>Frequency:</label>
                  <span>{selectedNotification.frequency}</span>
                </div>

                <div className="info-item">
                  <label>Created By:</label>
                  <span>
                    {userNames[selectedNotification.createdByUserId] ||
                      "Unknown"}
                  </span>
                </div>

                <div className="info-item">
                  <label>Created At:</label>
                  <span>{selectedNotification.createdAt}</span>
                </div>

                {selectedNotification.status === "Sent" && (
                  <>
                    <div className="info-item">
                      <label>Sent To:</label>
                      <span>{selectedNotification.sentTo}</span>
                    </div>

                    <div className="info-item">
                      <label>Sent Date:</label>
                      <span>{selectedNotification.sentDate}</span>
                    </div>

                    <div className="info-item">
                      <label>Read Count:</label>
                      <span>{selectedNotification.reads}</span>
                    </div>
                  </>
                )}

                {selectedNotification.status === "Scheduled" && (
                  <div className="info-item">
                    <label>Next Send Date:</label>
                    <span>{selectedNotification.nextSend}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedNotification(null);
                }}
                className="close-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Notification Modal */}
      {isEditModalOpen && selectedNotification && (
        <div className="modal-overlay">
          <div className="modal notification-edit-modal">
            <button
              className="modal-close-btn"
              onClick={() => {
                setIsEditModalOpen(false);
                setIsCreateModalOpen(false);
                setSelectedNotification(null);
              }}
            >
              ×
            </button>
            <h2>
              {isCreateModalOpen
                ? "Create New Notification"
                : "Edit Notification"}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveNotification(selectedNotification);
              }}
            >
              <div className="form-group">
                <label htmlFor="notificationType">Notification Type</label>
                <select
                  id="notificationType"
                  value={selectedNotification.type || "System"}
                  onChange={(e) =>
                    setSelectedNotification({
                      ...selectedNotification,
                      type: e.target.value,
                    })
                  }
                  required
                >
                  <option value="System">System</option>
                  <option value="Reminder">Reminder</option>
                  <option value="Promotion">Promotion</option>
                  <option value="Update">Update</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notificationMessage">Message</label>
                <textarea
                  id="notificationMessage"
                  value={selectedNotification.message || ""}
                  onChange={(e) =>
                    setSelectedNotification({
                      ...selectedNotification,
                      message: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Enter notification message..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="notificationStatus">Status</label>
                <select
                  id="notificationStatus"
                  value={selectedNotification.status || "Draft"}
                  onChange={(e) =>
                    setSelectedNotification({
                      ...selectedNotification,
                      status: e.target.value,
                    })
                  }
                  required
                >
                  <option value="Draft">Draft</option>
                  <option value="Scheduled">Scheduled</option>
                  {!isCreateModalOpen && <option value="Sent">Sent</option>}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notificationFrequency">Frequency</label>
                <select
                  id="notificationFrequency"
                  value={selectedNotification.frequency || "One-time"}
                  onChange={(e) =>
                    setSelectedNotification({
                      ...selectedNotification,
                      frequency: e.target.value,
                    })
                  }
                  required
                >
                  <option value="One-time">One-time</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notificationSentTo">Recipients</label>
                <select
                  id="notificationSentTo"
                  value={selectedNotification.sentTo || "All Users"}
                  onChange={(e) =>
                    setSelectedNotification({
                      ...selectedNotification,
                      sentTo: e.target.value,
                    })
                  }
                >
                  <option value="All Users">All Users</option>
                  <option value="Premium Users">Premium Users</option>
                  <option value="Active Users">Active Users</option>
                  <option value="New Users">New Users</option>
                </select>
              </div>

              {selectedNotification.status === "Scheduled" && (
                <div className="form-group">
                  <label htmlFor="notificationNextSend">Next Send Date</label>
                  <input
                    type="date"
                    id="notificationNextSend"
                    value={
                      selectedNotification.nextSend ||
                      new Date().toISOString().split("T")[0]
                    }
                    onChange={(e) =>
                      setSelectedNotification({
                        ...selectedNotification,
                        nextSend: e.target.value,
                      })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    required={selectedNotification.status === "Scheduled"}
                  />
                </div>
              )}

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setIsCreateModalOpen(false);
                    setSelectedNotification(null);
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  {isCreateModalOpen ? "Create" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send New Notification Modal */}
      {isCreateModalOpen && !isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal notification-send-modal">
            <button
              className="modal-close-btn"
              onClick={() => {
                setIsCreateModalOpen(false);
                setSelectedNotification(null);
              }}
            >
              ×
            </button>
            <h2>Send New Notification</h2>

            <div className="notification-tabs">
              <button
                className={`notification-tab ${
                  selectedNotification && selectedNotification.id === "new"
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  const templateContent = document.querySelector(
                    ".template-selection"
                  );
                  const formContent = document.querySelector(
                    ".notification-send-modal form"
                  );

                  if (templateContent)
                    templateContent.classList.remove("animate-tab-content");
                  if (formContent)
                    formContent.className.remove("animate-tab-content");

                  void document.querySelector(".notification-send-modal")
                    .offsetWidth;

                  setSelectedNotification({
                    id: "new",
                    type: "System",
                    status: "Draft",
                    frequency: "One-time",
                  });

                  setTimeout(() => {
                    const formContent = document.querySelector(
                      ".notification-send-modal form"
                    );
                    if (formContent)
                      formContent.classList.add("animate-tab-content");
                  }, 0);
                }}
              >
                Create New
              </button>
              <button
                className={`notification-tab ${
                  !selectedNotification || selectedNotification.id !== "new"
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  const templateContent = document.querySelector(
                    ".template-selection"
                  );
                  const formContent = document.querySelector(
                    ".notification-send-modal form"
                  );

                  if (templateContent)
                    templateContent.classList.remove("animate-tab-content");
                  if (formContent)
                    formContent.classList.remove("animate-tab-content");

                  void document.querySelector(".notification-send-modal")
                    .offsetWidth;

                  setSelectedNotification(null);

                  setTimeout(() => {
                    const templateContent = document.querySelector(
                      ".template-selection"
                    );
                    if (templateContent)
                      templateContent.classList.add("animate-tab-content");
                  }, 0);
                }}
              >
                Use Template
              </button>
            </div>

            {!selectedNotification || selectedNotification.id !== "new" ? (
              <div className="template-selection animate-tab-content">
                <p className="template-instruction">
                  Select a notification template to use:
                </p>

                <div className="template-list">
                  {notifications
                    .filter((n) => n.status === "Draft" || n.status === "Sent")
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className={`template-item ${
                          selectedNotification?.id === notification.id
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedNotification({
                            ...notification,
                            id: "template-" + notification.id,
                            status: "Draft",
                            sentDate: null,
                            reads: null,
                          })
                        }
                      >
                        <div className="template-header">
                          <span
                            className={`notification-type ${notification.type.toLowerCase()}`}
                          >
                            {notification.type}
                          </span>
                        </div>
                        <p className="template-message">
                          {notification.message}
                        </p>
                        <div className="template-footer">
                          <span>
                            Recipients: {notification.sentTo || "All Users"}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>

                {selectedNotification && (
                  <div className="selected-template-form">
                    <div className="form-group">
                      <label htmlFor="notificationSentTo">Recipients</label>
                      <select
                        id="notificationSentTo"
                        value={selectedNotification.sentTo || "All Users"}
                        onChange={(e) =>
                          setSelectedNotification({
                            ...selectedNotification,
                            sentTo: e.target.value,
                          })
                        }
                      >
                        <option value="All Users">All Users</option>
                        <option value="Premium Users">Premium Users</option>
                        <option value="Active Users">Active Users</option>
                        <option value="New Users">New Users</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="sendNow">Delivery</label>
                      <div className="radio-options">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="sendNow"
                            checked={selectedNotification.status === "Sent"}
                            onChange={() =>
                              setSelectedNotification({
                                ...selectedNotification,
                                status: "Sent",
                              })
                            }
                          />
                          Send immediately
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="sendNow"
                            checked={
                              selectedNotification.status === "Scheduled"
                            }
                            onChange={() =>
                              setSelectedNotification({
                                ...selectedNotification,
                                status: "Scheduled",
                              })
                            }
                          />
                          Schedule for later
                        </label>
                      </div>
                    </div>

                    {selectedNotification.status === "Scheduled" && (
                      <div className="form-group">
                        <label htmlFor="notificationNextSend">
                          Schedule Date
                        </label>
                        <input
                          type="date"
                          id="notificationNextSend"
                          value={
                            selectedNotification.nextSend ||
                            new Date().toISOString().split("T")[0]
                          }
                          onChange={(e) =>
                            setSelectedNotification({
                              ...selectedNotification,
                              nextSend: e.target.value,
                            })
                          }
                          min={new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <form
                className="animate-tab-content"
                onSubmit={(e) => {
                  e.preventDefault();
                  const newNotif = {
                    ...selectedNotification,
                    id: notifications.length + 1,
                  };
                  handleSaveNotification(newNotif);
                }}
              >
                <div className="form-group">
                  <label htmlFor="notificationType">Notification Type</label>
                  <select
                    id="notificationType"
                    value={selectedNotification.type || "System"}
                    onChange={(e) =>
                      setSelectedNotification({
                        ...selectedNotification,
                        type: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="System">System</option>
                    <option value="Reminder">Reminder</option>
                    <option value="Promotion">Promotion</option>
                    <option value="Update">Update</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="notificationMessage">Message</label>
                  <textarea
                    id="notificationMessage"
                    value={selectedNotification.message || ""}
                    onChange={(e) =>
                      setSelectedNotification({
                        ...selectedNotification,
                        message: e.target.value,
                      })
                    }
                    rows={4}
                    placeholder="Enter notification message..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notificationSentTo">Recipients</label>
                  <select
                    id="notificationSentTo"
                    value={selectedNotification.sentTo || "All Users"}
                    onChange={(e) =>
                      setSelectedNotification({
                        ...selectedNotification,
                        sentTo: e.target.value,
                      })
                    }
                  >
                    <option value="All Users">All Users</option>
                    <option value="Premium Users">Premium Users</option>
                    <option value="Active Users">Active Users</option>
                    <option value="New Users">New Users</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="sendNow">Delivery</label>
                  <div className="radio-options">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="sendNow"
                        checked={selectedNotification.status === "Sent"}
                        onChange={() =>
                          setSelectedNotification({
                            ...selectedNotification,
                            status: "Sent",
                          })
                        }
                      />
                      Send immediately
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="sendNow"
                        checked={selectedNotification.status === "Scheduled"}
                        onChange={() =>
                          setSelectedNotification({
                            ...selectedNotification,
                            status: "Scheduled",
                          })
                        }
                      />
                      Schedule for later
                    </label>
                  </div>
                </div>

                {selectedNotification.status === "Scheduled" && (
                  <div className="form-group">
                    <label htmlFor="notificationNextSend">Schedule Date</label>
                    <input
                      type="date"
                      id="notificationNextSend"
                      value={
                        selectedNotification.nextSend ||
                        new Date().toISOString().split("T")[0]
                      }
                      onChange={(e) =>
                        setSelectedNotification({
                          ...selectedNotification,
                          nextSend: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                )}

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setSelectedNotification(null);
                    }}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>

                  <button type="submit" className="save-btn">
                    {selectedNotification.status === "Scheduled"
                      ? "Schedule"
                      : "Send Now"}
                  </button>
                </div>
              </form>
            )}

            {(!selectedNotification || selectedNotification.id !== "new") && (
              <div className="modal-footer">
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setSelectedNotification(null);
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    if (!selectedNotification) {
                      alert("Please select a template first");
                      return;
                    }

                    const newNotif = {
                      ...selectedNotification,
                      id: notifications.length + 1,
                    };

                    handleSaveNotification(newNotif);
                  }}
                  className="save-btn"
                  disabled={!selectedNotification}
                >
                  {selectedNotification?.status === "Scheduled"
                    ? "Schedule"
                    : "Send Now"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedNotification(null);
        }}
        onConfirm={handleDeleteConfirm}
        item={selectedNotification || {}}
        itemType="notification"
      />
    </div>
  );
};

export default NotificationManagement;
