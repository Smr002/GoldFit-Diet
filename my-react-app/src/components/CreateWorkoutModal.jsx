import React, { useState, useEffect, useRef } from "react";
import { 
  Box, Button, TextField, Typography, MenuItem, IconButton, Divider, 
  Autocomplete, CircularProgress, Chip, Popper 
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { getExercises } from "../api"; // Import your API function to fetch exercises

const CreateWorkoutModal = ({ onClose, onSave, onDelete, workout }) => {
  // Workout state
  const [workoutData, setWorkoutData] = useState(
    workout || {
      title: "",
      description: "",
      difficulty: "beginner",
      goal: "general fitness",
      exercises: [],
    }
  );
  
  // State for available exercises from API
  const [availableExercises, setAvailableExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [newExerciseDetails, setNewExerciseDetails] = useState({
    sets: 3,
    reps: 10,
  });

  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef(null);
  const [filteredExercises, setFilteredExercises] = useState([]);

  // Fetch exercises from the API on component mount
  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const exercises = await getExercises();
        setAvailableExercises(exercises);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Filter exercises as the user types (only match exercise name)
  useEffect(() => {
    // Clear the previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If search query is empty, show no exercises
    if (!searchQuery.trim()) {
      setFilteredExercises([]);
      return;
    }

    // Set a new timeout for filtering (debounce)
    searchTimeoutRef.current = setTimeout(() => {
      const lowercaseQuery = searchQuery.toLowerCase().trim();
      const filtered = availableExercises.filter((exercise) =>
        exercise.name?.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredExercises(filtered);
      // Debug: Log filtered results (remove in production)
      console.log("Search Query:", lowercaseQuery, "Filtered Exercises:", filtered);
    }, 150); // 150ms debounce for responsiveness

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, availableExercises]);

  // Handle exercise changes
  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...workoutData.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value,
    };
    setWorkoutData({ ...workoutData, exercises: updatedExercises });
  };

  // Add selected exercise
  const addExercise = () => {
    if (selectedExercise) {
      // Add the exercise with its details from the API plus the user-specified sets and reps
      setWorkoutData({
        ...workoutData,
        exercises: [
          ...workoutData.exercises, 
          {
            id: selectedExercise.id,
            name: selectedExercise.name,
            muscle: selectedExercise.muscle,
            equipment: selectedExercise.equipment,
            sets: newExerciseDetails.sets,
            reps: newExerciseDetails.reps,
          }
        ],
      });
      setSelectedExercise(null);
      setNewExerciseDetails({ sets: 3, reps: 10 });
      setSearchQuery(""); // Clear search query after adding
      setFilteredExercises([]); // Clear filtered exercises after adding
    }
  };

  // Remove exercise
  const removeExercise = (index) => {
    const updatedExercises = [...workoutData.exercises];
    updatedExercises.splice(index, 1);
    setWorkoutData({ ...workoutData, exercises: updatedExercises });
  };

  // Custom Popper to ensure dropdown (not dropup)
  const CustomPopper = (props) => {
    return <Popper {...props} placement="bottom-start" />;
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
    >
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.mode === "dark" ? "#252525" : "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          maxWidth: 600,
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          p: 0,
          position: "relative",
          border: (theme) => theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: (theme) => 
              theme.palette.mode === "dark" 
                ? (workout ? "#333333" : "linear-gradient(45deg, #FFD700 0%, #FFC107 100%)") 
                : (workout ? "grey.100" : "primary.main"),
            color: (theme) => 
              theme.palette.mode === "dark" 
                ? (workout ? "#ffffff" : "#121212") 
                : (workout ? "text.primary" : "white"),
            p: 2,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Typography 
            variant="h5" 
            component="h2" 
            fontWeight="bold"
            sx={{
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? "#FFD700" // Gold in dark mode
                  : (workout ? "#6200ea" : "#ffffff"), // In light mode: Purple for edit, white for create
              textShadow: (theme) => 
                theme.palette.mode === "dark" && !workout
                  ? "0 1px 2px rgba(0, 0, 0, 0.3)"
                  : !workout ? "0 1px 2px rgba(0, 0, 0, 0.2)" : "none",
              transition: "color 0.3s ease",
            }}
          >
            {workout ? "Edit Workout" : "Create New Workout"}
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ 
              color: (theme) => 
                theme.palette.mode === "dark"
                  ? "#FFD700" // Gold in dark mode
                  : (workout ? "#6200ea" : "#ffffff"), // In light mode: Purple for edit, white for create
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 215, 0, 0.1)" 
                    : (workout ? "rgba(98, 0, 234, 0.1)" : "rgba(255, 255, 255, 0.2)"),
                transform: "rotate(90deg)"
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ 
          p: 3, 
          backgroundColor: (theme) => theme.palette.mode === "dark" ? "#252525" : "#ffffff",
          color: (theme) => theme.palette.mode === "dark" ? "#ffffff" : "inherit",
        }}>
          <TextField
            label="Workout Title"
            variant="outlined"
            fullWidth
            value={workoutData.title}
            onChange={(e) => setWorkoutData({ ...workoutData, title: e.target.value })}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: (theme) => theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                },
                '&:hover fieldset': {
                  borderColor: (theme) => theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
                },
                '&.Mui-focused fieldset': {
                  borderColor: (theme) => theme.palette.mode === "dark" ? "#FFD700" : "primary.main",
                },
              },
              '& .MuiInputLabel-root': {
                color: (theme) => theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                '&.Mui-focused': {
                  color: (theme) => theme.palette.mode === "dark" ? "#FFD700" : "primary.main",
                },
              },
              '& .MuiInputBase-input': {
                color: (theme) => theme.palette.mode === "dark" ? "#ffffff" : "inherit",
              }
            }}
          />

          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            value={workoutData.description}
            onChange={(e) => setWorkoutData({ ...workoutData, description: e.target.value })}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              select
              label="Difficulty"
              value={workoutData.difficulty}
              onChange={(e) => setWorkoutData({ ...workoutData, difficulty: e.target.value })}
              sx={{ flex: 1 }}
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </TextField>

            <TextField
              select
              label="Goal"
              value={workoutData.goal}
              onChange={(e) => setWorkoutData({ ...workoutData, goal: e.target.value })}
              sx={{ flex: 1 }}
            >
              <MenuItem value="strength">Strength</MenuItem>
              <MenuItem value="cardio">Cardio</MenuItem>
              <MenuItem value="flexibility">Flexibility</MenuItem>
              <MenuItem value="general fitness">General Fitness</MenuItem>
            </TextField>
          </Box>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Exercises
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Exercises list */}
          {workoutData.exercises.map((exercise, index) => (
            <Box
              key={exercise.id || index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
                p: 2,
                borderRadius: 1,
                backgroundColor: (theme) => theme.palette.mode === "dark" ? "#333333" : "grey.50",
                border: (theme) => theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
              }}
            >
              <Box sx={{ flex: 2 }}>
                <Typography variant="subtitle1">{exercise.name}</Typography>
                {exercise.muscle && (
                  <Chip 
                    label={exercise.muscle} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ mr: 1, mt: 1 }}
                  />
                )}
                {exercise.equipment && (
                  <Chip 
                    label={exercise.equipment} 
                    size="small" 
                    color="secondary" 
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
              <TextField
                label="Sets"
                type="number"
                value={exercise.sets}
                onChange={(e) => handleExerciseChange(index, "sets", parseInt(e.target.value) || 0)}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Reps"
                type="number"
                value={exercise.reps}
                onChange={(e) => handleExerciseChange(index, "reps", parseInt(e.target.value) || 0)}
                sx={{ flex: 1 }}
              />
              <IconButton
                color="error"
                onClick={() => removeExercise(index)}
                sx={{ ml: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          {/* Add new exercise from API */}
          <Box sx={{ mt: 3, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Add Exercise
            </Typography>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Autocomplete
                id="exercise-select"
                options={filteredExercises}
                getOptionLabel={(option) => option.name || ""}
                loading={loading}
                value={selectedExercise}
                onChange={(event, newValue) => {
                  setSelectedExercise(newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  setSearchQuery(newInputValue);
                }}
                filterOptions={(x) => x} // Rely on custom filtering
                noOptionsText={searchQuery.trim() ? "No matching exercises found" : "Start typing to search"}
                PopperComponent={CustomPopper} // Ensure dropdown below input
                renderOption={(props, option) => (
                  <li {...props}>
                    <Typography variant="body1">{option.name}</Typography>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search exercises"
                    variant="outlined"
                    sx={{ flex: 2 }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                sx={{ flex: 2 }}
              />
              
              <TextField
                label="Sets"
                type="number"
                value={newExerciseDetails.sets}
                onChange={(e) => setNewExerciseDetails({ 
                  ...newExerciseDetails, 
                  sets: parseInt(e.target.value) || 0 
                })}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Reps"
                type="number"
                value={newExerciseDetails.reps}
                onChange={(e) => setNewExerciseDetails({ 
                  ...newExerciseDetails, 
                  reps: parseInt(e.target.value) || 0 
                })}
                sx={{ flex: 1 }}
              />
              <IconButton
                color="primary"
                onClick={addExercise}
                disabled={!selectedExercise}
                sx={{ mt: 1 }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: 2,
            backgroundColor: (theme) => theme.palette.mode === "dark" ? "#333333" : "grey.50",
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            borderTop: "1px solid",
            borderColor: (theme) => theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "divider",
          }}
        >
          {/* Left side: Delete button (only for edits of non-recommended workouts) */}
          <Box>
            {onDelete && (
              <Button
                variant="contained"
                color="error"
                onClick={onDelete}
                startIcon={<DeleteIcon />}
                sx={{
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 8px rgba(211, 47, 47, 0.3)",
                    backgroundColor: (theme) => 
                      theme.palette.mode === "dark" ? "#b71c1c" : "#d32f2f"
                  },
                  "&:active": {
                    transform: "translateY(0)",
                    boxShadow: "0 2px 4px rgba(211, 47, 47, 0.3)",
                  }
                }}
              >
                Delete
              </Button>
            )}
          </Box>

          {/* Right side: Cancel and Save buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={onClose}
              sx={{
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  backgroundColor: (theme) => 
                    theme.palette.mode === "dark" 
                      ? "rgba(255, 255, 255, 0.05)" 
                      : "rgba(0, 0, 0, 0.04)",
                  borderColor: (theme) => 
                    theme.palette.mode === "dark" 
                      ? "rgba(255, 255, 255, 0.5)" 
                      : "rgba(0, 0, 0, 0.4)"
                },
                "&:active": {
                  transform: "translateY(0)",
                }
              }}
            >
              Cancel
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              onClick={() => onSave(workoutData)}
              disabled={!workoutData.title || workoutData.exercises.length === 0}
              sx={{
                transition: "all 0.3s ease",
                backgroundColor: (theme) => 
                  theme.palette.mode === "dark" ? "#FFD700" : theme.palette.primary.main,
                color: (theme) => 
                  theme.palette.mode === "dark" ? "#121212" : "#ffffff",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: (theme) => 
                    theme.palette.mode === "dark" 
                      ? "0 4px 12px rgba(255, 215, 0, 0.3)" 
                      : "0 4px 12px rgba(98, 0, 234, 0.3)",
                  backgroundColor: (theme) => 
                    theme.palette.mode === "dark" ? "#E1C000" : "#5000d0",
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: (theme) => 
                    theme.palette.mode === "dark" 
                      ? "0 2px 8px rgba(255, 215, 0, 0.3)" 
                      : "0 2px 8px rgba(98, 0, 234, 0.3)",
                },
                "&.Mui-disabled": {
                  backgroundColor: (theme) => 
                    theme.palette.mode === "dark" 
                      ? "rgba(255, 215, 0, 0.3)" 
                      : "rgba(98, 0, 234, 0.3)",
                  color: (theme) => 
                    theme.palette.mode === "dark" 
                      ? "rgba(0, 0, 0, 0.38)" 
                      : "rgba(255, 255, 255, 0.38)",
                }
              }}
            >
              {workout ? "Update" : "Create"}
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default CreateWorkoutModal;