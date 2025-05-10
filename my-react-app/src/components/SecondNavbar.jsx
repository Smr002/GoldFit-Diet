import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/goldfitlogo.png";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
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
  Badge,
} from "@mui/material";

export default function SecondNavbar({ setModalOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
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
  const [cartItemCount, setCartItemCount] = useState(0);

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

  useEffect(() => {
    if (darkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.setAttribute('data-theme', 'light');
    }
    
    return () => {
      document.body.removeAttribute('data-theme');
    };
  }, [darkMode]);

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

  const handleCartClick = () => {
    navigate('/checkout');
  };

  const isActive = (path) => {
    return location.pathname === path;
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
            className={isActive("/user-home") ? "try-now-button active" : "nav-link"}
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-text">Home</span>
          </Link>
          <Link
            to="/exercises"
            className={isActive("/exercises") ? "try-now-button active" : "nav-link"}
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-text">Exercises</span>
          </Link>
          <Link
            to="/workouts"
            className={isActive("/workouts") ? "try-now-button active" : "nav-link"}
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-text">Workouts</span>
          </Link>
          <Link
            to="/nutrition"
            className={isActive("/nutrition") ? "try-now-button active" : "nav-link"}
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-text">Nutrition</span>
          </Link>

          <IconButton 
            onClick={handleCartClick} 
            color="inherit"
            className="nav-icon-button cart-button"
            aria-label="shopping cart"
            sx={{ 
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              mr: 1 
            }}
          >
            <Badge badgeContent={cartItemCount} color="error" variant="dot" invisible={cartItemCount === 0}>
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          <IconButton 
            onClick={() => setProfileOpen(true)} 
            color="inherit"
            className="nav-icon-button"
          >
            <AccountCircleIcon />
          </IconButton>

          <IconButton
            aria-label="sign out"
            onClick={() => setOpenDialog(true)}
            sx={{ border: "2px solid", borderRadius: 2, ml: 2 }}
            className="nav-icon-button"
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
            Are you sure you want to sign out? You'll need to log in again to
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
    <style>
  {`
    /* Enhanced link transitions */
    .nav-link, .try-now-button {
      position: relative;
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      padding: 8px 16px;
      margin: 0 4px;
      overflow: hidden;
      font-weight: 500;
      text-align: center;
    }
    
    /* Text span animation */
    .nav-text {
      display: inline-block;
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), 
                  color 0.4s ease;
    }
    
    /* Default text colors - light mode */
    .nav-link .nav-text {
      color: var(--text-color, rgba(0, 0, 0, 0.75));
    }
    
    /* Dark mode text color adjustment */
    body[data-theme="dark"] .nav-link .nav-text {
      color: var(--text-color-dark, rgba(255, 255, 255, 0.85));
    }
    
    /* Hover effects - light mode */
    .nav-link:hover .nav-text {
      transform: translateY(-2px);
      color: #6c63ff;
    }
    
    /* Active state - both modes */
    .try-now-button.active .nav-text {
      transform: translateY(-2px);
      color: white !important;
    }
    
    /* Dark mode hover & active */
    body[data-theme="dark"] .nav-link:hover .nav-text {
      color: #d4af37;
    }
    
    /* Background fill effect for active/hover state - light mode */
    .nav-link::before, .try-now-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(108, 99, 255, 0.05), rgba(72, 52, 212, 0.08));
      border-radius: 8px;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1), 
                  background 0.5s ease-in-out;
      z-index: -1;
    }
    
    /* Dark mode background adjustment */
    body[data-theme="dark"] .nav-link::before, 
    body[data-theme="dark"] .try-now-button::before {
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(255, 215, 0, 0.12));
    }
    
    /* Bottom border animation - light mode */
    .nav-link::after, .try-now-button::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, #6c63ff, #4834d4);
      transform: scaleX(0);
      transform-origin: center;
      transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                  opacity 0.3s ease;
      opacity: 0;
    }
    
    /* Dark mode bottom border */
    body[data-theme="dark"] .nav-link::after, 
    body[data-theme="dark"] .try-now-button::after {
      background: linear-gradient(90deg, #d4af37, #ffd700);
    }
    
    /* Hover effects - light mode */
    .nav-link:hover::before {
      transform: scaleX(1);
      background: linear-gradient(135deg, rgba(108, 99, 255, 0.1), rgba(72, 52, 212, 0.15));
    }
    
    /* Dark mode hover effect */
    body[data-theme="dark"] .nav-link:hover::before {
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(255, 215, 0, 0.2));
    }
    
    .nav-link:hover::after {
      transform: scaleX(0.6);
      opacity: 0.7;
    }
    
    /* Active state styling with animations */
    .try-now-button.active {
      font-weight: 600;
      background: linear-gradient(90deg, #6c63ff, #4834d4);
    }
    
    .try-now-button.active::before {
      transform: scaleX(1);
      background: linear-gradient(90deg, #6c63ff, #4834d4);
    }
    
    body[data-theme="dark"] .try-now-button.active {
      background: linear-gradient(90deg, #d4af37, #ffd700);
      box-shadow: 0 2px 10px rgba(212, 175, 55, 0.15);
    }
    
    body[data-theme="dark"] .try-now-button.active::before {
      background: linear-gradient(90deg, #d4af37, #ffd700);
    }
    
    .try-now-button.active::after {
      transform: scaleX(0.8);
      opacity: 1;
    }
    
    /* Page transition between routes */
    .nav-links a {
      position: relative;
      transition: color 0.5s ease, 
                  transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
                  background-color 0.5s ease;
    }
    
    /* Active state animation */
    @keyframes activatePage {
      0% { transform: scale(0.95); opacity: 0.7; }
      50% { transform: scale(1.05); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    .try-now-button.active {
      animation: activatePage 0.6s cubic-bezier(0.18, 0.89, 0.32, 1.28);
      box-shadow: 0 2px 10px rgba(108, 99, 255, 0.2);
    }
    
    /* Light mode gradient for all active sections */
    .try-now-button.active[href="/user-home"] .nav-text,
    .try-now-button.active[href="/exercises"] .nav-text,
    .try-now-button.active[href="/workouts"] .nav-text,
    .try-now-button.active[href="/nutrition"] .nav-text {
      color: white !important;
    }
    
    .try-now-button.active[href="/user-home"],
    .try-now-button.active[href="/exercises"],
    .try-now-button.active[href="/workouts"],
    .try-now-button.active[href="/nutrition"] {
      background: linear-gradient(90deg, #6c63ff, #4834d4);
    }
    
    /* Dark mode gradient for all active sections */
    body[data-theme="dark"] .try-now-button.active[href="/user-home"],
    body[data-theme="dark"] .try-now-button.active[href="/exercises"],
    body[data-theme="dark"] .try-now-button.active[href="/workouts"],
    body[data-theme="dark"] .try-now-button.active[href="/nutrition"] {
      background: linear-gradient(90deg, #d4af37, #ffd700);
    }
    
    body[data-theme="dark"] .try-now-button.active[href="/user-home"] .nav-text,
    body[data-theme="dark"] .try-now-button.active[href="/exercises"] .nav-text,
    body[data-theme="dark"] .try-now-button.active[href="/workouts"] .nav-text,
    body[data-theme="dark"] .try-now-button.active[href="/nutrition"] .nav-text {
      color: white !important;
    }
    
    /* Section-specific hover colors */
    .nav-link[href="/user-home"]:hover .nav-text,
    .nav-link[href="/exercises"]:hover .nav-text,
    .nav-link[href="/workouts"]:hover .nav-text,
    .nav-link[href="/nutrition"]:hover .nav-text {
      color: #6c63ff;
    }
    
    body[data-theme="dark"] .nav-link[href="/user-home"]:hover .nav-text,
    body[data-theme="dark"] .nav-link[href="/exercises"]:hover .nav-text,
    body[data-theme="dark"] .nav-link[href="/workouts"]:hover .nav-text,
    body[data-theme="dark"] .nav-link[href="/nutrition"]:hover .nav-text {
      color: #d4af37;
    }
    
    /* Icon button animations */
    .nav-icon-button {
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    }
    
    .nav-icon-button:hover {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    body[data-theme="dark"] .nav-icon-button:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    /* Cart icon specific animations */
    .cart-button {
      position: relative;
      overflow: visible !important;
    }
    
    .cart-button:hover {
      transform: scale(1.1) !important;
    }
    
    /* Cart hover animation */
    .cart-button:hover svg {
      animation: cartBounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    @keyframes cartBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    
    /* Light mode cart styling */
    .cart-button svg {
      color: var(--text-color, rgba(0, 0, 0, 0.75));
      transition: color 0.3s ease;
    }
    
    .cart-button:hover svg {
      color: #6c63ff;
    }
    
    /* Dark mode cart styling */
    body[data-theme="dark"] .cart-button svg {
      color: var(--text-color-dark, rgba(255, 255, 255, 0.85));
    }
    
    body[data-theme="dark"] .cart-button:hover svg {
      color: #d4af37;
    }
    
    /* Additional styles for cart button with items */
    .MuiBadge-badge {
      transition: all 0.3s ease !important;
    }
  `}
</style>
    </header>
  );
}