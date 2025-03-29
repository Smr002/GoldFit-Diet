import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Target, LayoutTemplate, Dumbbell, ChevronDown, Info, Edit } from 'lucide-react';

// Updated mapping with more variations and standardized formats
const exerciseNameMapping = {
  "Alternate Lateral Pulldown": ["alternate lateral pulldown", "lateral pulldown", "pulldown"],
  "Assisted Parallel Close Grip Pull-up": ["assisted parallel close grip pull-up", "close grip pull-up", "assisted pull-up"],
  "Assisted Pull-up": ["assisted pull-up", "assisted pullup", "pull-up", "pullup"],
  "Barbell Pullover To Press": ["barbell pullover to press", "barbell pullover", "pullover press"],
  "Barbell Bent Over Row": ["barbell bent over row", "bent over row", "barbell row"]
};

const normalizeExerciseName = (name) => {
  return name.toLowerCase().replace(/\s+/g, ' ').trim();
};

const WorkoutDetailsModal = ({ workout, onClose, onEdit }) => {
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [exerciseDetails, setExerciseDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Track whether details or instructions section is open
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  // Fetch exercise details for all exercises in the workout
  useEffect(() => {
    const fetchExerciseDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const options = {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY || "",
            "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
          },
        };

        // Fetch exercises by their approximate names
        const exercisePromises = workout.exercises.map(exercise => {
          const searchTerm = exerciseNameMapping[exercise.name]?.[0] || normalizeExerciseName(exercise.name);
          return fetch(
            `https://exercisedb.p.rapidapi.com/exercises/name/${searchTerm}`,
            options
          ).then(response => response.json());
        });

        const results = await Promise.all(exercisePromises);
        
        // Create a mapping of exercise ID to complete exercise details
        const exerciseData = {};
        results.forEach((result, index) => {
          if (result && result.length > 0) {
            exerciseData[workout.exercises[index].id] = {
              gifUrl: result[0].gifUrl,
              bodyPart: result[0].bodyPart,
              target: result[0].target,
              equipment: result[0].equipment,
              instructions: result[0].instructions || ["Follow the animation carefully.", "Maintain proper form throughout the exercise."]
            };
          }
        });
        
        setExerciseDetails(exerciseData);
      } catch (error) {
        console.error("Error fetching exercises:", error);
        setError("Failed to fetch exercises. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseDetails();
  }, [workout.exercises]);

  const handleExerciseClick = (exercise) => {
    if (expandedExercise === exercise.id) {
      setExpandedExercise(null);
      return;
    }

    setExpandedExercise(exercise.id);
    setError(null);
    
    if (!exerciseDetails[exercise.id]) {
      // If we don't have this exercise's details yet, fetch it
      fetchSingleExerciseDetails(exercise);
    }
  };

  const fetchSingleExerciseDetails = async (exercise) => {
    try {
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY || "",
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      };
      
      // Try each possible name variation
      const namesToTry = exerciseNameMapping[exercise.name] || [normalizeExerciseName(exercise.name)];
      
      for (const name of namesToTry) {
        const response = await fetch(
          `https://exercisedb.p.rapidapi.com/exercises/name/${name}`,
          options
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setExerciseDetails(prev => ({
              ...prev,
              [exercise.id]: {
                gifUrl: data[0].gifUrl,
                bodyPart: data[0].bodyPart,
                target: data[0].target,
                equipment: data[0].equipment,
                instructions: data[0].instructions || ["Follow the animation carefully.", "Maintain proper form throughout the exercise."]
              }
            }));
            return; // Exit once we find a match
          }
        }
      }
      
      // If we get here, no match was found
      setError(`Could not find exercise: ${exercise.name}`);
    } catch (error) {
      console.error("Error fetching exercise details:", error);
      setError("Failed to fetch exercise details. Please try again.");
    }
  };

  const formattedDate = new Date(workout.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Toggle sections
  const toggleDetails = () => setDetailsOpen(!detailsOpen);
  const toggleInstructions = () => setInstructionsOpen(!instructionsOpen);

  return (
    <div className="modal-overlay">
      <div className="modal workout-details-modal">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="workout-details-header">
          <div className="workout-title-row">
            <h2>{workout.name}</h2>
            {onEdit && (
              <button 
                className="edit-workout-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
            )}
          </div>
          <div className="workout-meta-grid">
            <div className="meta-item">
              <Target size={18} />
              <span>Level: {workout.level}</span>
            </div>
            <div className="meta-item">
              <Clock size={18} />
              <span>Frequency: {workout.timesPerWeek}x per week</span>
            </div>
            <div className="meta-item">
              <User size={18} />
              <span>Created by: {workout.createdBy}</span>
            </div>
            <div className="meta-item">
              <LayoutTemplate size={18} />
              <span>Type: {workout.isPremade ? 'Premade' : 'Custom'}</span>
            </div>
            <div className="meta-item">
              <Calendar size={18} />
              <span>Created: {formattedDate}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="workout-loading-container">
            <div className="workout-loading-spinner"></div>
            <span>Loading exercises...</span>
          </div>
        ) : (
          <div className="workout-details-content">
            <div className="admin-exercises-header">
              <h3>Exercises</h3>
              <span className="admin-exercise-count">{workout.exercises?.length || 0} exercises</span>
            </div>

            <div className="admin-exercises-list">
              {workout.exercises?.map((exercise) => (
                <div key={exercise.id} className="admin-exercise-item-wrapper">
                  <div
                    className={`admin-exercise-item ${expandedExercise === exercise.id ? 'expanded' : ''}`}
                    onClick={() => handleExerciseClick(exercise)}
                  >
                    <div className="admin-exercise-icon">
                      <Dumbbell size={20} />
                    </div>
                    <div className="admin-exercise-info">
                      <span className="admin-exercise-name">{exercise.name}</span>
                      <span className="admin-exercise-reps">{exercise.reps}</span>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`admin-exercise-chevron ${expandedExercise === exercise.id ? 'rotated' : ''}`}
                    />
                  </div>
                  {expandedExercise === exercise.id && (
                    <div className="admin-exercise-content">
                      {error && expandedExercise === exercise.id ? (
                        <div className="admin-exercise-error">{error}</div>
                      ) : exerciseDetails[exercise.id] ? (
                        <div className="admin-exercise-details">
                          <div className="admin-exercise-video">
                            <img
                              src={exerciseDetails[exercise.id].gifUrl}
                              alt={exercise.name}
                              loading="lazy"
                            />
                          </div>
                          
                          {/* Exercise Details Section */}
                          <div className="exercise-info-section">
                            <div 
                              className="exercise-info-header"
                              onClick={toggleDetails}
                            >
                              <h4>Details</h4>
                              <ChevronDown
                                size={16}
                                className={`info-chevron ${detailsOpen ? 'rotated' : ''}`}
                              />
                            </div>
                            
                            {detailsOpen && (
                              <div className="exercise-info-content">
                                <div className="exercise-info-grid">
                                  <span className="info-label">Body Part:</span>
                                  <span className="info-value">{exerciseDetails[exercise.id].bodyPart}</span>
                                  
                                  <span className="info-label">Target:</span>
                                  <span className="info-value">{exerciseDetails[exercise.id].target}</span>
                                  
                                  <span className="info-label">Equipment:</span>
                                  <span className="info-value">{exerciseDetails[exercise.id].equipment}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Exercise Instructions Section */}
                          <div className="exercise-info-section">
                            <div 
                              className="exercise-info-header"
                              onClick={toggleInstructions}
                            >
                              <h4>Instructions</h4>
                              <ChevronDown
                                size={16}
                                className={`info-chevron ${instructionsOpen ? 'rotated' : ''}`}
                              />
                            </div>
                            
                            {instructionsOpen && (
                              <div className="exercise-info-content">
                                <ol className="exercise-instructions-list">
                                  {exerciseDetails[exercise.id].instructions?.map((instruction, i) => (
                                    <li key={i}>{instruction}</li>
                                  ))}
                                </ol>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="admin-exercise-loading">
                          <div className="loading-spinner"></div>
                          <span>Loading exercise details...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutDetailsModal;