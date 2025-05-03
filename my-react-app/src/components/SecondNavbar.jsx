import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/goldfitlogo.png";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ProfilePopup from './ProfilePopup';
import { getUserIdFromToken, getUserById } from '@/api';
import { useUpdateProfile } from '@/store/useUpdateProfile';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  Fade,
} from "@mui/material";

export default function SecondNavbar({ setModalOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const token = localStorage.getItem("token");
  const userId = token ? getUserIdFromToken(token) : null;
  const darkMode = localStorage.getItem("theme") === "dark";

  const {
    gender,
    ageGroup,
    height,
    weight,
    goal,
    setGender,
    setAgeGroup,
    setHeight,
    setWeight,
    setGoal,
  } = useUpdateProfile();

  const mapAgeToAgeGroup = (age) => {
    if (!age) return "18-25";
    if (age >= 18 && age <= 25) return "18-25";
    if (age >= 26 && age <= 35) return "26-35";
    if (age >= 36 && age <= 45) return "36-45";
    return "46+";
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId && token) {
        try {
          const userData = await getUserById(Number(userId), token);
          setFormData({
            firstName: userData.first_name || "",
            lastName: userData.last_name || "",
            email: userData.email || "",
            password: "",
            confirmPassword: "",
          });
          setGender(userData.gender || "Male");
          setAgeGroup(mapAgeToAgeGroup(userData.age));
          setHeight(userData.height || 0);
          setWeight(userData.weight || 0);
          setGoal(userData.goal || "Lose Weight");
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };
    
    if (profileOpen) {
      fetchUserData();
    }
  }, [profileOpen, userId, token]);

  const handleSignOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // Import the same logic from Profile.jsx
    // Copy the handleSubmit function from Profile.jsx
    
    // After successful submission, close the popup
    setProfileOpen(false);
  };

  return (
    <header className={`custom-header ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </Link>

        <div className="mobile-menu-container">
          <IconButton
            aria-label="sign out"
            onClick={() => setOpenDialog(true)}
            sx={{
              border: "2px solid",
              borderRadius: 2,
              ml: 2,
              display: { xs: "flex", sm: "none" },
            }}
          >
            <LogoutIcon />
          </IconButton>
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link
            to="/user-home"
            className="try-now-button"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/exercises"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Exercises
          </Link>
          <Link
            to="/workouts"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Workouts
          </Link>
          <Link
            to="/nutrition"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Nutrition
          </Link>

          <IconButton onClick={() => setProfileOpen(true)} color="inherit">
            <AccountCircleIcon />
          </IconButton>

          <IconButton
            aria-label="sign out"
            onClick={() => setOpenDialog(true)}
            sx={{ border: "2px solid", borderRadius: 2, ml: 2 }}
          >
            <LogoutIcon />
          </IconButton>
        </nav>
      </div>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 300 }}
        PaperProps={{
          sx: {
            p: 3,
            borderRadius: 4,
            background: "linear-gradient(135deg, #ffffff, #f9f9f9)",
            boxShadow: "0 12px 36px rgba(0,0,0,0.2)",
            minWidth: 360,
          },
        }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <Box display="flex" justifyContent="center" mb={1}>
            <LogoutIcon
              color="error"
              sx={{
                fontSize: 48,
                animation: "pop 0.4s ease-out",
              }}
            />
          </Box>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(90deg, #e53935, #d32f2f)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Sign Out
          </Typography>
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            id="sign-out-dialog-description"
            sx={{
              textAlign: "center",
              mt: 2,
              fontSize: "1rem",
              color: "text.secondary",
            }}
          >
            Are you sure you want to sign out? You’ll need to log in again to
            access your dashboard.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            color="primary"
            sx={{ borderRadius: 3, px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSignOut}
            variant="contained"
            color="error"
            autoFocus
            sx={{
              borderRadius: 3,
              px: 3,
              boxShadow: "0 4px 12px rgba(229, 57, 53, 0.3)",
            }}
          >
            Sign Out
          </Button>
        </DialogActions>

        <style>
          {`
            @keyframes pop {
              0% { transform: scale(0.8); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
          `}
        </style>
      </Dialog>

      <ProfilePopup
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleProfileSubmit}
        gender={gender}
        setGender={setGender}
        ageGroup={ageGroup}
        setAgeGroup={setAgeGroup}
        height={height}
        setHeight={setHeight}
        weight={weight}
        setWeight={setWeight}
        goal={goal}
        setGoal={setGoal}
        darkMode={darkMode}
      />
    </header>
  );
}
