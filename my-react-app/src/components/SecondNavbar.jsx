import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/goldfitlogo.png";
import LogoutIcon from "@mui/icons-material/Logout";
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/", { replace: true });
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

          <Link to="/profile" className="footer-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>

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
    </header>
  );
}
