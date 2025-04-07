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
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

function ProfileHeader() {
  const theme = useTheme();
  const [userName, setUserName] = useState("User");
  const [profileImage, setProfileImage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    console.log("User from localStorage:", user);
    console.log("Token from localStorage:", token);

    if (user?.displayName) {
      setUserName(user.displayName);
    } else if (user?.email) {
      setUserName(user.email.split("@")[0]);
    } else if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserName(payload.firstName || payload.username || "User");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    if (user?.photoURL) {
      console.log("Using photoURL:", user.photoURL);
      setProfileImage(user.photoURL);
    } else if (user?.email) {
      const gravatarUrl = `https://unavatar.io/${user.email}`;
      console.log("Using Gravatar URL:", gravatarUrl);
      setProfileImage(gravatarUrl);
    } else {
      const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userName
      )}&background=random`;
      console.log("Using fallback URL:", fallbackUrl);
      setProfileImage(fallbackUrl);
    }
  }, []);

  const handleSignOut = () => {
    // Clear all user related data
    localStorage.clear();
    // Navigate to home page
    navigate("/", { replace: true });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleProfileClick = () => {
    navigate("/user-home");
  };

  const userData = {
    level: "Intermediate",
    profileImage: profileImage,
    stats: {
      currentWeight: "175 lbs",
      goalWeight: "165 lbs",
      workoutsCompleted: 24,
      exerciseStreak: 7,
    },
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        mb: 3,
        borderRadius: 4,
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[900]} 100%)`
            : `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[100]} 100%)`,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 8px 32px rgba(0, 0, 0, 0.3)"
            : "0 8px 32px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "center", md: "flex-start" },
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            flex: 1,
          }}
        >
          <Box
            sx={{
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                inset: -2,
                borderRadius: "50%",
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                animation: "rotate 4s linear infinite",
              },
            }}
          >
            <Avatar
              src={userData.profileImage}
              alt="Profile"
              onClick={handleProfileClick}
              sx={{
                width: 90,
                height: 90,
                border: `4px solid ${theme.palette.background.paper}`,
                position: "relative",
                zIndex: 1,
                cursor: "pointer",
              }}
              onError={(e) => {
                console.log("Avatar failed to load:", userData.profileImage);
                const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  userName
                )}&background=random`;
                if (userData.profileImage !== fallbackUrl) {
                  setProfileImage(fallbackUrl);
                }
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
              }}
            >
              Welcome back, {userName}!
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 2 },
                flexWrap: "wrap",
              }}
            >
              <Chip
                label={userData.level}
                color="primary"
                size="small"
                sx={{
                  borderRadius: 2,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  height: { xs: "24px", sm: "32px" },
                }}
              />
              <Chip
                label={`Current: ${userData.stats.currentWeight}`}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 2,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  height: { xs: "24px", sm: "32px" },
                }}
              />
              <Chip
                label={`Goal: ${userData.stats.goalWeight}`}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 2,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  height: { xs: "24px", sm: "32px" },
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
            mt: { xs: 2, md: 0 },
          }}
        ></Box>

        <Stack
          direction="row"
          spacing={{ xs: 1, sm: 2 }}
          sx={{
            "& .MuiIconButton-root": {
              transition: "all 0.2s ease-in-out",
              width: { xs: "36px", sm: "48px" },
              height: { xs: "36px", sm: "48px" },
              "&:hover": {
                transform: "scale(1.1)",
                background: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              },
            },
            "& .MuiSvgIcon-root": {
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
            },
          }}
        >
          <IconButton
            aria-label="settings"
            sx={{
              border: `2px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <SettingsIcon />
          </IconButton>
          <IconButton
            aria-label="sign out"
            onClick={handleOpenDialog}
            sx={{
              border: `2px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Stack>
      </Box>

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
