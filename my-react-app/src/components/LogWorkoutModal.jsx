"use client"

import { useState } from "react";

const LogWorkoutModal = ({ workout, onClose, onSave }) => {
  const [duration, setDuration] = useState(workout.duration);
  const [notes, setNotes] = useState("");
  const [completedExercises, setCompletedExercises] = useState(
    workout.exercises.map(ex => ({
      id: ex.id,
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps,
      weight: "",
      completed: false
    }))
  );

  const handleExerciseToggle = (index) => {
    const updated = [...completedExercises];
    updated[index].completed = !updated[index].completed;
    setCompletedExercises(updated);
  };

  const handleWeightChange = (index, value) => {
    const updated = [...completedExercises];
    updated[index].weight = value;
    setCompletedExercises(updated);
  };

  const handleSave = () => {
    const workoutLog = {
      workoutId: workout.id,
      duration: parseInt(duration),
      notes,
      exercises: completedExercises,
      date: new Date().toISOString(),
    };
    onSave(workoutLog);
  };

  // Enhanced modal styles for better centering on small screens like iPhone SE
  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px',
      overflowY: 'auto',
      zIndex: 1000,
    },
    modal: {
      margin: '0 auto',
      maxHeight: '100vh',
      overflowY: 'auto',
      width: '100%',
      maxWidth: '700px',
      position: 'relative',
      top: 0,
      transform: 'none',
    }
  };

  return (
    <div className="workout-modal-overlay" onClick={onClose} style={modalStyles.overlay}>
      <div className="log-workout-modal" onClick={(e) => e.stopPropagation()} style={modalStyles.modal}>
        <button className="close-modal" onClick={onClose}>×</button>
        
        <h2 className="log-modal-title">Log Workout: {workout.title}</h2>
        
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
            {completedExercises.map((exercise, index) => (
              <div key={exercise.id} className="log-exercise-item">
                <div className="log-exercise-header">
                  <div className="log-exercise-check">
                    <input
                      type="checkbox"
                      id={`exercise-${index}`}
                      checked={exercise.completed}
                      onChange={() => handleExerciseToggle(index)}
                    />
                    <label 
                      htmlFor={`exercise-${index}`}
                      className="log-exercise-name"
                    >
                      {exercise.name}
                    </label>
                  </div>
                </div>
                
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
                      <label className="log-meta-label">Weight:</label>
                      <input
                        type="text"
                        className="log-weight-input"
                        value={exercise.weight}
                        onChange={(e) => handleWeightChange(index, e.target.value)}
                        placeholder="0"
                      />
                      <span className="log-weight-unit">kg</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="log-form-group">
          <label htmlFor="workout-notes">Notes</label>
          <textarea
            id="workout-notes"
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How was your workout? Add any notes here..."
          ></textarea>
        </div>
        
        <div className="log-modal-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="save-button" onClick={handleSave}>Save Log</button>
        </div>
      </div>
    </div>
  );
};

export default LogWorkoutModal;

