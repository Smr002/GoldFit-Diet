import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  Paper,
  IconButton,
  useTheme,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ThemeToggle from "../ThemeToggle";

function ProfileHeader() {
  const theme = useTheme();

  const userData = {
    firstName: "Alex",
    level: "Intermediate",
    profileImage: "https://avatars.dicebear.com/api/personas/alex.svg",

    stats: {
      currentWeight: "175 lbs",
      goalWeight: "165 lbs",
    },
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", md: "center" },
        gap: 2,
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0px 8px 24px -6px rgba(0,0,0,0.05)`,
      }}
    >
      {/* Profile Info */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ position: "relative", width: 72, height: 72 }}>
          <Avatar
            src={userData.profileImage}
            alt="Profile"
            sx={{
              width: 72,
              height: 72,
              border: `2px solid ${theme.palette.primary.main}`,
            }}
          />
          <Chip
            label={userData.level}
            color="primary"
            size="small"
            sx={{
              position: "absolute",
              bottom: -6,
              right: -6,
              fontSize: "0.7rem",
              borderRadius: 1,
              boxShadow: 1,
            }}
          />
        </Box>

        <Box>
          <Typography variant="h5" fontWeight={600}>
            Welcome back, {userData.firstName}!
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mt: 0.5,
              fontSize: "0.9rem",
              color: theme.palette.text.secondary,
            }}
          >
            <Typography variant="body2">
              Current: {userData.stats.currentWeight}
            </Typography>
            <Typography variant="body2">•</Typography>
            <Typography variant="body2">
              Goal: {userData.stats.goalWeight}
            </Typography>
          </Stack>
        </Box>
      </Box>

      {/* Buttons */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignSelf: { xs: "flex-end", md: "auto" } }}
      >
        <ThemeToggle />
        <IconButton
          aria-label="settings"
          size="medium"
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "50%",
            bgcolor: "background.default",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <SettingsIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Paper>
  );
}

export default ProfileHeader;
