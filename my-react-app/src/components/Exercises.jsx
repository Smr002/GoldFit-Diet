"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import BodyPartIcons from "./BodyPartIcons";
import FilterModal from "./FilterModal";
import CreateExerciseModal from "./CreateExerciseModal";
import MobileFooter from "./MobileFooter";
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

const bodyPartMapping = {
  "upper legs": "upper legs",
  "lower legs": "lower legs",
  "upper arms": "upper arms",
  "lower arms": "lower arms",
  waist: "waist",
  chest: "chest",
  back: "back",
  shoulders: "shoulders",
  neck: "neck",
  cardio: "cardio",
};

const Exercises = () => {
  const theme = useTheme();
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

  const scrollRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("myExercises", JSON.stringify(myExercises));
  }, [myExercises]);

  useEffect(() => {
    if (selectedExercise) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedExercise]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY || "",
            "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
          },
        };
        const response = await fetch(
          "https://exercisedb.p.rapidapi.com/exercises/equipmentList",
          options
        );
        const data = await response.json();
        setEquipmentList(["All Equipment", ...data]);
      } catch (error) {
        console.error("Error fetching equipment:", error);
        setError("Failed to fetch equipment list. Please try again.");
      }
    };
    fetchEquipment();
  }, []);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = "https://exercisedb.p.rapidapi.com/exercises";
        if (bodyPart && bodyPart !== "favorites") {
          const apiBodyPart = bodyPartMapping[bodyPart] || bodyPart;
          url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${apiBodyPart}`;
        }
        if (equipment && equipment !== "All Equipment") {
          url = `https://exercisedb.p.rapidapi.com/exercises/equipment/${equipment}`;
        }

        const options = {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY || "",
            "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
          },
        };
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error("Failed to fetch exercises");
        }
        const data = await response.json();
        setAllExercises(data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
        setError("Failed to fetch exercises. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [bodyPart, equipment]);

  useEffect(() => {
    let filteredData = [...allExercises, ...myExercises];

    if (search.trim()) {
      filteredData = filteredData.filter(
        (exercise) =>
          exercise.name?.toLowerCase().includes(search.trim().toLowerCase()) ||
          exercise.target
            ?.toLowerCase()
            .includes(search.trim().toLowerCase()) ||
          exercise.equipment
            ?.toLowerCase()
            .includes(search.trim().toLowerCase()) ||
          exercise.bodyPart?.toLowerCase().includes(search.trim().toLowerCase())
      );
    }

    if (filterOptions.showFavorites) {
      filteredData = filteredData.filter((exercise) =>
        favorites.includes(exercise.id)
      );
    }

    if (filterOptions.showMyExercises) {
      filteredData = [...filteredData, ...myExercises];
    }

    setExercises(filteredData);
  }, [allExercises, myExercises, search, filterOptions, favorites]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [bodyPart]);

  const handleSearchChange = (e) => setSearch(e.target.value);

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const handleBodyPartClick = (part) => {
    if (part === "Favorites") {
      setFilterOptions({
        ...filterOptions,
        showFavorites: true,
        showMyExercises: false,
      });
      setBodyPart("");
    } else if (part === "Filters") {
      setShowFilterModal(true);
    } else {
      setBodyPart(part.toLowerCase());
      setFilterOptions({
        ...filterOptions,
        bodyPart: part.toLowerCase(),
        showFavorites: false,
        showMyExercises: false,
      });
    }
  };

  const openExerciseDetails = (exercise) => {
    setModalLoading(true);
    setSelectedExercise(exercise);
    setDetailsOpen(true);
    setInstructionsOpen(false);

    setTimeout(() => {
      setModalLoading(false);
    }, 1000);
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
    const exerciseWithId = {
      ...newExercise,
      id: `custom-${Date.now()}`,
      bodyPart: filterOptions.bodyPart || "custom",
      equipment: "body weight",
      target: "custom",
    };
    setMyExercises((prev) => [...prev, exerciseWithId]);
    setShowCreateModal(false);
  };

  const exerciseCardStyle = {
    background: darkMode
      ? "linear-gradient(to right, #d4af37, #ffd700)"
      : "white",
    color: darkMode ? "black" : "inherit",
    transition: "all 0.3s ease",
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
            maxWidth: "1300px",
            margin: "0 auto",
            padding: "20px",
            paddingTop: "80px",
          }}
        >
          <div className={`exercises-container ${darkMode ? "dark-mode" : ""}`}>
            <div className="search-container">
              <div className={`search-bar ${darkMode ? "dark-mode" : ""}`}>
                <div className="search-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={
                      darkMode ? "rgba(255, 255, 255, 0.7)" : "currentColor"
                    }
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
                  placeholder="Search exercises in this category..."
                  className="search-input"
                  value={search}
                  onChange={handleSearchChange}
                  style={{
                    color: darkMode ? "#ffffff" : "inherit",
                    background: darkMode ? "#1e1e1e" : "white",
                  }}
                />
              </div>
            </div>

            <div
              className={`body-parts-container ${darkMode ? "dark-mode" : ""}`}
            >
              <div className="body-parts-scroll" ref={scrollRef}>
                {bodyParts.map((part) => (
                  <div
                    key={part.name}
                    onClick={() => handleBodyPartClick(part.name)}
                    className={`body-part-item ${
                      (part.name === "Favorites" &&
                        filterOptions.showFavorites) ||
                      bodyPart === part.name.toLowerCase()
                        ? "active"
                        : ""
                    } ${darkMode ? "dark-mode" : ""}`}
                  >
                    <div className="body-part-icon">
                      <BodyPartIcons type={part.icon} />
                    </div>
                    <span className="body-part-name">{part.name}</span>
                  </div>
                ))}
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
                ></div>
              </div>
            ) : exercises.length === 0 ? (
              <div className={`no-results ${darkMode ? "dark-mode" : ""}`}>
                <h3>No Exercises Found</h3>
                <p>Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className={`exercises-grid ${darkMode ? "dark-mode" : ""}`}>
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
                              darkMode
                                ? "rgba(0, 0, 0, 0.8)"
                                : "currentColor"
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
                              darkMode
                                ? "rgba(0, 0, 0, 0.8)"
                                : "currentColor"
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
                      className={`exercise-details ${darkMode ? "dark-mode" : ""}`}
                    >
                      <h3 className="exercise-name">{exercise.name}</h3>
                      <div className="exercise-tags">
                        <span
                          className={`exercise-tag ${darkMode ? "dark-mode" : ""}`}
                        >
                          {exercise.bodyPart}
                        </span>
                        <span
                          className={`exercise-tag ${darkMode ? "dark-mode" : ""}`}
                        >
                          {exercise.target}
                        </span>
                        <span
                          className={`exercise-tag ${darkMode ? "dark-mode" : ""}`}
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
              >
                <div
                  className={`exercise-modal ${darkMode ? "dark-mode" : ""}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className={`close-modal ${darkMode ? "dark-mode" : ""}`}
                    onClick={closeExerciseDetails}
                    aria-label="Close modal"
                    title="Close"
                  >
                    <span className="close-icon">✕</span>
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
                        <div className="modal-header">
                          <h2 className="modal-title">
                            {selectedExercise.name}
                          </h2>
                        </div>

                        <div className="modal-gif-section">
                          <img
                            src={
                              selectedExercise.gifUrl || "/placeholder.svg"
                            }
                            alt={selectedExercise.name}
                            className="modal-gif"
                          />
                        </div>

                        <div
                          className={`modal-content-section ${
                            darkMode ? "dark-mode" : ""
                          }`}
                        >
                          <div className="modal-info">
                            <div
                              className={`info-section details-section ${
                                darkMode ? "dark-mode" : ""
                              }`}
                            >
                              <div
                                className="section-header"
                                onClick={() =>
                                  setDetailsOpen(!detailsOpen)
                                }
                              >
                                <h3>Details</h3>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke={
                                    darkMode
                                      ? "rgba(255, 255, 255, 0.8)"
                                      : "currentColor"
                                  }
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
                                >
                                  <span className="detail-label">
                                    Body Part:
                                  </span>
                                  <span className="detail-value">
                                    {selectedExercise.bodyPart}
                                  </span>
                                  <span className="detail-label">Target:</span>
                                  <span className="detail-value">
                                    {selectedExercise.target}
                                  </span>
                                  <span className="detail-label">
                                    Equipment:
                                  </span>
                                  <span className="detail-value">
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
                              >
                                <h3>Instructions</h3>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke={
                                    darkMode
                                      ? "rgba(255, 255, 255, 0.8)"
                                      : "currentColor"
                                  }
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
                  (part) =>
                    part.name !== "Filters" && part.name !== "Favorites"
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
    </ThemeProvider>
  );
};

export default Exercises;
