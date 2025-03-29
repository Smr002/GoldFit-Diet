import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Target, LayoutTemplate, Dumbbell, ChevronDown, Plus, Trash2, Save, AlertCircle, Info } from 'lucide-react';

// Mapping for common exercise name variations
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

const WorkoutEditModal = ({ workout, onClose, onSave }) => {
  // State for storing editable workout details
  const [workoutData, setWorkoutData] = useState({
    name: workout.name,
    level: workout.level,
    timesPerWeek: workout.timesPerWeek,
    createdBy: workout.createdBy,
    isPremade: workout.isPremade,
    exercises: [...workout.exercises]
  });
  
  // State for managing UI interactions
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [exerciseLibrary, setExerciseLibrary] = useState([]);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [exerciseDetails, setExerciseDetails] = useState({});
  const [selectedListExercise, setSelectedListExercise] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  
  // Fetch exercise library for adding new exercises
  useEffect(() => {
    const fetchExerciseLibrary = async () => {
      setLoading(true);
      try {
        const options = {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY || "",
            "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
          },
        };
        
        const response = await fetch(
          "https://exercisedb.p.rapidapi.com/exercises",
          options
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch exercise library");
        }
        
        const data = await response.json();
        
        // Process the data to include GIFs, instructions, etc.
        const processedExercises = data.slice(0, 100).map(exercise => ({
          ...exercise,
          instructions: exercise.instructions || ["Follow the animation carefully.", "Maintain proper form throughout the exercise."]
        }));
        
        setExerciseLibrary(processedExercises);
      } catch (error) {
        console.error("Error fetching exercise library:", error);
        setError("Failed to load exercise library. You can still edit existing exercises.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchExerciseLibrary();
  }, []);
  
  // Fetch details for existing exercises in the workout
  useEffect(() => {
    const fetchExerciseDetails = async () => {
      if (!workout.exercises || workout.exercises.length === 0) return;
      
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
        setError("Failed to fetch exercise details. Some visual elements may be missing.");
      }
    };

    fetchExerciseDetails();
  }, [workout.exercises]);
  
  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setWorkoutData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Handle exercise changes
  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...workoutData.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value
    };
    setWorkoutData(prev => ({ ...prev, exercises: updatedExercises }));
  };
  
  // Add new exercise
  const addExercise = (exercise) => {
    const newExercise = {
      id: `temp-${Date.now()}`, // Temporary ID, will be replaced on save
      name: exercise.name || "New Exercise",
      reps: "3 sets x 10 reps",
      gifUrl: exercise.gifUrl,
      bodyPart: exercise.bodyPart,
      target: exercise.target,
      equipment: exercise.equipment
    };
    
    // Also add to exerciseDetails for rendering
    setExerciseDetails(prev => ({
      ...prev,
      [newExercise.id]: {
        gifUrl: exercise.gifUrl,
        bodyPart: exercise.bodyPart,
        target: exercise.target,
        equipment: exercise.equipment,
        instructions: exercise.instructions
      }
    }));
    
    setWorkoutData(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
    
    setShowExerciseSelector(false);
    setSearchTerm('');
    setSelectedListExercise(null);
  };
  
  // Remove exercise
  const removeExercise = (index) => {
    const updatedExercises = [...workoutData.exercises];
    updatedExercises.splice(index, 1);
    setWorkoutData(prev => ({ ...prev, exercises: updatedExercises }));
  };
  
  // Toggle exercise expansion
  const handleExerciseClick = (id) => {
    setExpandedExercise(expandedExercise === id ? null : id);
  };
  
  // View details of an exercise in the list
  const viewExerciseDetails = (exercise) => {
    setSelectedListExercise(exercise);
  };
  
  // Validate form before saving
  const validateForm = () => {
    const errors = {};
    
    if (!workoutData.name.trim()) {
      errors.name = "Workout name is required";
    }
    
    if (!workoutData.level) {
      errors.level = "Level is required";
    }
    
    if (!workoutData.timesPerWeek) {
      errors.timesPerWeek = "Frequency is required";
    } else if (isNaN(workoutData.timesPerWeek) || workoutData.timesPerWeek < 1 || workoutData.timesPerWeek > 7) {
      errors.timesPerWeek = "Frequency must be between 1-7";
    }
    
    if (workoutData.exercises.length === 0) {
      errors.exercises = "At least one exercise is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Save workout
  const handleSave = () => {
    if (!validateForm()) return;
    
    onSave({
      ...workout,
      ...workoutData,
      timesPerWeek: Number(workoutData.timesPerWeek)
    });
  };
  
  // Format date for display
  const formattedDate = new Date(workout.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Filter exercises for search
  const filteredExercises = exerciseLibrary.filter(exercise => 
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.bodyPart?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.equipment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle sections in the exercise details view
  const toggleDetails = () => setDetailsOpen(!detailsOpen);
  const toggleInstructions = () => setInstructionsOpen(!instructionsOpen);

  return (
    <div className="modal-overlay">
      <div className="modal workout-details-modal workout-edit-modal">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="workout-details-header">
          <div className="form-group">
            <label htmlFor="workoutName">Workout Name</label>
            <input
              type="text"
              id="workoutName"
              name="name"
              value={workoutData.name}
              onChange={handleInputChange}
              className={`form-control ${formErrors.name ? 'error' : ''}`}
              placeholder="Enter workout name"
            />
            {formErrors.name && <div className="form-error">{formErrors.name}</div>}
          </div>
          
          <div className="workout-meta-grid workout-meta-edit-grid">
            <div className="meta-item">
              <Target size={18} />
              <div className="form-group compact">
                <label htmlFor="level">Level</label>
                <select
                  id="level"
                  name="level"
                  value={workoutData.level}
                  onChange={handleInputChange}
                  className={`form-select ${formErrors.level ? 'error' : ''}`}
                >
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                {formErrors.level && <div className="form-error">{formErrors.level}</div>}
              </div>
            </div>
            
            <div className="meta-item">
              <Clock size={18} />
              <div className="form-group compact">
                <label htmlFor="timesPerWeek">Frequency (per week)</label>
                <input
                  type="number"
                  id="timesPerWeek"
                  name="timesPerWeek"
                  min="1"
                  max="7"
                  value={workoutData.timesPerWeek}
                  onChange={handleInputChange}
                  className={`form-control ${formErrors.timesPerWeek ? 'error' : ''}`}
                />
                {formErrors.timesPerWeek && <div className="form-error">{formErrors.timesPerWeek}</div>}
              </div>
            </div>
            
            <div className="meta-item">
              <User size={18} />
              <div className="form-group compact">
                <label htmlFor="createdBy">Created by</label>
                <input
                  type="text"
                  id="createdBy"
                  name="createdBy"
                  value={workoutData.createdBy}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Creator name"
                />
              </div>
            </div>
            
            <div className="meta-item">
              <LayoutTemplate size={18} />
              <div className="form-group compact checkbox-group">
                <label htmlFor="isPremade">
                  <input
                    type="checkbox"
                    id="isPremade"
                    name="isPremade"
                    checked={workoutData.isPremade}
                    onChange={handleInputChange}
                  />
                  <span>Premade Workout</span>
                </label>
              </div>
            </div>
            
            <div className="meta-item">
              <Calendar size={18} />
              <span>Created: {formattedDate}</span>
            </div>
          </div>
        </div>

        {loading && !workoutData.exercises.length ? (
          <div className="workout-loading-container">
            <div className="workout-loading-spinner"></div>
            <span>Loading...</span>
          </div>
        ) : (
          <div className="workout-details-content">
            <div className="admin-exercises-header">
              <h3>Exercises</h3>
              <div className="admin-exercises-actions">
                <button 
                  className="add-exercise-btn"
                  onClick={() => setShowExerciseSelector(!showExerciseSelector)}
                >
                  <Plus size={16} />
                  <span>Add Exercise</span>
                </button>
                <span className="admin-exercise-count">
                  {workoutData.exercises?.length || 0} exercises
                </span>
              </div>
              {formErrors.exercises && <div className="form-error exercise-list-error">{formErrors.exercises}</div>}
            </div>

            {showExerciseSelector && (
              <div className="exercise-selector">
                <div className="exercise-selector-header">
                  <div className="exercise-search">
                    <input
                      type="text"
                      placeholder="Search exercises by name, body part, or equipment..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button
                    className="close-selector-btn"
                    onClick={() => {
                      setShowExerciseSelector(false);
                      setSelectedListExercise(null);
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <div className="exercise-selector-content">
                  <div className="exercise-selector-list">
                    {filteredExercises.length > 0 ? (
                      filteredExercises.map(exercise => (
                        <div 
                          key={exercise.id} 
                          className={`exercise-selector-item ${selectedListExercise?.id === exercise.id ? 'selected' : ''}`}
                          onClick={() => viewExerciseDetails(exercise)}
                        >
                          <div className="exercise-selector-icon">
                            <Dumbbell size={16} />
                          </div>
                          <div className="exercise-selector-info">
                            <span className="exercise-selector-name">{exercise.name}</span>
                            <div className="exercise-selector-tags">
                              <span className="exercise-tag">{exercise.bodyPart}</span>
                              <span className="exercise-tag">{exercise.target}</span>
                              <span className="exercise-tag">{exercise.equipment}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="exercise-selector-empty">
                        <AlertCircle size={20} />
                        <span>No exercises found. Try a different search term.</span>
                      </div>
                    )}
                  </div>
                  
                  {selectedListExercise && (
                    <div className="exercise-selector-details">
                      <div className="exercise-preview-header">
                        <h4>{selectedListExercise.name}</h4>
                        <button 
                          className="add-selected-exercise-btn"
                          onClick={() => addExercise(selectedListExercise)}
                        >
                          <Plus size={16} />
                          <span>Add to Workout</span>
                        </button>
                      </div>
                      
                      <div className="exercise-preview-content">
                        <div className="exercise-preview-video">
                          <img
                            src={selectedListExercise.gifUrl}
                            alt={selectedListExercise.name}
                            loading="lazy"
                          />
                        </div>
                        
                        <div className="exercise-preview-info">
                          <div className="exercise-info-section">
                            <div className="exercise-info-header" onClick={toggleDetails}>
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
                                  <span className="info-value">{selectedListExercise.bodyPart}</span>
                                  
                                  <span className="info-label">Target:</span>
                                  <span className="info-value">{selectedListExercise.target}</span>
                                  
                                  <span className="info-label">Equipment:</span>
                                  <span className="info-value">{selectedListExercise.equipment}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="exercise-info-section">
                            <div className="exercise-info-header" onClick={toggleInstructions}>
                              <h4>Instructions</h4>
                              <ChevronDown
                                size={16}
                                className={`info-chevron ${instructionsOpen ? 'rotated' : ''}`}
                              />
                            </div>
                            
                            {instructionsOpen && (
                              <div className="exercise-info-content">
                                <ol className="exercise-instructions-list">
                                  {selectedListExercise.instructions?.map((instruction, i) => (
                                    <li key={i}>{instruction}</li>
                                  ))}
                                </ol>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="admin-exercises-list sortable-list">
              {workoutData.exercises.map((exercise, index) => (
                <div key={exercise.id} className="admin-exercise-item-wrapper">
                  <div
                    className={`admin-exercise-item ${expandedExercise === exercise.id ? 'expanded' : ''}`}
                    onClick={() => handleExerciseClick(exercise.id)}
                  >
                    <div className="exercise-drag-handle">
                      <span className="drag-dots">⋮⋮</span>
                    </div>
                    <div className="admin-exercise-icon">
                      <Dumbbell size={20} />
                    </div>
                    <div className="admin-exercise-info">
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="admin-exercise-name-input"
                        placeholder="Exercise name"
                      />
                      <input
                        type="text"
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="admin-exercise-reps-input"
                        placeholder="e.g. 3 sets x 10 reps"
                      />
                    </div>
                    <button 
                      className="remove-exercise-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeExercise(index);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                    <ChevronDown
                      size={20}
                      className={`admin-exercise-chevron ${expandedExercise === exercise.id ? 'rotated' : ''}`}
                    />
                  </div>
                  {expandedExercise === exercise.id && (
                    <div className="admin-exercise-content">
                      {exerciseDetails[exercise.id] ? (
                        <div className="admin-exercise-details">
                          <div className="admin-exercise-video">
                            <img
                              src={exerciseDetails[exercise.id].gifUrl}
                              alt={exercise.name}
                              loading="lazy"
                            />
                          </div>
                          
                          {/* Exercise Body Part, Target, Equipment Info */}
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
                                <span className="info-value">{exerciseDetails[exercise.id].bodyPart}</span>
                                
                                <span className="info-label">Target:</span>
                                <span className="info-value">{exerciseDetails[exercise.id].target}</span>
                                
                                <span className="info-label">Equipment:</span>
                                <span className="info-value">{exerciseDetails[exercise.id].equipment}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Exercise Instructions */}
                          <div className="exercise-info-section">
                            <div className="exercise-info-header">
                              <h4>Instructions</h4>
                              <ChevronDown
                                size={16}
                                className="info-chevron"
                              />
                            </div>
                            <div className="exercise-info-content">
                              <ol className="exercise-instructions-list">
                                {exerciseDetails[exercise.id].instructions?.map((instruction, i) => (
                                  <li key={i}>{instruction}</li>
                                ))}
                              </ol>
                            </div>
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
        
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>
            <Save size={16} />
            <span>Save Workout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutEditModal;