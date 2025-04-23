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
  useTheme,
} from "@mui/material";
import { Dumbbell, Flame, Calendar, PlayCircle } from "lucide-react";

function WorkoutSection() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

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
          <Dumbbell size={20} color={isDarkMode ? theme.palette.primary.main : "#7E69AB"} />
          <Typography variant="h6" fontWeight={600} sx={{ color: theme.palette.text.primary }}>
            Workout Plan
          </Typography>
        </Box>
        <Chip
          icon={<Flame size={16} color={isDarkMode ? "#CF6679" : "#FF7D55"} />}
          label={`${streak}-day streak`}
          size="small"
          sx={{
            bgcolor: isDarkMode ? "rgba(207, 102, 121, 0.1)" : "rgba(255, 125, 85, 0.1)",
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
              bgcolor: isDarkMode ? "rgba(187, 134, 252, 0.1)" : "rgba(126, 105, 171, 0.1)",
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Calendar size={16} color={isDarkMode ? theme.palette.primary.main : "#7E69AB"} />
              <Typography fontWeight={600} sx={{ color: theme.palette.text.primary }}>
                {workout.name}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ color: theme.palette.text.secondary }}
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
                    color: isDarkMode ? theme.palette.primary.main : "#7E69AB",
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
                    color: theme.palette.text.primary,
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
              variant="outlined"
              startIcon={<Calendar size={16} />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                borderColor: isDarkMode ? theme.palette.primary.main : "#7E69AB",
                color: isDarkMode ? theme.palette.primary.main : "#7E69AB",
                fontWeight: 600,
                "&:hover": {
                  borderColor: isDarkMode ? "#DAA520" : "#6E59A5",
                  bgcolor: isDarkMode ? "rgba(255, 215, 0, 0.05)" : "rgba(126, 105, 171, 0.05)",
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
