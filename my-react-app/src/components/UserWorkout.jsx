"use client";

import { useState, useEffect } from "react";
import WorkoutCard from "./WorkoutCard";
import CreateWorkoutModal from "./CreateWorkoutModal";
import WorkoutDetailModal from "./WorkoutDetailModal";
import LogWorkoutModal from "./LogWorkoutModal";
import { Box, CssBaseline, ThemeProvider, createTheme, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getWorkouts, createWorkout, updateWorkout, deleteWorkout, getUserIdFromToken } from "../api";
import legs from "../assets/legday.jpg";
import MobileFooter from "./MobileFooter";
import SecondNavbar from "./SecondNavbar";
import ThemeToggle from "./ThemeToggle";

const UserWorkout = () => {
  const [workouts, setWorkouts] = useState([]);
  const [recommendedWorkouts, setRecommendedWorkouts] = useState([]);
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [notificationSettings, setNotificationSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    difficulty: "all",
    duration: "all",
    goal: "all",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });

  // Token initialization with correct key
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token") || "";
    console.log("Initial token during state initialization:", storedToken ? "Present" : "Missing");
    return storedToken;
  });

  // User ID extraction
  const [loggedInUserId, setLoggedInUserId] = useState(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const id = getUserIdFromToken(storedToken);
        console.log("Extracted userId during initialization:", id);
        return id ? String(id) : null;
      } catch (error) {
        console.error("Error getting user ID during state initialization:", error);
        return null;
      }
    }
    return null;
  });

  const navigate = useNavigate();

  // Theme handling
  useEffect(() => {
    const handleThemeChange = (e) => {
      if (e.detail) {
        setDarkMode(e.detail.theme === "dark");
      } else {
        const savedTheme = localStorage.getItem("theme");
        setDarkMode(savedTheme === "dark");
      }
    };

    const savedTheme = localStorage.getItem("theme");
    setDarkMode(savedTheme === "dark");

    document.addEventListener("themeChanged", handleThemeChange);
    window.addEventListener("storage", () => {
      const currentTheme = localStorage.getItem("theme");
      setDarkMode(currentTheme === "dark");
    });

    return () => {
      document.removeEventListener("themeChanged", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  const [darkMode, setDarkMode] = useState(false);

  const customTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: darkMode ? "#FFD700" : "#6200ea" },
      secondary: { main: darkMode ? "#DAA520" : "#3f51b5" },
      background: {
        default: darkMode ? "#121212" : "#f5f7fa",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#ffffff" : "rgba(0, 0, 0, 0.87)",
        secondary: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
      },
    },
  });

  // Fetch workouts
  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!token) {
        setSnackbar({ open: true, message: "Please log in to view workouts", severity: "error" });
        navigate("/login");
        return;
      }
      setLoading(true);
      try {
        const data = await getWorkouts(token);
        console.log("Fetched workouts raw data:", data);
        const transformed = data.map((w) => ({
          id: w.id,
          title: w.name,
          description: `${w.level} workout for ${w.timesPerWeek}x/week`,
          difficulty: w.level.toLowerCase(),
          duration: w.workoutExercises.length * 10,
          goal: "general fitness",
          exercises: w.workoutExercises.map((we) => ({
            id: we.exerciseId,
            name: we.exercise.name,
            sets: we.sets,
            reps: we.reps,
          })),
          isRecommended: w.premium,
          createdAt: w.createdAt,
          userId: w.createdByUser ? String(w.createdByUser) : null,
          src: legs,
        }));
        setRecommendedWorkouts(transformed.filter((w) => w.isRecommended));
        const userCreated = transformed.filter((w) => !w.isRecommended);
        setUserWorkouts(userCreated);
        setWorkouts(transformed);
        setFavorites([]);
      } catch (error) {
        console.error("Error fetching workouts:", error.message, error.stack);
        if (error.message.includes("401") || error.message.includes("403")) {
          setSnackbar({ open: true, message: "Session expired. Please log in again.", severity: "error" });
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setSnackbar({ open: true, message: "Failed to fetch workouts", severity: "error" });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, [token, navigate]);

  // Handle storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token") || "";
      console.log("Storage change detected - New token:", newToken);
      setToken(newToken);
      if (newToken) {
        try {
          const id = getUserIdFromToken(newToken);
          console.log("Storage change detected - New userId:", id);
          setLoggedInUserId(id ? String(id) : null);
        } catch (error) {
          console.error("Error extracting userId from token:", error);
        }
      } else {
        setLoggedInUserId(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Update user ID when token changes
  useEffect(() => {
    if (token) {
      try {
        const id = getUserIdFromToken(token);
        console.log("Updating userId from token:", id);
        if (id) {
          setLoggedInUserId(String(id));
        }
      } catch (error) {
        console.error("Error extracting userId from token:", error);
      }
    } else {
      setLoggedInUserId(null);
    }
  }, [token]);

  const isWorkoutOwner = (workout) => {
    if (!loggedInUserId || !workout?.userId) return false;
    return String(workout.userId) === String(loggedInUserId);
  };

  const filteredWorkouts = workouts.filter((workout) => {
    if (activeTab === "recommended" && !workout.isRecommended) return false;
    if (activeTab === "my-workouts" && workout.isRecommended) return false;
    if (activeTab === "favorites" && !favorites.includes(workout.id)) return false;

    if (
      searchTerm &&
      !workout.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !workout.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    if (filterOptions.difficulty !== "all" && workout.difficulty !== filterOptions.difficulty)
      return false;
    if (filterOptions.duration !== "all") {
      if (filterOptions.duration === "short" && workout.duration > 30) return false;
      if (filterOptions.duration === "medium" && (workout.duration <= 30 || workout.duration > 60))
        return false;
      if (filterOptions.duration === "long" && workout.duration <= 60) return false;
    }
    if (filterOptions.goal !== "all" && workout.goal !== filterOptions.goal) return false;

    return true;
  });

  const handleCreateWorkout = async (newWorkout) => {
    const currentToken = localStorage.getItem("token");
    let currentUserId = null;

    if (currentToken) {
      try {
        currentUserId = getUserIdFromToken(currentToken);
      } catch (error) {
        console.error("Error getting user ID for workout creation:", error);
      }
    }

    if (!currentToken || !currentUserId) {
      setSnackbar({ open: true, message: "You must be logged in to create workouts", severity: "error" });
      navigate("/login");
      return;
    }

    try {
      console.log("Creating new workout with userId:", currentUserId);
      const payload = {
        name: newWorkout.title,
        level: newWorkout.difficulty || "beginner",
        timesPerWeek: 3,
        workoutExercises: newWorkout.exercises.map((ex) => ({
          exerciseId: ex.id,
          sets: ex.sets || 3,
          reps: ex.reps || 10,
        })),
        createdByUser: parseInt(currentUserId),
        premium: false,
      };

      console.log("Sending workout payload:", payload);

      const response = await createWorkout(payload, currentToken);
      console.log("Create workout response:", response);

      const workoutWithId = {
        ...newWorkout,
        id: response.id,
        createdAt: response.createdAt || new Date().toISOString(),
        isRecommended: false,
        difficulty: newWorkout.difficulty || "beginner",
        duration: newWorkout.exercises.length * 10,
        goal: newWorkout.goal || "general fitness",
        userId: String(currentUserId),
        src: legs,
      };

      setUserWorkouts((prevWorkouts) => [...prevWorkouts, workoutWithId]);
      setWorkouts((prevWorkouts) => [...prevWorkouts, workoutWithId]);
      setShowCreateModal(false);
      setSnackbar({ open: true, message: "Workout created successfully!", severity: "success" });
    } catch (error) {
      console.error("Create workout error:", error);
      if (error.message.includes("401") || error.message.includes("403")) {
        setSnackbar({ open: true, message: "Session expired. Please log in again.", severity: "error" });
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setSnackbar({ open: true, message: error.message || "Failed to create workout", severity: "error" });
      }
    }
  };

  const handleEditWorkout = async (updatedWorkout) => {
    if (!isWorkoutOwner(updatedWorkout)) {
      console.error("Unauthorized: Cannot edit workout that belongs to another user", {
        loggedInUserId,
        workoutUserId: updatedWorkout.userId,
      });
      return;
    }

    try {
      console.log("Updating workout:", updatedWorkout);
      const response = await updateWorkout(
        updatedWorkout.id,
        {
          name: updatedWorkout.title,
          level: updatedWorkout.difficulty,
          timesPerWeek: 3,
          workoutExercises: updatedWorkout.exercises.map((ex) => ({
            exerciseId: ex.id,
            sets: ex.sets,
            reps: ex.reps,
          })),
          createdByUser: parseInt(loggedInUserId),
          premium: false,
        },
        token
      );

      const workoutWithId = {
        ...updatedWorkout,
        id: response.id,
        createdAt: response.createdAt || updatedWorkout.createdAt,
        isRecommended: false,
        difficulty: updatedWorkout.difficulty || "beginner",
        duration: updatedWorkout.exercises.length * 10,
        goal: updatedWorkout.goal || "general fitness",
        userId: String(loggedInUserId),
        src: updatedWorkout.src || legs,
      };

      const updatedUserWorkouts = userWorkouts.map((workout) =>
        workout.id === updatedWorkout.id ? workoutWithId : workout
      );

      setUserWorkouts(updatedUserWorkouts);
      setWorkouts([...recommendedWorkouts, ...updatedUserWorkouts]);
      setEditingWorkout(null);
      setShowCreateModal(false);
      setSnackbar({ open: true, message: "Workout updated successfully!", severity: "success" });
    } catch (error) {
      console.error("Error updating workout:", error.message, error.stack);
      setSnackbar({ open: true, message: error.message || "Failed to update workout", severity: "error" });
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    const workout = workouts.find((w) => w.id === workoutId);

    if (!workout) {
      console.error("Cannot delete: Workout not found");
      return;
    }

    if (!isWorkoutOwner(workout)) {
      console.error("Unauthorized: Cannot delete workout that belongs to another user", {
        loggedInUserId,
        workoutUserId: workout.userId,
      });
      return;
    }

    try {
      console.log("Deleting workout:", workoutId);
      await deleteWorkout(workoutId, token);

      const updatedUserWorkouts = userWorkouts.filter((w) => w.id !== workoutId);
      setUserWorkouts(updatedUserWorkouts);
      setWorkouts([...recommendedWorkouts, ...updatedUserWorkouts]);

      if (favorites.includes(workoutId)) {
        setFavorites(favorites.filter((id) => id !== workoutId));
      }

      if (selectedWorkout && selectedWorkout.id === workoutId) {
        setSelectedWorkout(null);
        setShowDetailModal(false);
      }
      setSnackbar({ open: true, message: "Workout deleted successfully!", severity: "success" });
    } catch (error) {
      console.error("Error deleting workout:", error.message, error.stack);
      setSnackbar({ open: true, message: error.message || "Failed to delete workout", severity: "error" });
    }
  };

  const handleDeleteFromEdit = (workoutId) => {
    console.log("Deleting workout from edit:", workoutId);
    handleDeleteWorkout(workoutId);
    setShowCreateModal(false);
    setEditingWorkout(null);
  };

  const handleLogWorkout = (workoutLog) => {
    const logWithId = {
      ...workoutLog,
      id: `log-${Date.now()}`,
      date: new Date().toISOString(),
    };

    setWorkoutLogs([logWithId, ...workoutLogs]);
    setShowLogModal(false);
    setSnackbar({ open: true, message: "Workout logged successfully!", severity: "success" });
  };

  const toggleFavorite = (workoutId) => {
    if (favorites.includes(workoutId)) {
      setFavorites(favorites.filter((id) => id !== workoutId));
    } else {
      setFavorites([...favorites, workoutId]);
    }
  };

  const toggleNotification = (workoutId) => {
    setNotificationSettings({
      ...notificationSettings,
      [workoutId]: !notificationSettings[workoutId],
    });
  };

  const openWorkoutDetail = (workout) => {
    setSelectedWorkout(workout);
    setShowDetailModal(true);
  };

  const startEditWorkout = (workout) => {
    if (!isWorkoutOwner(workout)) {
      console.error("Unauthorized: Cannot edit this workout", {
        loggedInUserId,
        workoutUserId: workout.userId,
        tokenPresent: !!token,
      });
      setSnackbar({ open: true, message: "You can only edit your own workouts", severity: "error" });
      return;
    }

    console.log("Starting edit for workout:", workout);
    const workoutToEdit = {
      ...workout,
      exercises: workout.exercises.map((ex) => ({ ...ex })),
    };

    setEditingWorkout(workoutToEdit);
    setShowCreateModal(true);
  };

  const startLogWorkout = (workout) => {
    setSelectedWorkout(workout);
    setShowLogModal(true);
  };

  const handleFilterChange = (filterType, value) => {
    setFilterOptions({
      ...filterOptions,
      [filterType]: value,
    });
  };

  const getWorkoutLogs = (workoutId) => {
    return workoutLogs.filter((log) => log.workoutId === workoutId);
  };

  const handleCreateNewWorkout = () => {
    const currentToken = localStorage.getItem("token");
    let currentUserId = null;

    if (currentToken) {
      try {
        currentUserId = getUserIdFromToken(currentToken);
      } catch (error) {
        console.error("Error getting user ID for workout creation:", error);
      }
    }

    console.log("Create workout attempt - Token:", currentToken ? "Present" : "Missing");
    console.log("Create workout attempt - UserId:", currentUserId);

    if (!currentToken || !currentUserId) {
      setSnackbar({ open: true, message: "Please log in to create a workout", severity: "error" });
      navigate("/login");
      return;
    }

    if (currentToken !== token) {
      setToken(currentToken);
    }

    if (String(currentUserId) !== loggedInUserId) {
      setLoggedInUserId(String(currentUserId));
    }

    setEditingWorkout(null);
    setShowCreateModal(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: darkMode
            ? "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)"
            : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          color: darkMode ? "#ffffff" : "inherit",
          transition: "background 0.3s ease, color 0.3s ease",
        }}
      >
        <SecondNavbar />
        <Box sx={{ paddingTop: "80px" }}>
          <div className={`workout-container ${darkMode ? "dark-mode" : ""}`}>
            <div className={`workout-search-filter ${darkMode ? "dark-mode" : ""}`}>
              <div className={`search-container ${darkMode ? "dark-mode" : ""}`}>
                <div className={`search-bar ${darkMode ? "dark-mode" : ""}`}>
                  <div className="search-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={darkMode ? "#000" : "currentColor"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                  <div className="search-input-container">
                    <input
                      type="text"
                      placeholder="Search workouts"
                      className={`search-input ${darkMode ? "dark-mode" : ""}`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        color: darkMode ? "#ffffff" : "inherit",
                        background: darkMode ? "#1e1e1e" : "white",
                      }}
                    />
                    <button
                      className="create-workout-button"
                      onClick={handleCreateNewWorkout}
                      disabled={!token || !loggedInUserId}
                      style={{
                        background: darkMode ? "#FFD700" : "#6200ea",
                        color: darkMode ? "#121212" : "white",
                        opacity: !token || !loggedInUserId ? 0.5 : 1,
                        cursor: !token || !loggedInUserId ? "not-allowed" : "pointer",
                      }}
                      title={
                        !token || !loggedInUserId
                          ? "Please log in to create a workout"
                          : "Create a new workout"
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Create Workout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="filter-container">
              <div className="filter-group">
                <label>Difficulty:</label>
                <select
                  value={filterOptions.difficulty}
                  onChange={(e) => handleFilterChange("difficulty", e.target.value)}
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Duration:</label>
                <select
                  value={filterOptions.duration}
                  onChange={(e) => handleFilterChange("duration", e.target.value)}
                >
                  <option value="all">Any Duration</option>
                  <option value="short">Short (≤ 30 min)</option>
                  <option value="medium">Medium (31-60 min)</option>
                  <option value="long">Long (60 min)</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Goal:</label>
                <select
                  value={filterOptions.goal}
                  onChange={(e) => handleFilterChange("goal", e.target.value)}
                >
                  <option value="all">All Goals</option>
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="general fitness">General Fitness</option>
                </select>
              </div>
            </div>
          </div>

          <div className="workout-tabs">
            <button
              className={`tab-button ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Workouts
            </button>
            <button
              className={`tab-button ${activeTab === "recommended" ? "active" : ""}`}
              onClick={() => setActiveTab("recommended")}
            >
              Recommended
            </button>
            <button
              className={`tab-button ${activeTab === "my-workouts" ? "active" : ""}`}
              onClick={() => setActiveTab("my-workouts")}
            >
              My Workouts
            </button>
            <button
              className={`tab-button ${activeTab === "favorites" ? "active" : ""}`}
              onClick={() => setActiveTab("favorites")}
            >
              Favorites
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div className="workouts-grid">
              {filteredWorkouts.length > 0 ? (
                filteredWorkouts.map((workout, index) => {
                  const isOwner = isWorkoutOwner(workout);
                  return (
                    <WorkoutCard
                      key={workout.id}
                      workout={workout}
                      isFavorite={favorites.includes(workout.id)}
                      hasNotification={notificationSettings[workout.id]}
                      onToggleFavorite={() => toggleFavorite(workout.id)}
                      onToggleNotification={() => toggleNotification(workout.id)}
                      onClick={() => openWorkoutDetail(workout)}
                      onEdit={isOwner ? () => startEditWorkout(workout) : null}
                      onLog={() => startLogWorkout(workout)}
                      logs={getWorkoutLogs(workout.id)}
                      style={{ animationDelay: `${0.1 * (index % 10)}s` }}
                      isOwned={isOwner}
                    />
                  );
                })
              ) : (
                <div
                  className="no-results"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    width: "100%",
                    minHeight: "200px",
                    padding: "2rem",
                    gridColumn: "1 / -1",
                  }}
                >
                  <h3>No workouts found</h3>
                  <p>Try adjusting your filters or create a new workout</p>
                </div>
              )}
            </div>
          )}

          {showCreateModal && (
            <CreateWorkoutModal
              onClose={() => {
                setShowCreateModal(false);
                setEditingWorkout(null);
              }}
              onSave={editingWorkout ? handleEditWorkout : handleCreateWorkout}
              onDelete={
                editingWorkout && loggedInUserId && token && editingWorkout.userId === loggedInUserId
                  ? () => handleDeleteFromEdit(editingWorkout.id)
                  : null
              }
              workout={editingWorkout}
            />
          )}

          {showDetailModal && selectedWorkout && (
            <WorkoutDetailModal
              workout={selectedWorkout}
              onClose={() => setShowDetailModal(false)}
              isFavorite={favorites.includes(selectedWorkout.id)}
              hasNotification={notificationSettings[selectedWorkout.id]}
              onToggleFavorite={() => toggleFavorite(selectedWorkout.id)}
              onToggleNotification={() => toggleNotification(selectedWorkout.id)}
              onEdit={
                loggedInUserId && token && selectedWorkout.userId === loggedInUserId
                  ? () => {
                      console.log("Opening edit modal for workout:", selectedWorkout);
                      setShowDetailModal(false);
                      startEditWorkout(selectedWorkout);
                    }
                  : null
              }
              onDelete={
                loggedInUserId && token && selectedWorkout.userId === loggedInUserId
                  ? () => {
                      console.log("Deleting workout from detail modal:", selectedWorkout.id);
                      handleDeleteWorkout(selectedWorkout.id);
                      setShowDetailModal(false);
                    }
                  : null
              }
              onLog={() => startLogWorkout(selectedWorkout)}
              logs={getWorkoutLogs(selectedWorkout.id)}
              token={token}
            />
          )}

          {showLogModal && selectedWorkout && (
            <LogWorkoutModal
              workout={selectedWorkout}
              onClose={() => setShowLogModal(false)}
              onSave={handleLogWorkout}
            />
          )}
          <ThemeToggle />
          <MobileFooter />
        </Box>
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default UserWorkout;