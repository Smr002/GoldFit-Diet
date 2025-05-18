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
} from "lucide-react";

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
        const exercisePromises = workout.exercises.map((exercise) => {
          const searchTerm =
            exerciseNameMapping[exercise.name]?.[0] ||
            normalizeExerciseName(exercise.name);
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
            exerciseData[workout.exercises[index].id] = {
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
  }, [workout.exercises]);

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
    const updatedExercises = [...editedWorkout.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value,
    };
    setEditedWorkout((prev) => ({ ...prev, exercises: updatedExercises }));
  };

  // Add new exercise
  const addExercise = (exercise) => {
    // Use the real DB id as exerciseId
    const newExercise = {
      exerciseId: exercise.id, // real DB id from library
      name: exercise.name || "New Exercise",
      reps: "3 sets x 10 reps",
      gifUrl: exercise.gifUrl,
      bodyPart: exercise.bodyPart,
      target: exercise.target,
      equipment: exercise.equipment,
    };

    setExerciseDetails((prev) => ({
      ...prev,
      [exercise.id]: {
        gifUrl: exercise.gifUrl,
        bodyPart: exercise.bodyPart,
        target: exercise.target,
        equipment: exercise.equipment,
        instructions: exercise.instructions,
      },
    }));

    setEditedWorkout((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));

    setShowExerciseSelector(false);
    setSearchTerm("");
    setSelectedListExercise(null);
  };

  // Remove exercise
  const removeExercise = (index) => {
    const updatedExercises = [...editedWorkout.exercises];
    updatedExercises.splice(index, 1);
    setEditedWorkout((prev) => ({ ...prev, exercises: updatedExercises }));
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

    if (editedWorkout.exercises.length === 0) {
      errors.exercises = "At least one exercise is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Utility to parse reps string like "3 sets x 10 reps" to { sets: 3, reps: 10 }
  function parseRepsString(repsString) {
    // Match patterns like "3 sets x 10 reps" or "4 sets x 12 reps"
    const match = repsString.match(/(\d+)\s*sets?\s*x\s*(\d+)\s*reps?/i);
    if (match) {
      return {
        sets: parseInt(match[1], 10),
        reps: parseInt(match[2], 10),
      };
    }
    // fallback: try to extract any two numbers
    const numbers = repsString.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      return {
        sets: parseInt(numbers[0], 10),
        reps: parseInt(numbers[1], 10),
      };
    }
    return { sets: null, reps: null };
  }

  // Save workout
  const handleSave = () => {
    if (!validateForm()) return;

    // Map exercises to include only exerciseId, sets, reps
    const exercisesWithSetsReps = editedWorkout.exercises.map((ex) => {
      const { sets, reps } = parseRepsString(ex.reps || "");
      return {
        exerciseId: ex.exerciseId, // always use the DB id
        sets,
        reps,
      };
    });

    onSave({
      ...workout,
      ...editedWorkout,
      timesPerWeek: Number(editedWorkout.timesPerWeek),
      exercises: exercisesWithSetsReps,
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

          {/* Cover Image Upload Section */}
          <div className="form-group cover-image-upload">
            <label>
              Cover Image {isCreating && <span className="required">*</span>}
            </label>
            <div className="image-upload-container">
              {coverImage ? (
                <div className="image-preview-container">
                  <img
                    src={coverImage}
                    alt="Workout cover"
                    className="image-preview"
                  />
                  <button
                    className="remove-image-btn"
                    onClick={handleRemoveImage}
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <div
                  className="upload-placeholder"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Image size={48} />
                  <p>Click to upload workout cover image</p>
                  <span>Recommended: 16:9 ratio, min 800x450px</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
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

        {loading && !editedWorkout.exercises.length ? (
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
                  {editedWorkout.exercises?.length || 0} exercises
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
              {editedWorkout.exercises.map((exercise, index) => (
                <div key={exercise.id} className="admin-exercise-item-wrapper">
                  <div
                    className={`admin-exercise-item ${
                      expandedExercise === exercise.id ? "expanded" : ""
                    }`}
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
                        onChange={(e) =>
                          handleExerciseChange(index, "name", e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="admin-exercise-name-input"
                        placeholder="Exercise name"
                      />
                      <input
                        type="text"
                        value={exercise.reps}
                        onChange={(e) =>
                          handleExerciseChange(index, "reps", e.target.value)
                        }
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
                      className={`admin-exercise-chevron ${
                        expandedExercise === exercise.id ? "rotated" : ""
                      }`}
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
                                <span className="info-value">
                                  {exerciseDetails[exercise.id].bodyPart}
                                </span>

                                <span className="info-label">Target:</span>
                                <span className="info-value">
                                  {exerciseDetails[exercise.id].target}
                                </span>

                                <span className="info-label">Equipment:</span>
                                <span className="info-value">
                                  {exerciseDetails[exercise.id].equipment}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Exercise Instructions */}
                          <div className="exercise-info-section">
                            <div className="exercise-info-header">
                              <h4>Instructions</h4>
                              <ChevronDown size={16} className="info-chevron" />
                            </div>
                            <div className="exercise-info-content">
                              <ol className="exercise-instructions-list">
                                {exerciseDetails[exercise.id].instructions?.map(
                                  (instruction, i) => (
                                    <li key={i}>{instruction}</li>
                                  )
                                )}
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
