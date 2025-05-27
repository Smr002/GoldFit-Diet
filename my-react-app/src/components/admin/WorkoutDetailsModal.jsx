import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Target, LayoutTemplate, Dumbbell, ChevronDown, Info, Edit, Shield } from 'lucide-react';

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
  const [haveExercises, setHaveExercises] = useState([]);
  
  // Track whether details or instructions section is open
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  // Fetch exercise details for all exercises in the workout
  useEffect(() => {
    const fetchExerciseDetails = async () => {
      if (!workout.workoutExercises || workout.workoutExercises.length === 0) return;
      
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
        const exercisePromises = workout.workoutExercises.map(workoutExercise => {
          const searchTerm = exerciseNameMapping[workoutExercise.exercise?.name]?.[0] || normalizeExerciseName(workoutExercise.exercise?.name);
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
            exerciseData[workout.workoutExercises[index].exerciseId] = {
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
  }, [workout.workoutExercises]);

  const handleExerciseClick = (exerciseId) => {
    setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId);
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
              <span className="admin-exercise-count">{workout.workoutExercises?.length || 0} exercises</span>
            </div>

            <div className="admin-exercises-list">
              {workout.workoutExercises && workout.workoutExercises.length > 0 ? (
                workout.workoutExercises.map((workoutExercise, index) => {
                  return (
                    <div key={workoutExercise.exerciseId} className="admin-exercise-item-wrapper">
                      <div
                        className={`admin-exercise-item ${
                          expandedExercise === workoutExercise.exerciseId ? "expanded" : ""
                        }`}
                        onClick={() => handleExerciseClick(workoutExercise.exerciseId)}
                      >
                        <div className="exercise-drag-handle">
                          <span className="drag-dots">⋮⋮</span>
                        </div>
                        <div className="admin-exercise-icon">
                          <Dumbbell size={20} />
                        </div>
                        <div className="admin-exercise-info">
                          <div className="exercise-details">
                            <h4 className="exercise-name">
                              {workoutExercise.exercise?.name}
                            </h4>
                            <div className="exercise-meta">
                              {workoutExercise.sets} sets x {workoutExercise.reps} reps
                            </div>
                          </div>
                        </div>
                        <ChevronDown
                          size={20}
                          className={`admin-exercise-chevron ${
                            expandedExercise === workoutExercise.exerciseId ? "rotated" : ""
                          }`}
                        />
                      </div>
                      {expandedExercise === workoutExercise.exerciseId && (
                        <div className="admin-exercise-content">
                          <div className="admin-exercise-details">
                            <div className="admin-exercise-video">
                              <img
                                src={exerciseDetails[workoutExercise.exerciseId]?.gifUrl}
                                alt={workoutExercise.exercise?.name}
                                loading="lazy"
                              />
                            </div>

                            <div className="exercise-info-section">
                              <div className="exercise-info-header">
                                <h4>Details</h4>
                                <ChevronDown
                                  size={16}
                                  className="info-chevron rotated"
                                />
                              </div>
                              <div className="exercise-info-content">
                                <div className="exercise-info-grid">
                                  <span className="info-label">Body Part:</span>
                                  <span className="info-value">
                                    {exerciseDetails[workoutExercise.exerciseId]?.bodyPart}
                                  </span>

                                  <span className="info-label">Target:</span>
                                  <span className="info-value">
                                    {exerciseDetails[workoutExercise.exerciseId]?.target}
                                  </span>

                                  <span className="info-label">Equipment:</span>
                                  <span className="info-value">
                                    {exerciseDetails[workoutExercise.exerciseId]?.equipment || "Bodyweight"}
                                  </span>

                                  <span className="info-label">Day:</span>
                                  <span className="info-value">
                                    Day {workoutExercise.dayOfTheWeek}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="exercise-info-section">
                              <div className="exercise-info-header">
                                <h4>Instructions</h4>
                                <ChevronDown size={16} className="info-chevron" />
                              </div>
                              <div className="exercise-info-content">
                                <ol className="exercise-instructions-list">
                                  {exerciseDetails[workoutExercise.exerciseId]?.instructions ? (
                                    exerciseDetails[workoutExercise.exerciseId].instructions.map((instruction, i) => (
                                      <li key={i}>{instruction}</li>
                                    ))
                                  ) : (
                                    <li>Follow proper form and technique for {workoutExercise.exercise?.name}</li>
                                  )}
                                </ol>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="no-exercises-message">
                  No exercises in this workout.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutDetailsModal;