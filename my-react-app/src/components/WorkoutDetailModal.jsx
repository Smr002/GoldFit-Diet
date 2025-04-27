"use client";
import { useEffect, useState } from "react";
import ExerciseDetailModal from "./ExerciseDetailModal";
import { deleteWorkout } from "@/api";
import UpdateStatusModal from "./UpdateStatusModal";
import { getUserIdFromToken } from "@/helper";

const WorkoutDetailModal = ({
  workout,
  onClose,
  isFavorite,
  hasNotification,
  onToggleFavorite,
  onToggleNotification,
  onEdit,
  onDelete,
  onLog,
  logs = [],
  token,
}) => {
  const [showExerciseDetail, setShowExerciseDetail] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Track deletion state
  const [error, setError] = useState(null); // Track deletion errors
  const [isOwner, setIsOwner] = useState(true);

  const handleExerciseClick = (exerciseId) => {
    setSelectedExercise(exerciseId);
    setShowExerciseDetail(true);
  };

  const handleDeleteWorkout = () => {
    setShowConfirmDelete(true);
    setError(null); // Reset error state
  };

  useEffect(() => {
    // Use the passed token prop instead of an environment variable
    if (!token) {
      setIsOwner(false);
      return;
    }

    const loggedInUserId = getUserIdFromToken(token);

    if (workout?.userId && loggedInUserId) {
      setIsOwner(workout.userId === loggedInUserId);
    } else {
      setIsOwner(false);
    }
  }, [workout, token]);

  const confirmDelete = async () => {
    if (!workout || !workout.id || !token) {
      setError("Missing workout ID or authentication token.");
      setShowConfirmDelete(false);
      return;
    }

    setIsDeleting(true); // Show loading state
    try {
      await deleteWorkout(workout.id, token); // Call API

      if (typeof onDelete === "function") {
        onDelete(workout.id); // Notify parent
      }

      setShowConfirmDelete(false); // Close confirm modal
      onClose(); // Close detail modal
    } catch (err) {
      console.error("Failed to delete workout:", err);
      setError("Failed to delete workout. Please try again.");
    } finally {
      setIsDeleting(false); // Reset state
    }
  };

  const closeExerciseDetail = () => {
    setShowExerciseDetail(false);
    setSelectedExercise(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "#4ade80";
      case "intermediate":
        return "#facc15";
      case "advanced":
        return "#ef4444";
      default:
        return "#a3a3a3";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof onEdit === "function") {
      onEdit();
    }
  };

  return (
    <div
      className="workout-modal-overlay"
      onClick={onClose}
      style={modalStyles.overlay}
    >
      <div
        className="workout-modal"
        onClick={(e) => e.stopPropagation()}
        style={modalStyles.modal}
      >
        <button className="close-modal" onClick={onClose}>
          ×
        </button>

        <div className="workout-modal-header">
          <div className="workout-modal-title-section">
            <h3 className="workout-modal-title">{workout.title}</h3>
            <p className="workout-modal-description">{workout.description}</p>
          </div>

          <div className="workout-modal-actions">
            <button
              className={`modal-action-button ${isFavorite ? "active" : ""}`}
              onClick={onToggleFavorite}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              Favorite
            </button>

          </div>
        </div>

        <div className="workout-modal-content">
          <div className="workout-modal-info">
            <div className="workout-modal-badges">
              <span
                className="difficulty-badge large"
                style={{
                  backgroundColor: getDifficultyColor(workout.difficulty),
                }}
              >
                {workout.difficulty}
              </span>
              <span className="duration-badge large">
                {workout.duration} min
              </span>
              <span className="goal-badge large">{workout.goal}</span>
            </div>

            <div className="workout-info-section">
              <h3>Workout Information</h3>
              <div className="workout-detail-item">
                <span className="detail-label">Created</span>
                <span className="detail-value">
                  {formatDate(workout.createdAt)}
                </span>
              </div>
              <div className="workout-detail-item">
                <span className="detail-label">Target</span>
                <span className="detail-value">{workout.goal}</span>
              </div>
              <div className="workout-detail-item">
                <span className="detail-label">Exercises</span>
                <span className="detail-value">{workout.exercises.length}</span>
              </div>
            </div>
          </div>

          <div className="workout-exercises-section">
            <h3>Exercises</h3>
            <div className="exercise-list">
              {workout.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className="exercise-item"
                  onClick={() => handleExerciseClick(exercise.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="exercise-number">{index + 1}</div>
                  <div className="exercise-details">
                    <h4 className="exercise-name">{exercise.name}</h4>
                    <div className="exercise-meta">
                      <span>{exercise.sets} sets</span>
                      <span>{exercise.reps} reps</span>
                      <span>{exercise.rest}s rest</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {logs && logs.length > 0 && (
            <div className="workout-history-section">
              <h3>History</h3>
              <div className="workout-logs">
                {logs.map((log) => (
                  <div key={log.id} className="workout-log-item">
                    <div className="log-date-time">
                      <span className="log-date">{formatDate(log.date)}</span>
                      <span className="log-duration">{log.duration} min</span>
                    </div>
                    {log.notes && <p className="log-notes">{log.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div
            className="error-message"
            style={{ color: "#ef4444", marginBottom: "10px" }}
          >
            {error}
          </div>
        )}

        <div className="workout-modal-footer">
     

          <button className="modal-log-button" onClick={onLog}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Log Workout
          </button>
        </div>

        {showConfirmDelete && (
          <UpdateStatusModal
            mode="confirm"
            message="This action cannot be undone."
            onClose={() => setShowConfirmDelete(false)}
            onConfirm={confirmDelete}
          />
        )}

        {showExerciseDetail && selectedExercise && (
          <ExerciseDetailModal
            exerciseId={selectedExercise}
            token={token}
            onClose={closeExerciseDetail}
          />
        )}
      </div>
    </div>
  );
};

export default WorkoutDetailModal;
