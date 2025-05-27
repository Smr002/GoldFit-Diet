import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  Dumbbell,
  Flame,
  Calendar,
  PlayCircle,
  Activity,
  Weight,
  Repeat,
} from "lucide-react";
import { getLogWorkout, getWorkouts } from "../../../api";

function WorkoutSection() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [workoutLog, setWorkoutLog] = useState(null);
  const [workoutDetails, setWorkoutDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const token = localStorage.getItem("token");
        const logs = await getLogWorkout(token);
        if (logs && logs.length > 0) {
          // Sort logs by date and createdAt in descending order
          const sortedLogs = logs.sort((a, b) => {
            const dateComparison =
              new Date(b.date).getTime() - new Date(a.date).getTime();
            if (dateComparison === 0) {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            }
            return dateComparison;
          });

          setWorkoutLog(sortedLogs[0]); // Get the most recent workout
          setWorkoutDetails(sortedLogs[0].workout);
        }
      } catch (error) {
        console.error("Error fetching workout data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return date.toLocaleDateString("en-US", options);
    }
  };

  if (loading) {
    return (
      <Paper
        sx={{
          p: 2.5,
          height: "100%",
          borderRadius: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Paper>
    );
  }

  const hasWorkout =
    workoutLog &&
    workoutLog.workout &&
    workoutLog.sessionExercises &&
    workoutLog.sessionExercises.length > 0;
  // Calculate streak (you might want to implement proper streak calculation logic)
  const streak = 5;

  return (
    <Paper
      sx={{
        p: 2.5,
        height: "100%",
        borderRadius: 3,
        boxShadow: isDarkMode
          ? "0px 4px 20px rgba(0, 0, 0, 0.3)"
          : "0px 4px 20px rgba(0, 0, 0, 0.08)",
        background: isDarkMode
          ? "linear-gradient(145deg, #1e1e1e, #2a2a2a)"
          : "linear-gradient(145deg, #ffffff, #f5f7ff)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Dumbbell
            size={20}
            color={isDarkMode ? theme.palette.primary.main : "#7E69AB"}
          />
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ color: theme.palette.text.primary }}
          >
            Latest Workout
          </Typography>
        </Box>
        <Chip
          icon={<Flame size={16} color={isDarkMode ? "#CF6679" : "#FF7D55"} />}
          label={`${streak}-day streak`}
          size="small"
          sx={{
            bgcolor: isDarkMode
              ? "rgba(207, 102, 121, 0.1)"
              : "rgba(255, 125, 85, 0.1)",
            color: isDarkMode ? "#CF6679" : "#FF7D55",
            fontWeight: 600,
            borderRadius: 5,
            "& .MuiChip-label": {
              px: 1,
            },
          }}
        />
      </Box>

      {hasWorkout ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1.5,
              bgcolor: isDarkMode
                ? "rgba(187, 134, 252, 0.1)"
                : "rgba(126, 105, 171, 0.1)",
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Calendar
                size={16}
                color={isDarkMode ? theme.palette.primary.main : "#7E69AB"}
              />
              <Typography
                fontWeight={600}
                sx={{ color: theme.palette.text.primary }}
              >
                {workoutDetails.name}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{
                color: theme.palette.text.secondary,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {formatDate(workoutLog.date)}
            </Typography>
          </Box>

          <List dense sx={{ pl: 1 }}>
            {workoutLog?.sessionExercises?.map((exercise, index) => (
              <ListItem
                key={index}
                disablePadding
                sx={{
                  py: 1.2,
                  px: 1,
                  bgcolor: isDarkMode
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.02)",
                  borderRadius: 2,
                  mb: 1,
                  "&:last-child": { mb: 0 },
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                      }}
                    >
                      Exercise {index + 1}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Repeat
                        size={14}
                        color={
                          isDarkMode ? theme.palette.primary.main : "#7E69AB"
                        }
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {exercise.setsCompleted} sets
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Activity
                        size={14}
                        color={
                          isDarkMode ? theme.palette.primary.main : "#7E69AB"
                        }
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {exercise.repsCompleted} reps
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Weight
                        size={14}
                        color={
                          isDarkMode ? theme.palette.primary.main : "#7E69AB"
                        }
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {exercise.weightUsed}kg
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>

          <Button
            component={Link}
            to={`/workouts/`}
            variant="contained"
            startIcon={<PlayCircle size={20} />}
            fullWidth
            sx={{
              mt: 1,
              py: 1.2,
              bgcolor: isDarkMode ? theme.palette.primary.main : "#7E69AB",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              fontSize: 16,
              boxShadow: isDarkMode
                ? "0 4px 12px rgba(255, 215, 0, 0.3)"
                : "0 4px 12px rgba(126, 105, 171, 0.3)",
              "&:hover": {
                bgcolor: isDarkMode ? "#DAA520" : "#6E59A5",
              },
              color: isDarkMode ? "#000" : "#fff",
            }}
          >
            Start Workout
          </Button>
        </Box>
      ) : (
        <Box sx={{ py: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            No workout scheduled for today
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Button
              component={Link}
              to="/workouts"
              variant="outlined"
              startIcon={<Calendar size={16} />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                borderColor: isDarkMode
                  ? theme.palette.primary.main
                  : "#7E69AB",
                color: isDarkMode ? theme.palette.primary.main : "#7E69AB",
                fontWeight: 600,
                "&:hover": {
                  borderColor: isDarkMode ? "#DAA520" : "#6E59A5",
                  bgcolor: isDarkMode
                    ? "rgba(255, 215, 0, 0.05)"
                    : "rgba(126, 105, 171, 0.05)",
                },
              }}
            >
              Browse
            </Button>
            <Button
              component={Link}
              to="/workouts/"
              variant="contained"
              startIcon={<Dumbbell size={16} />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                bgcolor: isDarkMode ? theme.palette.primary.main : "#7E69AB",
                color: isDarkMode ? "#000" : "#fff",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: isDarkMode ? "#DAA520" : "#6E59A5",
                },
              }}
            >
              Quick Start
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
}

export default WorkoutSection;
