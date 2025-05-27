"use client";

import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";

function FilterModal({
  onClose,
  onApply,
  bodyParts,
  equipmentList,
  initialFilters,
  onCreateExercise,
  isDarkMode
}) {
  const theme = useTheme();
  const [filters, setFilters] = useState(initialFilters || {
    bodyPart: "",
    equipment: "",
    showFavorites: false,
    showMyExercises: false,
  });

  const handleBodyPartClick = (part) => {
    setFilters({
      ...filters,
      bodyPart: part.toLowerCase(),
    });
  };

  const handleEquipmentClick = (equip) => {
    setFilters({
      ...filters,
      equipment: equip === "All Equipment" ? "" : equip,
    });
  };

  const handleCheckboxChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.checked,
    });
  };

  const handleApply = () => {
    onApply(filters);
  };

  return (
    <div 
      className={`filter-modal-overlay ${isDarkMode ? 'dark-mode' : ''}`}
      onClick={onClose}
    >
      <div 
        className={`filter-modal ${isDarkMode ? 'dark-mode' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="filter-modal-header">
          <h2>Filter Exercises</h2>
          <button 
            className={`close-modal ${isDarkMode ? 'dark-mode' : ''}`}
            onClick={onClose}
          >
            <span className="close-icon">✕</span>
          </button>
        </div>

        <div className="filter-modal-content">
          <div className="filter-section">
            <h3>Body Part</h3>
            <div className="filter-options">
              {bodyParts.map((part) => (
                <div
                  key={part.name}
                  onClick={() => handleBodyPartClick(part.name)}
                  className={`filter-option ${
                    filters.bodyPart === part.name.toLowerCase() ? "selected" : ""
                  } ${isDarkMode ? 'dark-mode' : ''}`}
                >
                  <span>{part.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Equipment</h3>
            <div className="filter-options">
              {equipmentList.map((equip) => (
                <div
                  key={equip}
                  onClick={() => handleEquipmentClick(equip)}
                  className={`filter-option ${
                    (equip === "All Equipment" && !filters.equipment) ||
                    filters.equipment === equip
                      ? "selected"
                      : ""
                  } ${isDarkMode ? 'dark-mode' : ''}`}
                >
                  <span>{equip}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="filter-section checkbox-section">
            <h3>Additional Filters</h3>
            <div className="checkbox-wrapper">
              <label
                htmlFor="showFavorites"
                className={`checkbox-label ${isDarkMode ? 'dark-mode' : ''}`}
              >
                <input
                  type="checkbox"
                  id="showFavorites"
                  name="showFavorites"
                  checked={filters.showFavorites}
                  onChange={handleCheckboxChange}
                />
                <span className="checkbox-text">Show Favorites Only</span>
              </label>
            </div>
            <div className="checkbox-wrapper">
              <label
                htmlFor="showMyExercises"
                className={`checkbox-label ${isDarkMode ? 'dark-mode' : ''}`}
              >
                <input
                  type="checkbox"
                  id="showMyExercises"
                  name="showMyExercises"
                  checked={filters.showMyExercises}
                  onChange={handleCheckboxChange}
                />
                <span className="checkbox-text">Show My Exercises</span>
              </label>
            </div>
          </div>
        </div>

        <div className="filter-modal-footer">
          <button 
            className={`create-exercise-button ${isDarkMode ? 'dark-mode' : ''}`}
            onClick={onCreateExercise}
          >
            Create Exercise
          </button>
          <button 
            className={`apply-filters-button ${isDarkMode ? 'dark-mode' : ''}`}
            onClick={handleApply}
          >
            Apply Filters
          </button>
        </div>
      </div>

      <style jsx>{`
        .filter-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(3px);
        }
        
        .filter-modal-overlay.dark-mode {
          background-color: rgba(0, 0, 0, 0.7);
        }

        .filter-modal {
          background-color: white;
          border-radius: 16px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          animation: modalFadeIn 0.3s ease;
        }
        
        .filter-modal.dark-mode {
          background-color: #1e1e1e;
          color: white;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        }

        .filter-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #eee;
        }
        
        .filter-modal.dark-mode .filter-modal-header {
          border-bottom: 1px solid #333;
        }

        .filter-modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .close-modal {
          background: #f5f5f5;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          font-size: 18px;
          color: #333;
          transition: all 0.2s;
        }
        
        .close-modal.dark-mode {
          background: #333;
          color: white;
        }

        .close-modal:hover {
          background: #e0e0e0;
        }
        
        .close-modal.dark-mode:hover {
          background: #444;
        }

        .filter-modal-content {
          padding: 24px;
        }

        .filter-section {
          margin-bottom: 24px;
        }

        .filter-section h3 {
          margin: 0 0 16px 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
        }
        
        .filter-modal.dark-mode .filter-section h3 {
          color: #eee;
        }

        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 8px;
        }

        .filter-option {
          background-color: #f5f5f5;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
          user-select: none;
        }
        
        .filter-option.dark-mode {
          background-color: #2d2d2d;
          color: white;
        }

        .filter-option:hover {
          background-color: #e0e0e0;
        }
        
        .filter-option.dark-mode:hover {
          background-color: #3d3d3d;
        }

        .filter-option.selected {
          background-color: #6200ea;
          color: white;
        }
        
        .filter-option.dark-mode.selected {
          background-color: #FFD700;
          color: black;
        }

        .checkbox-section {
          margin-top: 24px;
        }

        .checkbox-wrapper {
          margin-bottom: 12px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          user-select: none;
        }
        
        .checkbox-label.dark-mode {
          color: white;
        }

        .checkbox-label input {
          margin-right: 10px;
          width: 18px;
          height: 18px;
        }

        .filter-modal-footer {
          display: flex;
          justify-content: space-between;
          padding: 20px 24px;
          border-top: 1px solid #eee;
        }
        
        .filter-modal.dark-mode .filter-modal-footer {
          border-top: 1px solid #333;
        }

        .create-exercise-button {
          background-color: #f5f5f5;
          color: #333;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .create-exercise-button.dark-mode {
          background-color: #2d2d2d;
          color: #fff;
          border: 1px solid #444;
        }

        .create-exercise-button:hover {
          background-color: #e0e0e0;
        }
        
        .create-exercise-button.dark-mode:hover {
          background-color: #3d3d3d;
        }

        .apply-filters-button {
          background-color: #6200ea;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .apply-filters-button.dark-mode {
          background-color: #FFD700;
          color: black;
        }

        .apply-filters-button:hover {
          background-color: #5000c9;
        }
        
        .apply-filters-button.dark-mode:hover {
          background-color: #DAA520;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default FilterModal;