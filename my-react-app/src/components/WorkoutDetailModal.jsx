"use client"
import { format } from "date-fns"

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
  logs,
}) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "#4ade80"
      case "intermediate":
        return "#facc15" 
      case "advanced":
        return "#ef4444" 
      default:
        return "#a3a3a3" 
    }
  }

  const confirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      onDelete()
    }
  }

  return (
    <div className="workout-modal-overlay" onClick={onClose}>
      <div className="workout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          ×
        </button>

        <div className="workout-modal-header">
          <div className="workout-modal-title-section">
            <h2 className="workout-modal-title">{workout.title}</h2>
            <p className="workout-modal-description">{workout.description}</p>
          </div>

          <div className="workout-modal-actions">
            <button
              className={`modal-action-button ${isFavorite ? "active" : ""}`}
              onClick={onToggleFavorite}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>{isFavorite ? "Favorited" : "Favorite"}</span>
            </button>

            <button
              className={`modal-action-button ${hasNotification ? "active" : ""}`}
              onClick={onToggleNotification}
              aria-label={hasNotification ? "Disable notifications" : "Enable notifications"}
            >
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
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span>{hasNotification ? "Notifications On" : "Notifications Off"}</span>
            </button>
          </div>
        </div>

        <div className="workout-modal-content">
          <div className="workout-modal-info">
            <div className="workout-modal-badges">
              <span
                className="difficulty-badge large"
                style={{ backgroundColor: getDifficultyColor(workout.difficulty) }}
              >
                {workout.difficulty}
              </span>
              <span className="duration-badge large">{workout.duration} min</span>
              <span className="goal-badge large">{workout.goal}</span>
            </div>

            <div className="workout-info-section">
              <h3>Workout Details</h3>
              <div className="workout-detail-item">
                <span className="detail-label">Created:</span>
                <span className="detail-value">{format(new Date(workout.createdAt), "MMM d, yyyy")}</span>
              </div>
              <div className="workout-detail-item">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{workout.isRecommended ? "Recommended" : "Custom"}</span>
              </div>
              <div className="workout-detail-item">
                <span className="detail-label">Total Exercises:</span>
                <span className="detail-value">{workout.exercises.length}</span>
              </div>
            </div>
          </div>

          <div className="workout-exercises-section">
            <h3>Exercises</h3>
            <div className="exercise-list">
              {workout.exercises.map((exercise, index) => (
                <div key={exercise.id} className="exercise-item">
                  <div className="exercise-number">{index + 1}</div>
                  <div className="exercise-details">
                    <h4 className="exercise-name">{exercise.name}</h4>
                    <div className="exercise-meta">
                      <span className="exercise-sets">{exercise.sets} sets</span>
                      <span className="exercise-reps">{exercise.reps} reps</span>
                      {exercise.rest && <span className="exercise-rest">{exercise.rest}s rest</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {logs && logs.length > 0 && (
            <div className="workout-history-section">
              <h3>Workout History</h3>
              <div className="workout-logs">
                {logs.map((log) => (
                  <div key={log.id} className="workout-log-item">
                    <div className="log-date-time">
                      <span className="log-date">{format(new Date(log.date), "MMM d, yyyy")}</span>
                      <span className="log-duration">{log.duration} min</span>
                    </div>
                    {log.notes && <p className="log-notes">{log.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="workout-modal-footer">
          {!workout.isRecommended && (
            <>
              <button className="modal-edit-button" onClick={onEdit}>
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
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit Workout
              </button>

              <button className="modal-delete-button" onClick={confirmDelete}>
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
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Delete
              </button>
            </>
          )}

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
      </div>
    </div>
  )
}

export default WorkoutDetailModal

