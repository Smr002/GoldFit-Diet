import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Button, Typography, Divider, Avatar, IconButton, Snackbar, Alert } from "@mui/material";
import { Close, Person, Save } from "@mui/icons-material";
import ProfileForm from "./ProfileForm";
import { updateUser, getUserIdFromToken, getUserById } from "@/api";
import { useUpdateProfile } from "@/store/useUpdateProfile";

// Helper function to map age to ageGroup
const mapAgeToAgeGroup = (age) => {
  if (!age) return "18-25";
  if (age >= 18 && age <= 25) return "18-25";
  if (age >= 26 && age <= 35) return "26-35";
  if (age >= 36 && age <= 45) return "36-45";
  return "46+";
};

export default function ProfilePopup({
  open,
  onClose,
  darkMode,
  onSuccess = null, // Callback for successful updates
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Add state for alerts
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the same global state as Profile.jsx
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

  // Setup function to show alerts
  const showAlert = (message, severity = "error") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  // Prevent body scrolling when popup is open
  useEffect(() => {
    if (open) {
      // Store original overflow style
      const originalStyle = window.getComputedStyle(document.body).overflow;
      // Prevent scrolling on the main page
      document.body.style.overflow = 'hidden';

      // Fetch user data when popup opens (like in Profile.jsx)
      const fetchUserData = async () => {
        const token = localStorage.getItem("token");
        const userId = token ? getUserIdFromToken(token) : null;
        
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
            showAlert("Failed to load user data", "error");
          }
        }
      };
      
      fetchUserData();
      
      // Cleanup function to restore scrolling
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [open, setGender, setAgeGroup, setHeight, setWeight, setGoal]);

  // Handle form submission (similar to Profile.jsx)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const token = localStorage.getItem("token");
    const userId = token ? getUserIdFromToken(token) : null;

    if (!userId) {
      showAlert("User not authenticated.", "error");
      setIsSubmitting(false);
      return;
    }

    if (formData.password && formData.password.length < 8) {
      showAlert("Password must be at least 8 characters long.", "error");
      setIsSubmitting(false);
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      showAlert("Passwords do not match.", "error");
      setIsSubmitting(false);
      return;
    }

    if (!gender || !ageGroup || !goal) {
      showAlert("Please select a gender, age group, and goal.", "error");
      setIsSubmitting(false);
      return;
    }

    // Fetch current user data to fill in missing fields
    let currentUser;
    try {
      currentUser = await getUserById(Number(userId), token);
    } catch (error) {
      showAlert("Failed to fetch user data.", "error");
      setIsSubmitting(false);
      return;
    }

    const requestBody = {
      email: formData.email || currentUser.email,
      password: formData.password || undefined, // Optional for updates
      fullName: `${formData.firstName || currentUser.first_name} ${formData.lastName || currentUser.last_name}`,
      selectedAgeGroup: ageGroup.split("-")[0], // e.g., "26-35" -> "26"
      selectedGender: gender, // Already "Male", "Female", etc.
      selectedHeight: height !== 0 ? height : currentUser.height,
      selectedWeight: weight !== 0 ? weight : currentUser.weight,
      selectedGoal: goal, // Already "Lose Weight", "Maintain", etc.
    };

    try {
      await updateUser(Number(userId), requestBody, token);

      // Update localStorage
      const updatedUser = {
        displayName: formData.firstName,
        email: formData.email,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Re-fetch user data to update UI
      const updatedUserData = await getUserById(Number(userId), token);
      setFormData({
        firstName: updatedUserData.first_name || "",
        lastName: updatedUserData.last_name || "",
        email: updatedUserData.email || "",
        password: "",
        confirmPassword: "",
      });
      setGender(updatedUserData.gender || "Male");
      setAgeGroup(mapAgeToAgeGroup(updatedUserData.age));
      setHeight(updatedUserData.height || 0);
      setWeight(updatedUserData.weight || 0);
      setGoal(updatedUserData.goal || "Lose Weight");

      showAlert("Profile updated successfully!", "success");
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(updatedUserData);
      }
      
      // Close the popup after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      showAlert(error.message || "Failed to update profile. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div 
      className="profile-modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(5px)",
      }}
    >
      <div 
        className="profile-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: darkMode ? "#1e1e1e" : "#fff",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "700px",
          maxHeight: "85vh",
          overflow: "hidden", // Hide overflow from container
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
          position: "relative",
          border: darkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
        }}
      >
        <IconButton
          onClick={onClose}
          aria-label="Close"
          sx={{
            position: "absolute",
            top: "12px",
            right: "12px",
            color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
            zIndex: 2,
            "&:hover": {
              backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          <Close />
        </IconButton>

        <Box
          sx={{
            background: darkMode 
              ? "linear-gradient(90deg, #D4AF37, #FFC857)" 
              : "linear-gradient(90deg, #6200ea, #3f51b5)",
            padding: "16px 24px",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor: darkMode ? "#1e1e1e" : "#fff",
              color: darkMode ? "#D4AF37" : "#6200ea",
              width: 48,
              height: 48,
            }}
          >
            <Person />
          </Avatar>
          <Typography 
            variant="h5" 
            component="h2" 
            fontWeight="bold"
            sx={{ 
              color: darkMode ? "#1a1a2e" : "#fff",
            }}
          >
            Your Profile
          </Typography>
        </Box>

        <Box 
          sx={{ 
            padding: "24px", 
            maxHeight: "calc(85vh - 70px)", 
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
              borderRadius: "4px"
            },
            "&::-webkit-scrollbar-thumb": {
              background: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
              borderRadius: "4px",
              '&:hover': {
                background: darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
              }
            }
          }}
        >
          <ProfileForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
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
            isPopup={true}
            isSubmitting={isSubmitting}
          />
        </Box>
      </div>
      
      {/* Add a Snackbar for alerts */}
      <Snackbar 
        open={alertOpen} 
        autoHideDuration={6000} 
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setAlertOpen(false)} 
          severity={alertSeverity}
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '0.95rem'
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

// Update PropTypes
ProfilePopup.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  darkMode: PropTypes.bool,
  onSuccess: PropTypes.func, // Callback for successful updates
};