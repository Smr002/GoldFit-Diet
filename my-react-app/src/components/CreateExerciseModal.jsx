"use client"

import { useState } from "react"

const CreateExerciseModal = ({ onClose, onSave }) => {
  const [exerciseName, setExerciseName] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")

  const handleSave = () => {
    if (!exerciseName.trim()) {
      setError("Exercise name is required")
      return
    }
    setError("")
    onSave({
      name: exerciseName,
      gifUrl: imageUrl || "/placeholder.svg",
      isCustom: true,
    })
    onClose() // Close modal after saving
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setError("Please upload an image or video file")
      return
    }

    setIsUploading(true)
    setError("")
    setTimeout(() => {
      const objectUrl = URL.createObjectURL(file)
      setImageUrl(objectUrl)
      setIsUploading(false)
    }, 1000) // Simulated upload delay
  }

  const handleRemoveImage = () => {
    setImageUrl("")
    setIsUploading(false)
  }

  return (
    <div className="create-modal-overlay">
      <div className="create-modal">
        <div className="create-modal-header">
          <button className="close-button" onClick={onClose} aria-label="Close">
            ×
          </button>
          <input
            type="text"
            placeholder="Enter exercise name"
            value={exerciseName}
            onChange={(e) => {
              setExerciseName(e.target.value)
              setError("")
            }}
            className="exercise-name-input"
            aria-label="Exercise name"
          />
          <button
            className="save-button"
            onClick={handleSave}
            disabled={!exerciseName.trim() || isUploading}
            aria-label="Save exercise"
          >
            Save
          </button>
        </div>

        <div className="image-upload-container">
          {error && <div className="error-message">{error}</div>}
          {imageUrl ? (
            <div className="image-preview">
              <img src={imageUrl || "/placeholder.svg"} alt="Exercise preview" />
              <div className="image-actions">
                <button
                  className="change-image-button"
                  onClick={() => document.getElementById("image-upload").click()}
                >
                  Change
                </button>
                <button className="remove-image-button" onClick={handleRemoveImage}>
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              className="upload-placeholder"
              onClick={() => !isUploading && document.getElementById("image-upload").click()}
            >
              {isUploading ? (
                <div className="upload-spinner"></div>
              ) : (
                <>
                  <div className="placeholder-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                  <span>Add Image or Video</span>
                </>
              )}
            </div>
          )}
          <input
            type="file"
            id="image-upload"
            accept="image/*,video/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </div>
      </div>
    </div>
  )
}

export default CreateExerciseModal