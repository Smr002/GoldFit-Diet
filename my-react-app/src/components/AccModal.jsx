import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getAdminById, getUserByEmail } from "../api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Button,
  Divider,
  Link,
  Box,
} from "@mui/material";
import { Google, PersonAdd, Email, Lock } from "@mui/icons-material";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import logo from "../assets/goldfitlogo.png";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";

export default function AccModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode on component mount and when body class changes
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    };

    // Initial check
    checkDarkMode();

    // Create a mutation observer to detect changes to body class
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          checkDarkMode();
        }
      });
    });

    // Start observing the body element
    observer.observe(document.body, { attributes: true });

    // Clean up observer on component unmount
    return () => observer.disconnect();
  }, []);

  // Define colors based on theme
  const primaryColor = isDarkMode ? "#ffd700" : "#6c63ff"; // Gold in dark mode, purple in light
  const backgroundColor = isDarkMode ? "#121212" : "#ffffff";
  const textPrimaryColor = isDarkMode ? "#ffffff" : "#000000";
  const textSecondaryColor = isDarkMode
    ? "rgba(255, 255, 255, 0.7)"
    : "rgba(0, 0, 0, 0.6)";
  const dividerColor = isDarkMode
    ? "rgba(255, 255, 255, 0.12)"
    : "rgba(0, 0, 0, 0)";
  const gradientColor = isDarkMode
    ? "linear-gradient(90deg, #ffd700, #ffb700)" // Gold gradient for dark mode
    : "linear-gradient(90deg, #6c63ff, #4834d4)"; // Purple gradient for light mode

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginUser({ email, password });
      localStorage.setItem("token", response.token);

      try {
        // Check if user is admin
        const userData = await getUserByEmail(email, response.token);
        const adminData = await getAdminById(userData.id, response.token);
        console.log("Admin Data:", adminData);
        console.log("User Data:", userData);
        if (adminData && adminData.role === "admin") {
          onClose();
          navigate("/admin/dashboard");
          return;
        }
      } catch (adminError) {
        console.error("Error checking admin status:", adminError);
      }

      // If not admin or error checking admin status, proceed as regular user
      onClose();
      navigate("/user-home");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const firebaseConfig = {
    apiKey: "AIzaSyCTlgHimTflDjxvLT_imd3ClR791UqTfvo",
    authDomain: "gold-fit.firebaseapp.com",
    projectId: "gold-fit",
    storageBucket: "gold-fit.firebasestorage.app",
    messagingSenderId: "266468364421",
    appId: "1:266468364421:web:52b62607c80e52a38559ec",
    measurementId: "G-35WWV9101J",
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;

        // Save user data and token to localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          })
        );
        localStorage.setItem("token", user.accessToken || "google-auth-token");

        // Redirect to the initial path after login
        window.location.href = "/user-home";
      })
      .catch((error) => {
        console.error("Error during Google login:", error.message);
        setError("Login failed: " + error.message);
      });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          border: `2px solid ${primaryColor}`,
          padding: 2,
          backgroundColor: backgroundColor,
          color: textPrimaryColor,
        },
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ textAlign: "center", marginBottom: 2 }}>
          <img src={logo} alt="Logo" style={{ width: "70px" }} />
        </Box>
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: primaryColor,
            fontSize: "1.8rem",
          }}
        >
          Welcome
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <DialogContentText
            sx={{
              marginBottom: 3,
              fontSize: "1rem",
              color: textSecondaryColor,
            }}
          >
            Sign in or create an account to continue
          </DialogContentText>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            sx={{
              marginBottom: 2,
              borderColor: primaryColor,
              color: primaryColor,
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { background: gradientColor, color: "#fff" },
            }}
            className="google-login-btn"
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="henry@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{
                marginBottom: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.23)"
                      : "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: primaryColor,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: primaryColor,
                  },
                },
                "& .MuiInputBase-input": {
                  color: textPrimaryColor,
                },
              }}
              InputProps={{
                startAdornment: (
                  <Email sx={{ marginRight: 1, color: primaryColor }} />
                ),
                sx: { borderRadius: 1 },
              }}
            />

            {email && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  sx={{
                    marginBottom: 2,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: isDarkMode
                          ? "rgba(255, 255, 255, 0.23)"
                          : "rgba(0, 0, 0, 0.23)",
                      },
                      "&:hover fieldset": {
                        borderColor: primaryColor,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: primaryColor,
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: textPrimaryColor,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <Lock sx={{ marginRight: 1, color: primaryColor }} />
                    ),
                    sx: { borderRadius: 1 },
                  }}
                />
              </motion.div>
            )}

            {error && (
              <DialogContentText
                sx={{
                  color: "error.main",
                  marginBottom: 2,
                  fontSize: "0.875rem",
                }}
              >
                {error}
              </DialogContentText>
            )}

            {email && (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  marginBottom: 2,
                  background: gradientColor,
                  color: "#fff",
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            )}
          </form>

          <Divider sx={{ marginY: 2, bgcolor: dividerColor }}>or</Divider>
          <Link
            href="/create-account/gender"
            style={{ textDecoration: "none" }}
          >
            <Button
              fullWidth
              variant="contained"
              startIcon={<PersonAdd />}
              sx={{
                marginBottom: 2,
                background: gradientColor,
                color: "#fff",
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              Create New Account
            </Button>
          </Link>

          {!email && (
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: [20, -30, 20] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut",
              }}
              style={{
                display: "inline-block",
                fontSize: "1.5rem",
                marginTop: "-2.5rem",
                color: primaryColor,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 256 256"
                style={{ fill: primaryColor }}
              >
                <g
                  fill={primaryColor}
                  fillRule="nonzero"
                  stroke="none"
                  strokeWidth="1"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  strokeMiterlimit="10"
                  fontFamily="none"
                  fontWeight="none"
                  fontSize="none"
                  textAnchor="none"
                  style={{ mixBlendMode: "normal" }}
                >
                  <g transform="scale(5.12,5.12)">
                    <path d="M14.78125,5c-0.03125,0.00781 -0.0625,0.01953 -0.09375,0.03125c-0.04297,0.01953 -0.08594,0.03906 -0.125,0.0625c-0.01172,0 -0.01953,0 -0.03125,0c-0.01953,0.00781 -0.04297,0.01953 -0.0625,0.03125c-0.01172,0.01172 -0.01953,0.01953 -0.03125,0.03125c-0.01172,0.01172 -0.01953,0.01953 -0.03125,0.03125c-0.03125,0.01953 -0.0625,0.03906 -0.09375,0.0625c-0.02344,0.01953 -0.04297,0.03906 -0.0625,0.0625c-0.01172,0.01953 -0.02344,0.04297 -0.03125,0.0625c-0.03516,0.03906 -0.06641,0.08203 -0.09375,0.125c-0.01172,0.01172 -0.01953,0.01953 -0.03125,0.03125c0,0.01172 0,0.01953 0,0.03125c-0.01172,0.01953 -0.02344,0.04297 -0.03125,0.0625c-0.01172,0.01172 -0.01953,0.01953 -0.03125,0.03125c0,0.01953 0,0.04297 0,0.0625c-0.01172,0.03906 -0.02344,0.08203 -0.03125,0.125c0,0.03125 0,0.0625 0,0.09375c0,0.01172 0,0.01953 0,0.03125c0,0.01172 0,0.01953 0,0.03125c-0.00391,0.05078 -0.00391,0.10547 0,0.15625v32.84375c0.00391,0.39844 0.24219,0.75781 0.60938,0.91406c0.36328,0.15625 0.78906,0.07813 1.07813,-0.19531l7.25,-6.8125l5.84375,13.5c0.10938,0.24609 0.3125,0.44141 0.56641,0.53516c0.25391,0.09375 0.53516,0.08203 0.77734,-0.03516l4.375,-2c0.49609,-0.22656 0.71875,-0.8125 0.5,-1.3125l-6.09375,-13.3125l10.1875,-0.875c0.40234,-0.02734 0.75,-0.29297 0.88281,-0.67578c0.12891,-0.38281 0.01563,-0.80859 -0.28906,-1.07422l-23.84375,-22.21875c-0.04687,-0.05859 -0.09766,-0.10937 -0.15625,-0.15625c-0.03906,-0.04687 -0.07812,-0.08594 -0.125,-0.125c-0.01172,0 -0.01953,0 -0.03125,0c-0.01953,-0.02344 -0.03906,-0.04297 -0.0625,-0.0625c-0.01172,0 -0.01953,0 -0.03125,0c-0.05078,-0.02344 -0.10156,-0.04687 -0.15625,-0.0625c-0.01172,0 -0.01953,0 -0.03125,0c-0.01953,-0.01172 -0.04297,-0.02344 -0.0625,-0.03125c-0.01172,0 -0.01953,0 -0.03125,0c-0.01953,0 -0.04297,0 -0.0625,0c-0.01172,0 -0.01953,0 -0.03125,0c-0.01953,0 -0.04297,0 -0.0625,0c-0.01172,0 -0.01953,0 -0.03125,0c-0.03125,0 -0.0625,0 -0.09375,0c-0.03125,0 -0.0625,0 -0.09375,0zM16,8.28125l20.6875,19.3125l-9.375,0.8125c-0.32031,0.03125 -0.60547,0.21484 -0.76562,0.49609c-0.16406,0.27734 -0.17969,0.61719 -0.04687,0.91016l6.28125,13.6875l-2.5625,1.15625l-6,-13.84375c-0.12891,-0.29687 -0.39062,-0.51562 -0.70703,-0.58203c-0.31641,-0.07031 -0.64844,0.01953 -0.88672,0.23828l-6.625,6.21875z"></path>
                  </g>
                </g>
              </svg>
            </motion.div>
          )}
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
