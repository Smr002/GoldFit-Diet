"use client"

import { useState } from "react"

const FilterModal = ({ onClose, onApply, bodyParts, equipmentList, initialFilters, onCreateExercise }) => {
  const [filters, setFilters] = useState(
    initialFilters || {
      bodyPart: "",
      equipment: "",
      showFavorites: false,
      showMyExercises: false,
    },
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
          <button className="close-button" onClick={onClose}>
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
            >
              <option value="">All Equipment</option>
              {equipmentList.map(
                (item, index) =>
                  item !== "All Equipment" && (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ),
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
          <button className={`filter-button ${filters.showFavorites ? "active" : ""}`} onClick={toggleFavorites}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={filters.showFavorites ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            Favorites
          </button>
          <button className={`filter-button ${filters.showMyExercises ? "active" : ""}`} onClick={toggleMyExercises}>
            My Exercises
          </button>
        </div>

        <button className="create-exercise-button" onClick={onCreateExercise}>
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
          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>
          <button className="apply-button" onClick={handleApply}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterModal

