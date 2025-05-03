"use client";

import { useState, useContext } from "react";
import { ThemeContext } from "@emotion/react";
import { Box, Button, TextField, Checkbox, Typography } from "@mui/material";

const LogWorkoutModal = ({ workout, onClose, onSave }) => {
  const theme = useContext(ThemeContext);
  const darkMode = theme?.palette?.mode === "dark";

  const [duration, setDuration] = useState(workout.duration);
  const [notes, setNotes] = useState("");
  const [completedExercises, setCompletedExercises] = useState(
    workout.exercises.map((ex) => ({
      id: ex.id,
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps,
      weight: "",
      completed: false,
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

  return (
    <Box
      className={`workout-modal-overlay ${darkMode ? "dark-mode" : ""}`}
      onClick={onClose}
      sx={{
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
        background: darkMode ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Box
        className={`log-workout-modal ${darkMode ? "dark-mode" : ""}`}
        onClick={(e) => e.stopPropagation()}
        sx={{
          margin: "0 auto",
          maxHeight: "100vh",
          overflowY: "auto",
          width: "100%",
          maxWidth: "700px",
          background: darkMode ? "#252525" : "#ffffff",
          borderRadius: "12px",
          boxShadow: darkMode ? "0 8px 32px rgba(0, 0, 0, 0.5)" : "0 8px 32px rgba(0, 0, 0, 0.1)",
          padding: "24px",
          position: "relative",
          color: darkMode ? "#ffffff" : "#333333",
        }}
      >
        <Button
          className="close-modal"
          onClick={onClose}
          sx={{
            position: "absolute",
            top: "16px",
            right: "16px",
            minWidth: "auto",
            color: darkMode ? "#FFD700" : "#6200ea",
            "&:hover": {
              background: darkMode ? "rgba(255, 215, 0, 0.1)" : "rgba(98, 0, 234, 0.1)",
            },
          }}
        >
          ×
        </Button>

        <Typography
          variant="h5"
          className="log-modal-title"
          sx={{
            mb: 3,
            fontWeight: 600,
            color: darkMode ? "#ffffff" : "#333333",
          }}
        >
          Log Workout: {workout.title}
        </Typography>

        <Box className="log-form-group" sx={{ mb: 3 }}>
          <Typography
            component="label"
            htmlFor="workout-duration"
            sx={{ display: "block", mb: 1, fontWeight: 500 }}
          >
            Duration (minutes)
          </Typography>
          <TextField
            type="number"
            id="workout-duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            inputProps={{ min: 1, max: 300 }}
            fullWidth
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                background: darkMode ? "#2d2d2d" : "#f5f5f5",
                "& fieldset": {
                  borderColor: darkMode ? "#444" : "#d0d0d0",
                },
                "&:hover fieldset": {
                  borderColor: darkMode ? "#FFD700" : "#6200ea",
                },
              },
              "& .MuiInputBase-input": {
                color: darkMode ? "#ffffff" : "#333333",
              },
            }}
          />
        </Box>

        <Box className="log-exercises-section" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            Exercises
          </Typography>
          <Box className="log-exercises-list">
            {completedExercises.map((exercise, index) => (
              <Box
                key={exercise.id}
                className="log-exercise-item"
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: "8px",
                  background: darkMode ? "#1e1e1e" : "#f9f9f9",
                  border: darkMode ? "1px solid #444" : "1px solid #e0e0e0",
                }}
              >
                <Box className="log-exercise-header" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Box className="log-exercise-check" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Checkbox
                      id={`exercise-${index}`}
                      checked={exercise.completed}
                      onChange={() => handleExerciseToggle(index)}
                      sx={{
                        color: darkMode ? "#FFD700" : "#6200ea",
                        "&.Mui-checked": {
                          color: darkMode ? "#FFD700" : "#6200ea",
                        },
                      }}
                    />
                    <Typography
                      component="label"
                      htmlFor={`exercise-${index}`}
                      className="log-exercise-name"
                      sx={{ fontWeight: 500 }}
                    >
                      {exercise.name}
                    </Typography>
                  </Box>
                </Box>

                <Box className="log-exercise-details">
                  <Box
                    className="log-exercise-meta"
                    sx={{ display: "flex", flexWrap: "wrap", gap: 2, fontSize: "14px" }}
                  >
                    <Box className="log-meta-item">
                      <Typography component="span" className="log-meta-label" sx={{ mr: 1, opacity: 0.7 }}>
                        Sets:
                      </Typography>
                      <Typography component="span" className="log-meta-value">
                        {exercise.sets}
                      </Typography>
                    </Box>
                    <Box className="log-meta-item">
                      <Typography component="span" className="log-meta-label" sx={{ mr: 1, opacity: 0.7 }}>
                        Reps:
                      </Typography>
                      <Typography component="span" className="log-meta-value">
                        {exercise.reps}
                      </Typography>
                    </Box>
                    <Box className="log-meta-item" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography component="label" className="log-meta-label" sx={{ opacity: 0.7 }}>
                        Weight:
                      </Typography>
                      <TextField
                        type="text"
                        className="log-weight-input"
                        value={exercise.weight}
                        onChange={(e) => handleWeightChange(index, e.target.value)}
                        placeholder="0"
                        size="small"
                        sx={{
                          width: "80px",
                          "& .MuiOutlinedInput-root": {
                            background: darkMode ? "#2d2d2d" : "#f5f5f5",
                            "& fieldset": {
                              borderColor: darkMode ? "#444" : "#d0d0d0",
                            },
                            "&:hover fieldset": {
                              borderColor: darkMode ? "#FFD700" : "#6200ea",
                            },
                          },
                          "& .MuiInputBase-input": {
                            color: darkMode ? "#ffffff" : "#333333",
                            padding: "6px 8px",
                          },
                        }}
                      />
                      <Typography component="span" className="log-weight-unit" sx={{ opacity: 0.7 }}>
                        kg
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box className="log-form-group" sx={{ mb: 3 }}>
          <Typography
            component="label"
            htmlFor="workout-notes"
            sx={{ display: "block", mb: 1, fontWeight: 500 }}
          >
            Notes
          </Typography>
          <TextField
            id="workout-notes"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How was your workout? Add any notes here..."
            fullWidth
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                background: darkMode ? "#2d2d2d" : "#f5f5f5",
                "& fieldset": {
                  borderColor: darkMode ? "#444" : "#d0d0d0",
                },
                "&:hover fieldset": {
                  borderColor: darkMode ? "#FFD700" : "#6200ea",
                },
              },
              "& .MuiInputBase-input": {
                color: darkMode ? "#ffffff" : "#333333",
              },
            }}
          />
        </Box>

        <Box
          className="log-modal-footer"
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button
            className="cancel-button"
            onClick={onClose}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              color: darkMode ? "#ffffff" : "#333333",
              background: darkMode ? "#2d2d2d" : "#f0f0f0",
              "&:hover": {
                background: darkMode ? "#3d3d3d" : "#e0e0e0",
                transform: "translateY(-2px)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            className="save-button"
            onClick={handleSave}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              color: darkMode ? "#121212" : "#ffffff",
              background: darkMode ? "#FFD700" : "#6200ea",
              "&:hover": {
                background: darkMode ? "#E1C000" : "#5000d0",
                transform: "translateY(-2px)",
              },
            }}
          >
            Save Log
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LogWorkoutModal;