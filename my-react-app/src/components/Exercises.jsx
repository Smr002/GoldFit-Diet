import { useState, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import BodyPartIcons from "./BodyPartIcons";
import FilterModal from "./FilterModal";
import CreateExerciseModal from "./CreateExerciseModal";
import MobileFooter from "./MobileFooter";
import { getExercises } from "../api";
import SecondNavbar from "./SecondNavbar";
import ThemeToggle from "./ThemeToggle";

const bodyParts = [
  { name: "Favorites", icon: "favorites" },
  { name: "Cardio", icon: "cardio" },
  { name: "Chest", icon: "chest" },
  { name: "Back", icon: "back" },
  { name: "Upper Legs", icon: "upper-legs" },
  { name: "Shoulders", icon: "shoulders" },
  { name: "Upper Arms", icon: "upper-arms" },
  { name: "Waist", icon: "waist" },
  { name: "Lower Legs", icon: "lower-legs" },
  { name: "Lower Arms", icon: "lower-arms" },
  { name: "Neck", icon: "neck" },
];

const cacheKey = "enrichedExercisesCache";

const Exercises = () => {
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
    shadows: darkMode
      ? [
          "none",
          "0px 2px 4px rgba(218, 165, 32, 0.2)", // Gold-tinted shadow
          // ...rest of shadows remain the same
        ]
      : undefined,
  });

  const [allExercises, setAllExercises] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [bodyPart, setBodyPart] = useState("");
  const [equipment, setEquipment] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [myExercises, setMyExercises] = useState(
    JSON.parse(localStorage.getItem("myExercises")) || []
  );
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    bodyPart: "",
    equipment: "",
    showFavorites: false,
    showMyExercises: false,
  });
  const [equipmentList, setEquipmentList] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Add a ref to control the body parts scroll container
  const scrollRef = useRef(null);

  const enrichWithExternalData = async (localData) => {
    return await Promise.all(
      localData.map(async (ex) => {
        try {
          const res = await fetch(
            `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(
              ex.name.toLowerCase()
            )}`,
            {
              headers: {
                "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY || "",
                "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
              },
            }
          );
          if (!res.ok) throw new Error(`Status ${res.status}`);
          const data = await res.json();
          const m = Array.isArray(data) ? data[0] : null;
          return {
            ...ex,
            gifUrl: m?.gifUrl || "/placeholder.svg",
            bodyPart: m?.bodyPart || "other",
            target: m?.target || "general",
            equipment: m?.equipment || "body weight",
            instructions: m?.instructions || ["Follow the animation"],
          };
        } catch {
          return {
            ...ex,
            gifUrl: "/placeholder.svg",
            bodyPart: "other",
            target: "general",
            equipment: "body weight",
            instructions: ["Follow the animation"],
          };
        }
      })
    );
  };

  // Fetch exercises based on body part or equipment
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken") || "";
        const localData = await getExercises(token);
        const enriched = await enrichWithExternalData(localData);
        setAllExercises(enriched);
        setExercises(enriched);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch exercises. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    let filtered = [...allExercises];
    if (filterOptions.showMyExercises) filtered = [...filtered, ...myExercises];

    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name?.toLowerCase().includes(query) ||
          e.target?.toLowerCase().includes(query) ||
          e.equipment?.toLowerCase().includes(query) ||
          e.bodyPart?.toLowerCase().includes(query)
      );
    }

    if (filterOptions.bodyPart)
      filtered = filtered.filter(
        (e) =>
          e.bodyPart?.toLowerCase() === filterOptions.bodyPart.toLowerCase()
      );

    if (
      filterOptions.equipment &&
      filterOptions.equipment.toLowerCase() !== "all equipment"
    ) {
      filtered = filtered.filter(
        (e) =>
          e.equipment?.toLowerCase() === filterOptions.equipment.toLowerCase()
      );
    }

    if (filterOptions.showFavorites)
      filtered = filtered.filter((e) => favorites.includes(e.id));

    setExercises(filtered);
  }, [search, filterOptions, allExercises, myExercises, favorites]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("myExercises", JSON.stringify(myExercises));
  }, [myExercises]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  }, [bodyPart]);

  const handleSearchChange = (e) => setSearch(e.target.value);

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBodyPartClick = (part) => {
    if (part === "Favorites") {
      setFilterOptions({ bodyPart: "", equipment: "", showFavorites: true });
    } else {
      setBodyPart(part.toLowerCase());
      setFilterOptions({
        ...filterOptions,
        bodyPart: part.toLowerCase(),
        showFavorites: false,
      });
    }
  };

  const openExerciseDetails = (exercise) => {
    setModalLoading(true);
    setSelectedExercise(exercise);
    setDetailsOpen(true);
    setInstructionsOpen(false);
    setTimeout(() => setModalLoading(false), 1000);
  };

  const closeExerciseDetails = () => {
    setSelectedExercise(null);
    setDetailsOpen(false);
    setInstructionsOpen(false);
  };

  const handleApplyFilters = (filters) => {
    setFilterOptions(filters);
    setBodyPart(filters.bodyPart);
    setEquipment(filters.equipment);
    setShowFilterModal(false);
  };

  const handleCreateExercise = (newExercise) => {
    const customExercise = {
      ...newExercise,
      id: `custom-${Date.now()}`,
      bodyPart: filterOptions.bodyPart || "custom",
      equipment: "body weight",
      target: "custom",
      gifUrl: "/placeholder.svg",
      instructions: ["Custom created"],
    };
    setMyExercises((prev) => [...prev, customExercise]);
    setShowCreateModal(false);
  };

  const exerciseCardStyle = {
    background: darkMode
      ? "linear-gradient(135deg, #212121 0%, #2c2c2c 100%)"
      : "white",
    color: darkMode ? "#ffffff" : "inherit",
    boxShadow: darkMode
      ? "0 4px 20px rgba(218, 165, 32, 0.15)" // Gold-tinted shadow
      : "0 2px 10px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    border: darkMode ? "1px solid #333" : "none",
    borderBottom: darkMode ? "2px solid #FFD700" : "none", // Gold border at bottom
  };

  const bodyPartItemStyle = (isActive) => ({
    border: "none",
    transition: "all 0.3s ease",
    padding: "6px", // Reduced from 10px
    margin: "2px 0", // Add margin to create space for borders
    background: "transparent",
    boxShadow:
      darkMode && isActive ? "0 0 10px rgba(255, 215, 0, 0.4)" : "none",
    borderBottom: isActive
      ? darkMode
        ? "2px solid #FFD700"
        : "2px solid #6200ea"
      : "none",
    borderTop: isActive && darkMode ? "2px solid #FFD700" : "none",
    paddingTop: "6px", // Reduced from 8px
    paddingBottom: "6px", // Reduced from 8px
    position: "relative", // Add this for better border positioning
    borderRadius: "4px", // Add slight rounding
  });

  const bodyPartNameStyle = {
    color: darkMode ? "#FFD700" : "inherit",
    fontWeight: "500",
    transition: "color 0.3s ease",
  };

  const exerciseNameStyle = {
    color: darkMode ? "#FFD700" : "inherit",
    fontWeight: "600",
    transition: "color 0.3s ease",
  };

  const exerciseTagStyle = {
    background: darkMode ? "#333333" : "#f0f0f0",
    color: darkMode ? "#FFD700" : "inherit", // Gold text for tags
    border: darkMode ? "1px solid rgba(255, 215, 0, 0.3)" : "none", // Subtle gold border
    transition: "all 0.3s ease",
  };

  const searchBarStyle = {
    background: darkMode ? "#202020" : "white",
    boxShadow: darkMode
      ? "0 2px 8px rgba(218, 165, 32, 0.2)" // Gold-tinted shadow
      : "0 2px 8px rgba(0, 0, 0, 0.1)",
    border: darkMode ? "1px solid rgba(255, 215, 0, 0.2)" : "none", // Subtle gold border
  };

  const modalHeaderStyle = {
    borderBottom: darkMode
      ? "1px solid rgba(255, 215, 0, 0.3)"
      : "1px solid #eaeaea",
    background: darkMode ? "#202020" : "white", // Add background color to match modal
    color: darkMode ? "#ffffff" : "inherit",
    padding: "15px 20px",
  };

  const modalContentStyle = {
    background: darkMode ? "#262626" : "#f8f8f8",
    borderRadius: "0 0 8px 8px", // Match modal bottom radius
  };

  const sectionHeaderStyle = {
    borderLeft: darkMode ? "3px solid #FFD700" : "none",
    paddingLeft: darkMode ? "10px" : "0",
    borderBottom: "none", // Remove any bottom border causing the blur line
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
  };

  // Update the closeButtonStyle object to use theme colors
  const closeButtonStyle = {
    background: darkMode ? "#333" : "#f0f0f0",
    color: darkMode ? "#FFD700" : "#6200ea", // Gold in dark mode, purple in light mode
    border: darkMode ? "1px solid #444" : "1px solid #ddd",
    boxShadow: darkMode ? "0 2px 5px rgba(0, 0, 0, 0.3)" : "none",
    transition: "all 0.3s ease",
  };

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: darkMode
            ? "linear-gradient(135deg, #0f0f0f 0%, #1d1d1d 100%)"
            : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          color: darkMode ? "#ffffff" : "inherit",
          transition: "background 0.3s ease, color 0.3s ease",
        }}
      >
        <SecondNavbar />
        <Box
          sx={{
            maxWidth: "1300px",
            margin: "0 auto",
            padding: "20px",
            paddingTop: "80px",
          }}
        >
          <div className={`exercises-container ${darkMode ? "dark-mode" : ""}`}>
            {/* Update the search container for better mobile responsiveness */}
            <div className="search-container" style={{ width: "100%" }}>
              <div
                className={`search-bar ${darkMode ? "dark-mode" : ""}`}
                style={{
                  ...searchBarStyle,
                  display: "flex",
                  alignItems: "center",
                  width: "96%",
                  maxWidth: "100%",
                  margin: "32px auto 15px auto",
                  padding: "10px 15px",
                  borderRadius: "8px",
                }}
              >
                <div className="search-icon" style={{ marginRight: "10px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20" // Slightly smaller on mobile
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={darkMode ? "#FFD700" : "currentColor"}
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
                  placeholder="Search exercises..."
                  className="search-input"
                  value={search}
                  onChange={handleSearchChange}
                  style={{
                    color: darkMode ? "#ffffff" : "inherit",
                    background: darkMode ? "#202020" : "white",
                    width: "100%",
                    border: "none",
                    outline: "none",
                    fontSize: "14px",
                    padding: "8px 0",
                  }}
                />
              </div>
            </div>

            {/* Body parts container with improved mobile responsiveness */}
            <div
              className={`body-parts-container ${darkMode ? "dark-mode" : ""}`}
              style={{
                background: "transparent",
                boxShadow: "none",
                borderBottom: darkMode ? "1px solid #333" : "1px solid #eaeaea",
                paddingBottom: "10px",
                marginBottom: "20px",
                paddingTop: "15px",
                width: "100%",
                maxWidth: "100%",
              }}
            >
              <div
                className="body-parts-scroll"
                ref={scrollRef}
                style={{
                  display: "flex",
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                  WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
                  scrollbarWidth: "none", // Hide scrollbar for Firefox
                  msOverflowStyle: "none", // Hide scrollbar for IE/Edge
                  paddingBottom: "5px", // Space for scrollbar
                  justifyContent: "center", // Center items on desktop
                }}
              >
                {/* Add this style to hide the scrollbar and fix desktop/mobile behavior */}
                <style>
                  {`
                    .body-parts-scroll::-webkit-scrollbar {
                      display: none;
                    }
                    
                    /* Mobile-specific styles */
                    @media (max-width: 768px) {
                      .body-parts-scroll {
                        justify-content: flex-start !important; /* Left align on mobile */
                        padding-right: 20px !important; /* Override desktop padding */
                        padding-left: 20px !important; /* Override desktop padding */
                      }
                    }
                  `}
                </style>
                {bodyParts.map((part) => {
                  const isActive =
                    (part.name === "Favorites" &&
                      filterOptions.showFavorites) ||
                    bodyPart === part.name.toLowerCase();
                  return (
                    <div
                      key={part.name}
                      onClick={() => handleBodyPartClick(part.name)}
                      className={`body-part-item ${isActive ? "active" : ""} ${
                        darkMode ? "dark-mode" : ""
                      }`}
                      style={{
                        ...bodyPartItemStyle(isActive),
                        minWidth: "85px", // Prevent items from being too small
                        textAlign: "center",
                        flexShrink: 0, // Prevent shrinking
                        display: "inline-flex",
                        flexDirection: "column",
                        alignItems: "center",
                        margin: "0 5px",
                      }}
                    >
                      <div
                        className="body-part-icon"
                        style={{
                          color: isActive
                            ? darkMode
                              ? "#FFD700"
                              : "#6200ea"
                            : darkMode
                            ? "#999"
                            : "#666",
                          fontSize: "20px", // Adjust icon size
                          marginBottom: "4px",
                        }}
                      >
                        <BodyPartIcons type={part.icon} />
                      </div>
                      <span
                        className="body-part-name"
                        style={{
                          ...bodyPartNameStyle,
                          fontSize: "12px", // Smaller text for mobile
                          color: isActive
                            ? darkMode
                              ? "#FFD700"
                              : "#6200ea"
                            : darkMode
                            ? "#ddd"
                            : "inherit",
                        }}
                      >
                        {part.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className={`error-message ${darkMode ? "dark-mode" : ""}`}>
                {error}
              </div>
            )}

            {loading ? (
              <div className="loading-container">
                <div
                  className={`loading-spinner ${darkMode ? "dark-mode" : ""}`}
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
                ></div>
                <style>
                  {`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}
                </style>
              </div>
            ) : exercises.length === 0 ? (
              <div
                className={`no-results ${darkMode ? "dark-mode" : ""}`}
                style={{
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
                  No Exercises Found
                </h3>
                <p
                  style={{
                    fontSize: "16px",
                    opacity: 0.8,
                    maxWidth: "400px",
                    lineHeight: "1.5",
                  }}
                >
                  Try adjusting your search or filters to find exercises.
                </p>
              </div>
            ) : (
              <div
                className={`exercises-grid ${darkMode ? "dark-mode" : ""}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                
                  width: "100%",
                  margin: "0 auto",
                
                }}
              >
                {exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className={`exercise-card ${darkMode ? "dark-mode" : ""}`}
                    onClick={() => openExerciseDetails(exercise)}
                    style={exerciseCardStyle}
                  >
                    <div className="exercise-image-container">
                      <div className="top-buttons">
                        <button
                          className={`circle-button bookmark-button ${
                            darkMode ? "dark-mode" : ""
                          }`}
                          onClick={(e) => toggleFavorite(e, exercise.id)}
                          aria-label="Bookmark"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill={
                              favorites.includes(exercise.id)
                                ? "#ef4444"
                                : "none"
                            }
                            stroke={
                              darkMode ? "rgba(0, 0, 0, 0.8)" : "currentColor"
                            }
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                          </svg>
                        </button>
                        <button
                          className={`circle-button inspect-button ${
                            darkMode ? "dark-mode" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openExerciseDetails(exercise);
                          }}
                          aria-label="Inspect"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={
                              darkMode ? "rgba(0, 0, 0, 0.8)" : "currentColor"
                            }
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          </svg>
                        </button>
                      </div>
                      <div className="exercise-static-image">
                        <img
                          src={exercise.gifUrl || "/placeholder.svg"}
                          alt={exercise.name}
                          className="exercise-image"
                        />
                        <div className="view-exercise-overlay">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#000"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="view-icon"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`exercise-details ${
                        darkMode ? "dark-mode" : ""
                      }`}
                    >
                      <h3 className="exercise-name" style={exerciseNameStyle}>
                        {exercise.name}
                      </h3>
                      <div className="exercise-tags">
                        <span
                          className={`exercise-tag ${
                            darkMode ? "dark-mode" : ""
                          }`}
                          style={exerciseTagStyle}
                        >
                          {exercise.bodyPart}
                        </span>
                        <span
                          className={`exercise-tag ${
                            darkMode ? "dark-mode" : ""
                          }`}
                          style={exerciseTagStyle}
                        >
                          {exercise.target}
                        </span>
                        <span
                          className={`exercise-tag ${
                            darkMode ? "dark-mode" : ""
                          }`}
                          style={exerciseTagStyle}
                        >
                          {exercise.equipment}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedExercise && (
              <div
                className={`exercise-modal-overlay ${
                  darkMode ? "dark-mode" : ""
                }`}
                onClick={closeExerciseDetails}
                style={{
                  backgroundColor: darkMode
                    ? "rgba(0, 0, 0, 0.8)"
                    : "rgba(0, 0, 0, 0.5)",
                }}
              >
                <div
                  className={`exercise-modal ${darkMode ? "dark-mode" : ""}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: darkMode ? "#202020" : "white",
                    boxShadow: darkMode
                      ? "0 5px 30px rgba(218, 165, 32, 0.2)"
                      : "0 5px 30px rgba(0, 0, 0, 0.2)",
                    border: darkMode ? "1px solid #333" : "none",
                    borderLeft: darkMode ? "3px solid #FFD700" : "none",
                  }}
                >
                  <button
                    className={`close-modal ${darkMode ? "dark-mode" : ""}`}
                    onClick={closeExerciseDetails}
                    aria-label="Close modal"
                    title="Close"
                    style={{
                      ...closeButtonStyle,
                      // Ensure the button itself has the right styling
                      background: darkMode ? "#333" : "#f0f0f0",
                      border: darkMode ? "1px solid #444" : "1px solid #ddd",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <span
                      className="close-icon"
                      style={{
                        color: darkMode ? "#FFD700" : "#6200ea", // Gold in dark mode, purple in light mode
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      ✕
                    </span>
                  </button>

                  <div className="modal-container">
                    {modalLoading ? (
                      <div
                        className={`modal-skeleton ${
                          darkMode ? "dark-mode" : ""
                        }`}
                      ></div>
                    ) : (
                      <>
                        <div className="modal-header" style={modalHeaderStyle}>
                          <h2 className="modal-title" style={exerciseNameStyle}>
                            {selectedExercise.name}
                          </h2>
                        </div>

                        <div
                          className="modal-gif-section"
                          style={{
                            background: darkMode ? "#1a1a1a" : "#fff",
                            borderBottom: darkMode
                              ? "1px solid #333"
                              : "1px solid #eee",
                          }}
                        >
                          <img
                            src={selectedExercise.gifUrl || "/placeholder.svg"}
                            alt={selectedExercise.name}
                            className="modal-gif"
                          />
                        </div>

                        <div
                          className={`modal-content-section ${
                            darkMode ? "dark-mode" : ""
                          }`}
                          style={modalContentStyle}
                        >
                          <div className="modal-info">
                            <div
                              className={`info-section details-section ${
                                darkMode ? "dark-mode" : ""
                              }`}
                            >
                              <div
                                className="section-header"
                                onClick={() => setDetailsOpen(!detailsOpen)}
                                style={sectionHeaderStyle}
                              >
                                <h3
                                  style={{
                                    color: darkMode ? "#FFD700" : "inherit",
                                  }}
                                >
                                  Details
                                </h3>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke={darkMode ? "#FFD700" : "#6200ea"} // Gold in dark mode, purple in light mode
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className={`dropdown-icon ${
                                    detailsOpen ? "rotate-180" : ""
                                  }`}
                                >
                                  <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                              </div>
                              <div
                                className={`collapsible-content ${
                                  detailsOpen ? "open" : ""
                                }`}
                              >
                                <div
                                  className={`exercise-details-grid ${
                                    darkMode ? "dark-mode" : ""
                                  }`}
                                  style={{
                                    background: darkMode ? "#333" : "#f5f5f5",
                                    borderRadius: "8px",
                                    padding: "15px",
                                    marginTop: "5px",
                                  }}
                                >
                                  <span
                                    className="detail-label"
                                    style={{
                                      color: darkMode ? "#ddd" : "inherit",
                                    }}
                                  >
                                    Body Part:
                                  </span>
                                  <span
                                    className="detail-value"
                                    style={{
                                      color: darkMode ? "#FFD700" : "inherit",
                                    }}
                                  >
                                    {selectedExercise.bodyPart}
                                  </span>
                                  <span
                                    className="detail-label"
                                    style={{
                                      color: darkMode ? "#ddd" : "inherit",
                                    }}
                                  >
                                    Target:
                                  </span>
                                  <span
                                    className="detail-value"
                                    style={{
                                      color: darkMode ? "#FFD700" : "inherit",
                                    }}
                                  >
                                    {selectedExercise.target}
                                  </span>
                                  <span
                                    className="detail-label"
                                    style={{
                                      color: darkMode ? "#ddd" : "inherit",
                                    }}
                                  >
                                    Equipment:
                                  </span>
                                  <span
                                    className="detail-value"
                                    style={{
                                      color: darkMode ? "#FFD700" : "inherit",
                                    }}
                                  >
                                    {selectedExercise.equipment}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div
                              className={`info-section instructions-section ${
                                darkMode ? "dark-mode" : ""
                              }`}
                            >
                              <div
                                className="section-header"
                                onClick={() =>
                                  setInstructionsOpen(!instructionsOpen)
                                }
                                style={sectionHeaderStyle}
                              >
                                <h3
                                  style={{
                                    color: darkMode ? "#FFD700" : "inherit",
                                  }}
                                >
                                  Instructions
                                </h3>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke={darkMode ? "#FFD700" : "#6200ea"} // Gold in dark mode, purple in light mode
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className={`dropdown-icon ${
                                    instructionsOpen ? "rotate-180" : ""
                                  }`}
                                >
                                  <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                              </div>
                              <div
                                className={`collapsible-content ${
                                  instructionsOpen ? "open" : ""
                                }`}
                              >
                                <ol
                                  className={`instructions-list ${
                                    darkMode ? "dark-mode" : ""
                                  }`}
                                  style={{
                                    background: darkMode ? "#333" : "#f5f5f5",
                                    borderRadius: "8px",
                                    padding: "15px 15px 15px 35px",
                                    marginTop: "5px",
                                    color: darkMode ? "#ddd" : "inherit",
                                  }}
                                >
                                  {selectedExercise.instructions?.map(
                                    (instruction, index) => (
                                      <li key={index}>{instruction}</li>
                                    )
                                  ) || <li>Follow the animation above.</li>}
                                </ol>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {showFilterModal && (
              <FilterModal
                onClose={() => setShowFilterModal(false)}
                onApply={handleApplyFilters}
                bodyParts={bodyParts.filter(
                  (part) => part.name !== "Filters" && part.name !== "Favorites"
                )}
                equipmentList={equipmentList}
                initialFilters={filterOptions}
                onCreateExercise={() => {
                  setShowFilterModal(false);
                  setShowCreateModal(true);
                }}
                isDarkMode={darkMode}
              />
            )}

            {showCreateModal && (
              <CreateExerciseModal
                onClose={() => setShowCreateModal(false)}
                onSave={handleCreateExercise}
                isDarkMode={darkMode}
              />
            )}
          </div>
        </Box>
        <ThemeToggle />
        <MobileFooter />
      </Box>
      {/* Add media queries for different screen sizes */}
      <style>
        {`
          @media (max-width: 768px) {
            .exercises-grid {
              grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important;
              gap: 15px !important;
            }
            
            .exercise-card {
              min-height: 280px !important;
            }
            
            .body-part-item {
              min-width: 80px !important;
              padding: 5px !important;
            }
            
            .search-bar {
              padding: 8px 12px !important;
            }
            
            .search-input {
              font-size: 13px !important;
            }
          }
          
          @media (max-width: 480px) {
            .exercises-grid {
              grid-template-columns: 1fr !important;
              gap: 12px !important;
            }
            
            .body-part-item {
              min-width: 70px !important;
            }
            
            .body-part-name {
              font-size: 11px !important;
            }
            
            .exercise-name {
              font-size: 16px !important;
            }
            
            .exercise-tag {
              font-size: 11px !important;
              padding: 3px 6px !important;
            }
          }
        `}
      </style>
    </ThemeProvider>
  );
};

export default Exercises;
