import React from "react";
import { Box, Typography, Paper, Button, Divider } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

function NotificationsReminders() {
  const reminders = [
    {
      type: "workout",
      message: "Workout reminder for 7 PM today",
      time: "2 hours from now",
    },
    {
      type: "nutrition",
      message: "Don't forget to log your lunch",
      time: "Just now",
    },
  ];

  const recommendations = [
    {
      title: "New HIIT Workout Added",
      description: "15-minute fat burner",
    },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <NotificationsIcon color="primary" />
        <Typography variant="h6" fontWeight="bold">
          Reminders & Updates
        </Typography>
      </Box>

      {/* Reminders */}
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
        Today's Reminders
      </Typography>
      <Box display="flex" flexDirection="column" gap={1.5} mb={3}>
        {reminders.map((reminder, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "action.hover",
              transition: "0.2s",
              "&:hover": { bgcolor: "action.selected" },
            }}
          >
            <AccessTimeIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {reminder.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {reminder.time}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Recommendations */}
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
        Recommendations
      </Typography>
      <Box display="flex" flexDirection="column" gap={1.5} mb={3}>
        {recommendations.map((rec, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "action.hover",
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": { bgcolor: "action.selected" },
            }}
          >
            <EventAvailableIcon fontSize="small" color="secondary" />
            <Box flexGrow={1}>
              <Typography variant="body2" fontWeight={500}>
                {rec.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {rec.description}
              </Typography>
            </Box>
            <ChevronRightIcon fontSize="small" color="action" />
          </Box>
        ))}
      </Box>

      {/* Weekly Summary Button */}
      <Box display="flex" justifyContent="center">
        <Button
          variant="outlined"
          endIcon={<ChevronRightIcon />}
          size="small"
          sx={{ textTransform: "none" }}
        >
          Weekly Summary
        </Button>
      </Box>
    </Paper>
  );
}

export default NotificationsReminders;
