"use client";
import { updateWorkout, getExercises } from "@/api";
import { useState, useEffect } from "react";
import UpdateStatusModal from "./UpdateStatusModal";

const CreateWorkoutModal = ({ onClose, onSave, workout = null }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [duration, setDuration] = useState(30);
  const [goal, setGoal] = useState("general fitness");
  const [showStatus, setShowStatus] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState({
    name: "",
    sets: 3,
    reps: 10,
    rest: 60,
  });
  const [src, setSrc] = useState("/placeholder.svg"); // Changed from imageUrl to src, using placeholder as default
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);

  // Add custom styles for the edit and remove buttons
  const buttonStyles = {
    editButton: {
      backgroundColor: "#4ade80", // green
      color: "white",
      borderRadius: "4px",
      padding: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      cursor: "pointer",
      marginRight: "5px",
    },
    removeButton: {
      backgroundColor: "#ef4444", // red
      color: "white",
      borderRadius: "4px",
      padding: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      cursor: "pointer",
    },
  };

  // Enhanced modal styles for better centering on small screens like iPhone SE
  const modalStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px",
      overflowY: "auto",
      zIndex: 1000,
    },
    modal: {
      margin: "0 auto",
      maxHeight: "100vh",
      overflowY: "auto",
      width: "100%",
      maxWidth: "700px",
      position: "relative",
      top: 0,
      transform: "none",
    },
  };

  useEffect(() => {
    if (workout) {
      setTitle(workout.title);
      setDescription(workout.description);
      setDifficulty(workout.difficulty);
      setDuration(workout.duration);
      setGoal(workout.goal);
      setExercises(workout.exercises);
      setSrc(workout.src || "/placeholder.svg"); // Changed to src
    }
  }, [workout]);

  const handleAddExercise = () => {
    if (!currentExercise.name) return;

    if (isEditing && editingIndex >= 0) {
      const updatedExercises = [...exercises];
      updatedExercises[editingIndex] = {
        ...currentExercise,
        id: exercises[editingIndex].id,
      };
      setExercises(updatedExercises);
      setIsEditing(false);
      setEditingIndex(-1);
    } else {
      setExercises([
        ...exercises,
        {
          ...currentExercise,
          id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        },
      ]);
    }

    setCurrentExercise({
      name: "",
      sets: 3,
      reps: 10,
      rest: 60,
    });
  };

  const handleEditExercise = (index) => {
    setCurrentExercise(exercises[index]);
    setIsEditing(true);
    setEditingIndex(index);
  };

  const handleRemoveExercise = (index) => {
    const updatedExercises = [...exercises];
    updatedExercises.splice(index, 1);
    setExercises(updatedExercises);

    if (isEditing && editingIndex === index) {
      setIsEditing(false);
      setEditingIndex(-1);
      setCurrentExercise({
        name: "",
        sets: 3,
        reps: 10,
        rest: 60,
      });
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return alert("Workout title is required.");
    if (exercises.length === 0) return alert("Add at least one exercise.");

    try {
      const all = await getExercises(import.meta.env.VITE_AUTH_TOKEN);
      const resolved = exercises.map((ex) => {
        const match = all.find(
          (e) => e.name.toLowerCase() === ex.name.toLowerCase()
        );
        return {
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          rest: ex.rest,
          exerciseId: match?.id,
        };
      });

      if (resolved.some((ex) => typeof ex.exerciseId !== "number")) {
        setUpdateSuccess(false);
        setStatusMessage("Some exercises could not be matched with an ID.");
        setShowStatus(true);
        return;
      }

      const data = {
        name: title,
        description,
        difficulty,
        duration: Number(duration),
        goal,
        exercises: resolved,
        src,
      };

      if (workout) {
        await updateWorkout(workout.id, data, import.meta.env.VITE_AUTH_TOKEN);
        setUpdateSuccess(true);
        setStatusMessage("Workout updated successfully!");
      } else {
        setUpdateSuccess(true);
        setStatusMessage("Workout created successfully!");
      }

      setShowStatus(true);

      // Delay onSave so modal is visible
      setTimeout(() => {
        onSave(workout ? { ...workout, ...data } : data);
      }, 1500);
    } catch (err) {
      console.error(err);
      setUpdateSuccess(false);
      setStatusMessage("Something went wrong while saving.");
      setShowStatus(true);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setSrc(objectUrl); // Changed to setSrc
  };

  return (
    <div
      className="workout-modal-overlay"
      onClick={onClose}
      style={modalStyles.overlay}
    >
      <div
        className="create-workout-modal"
        onClick={(e) => e.stopPropagation()}
        style={modalStyles.modal}
      >
        <button className="close-modal" onClick={onClose}>
          ×
        </button>

        <h2 className="create-modal-title">
          {workout ? "Edit Workout" : "Create New Workout"}
        </h2>
        {showStatus && (
          <UpdateStatusModal
            status={updateSuccess ? "success" : "error"}
            message={
              updateSuccess
                ? "Workout saved successfully!"
                : "Something went wrong while saving."
            }
            onClose={() => setShowStatus(false)}
          />
        )}
        <div className="create-modal-content">
          <div className="create-modal-form">
            {/* Basic workout information form */}
            <div className="form-group">
              <label htmlFor="workout-title">Workout Title*</label>
              <input
                type="text"
                id="workout-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter workout title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="workout-description">Description</label>
              <textarea
                id="workout-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your workout"
                rows="3"
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="workout-difficulty">Difficulty</label>
                <select
                  id="workout-difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group half">
                <label htmlFor="workout-duration">Duration (minutes)</label>
                <input
                  type="number"
                  id="workout-duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min="5"
                  max="180"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="workout-goal">Goal</label>
              <select
                id="workout-goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              >
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibility</option>
                <option value="general fitness">General Fitness</option>
              </select>
            </div>

            <div className="form-group">
              <label>Workout Image</label>
              <div className="image-upload-container">
                <img
                  src={src || "/placeholder.svg"}
                  alt="Workout"
                  className="workout-image-preview"
                />{" "}
                {/* Changed to src */}
                <button
                  className="change-image-button"
                  onClick={() =>
                    document.getElementById("workout-image").click()
                  }
                >
                  Change Image
                </button>
                <input
                  type="file"
                  id="workout-image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>

          <div className="exercises-form">
            <h3>Exercises*</h3>

            {/* Exercise input form */}
            <div className="exercise-input-form">
              <div className="form-group">
                <label htmlFor="exercise-name">Exercise Name*</label>
                <input
                  type="text"
                  id="exercise-name"
                  value={currentExercise.name}
                  onChange={(e) =>
                    setCurrentExercise({
                      ...currentExercise,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter exercise name"
                />
              </div>

              <div className="form-row">
                <div className="form-group third">
                  <label htmlFor="exercise-sets">Sets</label>
                  <input
                    type="number"
                    id="exercise-sets"
                    value={currentExercise.sets}
                    onChange={(e) =>
                      setCurrentExercise({
                        ...currentExercise,
                        sets: Number.parseInt(e.target.value) || 1,
                      })
                    }
                    min="1"
                    max="10"
                  />
                </div>

                <div className="form-group third">
                  <label htmlFor="exercise-reps">Reps</label>
                  <input
                    type="number"
                    id="exercise-reps"
                    value={currentExercise.reps}
                    onChange={(e) =>
                      setCurrentExercise({
                        ...currentExercise,
                        reps: Number.parseInt(e.target.value) || 1,
                      })
                    }
                    min="1"
                    max="100"
                  />
                </div>

                <div className="form-group third">
                  <label htmlFor="exercise-rest">Rest (sec)</label>
                  <input
                    type="number"
                    id="exercise-rest"
                    value={currentExercise.rest}
                    onChange={(e) =>
                      setCurrentExercise({
                        ...currentExercise,
                        rest: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                    max="300"
                  />
                </div>
              </div>

              <button
                className="add-exercise-button"
                onClick={handleAddExercise}
                disabled={!currentExercise.name}
              >
                {isEditing ? "Update Exercise" : "Add Exercise"}
              </button>
            </div>

            {/* Exercise list */}
            <div className="exercises-list">
              {exercises.length > 0 ? (
                exercises.map((exercise, index) => (
                  <div key={exercise.id} className="exercise-list-item">
                    <div className="exercise-list-content">
                      <div className="exercise-number">{index + 1}</div>
                      <div className="exercise-list-details">
                        <h4 className="exercise-list-name">{exercise.name}</h4>
                        <div className="exercise-list-meta">
                          <span>{exercise.sets} sets</span>
                          <span>{exercise.reps} reps</span>
                          <span>{exercise.rest}s rest</span>
                        </div>
                      </div>
                    </div>
                    <div className="exercise-list-actions">
                      <button
                        style={buttonStyles.editButton}
                        onClick={() => handleEditExercise(index)}
                        title="Edit exercise"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      </button>
                      <button
                        style={buttonStyles.removeButton}
                        onClick={() => handleRemoveExercise(index)}
                        title="Remove exercise" // Fixed syntax
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-exercises">
                  <p>
                    No exercises added yet. Add at least one exercise to create
                    a workout.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="create-modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="save-button"
            onClick={handleSave}
            disabled={!title || exercises.length === 0}
          >
            {workout ? "Update Workout" : "Create Workout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkoutModal;
