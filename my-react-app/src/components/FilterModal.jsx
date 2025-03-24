"use client"

import { useState } from "react"

// Helper function to capitalize the first letter of each word
const capitalizeWords = (str) => {
  if (!str) return str
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

const FilterModal = ({ onClose, onApply, bodyParts, equipmentList, initialFilters, onCreateExercise }) => {
  const [filters, setFilters] = useState(
    initialFilters || {
      bodyPart: "",
      equipment: "",
      showFavorites: false,
      showMyExercises: false,
    }
  )

  const handleReset = () => {
    setFilters({
      bodyPart: "",
      equipment: "",
      showFavorites: false,
      showMyExercises: false,
    })
  }

  const handleApply = () => {
    onApply(filters)
    onClose() // Close modal after applying filters
  }

  const toggleFavorites = () => {
    setFilters({
      ...filters,
      showFavorites: !filters.showFavorites,
      showMyExercises: false,
    })
  }

  const toggleMyExercises = () => {
    setFilters({
      ...filters,
      showMyExercises: !filters.showMyExercises,
      showFavorites: false,
    })
  }

  return (
    <div className="filter-modal-overlay">
      <div className="filter-modal">
        <div className="filter-modal-header">
          <h2>Filters</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="filter-section">
          <h3>Equipment</h3>
          <div className="select-wrapper">
            <select
              value={filters.equipment}
              onChange={(e) => setFilters({ ...filters, equipment: e.target.value })}
              className="filter-select"
              aria-label="Select equipment"
            >
              <option value="">{capitalizeWords("All Equipment")}</option>
              {equipmentList.map(
                (item, index) =>
                  item !== "All Equipment" && (
                    <option key={index} value={item}>
                      {capitalizeWords(item)}
                    </option>
                  )
              )}
            </select>
            <div className="select-arrow">
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
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <h3>Body Parts</h3>
          <div className="select-wrapper">
            <select
              value={filters.bodyPart}
              onChange={(e) => setFilters({ ...filters, bodyPart: e.target.value })}
              className="filter-select"
              aria-label="Select body part"
            >
              <option value="">All Body Parts</option>
              {bodyParts.map((part) => (
                <option key={part.name} value={part.name.toLowerCase()}>
                  {part.name}
                </option>
              ))}
            </select>
            <div className="select-arrow">
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
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-button ${filters.showFavorites ? "active" : ""}`}
            onClick={toggleFavorites}
            aria-label="Toggle favorites"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={filters.showFavorites ? "#ffffff" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            Favorites
          </button>
          <button
            className={`filter-button ${filters.showMyExercises ? "active" : ""}`}
            onClick={toggleMyExercises}
            aria-label="Toggle my exercises"
          >
            My Exercises
          </button>
        </div>

        <button className="create-exercise-button" onClick={onCreateExercise} aria-label="Create new exercise">
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
          Create New Exercise
        </button>

        <div className="filter-actions">
          <button className="reset-button" onClick={handleReset} aria-label="Reset filters">
            Reset
          </button>
          <button className="apply-button" onClick={handleApply} aria-label="Apply filters">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterModal