"use client"

import { useState, useEffect } from "react"
import BodyPartIcons from "./BodyPartIcons"
import FilterModal from "./FilterModal"
import CreateExerciseModal from "./CreateExerciseModal"

const bodyParts = [
  { name: "Favorites", icon: "favorites" },
  { name: "Cardio", icon: "cardio" },
  { name: "Chest", icon: "chest" },
  { name: "Back", icon: "back" },
  { name: "Upper Legs", icon: "upper-legs" },
  { name: "Shoulders", icon: "shoulders" },
  { name: "Upper Arms", icon: "upper-arms" },
  { name: "Waist", icon: "waist" },
  { name: "Lower Legs", icon: "lower-legs" },
  { name: "Lower Arms", icon: "lower-arms" },
  { name: "Neck", icon: "neck" },
  { name: "Filters", icon: "filters" },
]

// Update the bodyPartMapping to ensure proper mapping to API values
const bodyPartMapping = {
  "upper legs": "upper legs",
  "lower legs": "lower legs",
  "upper arms": "upper arms",
  "lower arms": "lower arms",
  waist: "waist",
  chest: "chest",
  back: "back",
  shoulders: "shoulders",
  neck: "neck",
  cardio: "cardio",
}

const Exercises = () => {
  const [exercises, setExercises] = useState([])
  const [bodyPart, setBodyPart] = useState("")
  const [equipment, setEquipment] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [myExercises, setMyExercises] = useState([])
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filterOptions, setFilterOptions] = useState({
    bodyPart: "",
    equipment: "",
    showFavorites: false,
    showMyExercises: false,
  })
  const [equipmentList, setEquipmentList] = useState([])


  useEffect(() => {
    // Fetch equipment list on component mount
    const fetchEquipment = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY || "",
            "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
          },
        }

        const response = await fetch("https://exercisedb.p.rapidapi.com/exercises/equipmentList", options)
        const data = await response.json()
        setEquipmentList(["All Equipment", ...data])
      } catch (error) {
        console.error("Error fetching equipment:", error)
      }
    }

    fetchEquipment()
  }, [])


  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true)
      try {
        let url = "https://exercisedb.p.rapidapi.com/exercises"

        if (bodyPart) {
          // Use the mapping if it exists, otherwise use the bodyPart directly
          const apiBodyPart = bodyPartMapping[bodyPart] || bodyPart
          url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${apiBodyPart}`
        }

        if (equipment && equipment !== "All Equipment") {
          url = `https://exercisedb.p.rapidapi.com/exercises/equipment/${equipment}`
        }

        const options = {
          method: "GET",
          headers: {
            "X-RapidAPI-Key":import.meta.env.VITE_RAPID_API_KEY || "",
            "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
          },
        }

        const response = await fetch(url, options)
        const data = await response.json()

        let filteredData = data

        // Apply additional filters
        if (filterOptions.showFavorites) {
          filteredData = filteredData.filter((exercise) => favorites.includes(exercise.id))
        }

        if (filterOptions.showMyExercises) {
          filteredData = [...filteredData, ...myExercises]
        }

        setExercises(filteredData)
      } catch (error) {
        console.error("Error fetching exercises:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [bodyPart, equipment, filterOptions, favorites, myExercises])

  useEffect(() => {
    if (search) {
      setLoading(true)
      const fetchSearchResults = async () => {
        try {
          const options = {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY || "",
              "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
            },
          }
  
          const response = await fetch("https://exercisedb.p.rapidapi.com/exercises", options)
          const data = await response.json()
  
          const filteredExercises = data.filter(
            (exercise) =>
              exercise.name.toLowerCase().includes(search.toLowerCase()) ||
              exercise.target.toLowerCase().includes(search.toLowerCase()) ||
              exercise.equipment.toLowerCase().includes(search.toLowerCase()) ||
              exercise.bodyPart.toLowerCase().includes(search.toLowerCase())
          )
  
          setExercises(filteredExercises)
        } catch (error) {
          console.error("Error searching exercises:", error)
        } finally {
          setLoading(false)
        }
      }
  
      fetchSearchResults()
    } else {
      // If search is empty, you may want to fetch all exercises or reset the list.
      // fetchExercises() can be reused here if needed.
    }
  }, [search])  // This effect runs every time the 'search' value changes
  

  const handleSearch = async () => {
    if (search) {
      setLoading(true)
      try {
        const options = {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY || "",
            "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
          },
        }

        const response = await fetch("https://exercisedb.p.rapidapi.com/exercises", options)
        const data = await response.json()

        const filteredExercises = data.filter(
          (exercise) =>
            exercise.name.toLowerCase().includes(search.toLowerCase()) ||
            exercise.target.toLowerCase().includes(search.toLowerCase()) ||
            exercise.equipment.toLowerCase().includes(search.toLowerCase()) ||
            exercise.bodyPart.toLowerCase().includes(search.toLowerCase()),
        )

        setExercises(filteredExercises)
      } catch (error) {
        console.error("Error searching exercises:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const toggleFavorite = (e, id) => {
    e.stopPropagation()
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  const handleBodyPartClick = (part) => {
    if (part === "Favorites") {
      // Filter to show only favorited exercises
      setFilterOptions({
        ...filterOptions,
        showFavorites: true,
        showMyExercises: false,
      })
    } else if (part === "Filters") {
      // Open filter modal
      setShowFilterModal(true)
    } else {
      setBodyPart(part.toLowerCase())
      setFilterOptions({
        ...filterOptions,
        bodyPart: part.toLowerCase(),
        showFavorites: false,
        showMyExercises: false,
      })
    }
  }

  const openExerciseDetails = (exercise) => {
    setSelectedExercise(exercise)
  }

  const closeExerciseDetails = () => {
    setSelectedExercise(null)
  }

  const handleApplyFilters = (filters) => {
    setFilterOptions(filters)
    setBodyPart(filters.bodyPart)
    setEquipment(filters.equipment)
    setShowFilterModal(false)
  }

  const handleCreateExercise = (newExercise) => {
    // Add a unique ID to the new exercise
    const exerciseWithId = {
      ...newExercise,
      id: `custom-${Date.now()}`,
      bodyPart: filterOptions.bodyPart || "custom",
      equipment: "body weight",
      target: "custom",
    }

    setMyExercises([...myExercises, exerciseWithId])
    setShowCreateModal(false)
  }

  return (
    <div className="exercises-container">
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-bar">
          <div className="search-icon">
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
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for exercises"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
      </div>

      {/* Body Part Filter */}
      <div className="body-parts-container">
        <div className="body-parts-scroll">
          {bodyParts.map((part) => (
            <div
              key={part.name}
              onClick={() => handleBodyPartClick(part.name)}
              className={`body-part-item ${
                (part.name === "Favorites" && filterOptions.showFavorites) || (bodyPart === part.name.toLowerCase())
                  ? "active"
                  : ""
              }`}
            >
              <div className="body-part-icon">
                <BodyPartIcons type={part.icon} />
              </div>
              <span className="body-part-name">{part.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Exercises Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="exercises-grid">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="exercise-card" onClick={() => openExerciseDetails(exercise)}>
              <div className="exercise-image-container">
                <button onClick={(e) => toggleFavorite(e, exercise.id)} className="favorite-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={favorites.includes(exercise.id) ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
                <button
                  className="help-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    openExerciseDetails(exercise)
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </button>
                {/* Static image instead of GIF */}
                <div className="exercise-static-image">
                  {/* This would ideally be a static image, but we'll use the first frame of the GIF */}
                  <img src={exercise.gifUrl || "/placeholder.svg"} alt={exercise.name} className="exercise-image" />
                  <div className="view-exercise-overlay">
                    <span>Click to view exercise</span>
                  </div>
                </div>
              </div>
              <div className="exercise-details">
                <h3 className="exercise-name">{exercise.name}</h3>
                <div className="exercise-tags">
                  <span className="exercise-tag">{exercise.bodyPart}</span>
                  <span className="exercise-tag">{exercise.target}</span>
                  <span className="exercise-tag">{exercise.equipment}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {exercises.length === 0 && !loading && (
        <div className="no-results">
          <h3>No exercises found</h3>
          <p>Try a different search term or filter</p>
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="exercise-modal-overlay" onClick={closeExerciseDetails}>
          <div className="exercise-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeExerciseDetails}>
              ×
            </button>

            <div className="modal-content">
              <div className="modal-gif-container">
                <img
                  src={selectedExercise.gifUrl || "/placeholder.svg"}
                  alt={selectedExercise.name}
                  className="modal-gif"
                />
              </div>

              <div className="modal-info">
                <h2 className="modal-title">{selectedExercise.name}</h2>

                <div className="info-section">
                  <div className="exercise-tag-large">{selectedExercise.bodyPart}</div>
                  <div className="exercise-tag-large">{selectedExercise.target}</div>
                  <div className="exercise-tag-large">{selectedExercise.equipment}</div>
                </div>

                <div className="info-section">
                  <h3>Target Muscle</h3>
                  <p>{selectedExercise.target}</p>
                </div>

                <div className="info-section">
                  <h3>Body Part</h3>
                  <p>{selectedExercise.bodyPart}</p>
                </div>

                <div className="info-section">
                  <h3>Equipment</h3>
                  <p>{selectedExercise.equipment}</p>
                </div>

                <div className="info-section">
                  <h3>Instructions</h3>
                  <ol className="instructions-list">
                    {selectedExercise.instructions ? (
                      selectedExercise.instructions.map((instruction, index) => <li key={index}>{instruction}</li>)
                    ) : (
                      <li>Perform the exercise as shown in the animation.</li>
                    )}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <FilterModal
          onClose={() => setShowFilterModal(false)}
          onApply={handleApplyFilters}
          bodyParts={bodyParts.filter((part) => part.name !== "Filters" && part.name !== "Favorites")}
          equipmentList={equipmentList}
          initialFilters={filterOptions}
          onCreateExercise={() => {
            setShowFilterModal(false)
            setShowCreateModal(true)
          }}
        />
      )}

      {/* Create Exercise Modal */}
      {showCreateModal && (
        <CreateExerciseModal onClose={() => setShowCreateModal(false)} onSave={handleCreateExercise} />
      )}
    </div>
  )
}

export default Exercises

