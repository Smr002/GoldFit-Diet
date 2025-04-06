import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  Paper,
  IconButton,
  useTheme,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ThemeToggle from "../ThemeToggle";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

function ProfileHeader() {
  const theme = useTheme();
  const [userName, setUserName] = useState("User");
  const [profileImage, setProfileImage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Debugging: Log what’s retrieved from localStorage
    console.log("User from localStorage:", user);
    console.log("Token from localStorage:", token);

    // Set username
    if (user?.displayName) {
      setUserName(user.displayName);
    } else if (user?.email) {
      setUserName(user.email.split("@")[0]);
    } else if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("Token payload:", payload);
        setUserName(payload.firstName || payload.username || "User");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    // Set profile picture - Priority:
    // 1. User-provided photoURL (if available)
    // 2. Gravatar based on email
    // 3. Fallback to generated avatar
    if (user?.photoURL) {
      console.log("Using photoURL:", user.photoURL);
      setProfileImage(user.photoURL);
    } else if (user?.email) {
      const gravatarUrl = `https://unavatar.io/${user.email}`;
      console.log("Using Gravatar URL:", gravatarUrl);
      setProfileImage(gravatarUrl);
    } else {
      const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`;
      console.log("Using fallback URL:", fallbackUrl);
      setProfileImage(fallbackUrl);
    }
  }, []); // Empty dependency array to run only on mount

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const userData = {
    level: "Intermediate",
    profileImage: profileImage,
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
            // eslint-disable-next-line no-unused-vars
            onError={(e) => {
              console.log("Avatar failed to load:", userData.profileImage);
              const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`;
              if (userData.profileImage !== fallbackUrl) {
                setProfileImage(fallbackUrl);
              }
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
            Welcome back, {userName}!
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
        <IconButton
          aria-label="sign out"
          size="medium"
          onClick={handleOpenDialog}
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
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Stack>

      {/* Sign Out Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="sign-out-dialog-title"
        aria-describedby="sign-out-dialog-description"
      >
        <DialogTitle id="sign-out-dialog-title">Sign Out</DialogTitle>
        <DialogContent>
          <DialogContentText id="sign-out-dialog-description">
            Are you sure you want to sign out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSignOut} color="primary" autoFocus>
            Sign Out
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default ProfileHeader;