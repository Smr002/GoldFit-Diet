"use client"
import { formatDistanceToNow } from "date-fns"

const WorkoutCard = ({
  workout,
  isFavorite,
  hasNotification,
  onToggleFavorite,
  onToggleNotification,
  onClick,
  onEdit,
  onLog,
  logs,
  style,
}) => {
  const lastLog = logs && logs.length > 0 ? logs[0] : null

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

  return (
    <div className="workout-card" style={style}>
      <div className="workout-image-container">
        <img src={workout.imageUrl || "/placeholder.svg"} alt={workout.title} className="workout-image" />
        <div className="workout-actions">
          <button
            className={`action-button favorite-button ${isFavorite ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite()
            }}
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
          </button>
          <button
            className={`action-button notification-button ${hasNotification ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation()
              onToggleNotification()
            }}
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
          </button>
        </div>
      </div>
      <div className="workout-content" onClick={onClick}>
        <h3 className="workout-title">{workout.title}</h3>
        <p className="workout-description">{workout.description}</p>
        <div className="workout-meta">
          <div className="workout-exercises">
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
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
            {workout.exercises.length} exercises
          </div>
          <div className="workout-goal">
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
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {workout.goal}
          </div>
        </div>
        {lastLog && (
          <div className="last-log">
            <span className="log-label">Last completed:</span>
            <span className="log-date">{formatDistanceToNow(new Date(lastLog.date))} ago</span>
          </div>
        )}
      </div>
      <div className="workout-footer">
        <div className="workout-badges-footer">
          <span className="difficulty-badge" style={{ backgroundColor: getDifficultyColor(workout.difficulty) }}>
            {workout.difficulty}
          </span>
          <span className="duration-badge">{workout.duration} min</span>
        </div>
        <div className="workout-actions-footer">
          {!workout.isRecommended && (
            <button
              className="edit-button"
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
            >
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
              Edit
            </button>
          )}
          <button
            className="log-button"
            onClick={(e) => {
              e.stopPropagation()
              onLog()
            }}
          >
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

export default WorkoutCard

