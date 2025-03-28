"use client"

import { useState, useEffect } from "react"

const CreateWorkoutModal = ({ onClose, onSave, workout = null }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [difficulty, setDifficulty] = useState("beginner")
  const [duration, setDuration] = useState(30)
  const [goal, setGoal] = useState("general fitness")
  const [exercises, setExercises] = useState([])
  const [currentExercise, setCurrentExercise] = useState({
    name: "",
    sets: 3,
    reps: 10,
    rest: 60,
  })
  const [imageUrl, setImageUrl] = useState("https://plus.unsplash.com/premium_photo-1661914978519-52a11fe159a7?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bG9nb3xlbnwwfHwwfHx8MA%3D%3D")
  const [isEditing, setIsEditing] = useState(false)
  const [editingIndex, setEditingIndex] = useState(-1)

  useEffect(() => {
    if (workout) {
      setTitle(workout.title)
      setDescription(workout.description)
      setDifficulty(workout.difficulty)
      setDuration(workout.duration)
      setGoal(workout.goal)
      setExercises(workout.exercises)
      setImageUrl(workout.imageUrl)
    }
  }, [workout])

  const handleAddExercise = () => {
    if (!currentExercise.name) return

    if (isEditing && editingIndex >= 0) {
      const updatedExercises = [...exercises]
      updatedExercises[editingIndex] = {
        ...currentExercise,
        id: exercises[editingIndex].id,
      }
      setExercises(updatedExercises)
      setIsEditing(false)
      setEditingIndex(-1)
    } else {
      setExercises([
        ...exercises,
        {
          ...currentExercise,
          id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        },
      ])
    }

    setCurrentExercise({
      name: "",
      sets: 3,
      reps: 10,
      rest: 60,
    })
  }

  const handleEditExercise = (index) => {
    setCurrentExercise(exercises[index])
    setIsEditing(true)
    setEditingIndex(index)
  }

  const handleRemoveExercise = (index) => {
    const updatedExercises = [...exercises]
    updatedExercises.splice(index, 1)
    setExercises(updatedExercises)

    if (isEditing && editingIndex === index) {
      setIsEditing(false)
      setEditingIndex(-1)
      setCurrentExercise({
        name: "",
        sets: 3,
        reps: 10,
        rest: 60,
      })
    }
  }

  const handleSave = () => {
    if (!title || exercises.length === 0) return

    const newWorkout = {
      title,
      description,
      difficulty,
      duration: Number.parseInt(duration),
      goal,
      exercises,
      imageUrl,
    }

    if (workout) {
      newWorkout.id = workout.id
      newWorkout.createdAt = workout.createdAt
      newWorkout.isRecommended = workout.isRecommended
    }

    onSave(newWorkout)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    setImageUrl(objectUrl)
  }

  return (
    <div className="workout-modal-overlay" onClick={onClose}>
      <div className="create-workout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          ×
        </button>

        <h2 className="create-modal-title">{workout ? "Edit Workout" : "Create New Workout"}</h2>

        <div className="create-modal-content">
          <div className="create-modal-form">
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
                <select id="workout-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
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
              <select id="workout-goal" value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibility</option>
                <option value="general fitness">General Fitness</option>
              </select>
            </div>

            <div className="form-group">
              <label>Workout Image</label>
              <div className="image-upload-container">
                <img src={imageUrl || "/placeholder.svg"} alt="Workout" className="workout-image-preview" />
                <button
                  className="change-image-button"
                  onClick={() => document.getElementById("workout-image").click()}
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

            <div className="exercise-input-form">
              <div className="form-group">
                <label htmlFor="exercise-name">Exercise Name*</label>
                <input
                  type="text"
                  id="exercise-name"
                  value={currentExercise.name}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
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
                      setCurrentExercise({ ...currentExercise, sets: Number.parseInt(e.target.value) || 1 })
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
                      setCurrentExercise({ ...currentExercise, reps: Number.parseInt(e.target.value) || 1 })
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
                      setCurrentExercise({ ...currentExercise, rest: Number.parseInt(e.target.value) || 0 })
                    }
                    min="0"
                    max="300"
                  />
                </div>
              </div>

              <button className="add-exercise-button" onClick={handleAddExercise} disabled={!currentExercise.name}>
                {isEditing ? "Update Exercise" : "Add Exercise"}
              </button>
            </div>

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
                      <button className="edit-exercise-button" onClick={() => handleEditExercise(index)}>
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
                      </button>
                      <button className="remove-exercise-button" onClick={() => handleRemoveExercise(index)}>
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
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-exercises">
                  <p>No exercises added yet. Add at least one exercise to create a workout.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="create-modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="save-button" onClick={handleSave} disabled={!title || exercises.length === 0}>
            {workout ? "Update Workout" : "Create Workout"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateWorkoutModal

