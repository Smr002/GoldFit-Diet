import React, { useState, useEffect } from "react";
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
import { motion } from "framer-motion";
import logo from "../assets/react.svg";

export default function AccModal({ open, onClose }) {
  const [email, setEmail] = useState("");
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
    : "rgba(0, 0, 0, 0.12)";
  const gradientColor = isDarkMode
    ? "linear-gradient(90deg, #ffd700, #ffb700)" // Gold gradient for dark mode
    : "linear-gradient(90deg, #6c63ff, #4834d4)"; // Purple gradient for light mode

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
          <img src={logo} alt="Logo" style={{ width: "50px" }} />
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
          >
            Continue with Google
          </Button>

          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="henry@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <Link
            href="#"
            underline="hover"
            sx={{
              display: "block",
              marginTop: 1,
              color: primaryColor,
              fontWeight: "bold",
            }}
          >
            Forgot Password?
          </Link>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
