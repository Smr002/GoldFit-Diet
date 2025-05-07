"use client";

import { useState, useEffect } from "react";
import WorkoutCard from "./WorkoutCard";
import CreateWorkoutModal from "./CreateWorkoutModal";
import WorkoutDetailModal from "./WorkoutDetailModal";
import LogWorkoutModal from "./LogWorkoutModal";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getUserIdFromToken,
} from "../api";
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Token and user ID initialization
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [loggedInUserId, setLoggedInUserId] = useState(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        return String(getUserIdFromToken(storedToken)) || null;
      } catch (error) {
        console.error("Error getting user ID:", error);
        return null;
      }
    }
    return null;
  });

  // Theme handling
  const customTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#FFD700" : "#6200ea",
        dark: darkMode ? "#E1C000" : "#5000d0",
        light: darkMode ? "#FFF176" : "#7c43e0",
      },
      secondary: {
        main: darkMode ? "#00E5FF" : "#3f51b5",
        dark: darkMode ? "#00B8D4" : "#303f9f",
        light: darkMode ? "#84FFFF" : "#7986cb",
      },
      background: {
        default: darkMode ? "#121212" : "#f5f7fa",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
        card: darkMode ? "#252525" : "#ffffff",
        elevated: darkMode ? "#2d2d2d" : "#f0f0f0",
      },
      text: {
        primary: darkMode ? "#ffffff" : "rgba(0, 0, 0, 0.87)",
        secondary: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
      },
      divider: darkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? "#252525" : "#ffffff",
            transition: "background-color 0.3s ease, box-shadow 0.3s ease",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: darkMode
              ? "0 4px 6px rgba(0, 0, 0, 0.4)"
              : "0 2px 4px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              boxShadow: darkMode
                ? "0 6px 8px rgba(0, 0, 0, 0.5)"
                : "0 4px 8px rgba(0, 0, 0, 0.15)",
              transform: "translateY(-2px)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: "background-color 0.3s ease",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: darkMode ? "#252525" : "#ffffff",
            boxShadow: darkMode
              ? "0 8px 32px rgba(0, 0, 0, 0.5)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
  });

  // Theme effect
  useEffect(() => {
    const handleThemeChange = (e) => {
      setDarkMode(
        e.detail?.theme === "dark" || localStorage.getItem("theme") === "dark"
      );
    };

    setDarkMode(localStorage.getItem("theme") === "dark");
    document.addEventListener("themeChanged", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);
    return () => {
      document.removeEventListener("themeChanged", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  // Fetch workouts
  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!token) {
        setSnackbar({
          open: true,
          message: "Please log in to view workouts",
          severity: "error",
        });
        navigate("/login");
        return;
      }
      setLoading(true);
      try {
        const data = await getWorkouts(token);
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
        setUserWorkouts(transformed.filter((w) => !w.isRecommended));
        setWorkouts(transformed);
        setFavorites([]);
      } catch (error) {
        console.error("Error fetching workouts:", error);
        if (error.message.includes("401") || error.message.includes("403")) {
          setSnackbar({
            open: true,
            message: "Session expired. Please log in again.",
            severity: "error",
          });
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setSnackbar({
            open: true,
            message: "Failed to fetch workouts",
            severity: "error",
          });
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
      setToken(newToken);
      if (newToken) {
        try {
          const id = getUserIdFromToken(newToken);
          setLoggedInUserId(id ? String(id) : null);
        } catch (error) {
          console.error("Error extracting userId:", error);
        }
      } else {
        setLoggedInUserId(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Update user ID
  useEffect(() => {
    if (token) {
      try {
        const id = getUserIdFromToken(token);
        setLoggedInUserId(id ? String(id) : null);
      } catch (error) {
        console.error("Error extracting userId:", error);
      }
    } else {
      setLoggedInUserId(null);
    }
  }, [token]);

  const isWorkoutOwner = (workout) => {
    return (
      loggedInUserId &&
      workout?.userId &&
      String(workout.userId) === String(loggedInUserId)
    );
  };

  const filteredWorkouts = workouts.filter((workout) => {
    if (activeTab === "recommended" && !workout.isRecommended) return false;
    if (activeTab === "my-workouts" && workout.isRecommended) return false;
    if (activeTab === "favorites" && !favorites.includes(workout.id))
      return false;

    if (
      searchTerm &&
      !workout.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !workout.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    if (
      filterOptions.difficulty !== "all" &&
      workout.difficulty !== filterOptions.difficulty
    )
      return false;
    if (filterOptions.duration !== "all") {
      if (filterOptions.duration === "short" && workout.duration > 30)
        return false;
      if (
        filterOptions.duration === "medium" &&
        (workout.duration <= 30 || workout.duration > 60)
      )
        return false;
      if (filterOptions.duration === "long" && workout.duration <= 60)
        return false;
    }
    if (filterOptions.goal !== "all" && workout.goal !== filterOptions.goal)
      return false;

    return true;
  });

  const handleCreateWorkout = async (newWorkout) => {
    const currentToken = localStorage.getItem("token");
    const currentUserId = currentToken
      ? getUserIdFromToken(currentToken)
      : null;

    if (!currentToken || !currentUserId) {
      setSnackbar({
        open: true,
        message: "You must be logged in to create workouts",
        severity: "error",
      });
      navigate("/login");
      return;
    }

    try {
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

      const response = await createWorkout(payload, currentToken);
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

      setUserWorkouts((prev) => [...prev, workoutWithId]);
      setWorkouts((prev) => [...prev, workoutWithId]);
      setShowCreateModal(false);
      setSnackbar({
        open: true,
        message: "Workout created successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Create workout error:", error);
      if (error.message.includes("401") || error.message.includes("403")) {
        setSnackbar({
          open: true,
          message: "Session expired. Please log in again.",
          severity: "error",
        });
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setSnackbar({
          open: true,
          message: error.message || "Failed to create workout",
          severity: "error",
        });
      }
    }
  };

  const handleEditWorkout = async (updatedWorkout) => {
    if (!isWorkoutOwner(updatedWorkout)) return;

    try {
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

      const updatedUserWorkouts = userWorkouts.map((w) =>
        w.id === updatedWorkout.id ? workoutWithId : w
      );
      setUserWorkouts(updatedUserWorkouts);
      setWorkouts([...recommendedWorkouts, ...updatedUserWorkouts]);
      setEditingWorkout(null);
      setShowCreateModal(false);
      setSnackbar({
        open: true,
        message: "Workout updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating workout:", error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to update workout",
        severity: "error",
      });
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    const workout = workouts.find((w) => w.id === workoutId);
    if (!workout || !isWorkoutOwner(workout)) return;

    try {
      await deleteWorkout(workoutId, token);
      const updatedUserWorkouts = userWorkouts.filter(
        (w) => w.id !== workoutId
      );
      setUserWorkouts(updatedUserWorkouts);
      setWorkouts([...recommendedWorkouts, ...updatedUserWorkouts]);
      setFavorites(favorites.filter((id) => id !== workoutId));
      if (selectedWorkout?.id === workoutId) {
        setSelectedWorkout(null);
        setShowDetailModal(false);
      }
      setSnackbar({
        open: true,
        message: "Workout deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting workout:", error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to delete workout",
        severity: "error",
      });
    }
  };

  const handleDeleteFromEdit = (workoutId) => {
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
    setSnackbar({
      open: true,
      message: "Workout logged successfully!",
      severity: "success",
    });
  };

  const toggleFavorite = (workoutId) => {
    setFavorites((prev) =>
      prev.includes(workoutId)
        ? prev.filter((id) => id !== workoutId)
        : [...prev, workoutId]
    );
  };

  const toggleNotification = (workoutId) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [workoutId]: !prev[workoutId],
    }));
  };

  const openWorkoutDetail = (workout) => {
    setSelectedWorkout(workout);
    setShowDetailModal(true);
  };

  const startEditWorkout = (workout) => {
    if (!isWorkoutOwner(workout)) {
      setSnackbar({
        open: true,
        message: "You can only edit your own workouts",
        severity: "error",
      });
      return;
    }
    setEditingWorkout({
      ...workout,
      exercises: workout.exercises.map((ex) => ({ ...ex })),
    });
    setShowCreateModal(true);
  };

  const startLogWorkout = (workout) => {
    setSelectedWorkout(workout);
    setShowLogModal(true);
  };

  const handleFilterChange = (filterType, value) => {
    setFilterOptions((prev) => ({ ...prev, [filterType]: value }));
  };

  const getWorkoutLogs = (workoutId) => {
    return workoutLogs.filter((log) => log.workoutId === workoutId);
  };

  const handleCreateNewWorkout = () => {
    const currentToken = localStorage.getItem("token");
    const currentUserId = currentToken
      ? getUserIdFromToken(currentToken)
      : null;

    if (!currentToken || !currentUserId) {
      setSnackbar({
        open: true,
        message: "Please log in to create a workout",
        severity: "error",
      });
      navigate("/login");
      return;
    }

    setEditingWorkout(null);
    setShowCreateModal(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
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
        <Box
          sx={{
            paddingTop: "80px",
            px: { xs: 2, sm: 4 },
            transition:
              "background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease, border 0.3s ease",
          }}
        >
          <div
            className={`workout-container ${darkMode ? "dark-mode" : ""}`}
            style={{
              transition:
                "background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease, border 0.3s ease",
            }}
          >
            <div
              className={`workout-search-filter ${darkMode ? "dark-mode" : ""}`}
              style={{
                transition:
                  "background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease, border 0.3s ease",
              }}
            >
              <div
                className="search-container"
                style={{
                  marginBottom: "24px",
                  width: "100%",
                  maxWidth: "1200px",
                  margin: "0 auto",
                  transition:
                    "background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease, border 0.3s ease",
                  padding: "0 8px",
                }}
              >
                <div
                  className={`search-bar ${darkMode ? "dark-mode" : ""}`}
                  style={{
                    boxShadow: darkMode
                      ? "0 8px 16px rgba(0, 0, 0, 0.3)"
                      : "0 6px 16px rgba(0, 0, 0, 0.08)",
                    background: darkMode
                      ? "rgba(37, 37, 37, 0.8)"
                      : "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: window.innerWidth < 600 ? "column" : "row", // Stack on mobile
                    alignItems: "center",
                    padding: window.innerWidth < 600 ? "12px" : "8px 16px",
                    border: darkMode
                      ? "1px solid rgba(255, 255, 255, 0.1)"
                      : "1px solid rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div
                    className="search-input-wrapper"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      marginBottom: window.innerWidth < 600 ? "12px" : "0",
                    }}
                  >
                    <div
                      className="search-icon"
                      style={{
                        color: darkMode ? "#FFD700" : "#6200ea",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "8px",
                        transition: "color 0.3s ease",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={window.innerWidth < 600 ? "20" : "22"}
                        height={window.innerWidth < 600 ? "20" : "22"}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search for workouts..."
                      className={`search-input ${darkMode ? "dark-mode" : ""}`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        color: darkMode ? "#ffffff" : "#333333",
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        fontSize: window.innerWidth < 600 ? "15px" : "16px",
                        fontWeight: "500",
                        width: "100%",
                        padding: "12px 4px",
                        flex: "1",
                        transition: "color 0.3s ease",
                      }}
                    />
                  </div>

                  <button
                    className="create-workout-button"
                    onClick={handleCreateNewWorkout}
                    disabled={!token || !loggedInUserId}
                    style={{
                      background: darkMode
                        ? "linear-gradient(45deg, #FFD700 0%, #FFC107 100%)"
                        : "linear-gradient(45deg, #6200ea 0%, #7c43e0 100%)",
                      color: darkMode ? "#121212" : "white",
                      opacity: !token || !loggedInUserId ? 0.5 : 1,
                      cursor:
                        !token || !loggedInUserId ? "not-allowed" : "pointer",
                      borderRadius: "12px",
                      padding:
                        window.innerWidth < 400 ? "10px 16px" : "12px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      fontWeight: "600",
                      border: "none",
                      boxShadow: darkMode
                        ? "0 4px 12px rgba(255, 215, 0, 0.3)"
                        : "0 4px 12px rgba(98, 0, 234, 0.3)",
                      transition: "all 0.3s ease",
                      fontSize: window.innerWidth < 400 ? "14px" : "15px",
                      letterSpacing: "0.3px",
                      whiteSpace: "nowrap",
                      width: window.innerWidth < 600 ? "100%" : "auto",
                      animation:
                        token && loggedInUserId ? "pulse 2s infinite" : "none",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={window.innerWidth < 400 ? "16" : "18"}
                      height={window.innerWidth < 400 ? "16" : "18"}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    {window.innerWidth < 400 ? "Create" : "Create Workout"}
                  </button>
                </div>
              </div>

              {/* Add React useEffect to handle window resize */}
              <style>
                {`
                  @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                  }
                  @media (max-width: 600px) {
                    .search-bar {
                      flex-direction: column !important;
                      padding: 12px !important;
                    }
                    .search-input-wrapper {
                      margin-bottom: 12px !important;
                      width: 100% !important;
                    }
                    .create-workout-button {
                      width: 100% !important;
                    }
                  }
                  @media (max-width: 400px) {
                    .create-workout-button {
                      padding: 10px 16px !important;
                      font-size: 14px !important;
                    }
                    .search-icon svg {
                      width: 20px !important;
                      height: 20px !important;
                    }
                    .search-input {
                      font-size: 15px !important;
                    }
                  }
                `}
              </style>
            </div>
            <div
              className="filter-container"
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "20px auto 30px",
                padding: "0 20px",
                maxWidth: "1200px",
                position: "relative",
                zIndex: "1",
                width: "100%",
                transition: "all 0.3s ease",
              }}
            >
              <div
                className="filter-wrapper"
                style={{
                  background: darkMode
                    ? "rgba(45, 45, 45, 0.8)"
                    : "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "14px",
                  padding: "16px 24px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  justifyContent: "center",
                  width: "100%",
                  boxShadow: darkMode
                    ? "0 6px 16px rgba(0, 0, 0, 0.3)"
                    : "0 6px 16px rgba(0, 0, 0, 0.08)",
                  border: darkMode
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(0, 0, 0, 0.05)",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  className="filter-group"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition:
                      "background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease, border 0.3s ease",
                  }}
                >
                  <label
                    style={{
                      color: darkMode ? "#FFD700" : "#6200ea",
                      fontWeight: "600",
                      fontSize: "15px",
                      transition:
                        "background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease, border 0.3s ease",
                    }}
                  >
                    Difficulty:
                  </label>
                  <select
                    value={filterOptions.difficulty}
                    onChange={(e) =>
                      handleFilterChange("difficulty", e.target.value)
                    }
                    style={{
                      backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
                      color: darkMode ? "#ffffff" : "#333333",
                      border: darkMode ? "1px solid #444" : "1px solid #e0e0e0",
                      borderRadius: "10px",
                      padding: "10px 16px",
                      paddingRight: "36px",
                      fontSize: "14px",
                      fontWeight: "500",
                      outline: "none",
                      cursor: "pointer",
                      boxShadow: darkMode
                        ? "0 2px 8px rgba(0, 0, 0, 0.3)"
                        : "0 1px 3px rgba(0, 0, 0, 0.08)",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22${
                        darkMode ? "%23FFD700" : "%236200ea"
                      }%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px top 50%",
                      backgroundSize: "12px auto",
                      transition:
                        "background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease, border 0.3s ease",
                    }}
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div
                  className="filter-group"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition:
                      "background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease, border 0.3s ease",
                  }}
                >
                  <label
                    style={{
                      color: darkMode ? "#FFD700" : "#6200ea",
                      fontWeight: "600",
                      fontSize: "15px",
                      transition:
                        "background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease, border 0.3s ease",
                    }}
                  >
                    Duration:
                  </label>
                  <select
                    value={filterOptions.duration}
                    onChange={(e) =>
                      handleFilterChange("duration", e.target.value)
                    }
                    style={{
                      backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
                      color: darkMode ? "#ffffff" : "#333333",
                      border: darkMode ? "1px solid #444" : "1px solid #e0e0e0",
                      borderRadius: "10px",
                      padding: "10px 16px",
                      paddingRight: "36px",
                      fontSize: "14px",
                      fontWeight: "500",
                      outline: "none",
                      cursor: "pointer",
                      boxShadow: darkMode
                        ? "0 2px 8px rgba(0, 0, 0, 0.3)"
                        : "0 1px 3px rgba(0, 0, 0, 0.08)",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22${
                        darkMode ? "%23FFD700" : "%236200ea"
                      }%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px top 50%",
                      backgroundSize: "12px auto",
                      transition:
                        "background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease, border 0.3s ease",
                    }}
                  >
                    <option value="all">Any Duration</option>
                    <option value="short">Short (≤ 30 min)</option>
                    <option value="medium">Medium (31-60 min)</option>
                    <option value="long">Long (≥ 60 min)</option>
                  </select>
                </div>

                <div
                  className="filter-group"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition:
                      "background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease, border 0.3s ease",
                  }}
                >
                  <label
                    style={{
                      color: darkMode ? "#FFD700" : "#6200ea",
                      fontWeight: "600",
                      fontSize: "15px",
                      transition:
                        "background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease, border 0.3s ease",
                    }}
                  >
                    Goal:
                  </label>
                  <select
                    value={filterOptions.goal}
                    onChange={(e) => handleFilterChange("goal", e.target.value)}
                    style={{
                      backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
                      color: darkMode ? "#ffffff" : "#333333",
                      border: darkMode ? "1px solid #444" : "1px solid #e0e0e0",
                      borderRadius: "10px",
                      padding: "10px 16px",
                      paddingRight: "36px",
                      fontSize: "14px",
                      fontWeight: "500",
                      outline: "none",
                      cursor: "pointer",
                      boxShadow: darkMode
                        ? "0 2px 8px rgba(0, 0, 0, 0.3)"
                        : "0 1px 3px rgba(0, 0, 0, 0.08)",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22${
                        darkMode ? "%23FFD700" : "%236200ea"
                      }%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px top 50%",
                      backgroundSize: "12px auto",
                      transition:
                        "background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease, border 0.3s ease",
                    }}
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
          </div>
          <div
            className="workout-tabs"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
              transition: "all 0.3s ease",
              position: "relative",
              maxWidth: "1200px",
              margin: "20px auto 30px",
              padding: "0 20px",
            }}
          >
            {["all", "recommended", "my-workouts", "favorites"].map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "12px 20px",
                  borderRadius: "10px",
                  background:
                    activeTab === tab
                      ? darkMode
                        ? "linear-gradient(45deg, #FFD700 0%, #FFC107 100%)"
                        : "linear-gradient(45deg, #6200ea 0%, #7c43e0 100%)"
                      : darkMode
                      ? "rgba(45, 45, 45, 0.7)"
                      : "rgba(255, 255, 255, 0.7)",
                  color:
                    activeTab === tab
                      ? darkMode
                        ? "#121212"
                        : "#ffffff"
                      : darkMode
                      ? "#ffffff"
                      : "#333333",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  boxShadow:
                    activeTab === tab
                      ? darkMode
                        ? "0 4px 12px rgba(255, 215, 0, 0.3)"
                        : "0 4px 12px rgba(98, 0, 234, 0.3)"
                      : "none",
                  margin: "4px",
                  position: "relative",
                  borderBottom:
                    !darkMode && activeTab !== tab
                      ? "3px solid rgba(98, 0, 234, 0.1)"
                      : activeTab === tab
                      ? "none"
                      : "3px solid transparent",
                }}
                onMouseOver={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = darkMode
                      ? "0 4px 10px rgba(0, 0, 0, 0.3)"
                      : "0 4px 10px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.background = darkMode
                      ? "rgba(55, 55, 55, 0.8)"
                      : "rgba(245, 245, 245, 0.9)";

                    if (!darkMode) {
                      e.currentTarget.style.borderBottom =
                        "3px solid rgba(98, 0, 234, 0.3)";
                    }
                  } else {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = darkMode
                      ? "0 6px 14px rgba(255, 215, 0, 0.4)"
                      : "0 6px 14px rgba(98, 0, 234, 0.4)";
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background = darkMode
                      ? "rgba(45, 45, 45, 0.7)"
                      : "rgba(255, 255, 255, 0.7)";

                    if (!darkMode) {
                      e.currentTarget.style.borderBottom =
                        "3px solid rgba(98, 0, 234, 0.1)";
                    }
                  } else {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = darkMode
                      ? "0 4px 12px rgba(255, 215, 0, 0.3)"
                      : "0 4px 12px rgba(98, 0, 234, 0.3)";
                  }
                }}
              >
                {tab === "all" && "All Workouts"}
                {tab === "recommended" && "Recommended"}
                {tab === "my-workouts" && "My Workouts"}
                {tab === "favorites" && "Favorites"}
              </button>
            ))}

            {!darkMode && (
              <div
                style={{
                  position: "absolute",
                  bottom: "3px",
                  left: "20px",
                  right: "20px",
                  height: "3px",
                  background: "rgba(98, 0, 234, 0.05)",
                  borderRadius: "1.5px",
                  zIndex: "-1",
                }}
              />
            )}
          </div>

          {loading ? (
            <div
              className="loading-container"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "300px",
                width: "100%",
              }}
            >
              <div
                className="loading-spinner"
                style={{
                  width: "50px",
                  height: "50px",
                  border: `4px solid ${
                    darkMode
                      ? "rgba(255, 215, 0, 0.3)"
                      : "rgba(98, 0, 234, 0.3)"
                  }`,
                  borderTop: `4px solid ${darkMode ? "#FFD700" : "#6200ea"}`,
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
            </div>
          ) : (
            <div
              className="workouts-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px",
                padding: "0 20px 40px",
                maxWidth: "1200px",
                margin: "0 auto",
                transition: "all 0.3s ease",
              }}
            >
              {filteredWorkouts.length > 0 ? (
                filteredWorkouts.map((workout, index) => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    isFavorite={favorites.includes(workout.id)}
                    hasNotification={notificationSettings[workout.id]}
                    onToggleFavorite={() => toggleFavorite(workout.id)}
                    onToggleNotification={() => toggleNotification(workout.id)}
                    onClick={() => openWorkoutDetail(workout)}
                    onEdit={
                      isWorkoutOwner(workout)
                        ? () => startEditWorkout(workout)
                        : null
                    }
                    onLog={() => startLogWorkout(workout)}
                    logs={getWorkoutLogs(workout.id)}
                    style={{
                      animationDelay: `${0.1 * (index % 10)}s`,
                      transition: "all 0.3s ease",
                      transform: "translateY(0)",
                      cursor: "pointer",
                      ":hover": {
                        transform: "translateY(-8px)",
                        boxShadow: darkMode
                          ? "0 12px 24px rgba(0, 0, 0, 0.4)"
                          : "0 12px 24px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                    isOwned={isWorkoutOwner(workout)}
                  />
                ))
              ) : (
                <div
                  className="no-results"
                  style={{
                    gridColumn: "1 / -1",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    minHeight: "200px",
                    padding: "3rem",
                    color: darkMode ? "#ffffff" : "#333333",
                    background: darkMode
                      ? "rgba(45, 45, 45, 0.7)"
                      : "rgba(255, 255, 255, 0.7)",
                    borderRadius: "16px",
                    backdropFilter: "blur(8px)",
                    boxShadow: darkMode
                      ? "0 8px 16px rgba(0, 0, 0, 0.2)"
                      : "0 8px 16px rgba(0, 0, 0, 0.05)",
                    border: darkMode
                      ? "1px solid rgba(255, 255, 255, 0.1)"
                      : "1px solid rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                    margin: "20px auto",
                    maxWidth: "800px",
                    width: "calc(100% - 48px)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={darkMode ? "#FFD700" : "#6200ea"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginBottom: "20px", opacity: 0.8 }}
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  <h3
                    style={{
                      fontSize: "24px",
                      marginBottom: "12px",
                      color: darkMode ? "#FFD700" : "#6200ea",
                    }}
                  >
                    No workouts found
                  </h3>
                  <p
                    style={{
                      fontSize: "16px",
                      opacity: 0.8,
                      maxWidth: "400px",
                      lineHeight: "1.5",
                    }}
                  >
                    Try adjusting your filters or create a new workout
                  </p>
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
                editingWorkout && isWorkoutOwner(editingWorkout)
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
              onToggleNotification={() =>
                toggleNotification(selectedWorkout.id)
              }
              onEdit={
                isWorkoutOwner(selectedWorkout)
                  ? () => {
                      setShowDetailModal(false);
                      startEditWorkout(selectedWorkout);
                    }
                  : null
              }
              onDelete={
                isWorkoutOwner(selectedWorkout)
                  ? () => handleDeleteWorkout(selectedWorkout.id)
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
              token={token}
            />
          )}

          <ThemeToggle />
          <MobileFooter />
        </Box>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{
            vertical: snackbar.severity === "success" ? "bottom" : "top",
            horizontal: snackbar.severity === "success" ? "right" : "center",
          }}
          sx={{
            "& .MuiAlert-root": {
              backdropFilter: "blur(10px)",
              background: darkMode
                ? "rgba(45, 45, 45, 0.9)"
                : "rgba(255, 255, 255, 0.9)",
              borderLeft: `4px solid ${
                snackbar.severity === "success"
                  ? "#4caf50"
                  : snackbar.severity === "error"
                  ? "#f44336"
                  : snackbar.severity === "warning"
                  ? "#ff9800"
                  : "#2196f3"
              }`,
              color: darkMode ? "#ffffff" : "#333333",
              boxShadow: darkMode
                ? "0 4px 20px rgba(0, 0, 0, 0.5)"
                : "0 4px 20px rgba(0, 0, 0, 0.15)",
              margin:
                snackbar.severity === "success"
                  ? "0 16px 16px 0"
                  : "16px 0 0 0",
              maxWidth: "400px",
              width: "auto",
            },
          }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{
              width: "100%",
              alignItems: "center",
              borderRadius: "8px",
              ".MuiAlert-icon": {
                fontSize: "22px",
              },
              ".MuiAlert-message": {
                fontSize: "15px",
                fontWeight: "500",
              },
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default UserWorkout;
