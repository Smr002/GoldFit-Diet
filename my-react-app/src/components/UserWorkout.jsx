"use client";

import { useState, useEffect } from "react";
import WorkoutCard from "./WorkoutCard";
import CreateWorkoutModal from "./CreateWorkoutModal";
import WorkoutDetailModal from "./WorkoutDetailModal";
import LogWorkoutModal from "./LogWorkoutModal";
import { useTheme } from "@mui/material/styles";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import fullbody from "../assets/fullbody.jpg";
import hiit from "../assets/hiitcardio.jpg";
import beginner from "../assets/beginner.jpg";
import legs from "../assets/legday.jpg";
import MobileFooter from "./MobileFooter";
import SecondNavbar from "./SecondNavbar";
import ThemeToggle from "./ThemeToggle";
import { getWorkouts } from "../api";

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

  // Dark mode setup
  const theme = useTheme();
  // eslint-disable-next-line no-unused-vars
  const isDarkMode = theme.palette.mode === "dark";
  const [darkMode, setDarkMode] = useState(false);

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

  const customTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#FFD700" : "#6200ea",
      },
      secondary: {
        main: darkMode ? "#DAA520" : "#3f51b5",
      },
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

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken") || "";
        const data = await getWorkouts(token); // JSON from your backend

        // Transform into shape expected by WorkoutCard (add mock src and derived fields)
        const transformed = data.map((w) => ({
          id: w.id,
          title: w.name,
          description: `${w.level} workout for ${w.timesPerWeek}x/week`,
          difficulty: w.level.toLowerCase(),
          duration: w.workoutExercises.length * 10, // simple estimate
          goal: "general fitness", // or derive from user goal
          exercises: w.workoutExercises.map((we) => ({
            id: we.exerciseId,
            name: we.exercise.name,
            sets: we.sets,
            reps: we.reps,
          })),
          isRecommended: w.premium, // treat premium as "recommended"
          createdAt: w.createdAt,
          src: legs, // fallback image (optionally randomize)
        }));

        setRecommendedWorkouts(transformed.filter((w) => w.isRecommended));
        const userCreated = transformed.filter((w) => !w.isRecommended);
        setUserWorkouts(userCreated);
        setWorkouts(transformed);

        setFavorites([]); // Or extract if API provides
      } catch (error) {
        console.error("Error fetching workouts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

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

  const handleCreateWorkout = (newWorkout) => {
    const workoutWithId = {
      ...newWorkout,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRecommended: false,
    };

    setUserWorkouts([...userWorkouts, workoutWithId]);
    setWorkouts([...recommendedWorkouts, ...userWorkouts, workoutWithId]);
    setShowCreateModal(false);
  };

  const handleEditWorkout = (updatedWorkout) => {
    // For recommended workouts, create a new non-recommended copy
    if (updatedWorkout.isRecommended) {
      const newUserWorkout = {
        ...updatedWorkout,
        id: `user-${Date.now()}`,
        isRecommended: false,
        title: `My ${updatedWorkout.title}`, // Add "My" to title to indicate it's a custom version
      };

      setUserWorkouts([...userWorkouts, newUserWorkout]);
      setWorkouts([...recommendedWorkouts, ...userWorkouts, newUserWorkout]);
    } else {
      // For user workouts, update the existing workout
      const updatedUserWorkouts = userWorkouts.map((workout) =>
        workout.id === updatedWorkout.id ? updatedWorkout : workout
      );

      setUserWorkouts(updatedUserWorkouts);
      setWorkouts([...recommendedWorkouts, ...updatedUserWorkouts]);
    }

    setEditingWorkout(null);
    setShowCreateModal(false);
  };

  const handleDeleteWorkout = (workoutId) => {
    const updatedUserWorkouts = userWorkouts.filter(
      (workout) => workout.id !== workoutId
    );
    setUserWorkouts(updatedUserWorkouts);
    setWorkouts([...recommendedWorkouts, ...updatedUserWorkouts]);

    if (favorites.includes(workoutId)) {
      setFavorites(favorites.filter((id) => id !== workoutId));
    }

    if (selectedWorkout && selectedWorkout.id === workoutId) {
      setSelectedWorkout(null);
      setShowDetailModal(false);
    }
  };

  const handleLogWorkout = (workoutLog) => {
    const logWithId = {
      ...workoutLog,
      id: `log-${Date.now()}`,
      date: new Date().toISOString(),
    };

    setWorkoutLogs([logWithId, ...workoutLogs]);
    setShowLogModal(false);
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
    // Make sure we're getting a full copy of the workout to edit
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
            <div
              className={`workout-search-filter ${darkMode ? "dark-mode" : ""}`}
            >
              <div
                className={`search-container ${darkMode ? "dark-mode" : ""}`}
              >
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
                </div>
              </div>
            </div>

            <div className="filter-container">
              <div className="filter-group">
                <label>Difficulty:</label>
                <select
                  value={filterOptions.difficulty}
                  onChange={(e) =>
                    handleFilterChange("difficulty", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleFilterChange("duration", e.target.value)
                  }
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
              className={`tab-button ${
                activeTab === "recommended" ? "active" : ""
              }`}
              onClick={() => setActiveTab("recommended")}
            >
              Recommended
            </button>
            <button
              className={`tab-button ${
                activeTab === "my-workouts" ? "active" : ""
              }`}
              onClick={() => setActiveTab("my-workouts")}
            >
              My Workouts
            </button>
            <button
              className={`tab-button ${
                activeTab === "favorites" ? "active" : ""
              }`}
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
                filteredWorkouts.map((workout, index) => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    isFavorite={favorites.includes(workout.id)}
                    hasNotification={notificationSettings[workout.id]}
                    onToggleFavorite={() => toggleFavorite(workout.id)}
                    onToggleNotification={() => toggleNotification(workout.id)}
                    onClick={() => openWorkoutDetail(workout)}
                    onEdit={() => startEditWorkout(workout)}
                    onLog={() => startLogWorkout(workout)}
                    logs={getWorkoutLogs(workout.id)}
                    style={{ animationDelay: `${0.1 * (index % 10)}s` }}
                  />
                ))
              ) : (
                <div className="no-results">
                  <h3>No workouts found</h3>
                  <p>Try adjusting your filters or create a new workout</p>
                </div>
              )}
            </div>
          )}

          {/* Create/Edit Workout Modal */}
          {showCreateModal && (
            <CreateWorkoutModal
              onClose={() => {
                setShowCreateModal(false);
                setEditingWorkout(null);
              }}
              onSave={editingWorkout ? handleEditWorkout : handleCreateWorkout}
              workout={editingWorkout}
            />
          )}

          {/* Workout Detail Modal */}
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
              onEdit={() => {
                setShowDetailModal(false);
                startEditWorkout(selectedWorkout);
              }}
              onDelete={() => {
                handleDeleteWorkout(selectedWorkout.id);
                setShowDetailModal(false);
              }}
              onLog={() => startLogWorkout(selectedWorkout)}
              logs={getWorkoutLogs(selectedWorkout.id)}
            />
          )}

          {/* Log Workout Modal */}
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
      </Box>
    </ThemeProvider>
  );
};

export default UserWorkout;
