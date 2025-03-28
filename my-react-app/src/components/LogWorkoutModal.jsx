"use client"

import { useState } from "react"

const LogWorkoutModal = ({ workout, onClose, onSave }) => {
  const [duration, setDuration] = useState(workout.duration)
  const [notes, setNotes] = useState("")
  const [exercises, setExercises] = useState(
    workout.exercises.map((exercise) => ({
      ...exercise,
      weight: 0,
      completed: true,
    })),
  )

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...exercises]
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: field === "weight" ? Number.parseFloat(value) || 0 : value,
    }
    setExercises(updatedExercises)
  }

  const handleSave = () => {
    const completedExercises = exercises.filter((ex) => ex.completed)

    if (completedExercises.length === 0) {
      alert("Please complete at least one exercise")
      return
    }

    const workoutLog = {
      workoutId: workout.id,
      duration: Number.parseInt(duration),
      notes,
      exercises: completedExercises,
    }

    onSave(workoutLog)
  }

  return (
    <div className="workout-modal-overlay" onClick={onClose}>
      <div className="log-workout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          ×
        </button>

        <h2 className="log-modal-title">Log Workout: {workout.title}</h2>

        <div className="log-modal-content">
          <div className="log-form-group">
            <label htmlFor="workout-duration">Duration (minutes)</label>
            <input
              type="number"
              id="workout-duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
              max="300"
            />
          </div>

          <div className="log-exercises-section">
            <h3>Exercises</h3>
            <div className="log-exercises-list">
              {exercises.map((exercise, index) => (
                <div key={exercise.id} className="log-exercise-item">
                  <div className="log-exercise-header">
                    <div className="log-exercise-check">
                      <input
                        type="checkbox"
                        id={`exercise-${index}`}
                        checked={exercise.completed}
                        onChange={(e) => handleExerciseChange(index, "completed", e.target.checked)}
                      />
                      <label htmlFor={`exercise-${index}`} className="log-exercise-name">
                        {exercise.name}
                      </label>
                    </div>
                  </div>

                  {exercise.completed && (
                    <div className="log-exercise-details">
                      <div className="log-exercise-meta">
                        <div className="log-meta-item">
                          <span className="log-meta-label">Sets:</span>
                          <span className="log-meta-value">{exercise.sets}</span>
                        </div>
                        <div className="log-meta-item">
                          <span className="log-meta-label">Reps:</span>
                          <span className="log-meta-value">{exercise.reps}</span>
                        </div>
                        <div className="log-meta-item">
                          <label className="log-meta-label" htmlFor={`weight-${index}`}>
                            Weight:
                          </label>
                          <input
                            type="number"
                            id={`weight-${index}`}
                            className="log-weight-input"
                            value={exercise.weight}
                            onChange={(e) => handleExerciseChange(index, "weight", e.target.value)}
                            min="0"
                            step="2.5"
                          />
                          <span className="log-weight-unit">lbs</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="log-form-group">
            <label htmlFor="workout-notes">Notes</label>
            <textarea
              id="workout-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did the workout go? Any PRs or challenges?"
              rows="3"
            ></textarea>
          </div>
        </div>

        <div className="log-modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="save-button" onClick={handleSave}>
            Log Workout
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogWorkoutModal

