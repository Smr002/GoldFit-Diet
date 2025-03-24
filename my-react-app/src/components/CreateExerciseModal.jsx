"use client"

import { useState } from "react"

const CreateExerciseModal = ({ onClose, onSave }) => {
  const [exerciseName, setExerciseName] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleSave = () => {
    if (!exerciseName.trim()) return

    onSave({
      name: exerciseName,
      gifUrl: imageUrl || "/placeholder.svg",
      isCustom: true,
    })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)

    setTimeout(() => {
      const objectUrl = URL.createObjectURL(file)
      setImageUrl(objectUrl)
      setIsUploading(false)
    }, 1000)
  }

  return (
    <div className="create-modal-overlay">
      <div className="create-modal">
        <div className="create-modal-header">
          <button className="close-button" onClick={onClose}>
            ×
          </button>
          <input
            type="text"
            placeholder="Enter exercise name"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            className="exercise-name-input"
          />
          <button className="save-button" onClick={handleSave} disabled={!exerciseName.trim()}>
            Save
          </button>
        </div>

        <div className="image-upload-container">
          {imageUrl ? (
            <div className="image-preview">
              <img src={imageUrl || "/placeholder.svg"} alt="Exercise preview" />
              <button className="change-image-button" onClick={() => document.getElementById("image-upload").click()}>
                Change Image
              </button>
            </div>
          ) : (
            <div className="upload-placeholder" onClick={() => document.getElementById("image-upload").click()}>
              {isUploading ? (
                <div className="upload-spinner"></div>
              ) : (
                <>
                  <div className="placeholder-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
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
                  <span>+ Add Image or Video</span>
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

