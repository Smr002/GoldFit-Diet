import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

function WorkoutSection() {
  // Mock data
  const hasWorkout = true;
  const workout = {
    name: "Upper Body Power",
    exercises: [
      "Bench Press: 4 × 8",
      "Pull-ups: 3 × 10",
      "Military Press: 3 × 10",
    ],
    duration: "45 min",
  };
  const streak = 5;

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <FitnessCenterIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Workout Plan
          </Typography>
        </Box>
        <Chip
          icon={
            <LocalFireDepartmentIcon
              fontSize="small"
              sx={{ color: "error.main !important" }}
            />
          }
          label={`${streak}-day streak`}
          size="small"
          sx={{
            bgcolor: "action.hover",
            fontWeight: 600,
            px: 1.5,
            borderRadius: 2,
          }}
        />
      </Box>

      {/* Workout Display */}
      {hasWorkout ? (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarMonthIcon fontSize="small" color="action" />
              <Typography variant="subtitle2" fontWeight={600}>
                {workout.name}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {workout.duration}
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <List dense disablePadding sx={{ mb: 2 }}>
            {workout.exercises.map((exercise, index) => (
              <ListItem
                key={index}
                disablePadding
                sx={{
                  py: 0.8,
                  pl: 0.5,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mr: 1 }}
                >
                  •
                </Typography>
                <ListItemText
                  primary={exercise}
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: 500,
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Button
            variant="contained"
            startIcon={<PlayCircleOutlineIcon />}
            fullWidth
            size="large"
            sx={{
              textTransform: "none",
              py: 1.5,
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            Start Workout
          </Button>
        </>
      ) : (
        // No Workout Case
        <Box textAlign="center" mt={4}>
          <Typography variant="body2" color="text.secondary" mb={2}>
            No workout scheduled for today
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              mt: 1,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<CalendarMonthIcon />}
              fullWidth
              sx={{ textTransform: "none", fontWeight: 500 }}
            >
              Browse
            </Button>
            <Button
              variant="contained"
              startIcon={<FitnessCenterIcon />}
              fullWidth
              sx={{ textTransform: "none", fontWeight: 500 }}
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
