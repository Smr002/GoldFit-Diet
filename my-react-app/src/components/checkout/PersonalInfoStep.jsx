import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getUserById, getUserIdFromToken } from "../../api"; // Adjust the import path as needed

const PersonalInfoStep = ({
  formData,
  formErrors,
  handleInputChange,
  handleNext,
  onClose,
  guestCheckout,
  setGuestCheckout,
  isDarkMode,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user data from the database
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Only fetch user data if user is logged in and not in guest checkout
    if (token && !guestCheckout) {
      const fetchUserData = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const userId = getUserIdFromToken(token);
          if (!userId) {
            throw new Error("Invalid token: User ID not found");
          }

          const userData = await getUserById(userId, token);

          // Update form data with user information
          handleInputChange({
            target: { name: "firstName", value: userData.firstName || "" },
          });
          handleInputChange({
            target: { name: "lastName", value: userData.lastName || "" },
          });
          handleInputChange({
            target: { name: "email", value: userData.email || "" },
          });
          if (userData.phone) {
            handleInputChange({
              target: { name: "phone", value: userData.phone },
            });
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError(
            "Failed to load your profile data. Please enter your details manually."
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [guestCheckout, handleInputChange]); // Include handleInputChange in dependencies

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    if (name === "guestCheckout") {
      setGuestCheckout(checked);
    } else {
      handleInputChange({
        target: { name, type: "checkbox", checked },
      });
    }
  };

  const textFieldProps = {
    InputLabelProps: {
      style: { color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : undefined },
    },
    sx: {
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: isDarkMode ? "rgba(255, 215, 0, 0.5)" : undefined,
        },
        "&:hover fieldset": {
          borderColor: isDarkMode ? "rgba(255, 215, 0, 0.7)" : undefined,
        },
        "&.Mui-focused fieldset": {
          borderColor: isDarkMode ? "#FFD700" : undefined,
        },
        "& input": {
          color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : undefined,
        },
      },
    },
  };

  return (
    <Paper
      elevation={isDarkMode ? 2 : 1}
      sx={{
        p: 3,
        mb: 3,
        bgcolor: isDarkMode
          ? "rgba(40, 40, 40, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        borderRadius: 2,
        transition: "all 0.3s ease",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          color: isDarkMode ? "#FFD700" : "#6c63ff",
          fontWeight: 600,
        }}
      >
        Personal Information
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress
            size={40}
            sx={{ color: isDarkMode ? "#FFD700" : "#6c63ff" }}
          />
        </Box>
      ) : (
        <>
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {!guestCheckout && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.createAccount}
                  onChange={handleCheckboxChange}
                  name="createAccount"
                  sx={{
                    color: isDarkMode ? "rgba(255, 215, 0, 0.7)" : undefined,
                    "&.Mui-checked": {
                      color: isDarkMode ? "#FFD700" : "#6c63ff",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : "inherit",
                  }}
                >
                  Create an account for faster checkout next time
                </Typography>
              }
            />
          )}

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                variant="outlined"
                {...textFieldProps}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
                variant="outlined"
                {...textFieldProps}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                variant="outlined"
                {...textFieldProps}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                variant="outlined"
                {...textFieldProps}
              />
            </Grid>
          </Grid>

          {!guestCheckout && formData.createAccount && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Create Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                variant="outlined"
                {...textFieldProps}
              />
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={onClose}
              sx={{
                borderColor: isDarkMode ? "#FFD700" : "#6c63ff",
                color: isDarkMode ? "#FFD700" : "#6c63ff",
                "&:hover": {
                  borderColor: isDarkMode ? "#DAA520" : "#4834d4",
                  backgroundColor: isDarkMode
                    ? "rgba(255, 215, 0, 0.1)"
                    : undefined,
                },
              }}
            >
              Back to Plans
            </Button>

            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                backgroundColor: isDarkMode ? "#FFD700" : "#6c63ff",
                color: isDarkMode ? "#000" : "#fff",
                "&:hover": {
                  backgroundColor: isDarkMode ? "#DAA520" : "#4834d4",
                },
              }}
            >
              Continue to Address
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default PersonalInfoStep;
