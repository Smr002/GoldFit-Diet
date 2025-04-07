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
} from "@mui/material";
import { Dumbbell, Flame, Calendar, PlayCircle } from "lucide-react";

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
    <Paper
      sx={{
        p: 2.5,
        height: "100%",
        borderRadius: 3,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
        background: "linear-gradient(145deg, #ffffff, #f5f7ff)",
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
          <Dumbbell size={20} color="#7E69AB" />
          <Typography variant="h6" fontWeight={600} sx={{ color: "#1A1F2C" }}>
            Workout Plan
          </Typography>
        </Box>
        <Chip
          icon={<Flame size={16} color="#FF7D55" />}
          label={`${streak}-day streak`}
          size="small"
          sx={{
            bgcolor: "rgba(255, 125, 85, 0.1)",
            color: "#FF7D55",
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
              bgcolor: "rgba(126, 105, 171, 0.1)",
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Calendar size={16} color="#7E69AB" />
              <Typography fontWeight={600} sx={{ color: "#1A1F2C" }}>
                {workout.name}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ color: "#8E9196" }}
            >
              {workout.duration}
            </Typography>
          </Box>

          <List dense sx={{ pl: 1 }}>
            {workout.exercises.map((exercise, index) => (
              <ListItem key={index} disablePadding sx={{ py: 0.7 }}>
                <Typography
                  variant="body1"
                  component="span"
                  sx={{
                    mr: 1.5,
                    color: "#7E69AB",
                    fontWeight: 600,
                    fontSize: 18,
                  }}
                >
                  •
                </Typography>
                <ListItemText
                  primary={exercise}
                  primaryTypographyProps={{
                    variant: "body1",
                    fontWeight: 500,
                    color: "#403E43",
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Button
            variant="contained"
            startIcon={<PlayCircle size={20} />}
            fullWidth
            sx={{
              mt: 1,
              py: 1.2,
              bgcolor: "#7E69AB",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              fontSize: 16,
              boxShadow: "0 4px 12px rgba(126, 105, 171, 0.3)",
              "&:hover": {
                bgcolor: "#6E59A5",
              },
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
              variant="outlined"
              startIcon={<Calendar size={16} />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                borderColor: "#7E69AB",
                color: "#7E69AB",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#6E59A5",
                  bgcolor: "rgba(126, 105, 171, 0.05)",
                },
              }}
            >
              Browse
            </Button>
            <Button
              variant="contained"
              startIcon={<Dumbbell size={16} />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                bgcolor: "#7E69AB",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#6E59A5",
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
