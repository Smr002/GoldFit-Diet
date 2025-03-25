"use client";

import { useState, useEffect } from "react";
import BodyPartIcons from "./BodyPartIcons";
import FilterModal from "./FilterModal";
import CreateExerciseModal from "./CreateExerciseModal";

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
  { name: "Neck", icon: "neck" }
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
  const [allExercises, setAllExercises] = useState([]); // Store all fetched exercises
  const [exercises, setExercises] = useState([]); // Filtered exercises to display
  const [bodyPart, setBodyPart] = useState("");
  const [equipment, setEquipment] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // For error handling
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

  // Persist favorites and custom exercises
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("myExercises", JSON.stringify(myExercises));
  }, [myExercises]);

  // Fetch equipment list
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

  // Fetch exercises based on body part or equipment
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
        setAllExercises(data); // Store all fetched exercises
      } catch (error) {
        console.error("Error fetching exercises:", error);
        setError("Failed to fetch exercises. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [bodyPart, equipment]); // Only fetch when bodyPart or equipment changes

  // Apply filters and search on the client side
  useEffect(() => {
    let filteredData = [...allExercises, ...myExercises]; // Start with all exercises, including custom ones

    // Apply search filter first
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

    // Apply favorites filter
    if (filterOptions.showFavorites) {
      filteredData = filteredData.filter((exercise) =>
        favorites.includes(exercise.id)
      );
    }

    // Apply custom exercises filter
    if (filterOptions.showMyExercises) {
      filteredData = [...filteredData, ...myExercises];
    }

    setExercises(filteredData);
  }, [allExercises, myExercises, search, filterOptions, favorites]);

  // Debounce search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

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

  const openExerciseDetails = (exercise) => setSelectedExercise(exercise);
  const closeExerciseDetails = () => setSelectedExercise(null);

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

  return (
    <div className="exercises-container">
      
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-bar">
          <div className="search-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
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
          />
        </div>
      </div>

      {/* Body Part Filter */}
      <div className="body-parts-container">
        <div className="body-parts-scroll">
          {bodyParts.map((part) => (
            <div
              key={part.name}
              onClick={() => handleBodyPartClick(part.name)}
              className={`body-part-item ${
                (part.name === "Favorites" && filterOptions.showFavorites) ||
                bodyPart === part.name.toLowerCase()
                  ? "active"
                  : ""
              }`}
            >
              <div className="body-part-icon">
                <BodyPartIcons type={part.icon} />
              </div>
              <span className="body-part-name">{part.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Exercises Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : exercises.length === 0 ? (
        <div className="no-results">
          <h3>No Exercises Found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="exercises-grid">
          {exercises.map((exercise) => (
            <div
              className="exercise-card"
              onClick={() => openExerciseDetails(exercise)}
            >
              <div className="exercise-image-container">
                {/* Top circular buttons */}
                <div className="top-buttons">
                  {/* Bookmark Button */}
                  <button
                    className="circle-button bookmark-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(e, exercise.id);
                    }}
                    aria-label="Bookmark"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={
                        favorites.includes(exercise.id) ? "#ef4444" : "none"
                      }
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </button>

                  {/* Magnifying Icon */}
                  <button
                    className="circle-button inspect-button"
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
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </button>
                </div>

                {/* Exercise Image */}
                <div className="exercise-static-image">
                  <img
                    src={exercise.gifUrl || "/placeholder.svg"}
                    alt={exercise.name}
                    className="exercise-image"
                  />
                  <div className="view-exercise-overlay">
                    <span>View Exercise</span>
                  </div>
                </div>
              </div>

              {/* Exercise Details */}
              <div className="exercise-details">
                <h3 className="exercise-name">{exercise.name}</h3>
                <div className="exercise-tags">
                  <span className="exercise-tag">{exercise.bodyPart}</span>
                  <span className="exercise-tag">{exercise.target}</span>
                  <span className="exercise-tag">{exercise.equipment}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="exercise-modal-overlay" onClick={closeExerciseDetails}>
          <div className="exercise-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal"
              onClick={closeExerciseDetails}
              aria-label="Close"
            >
              ×
            </button>
            <div className="modal-header">
              <h2 className="modal-title">{selectedExercise.name}</h2>
            </div>
            <div className="modal-content">
              <div className="modal-gif-container">
                <img
                  src={selectedExercise.gifUrl || "/placeholder.svg"}
                  alt={selectedExercise.name}
                  className="modal-gif"
                />
              </div>
              <div className="modal-info">
                <div className="info-section details-section">
                  <h3>Details</h3>
                  <div className="exercise-details-grid">
                    <span className="detail-label">Body Part:</span>
                    <span className="detail-value">
                      {selectedExercise.bodyPart}
                    </span>
                    <span className="detail-label">Target:</span>
                    <span className="detail-value">
                      {selectedExercise.target}
                    </span>
                    <span className="detail-label">Equipment:</span>
                    <span className="detail-value">
                      {selectedExercise.equipment}
                    </span>
                  </div>
                </div>
                <div className="info-section instructions-section">
                  <h3>Instructions</h3>
                  <ol className="instructions-list">
                    {selectedExercise.instructions?.map(
                      (instruction, index) => <li key={index}>{instruction}</li>
                    ) || <li>Follow the animation above.</li>}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
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
        />
      )}

      {/* Create Exercise Modal */}
      {showCreateModal && (
        <CreateExerciseModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateExercise}
        />
      )}
    </div>
  );
};

export default Exercises;
