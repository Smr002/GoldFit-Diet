import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Target,
  LayoutTemplate,
  Dumbbell,
  ChevronDown,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  Info,
  Image,
  Upload,
  CheckIcon,
} from "lucide-react";
import { getExercisesById } from "../../api";

// Mapping for common exercise name variations
const exerciseNameMapping = {
  "Alternate Lateral Pulldown": [
    "alternate lateral pulldown",
    "lateral pulldown",
    "pulldown",
  ],
  "Assisted Parallel Close Grip Pull-up": [
    "assisted parallel close grip pull-up",
    "close grip pull-up",
    "assisted pull-up",
  ],
  "Assisted Pull-up": [
    "assisted pull-up",
    "assisted pullup",
    "pull-up",
    "pullup",
  ],
  "Barbell Pullover To Press": [
    "barbell pullover to press",
    "barbell pullover",
    "pullover press",
  ],
  "Barbell Bent Over Row": [
    "barbell bent over row",
    "bent over row",
    "barbell row",
  ],
};

const normalizeExerciseName = (name) => {
  return name.toLowerCase().replace(/\s+/g, " ").trim();
};

const WorkoutEditModal = ({ workout, onClose, onSave, isCreating = false }) => {
  const [editedWorkout, setEditedWorkout] = useState(workout);
  const [coverImage, setCoverImage] = useState(workout.coverImage || null);
  const fileInputRef = useRef(null);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [exerciseLibrary, setExerciseLibrary] = useState([]);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [exerciseDetails, setExerciseDetails] = useState({});
  const [selectedListExercise, setSelectedListExercise] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [haveExercises, setHaveExercises] = useState(workout.workoutExercises || []);

  // Add debug logs
  useEffect(() => {
    console.log("Initial workout:", workout);
    console.log("Initial workoutExercises:", workout.workoutExercises);
    console.log("Initial haveExercises:", haveExercises);
  }, []);

  // Update haveExercises when workout.workoutExercises changes
  useEffect(() => {
    console.log("workoutExercises changed:", workout.workoutExercises);
    if (workout.workoutExercises) {
      // Fetch exercise details for each workout exercise
      const fetchExerciseDetails = async () => {
        try {
          const token = localStorage.getItem("authToken");
          const exercisesWithDetails = await Promise.all(
            workout.workoutExercises.map(async (we) => {
              const exerciseDetails = await getExercisesById(we.exerciseId, token);
              return {
                ...we,
                exercise: exerciseDetails
              };
            })
          );
          console.log("Exercises with details:", exercisesWithDetails);
          setHaveExercises(exercisesWithDetails);
        } catch (error) {
          console.error("Error fetching exercise details:", error);
        }
      };
      fetchExerciseDetails();
    }
  }, [workout.workoutExercises]);

  // Fetch exercise library for adding new exercises
  useEffect(() => {
    const fetchExerciseLibrary = async () => {
      setLoading(true);
      try {
        // Fetch exercises from your backend API instead of the external API
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:3000/exercises", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch exercise library");
        }
        const data = await response.json();
        // Optionally process the data if needed
        setExerciseLibrary(data);
      } catch (error) {
        console.error("Error fetching exercise library:", error);
        setError(
          "Failed to load exercise library. You can still edit existing exercises."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseLibrary();
  }, []);

  // Fetch details for existing exercises in the workout
  useEffect(() => {
    const fetchExerciseDetails = async () => {
      if (!workout.workoutExercises || workout.workoutExercises.length === 0) return;

      try {
        const options = {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY || "",
            "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
          },
        };

        // Fetch exercises by their approximate names
        const exercisePromises = workout.workoutExercises.map((workoutExercise) => {
          const searchTerm =
            workoutExercise.exercise?.name?.[0] ||
            normalizeExerciseName(workoutExercise.exercise?.name);
          return fetch(
            `https://exercisedb.p.rapidapi.com/exercises/name/${searchTerm}`,
            options
          ).then((response) => response.json());
        });

        const results = await Promise.all(exercisePromises);

        // Create a mapping of exercise ID to complete exercise details
        const exerciseData = {};
        results.forEach((result, index) => {
          if (result && result.length > 0) {
            exerciseData[workout.workoutExercises[index].id] = {
              gifUrl: result[0].gifUrl,
              bodyPart: result[0].bodyPart,
              target: result[0].target,
              equipment: result[0].equipment,
              instructions: result[0].instructions || [
                "Follow the animation carefully.",
                "Maintain proper form throughout the exercise.",
              ],
            };
          }
        });

        setExerciseDetails(exerciseData);
      } catch (error) {
        console.error("Error fetching exercises:", error);
        setError(
          "Failed to fetch exercise details. Some visual elements may be missing."
        );
      }
    };

    fetchExerciseDetails();
  }, [workout.workoutExercises]);

  // Fetch exercises by ID
  useEffect(() => {
    const fetchExercises = async () => {
      if (!workout.workoutExercises || workout.workoutExercises.length === 0) return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const exercisePromises = workout.workoutExercises.map(workoutExercise => 
          getExercisesById(workoutExercise.exerciseId, token)
        );
        
        const exercises = await Promise.all(exercisePromises);
        setHaveExercises(exercises);
      } catch (error) {
        console.error("Error fetching exercises:", error);
        setError("Failed to fetch exercises");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [workout.workoutExercises]);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedWorkout((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle exercise changes
  const handleExerciseChange = (index, field, value) => {
    setEditedWorkout(prev => {
      const updatedExercises = [...(prev.workoutExercises || [])];
      updatedExercises[index] = {
        ...updatedExercises[index],
        [field]: value
      };
      return {
        ...prev,
        workoutExercises: updatedExercises
      };
    });
  };

  // Add new exercise
  const addExercise = (exercise) => {
    const newExercise = {
      exerciseId: exercise.id,
      workoutId: workout.id,
      dayOfTheWeek: 1, // Default to day 1
      sets: 3,
      reps: 10
    };

    setEditedWorkout(prev => ({
      ...prev,
      workoutExercises: [...(prev.workoutExercises || []), newExercise]
    }));

    setHaveExercises(prev => [...prev, exercise]);
    setShowExerciseSelector(false);
    setSearchTerm("");
    setSelectedListExercise(null);
  };

  // Remove exercise
  const removeExercise = (index) => {
    setEditedWorkout(prev => ({
      ...prev,
      workoutExercises: (prev.workoutExercises || []).filter((_, i) => i !== index)
    }));

    setHaveExercises(prev => prev.filter((_, i) => i !== index));
  };

  // Toggle exercise expansion
  const handleExerciseClick = (id) => {
    console.log("handleExerciseClick", id);
    console.log("Current haveExercises:", haveExercises);
    setExpandedExercise(expandedExercise === id ? null : id);
  };

  // View details of an exercise in the list
  const viewExerciseDetails = (exercise) => {
    setSelectedListExercise(exercise);
  };

  // Validate form before saving
  const validateForm = () => {
    const errors = {};

    if (!editedWorkout.name.trim()) {
      errors.name = "Workout name is required";
    }

    if (!editedWorkout.level) {
      errors.level = "Level is required";
    }

    if (!editedWorkout.timesPerWeek) {
      errors.timesPerWeek = "Frequency is required";
    } else if (
      isNaN(editedWorkout.timesPerWeek) ||
      editedWorkout.timesPerWeek < 1 ||
      editedWorkout.timesPerWeek > 7
    ) {
      errors.timesPerWeek = "Frequency must be between 1-7";
    }

    if (editedWorkout.workoutExercises.length === 0) {
      errors.exercises = "At least one exercise is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save workout
  const handleSave = () => {
    if (!validateForm()) return;

    // Map exercises to include only exerciseId, sets, reps
    const exercisesWithSetsReps = editedWorkout.workoutExercises.map((ex) => {
      return {
        exerciseId: ex.exerciseId,
        sets: ex.sets,
        reps: ex.reps,
        dayOfTheWeek: ex.dayOfTheWeek
      };
    });

    onSave({
      ...workout,
      ...editedWorkout,
      timesPerWeek: Number(editedWorkout.timesPerWeek),
      workoutExercises: exercisesWithSetsReps,
    });
  };

  // Format date for display
  const formattedDate = new Date(workout.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Filter exercises for search
  const filteredExercises = exerciseLibrary.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.bodyPart?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.equipment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle sections in the exercise details view
  const toggleDetails = () => setDetailsOpen(!detailsOpen);
  const toggleInstructions = () => setInstructionsOpen(!instructionsOpen);

  // Image upload handling
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setCoverImage(imageUrl);
        setEditedWorkout((prev) => ({
          ...prev,
          coverImage: imageUrl,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setEditedWorkout((prev) => ({
      ...prev,
      coverImage: null,
    }));
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal workout-details-modal workout-edit-modal">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <h2>{isCreating ? "Create New Workout" : "Edit Workout"}</h2>
        </div>

        <div className="workout-details-header">
          <div className="form-group">
            <label htmlFor="workoutName">Workout Name</label>
            <input
              type="text"
              id="workoutName"
              name="name"
              value={editedWorkout.name}
              onChange={handleInputChange}
              className={`form-control ${formErrors.name ? "error" : ""}`}
              placeholder="Enter workout name"
            />
            {formErrors.name && (
              <div className="form-error">{formErrors.name}</div>
            )}
          </div>


          <div className="workout-meta-grid workout-meta-edit-grid">
            <div className="meta-item">
              <Target size={18} />
              <div className="form-group compact">
                <label htmlFor="level">Level</label>
                <select
                  id="level"
                  name="level"
                  value={editedWorkout.level}
                  onChange={handleInputChange}
                  className={`form-select ${formErrors.level ? "error" : ""}`}
                >
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                {formErrors.level && (
                  <div className="form-error">{formErrors.level}</div>
                )}
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
                  value={editedWorkout.timesPerWeek}
                  onChange={handleInputChange}
                  className={`form-control ${
                    formErrors.timesPerWeek ? "error" : ""
                  }`}
                />
                {formErrors.timesPerWeek && (
                  <div className="form-error">{formErrors.timesPerWeek}</div>
                )}
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
                  value={editedWorkout.createdBy}
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
                    checked={editedWorkout.isPremade}
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

        {loading && !editedWorkout.workoutExercises?.length ? (
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
                 <span>+</span>
                </button>
                <span className="admin-exercise-count">
                  {haveExercises.length || 0} exercises
                </span>
              </div>
              {formErrors.exercises && (
                <div className="form-error exercise-list-error">
                  {formErrors.exercises}
                </div>
              )}
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
                      filteredExercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className={`exercise-selector-item ${
                            selectedListExercise?.id === exercise.id
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => viewExerciseDetails(exercise)}
                        >
                          <div className="exercise-selector-icon">
                            <Dumbbell size={16} />
                          </div>
                          <div className="exercise-selector-info">
                            <span className="exercise-selector-name">
                              {exercise.name}
                            </span>
                            <div className="exercise-selector-tags">
                              <span className="exercise-tag">
                                {exercise.bodyPart}
                              </span>
                              <span className="exercise-tag">
                                {exercise.target}
                              </span>
                              <span className="exercise-tag">
                                {exercise.equipment}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="exercise-selector-empty">
                        <AlertCircle size={20} />
                        <span>
                          No exercises found. Try a different search term.
                        </span>
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
                            <div
                              className="exercise-info-header"
                              onClick={toggleDetails}
                            >
                              <h4>Details</h4>
                              <ChevronDown
                                size={16}
                                className={`info-chevron ${
                                  detailsOpen ? "rotated" : ""
                                }`}
                              />
                            </div>

                            {detailsOpen && (
                              <div className="exercise-info-content">
                                <div className="exercise-info-grid">
                                  <span className="info-label">Body Part:</span>
                                  <span className="info-value">
                                    {selectedListExercise.bodyPart}
                                  </span>

                                  <span className="info-label">Target:</span>
                                  <span className="info-value">
                                    {selectedListExercise.target}
                                  </span>

                                  <span className="info-label">Equipment:</span>
                                  <span className="info-value">
                                    {selectedListExercise.equipment}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="exercise-info-section">
                            <div
                              className="exercise-info-header"
                              onClick={toggleInstructions}
                            >
                              <h4>Instructions</h4>
                              <ChevronDown
                                size={16}
                                className={`info-chevron ${
                                  instructionsOpen ? "rotated" : ""
                                }`}
                              />
                            </div>

                            {instructionsOpen && (
                              <div className="exercise-info-content">
                                <ol className="exercise-instructions-list">
                                  {selectedListExercise.instructions?.map(
                                    (instruction, i) => (
                                      <li key={i}>{instruction}</li>
                                    )
                                  )}
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
       
              {haveExercises && haveExercises.length > 0 ? (
                haveExercises.map((workoutExercise, index) => {
                  // Find the corresponding workout exercise details
                  const workoutExerciseDetails = editedWorkout.workoutExercises?.find(
                    we => we.exerciseId === workoutExercise.id
                  );
                  
                  console.log("Exercise:", workoutExercise);
                  console.log("Exercise Details:", workoutExerciseDetails);
                  
                  return (
                    <div key={workoutExercise.id} className="admin-exercise-item-wrapper">
                      <div
                        className={`admin-exercise-item ${
                          expandedExercise === workoutExercise.id ? "expanded" : ""
                        }`}
                        onClick={() => handleExerciseClick(workoutExercise.id)}
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
                              {workoutExercise.name}
                            </h4>
                            <div className="exercise-meta">
                              {workoutExerciseDetails ? (
                                <>
                                  {workoutExerciseDetails.sets} sets x {workoutExerciseDetails.reps} reps
                                </>
                              ) : (
                                "No sets/reps specified"
                              )}
                            </div>
                          </div>
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
                          className={`admin-exercise-chevron ${
                            expandedExercise === workoutExercise.id ? "rotated" : ""
                          }`}
                        />
                      </div>
                      {expandedExercise === workoutExercise.id && (
                        <div className="admin-exercise-content">
                          <div className="admin-exercise-details">
                            <div className="admin-exercise-video">
                              <img
                                src={workoutExercise.gifUrl}
                                alt={workoutExercise.name}
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
                                    {workoutExercise.muscleGroup}
                                  </span>

                                  <span className="info-label">Target:</span>
                                  <span className="info-value">
                                    {workoutExercise.target || workoutExercise.muscleGroup}
                                  </span>

                                  <span className="info-label">Equipment:</span>
                                  <span className="info-value">
                                    {workoutExercise.equipment || "Bodyweight"}
                                  </span>

                                  {workoutExerciseDetails && (
                                    <>
                                      <span className="info-label">Day:</span>
                                      <span className="info-value">
                                        Day {workoutExerciseDetails.dayOfTheWeek}
                                      </span>
                                    </>
                                  )}
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
                                  {workoutExercise.instructions ? (
                                    workoutExercise.instructions.map((instruction, i) => (
                                      <li key={i}>{instruction}</li>
                                    ))
                                  ) : (
                                    <li>Follow proper form and technique for {workoutExercise.name}</li>
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
                  No exercises added yet. Click the + button to add exercises.
                </div>
              )}
            </div>

      
          </div>
        )}

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            <Save size={16} />
            <span>{isCreating ? "Create Workout" : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutEditModal;
