import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Button, Grid, Typography, Divider, Avatar, ToggleButtonGroup, ToggleButton, Snackbar, Alert } from "@mui/material";
import { ArrowForward, Person, Save, Refresh } from "@mui/icons-material";
import ProfileField from "./ProfileField";
import { updateUser } from "../api";
import { getUserIdFromToken} from "@/api";

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const ageGroupOptions = [
  { value: "18-25", label: "18-25" },
  { value: "26-35", label: "26-35" },
  { value: "36-45", label: "36-45" },
  { value: "46+", label: "46+" },
];

const goalOptions = [
  { value: "WEIGHT_LOSS", label: "Weight Loss" },
  { value: "MUSCLE_GAIN", label: "Muscle Gain" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "STRENGTH", label: "Strength" },
  { value: "ENDURANCE", label: "Endurance" },
];
export default function ProfileForm({
  formData,
  setFormData,
  handleSubmit: parentHandleSubmit = null,
  gender,
  setGender,
  ageGroup,
  setAgeGroup,
  height,
  setHeight,
  weight,
  setWeight,
  goal,
  setGoal,
  isPopup = false,
  darkMode = false,
  onSuccess = null,
  currentUser = null,
}) {
  const [heightUnit, setHeightUnit] = useState('cm');
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(0);
  const [weightUnit, setWeightUnit] = useState('kg');
  const [pounds, setPounds] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  useEffect(() => {
    if (heightUnit === 'ft' && height) {
      const totalInches = height / 2.54;
      const ft = Math.floor(totalInches / 12);
      const inch = Math.round(totalInches % 12);
      setFeet(ft);
      setInches(inch);
    } else if (heightUnit === 'cm' && (feet || inches)) {
      const totalInches = (feet * 12) + inches;
      const cm = Math.round(totalInches * 2.54);
      setHeight(cm);
    }
  }, [heightUnit]);

  useEffect(() => {
    if (weightUnit === 'lb' && weight) {
      const lb = Math.round(weight * 2.20462);
      setPounds(lb);
    } else if (weightUnit === 'kg' && pounds) {
      const kg = Math.round(pounds / 2.20462);
      setWeight(kg);
    }
  }, [weightUnit, weight, pounds, setWeight]);

  const handleHeightUnitChange = (event, newUnit) => {
    if (newUnit !== null) {
      setHeightUnit(newUnit);
    }
  };

  const handleWeightUnitChange = (event, newUnit) => {
    if (newUnit !== null) {
      setWeightUnit(newUnit);
    }
  };

  const handleFeetChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setFeet('');
    } else {
      const newFeet = Number(value);
      setFeet(newFeet);
      if (inches !== '' && inches !== null) {
        const totalInches = (newFeet * 12) + Number(inches);
        const cm = Math.round(totalInches * 2.54);
        setHeight(cm);
      }
    }
  };

  const handleInchesChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setInches('');
    } else {
      const newInches = Number(value);
      setInches(newInches);
      if (feet !== '' && feet !== null) {
        const totalInches = (Number(feet) * 12) + newInches;
        const cm = Math.round(totalInches * 2.54);
        setHeight(cm);
      }
    }
  };

  const handleCmChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setHeight('');
    } else {
      const newHeight = Number(value);
      setHeight(newHeight);
    }
  };

  const handleKgChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setWeight('');
    } else {
      const newWeight = Number(value);
      setWeight(newWeight);
    }
  };

  const handleLbChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setPounds('');
    } else {
      const newPounds = Number(value);
      setPounds(newPounds);
      const kg = Math.round(newPounds / 2.20462);
      setWeight(kg);
    }
  };

  const handleTextChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const validateForm = () => {
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        showAlert("Passwords do not match", "error");
        return false;
      }
    }

    if (!height || height < 130 || height > 220) {
      showAlert("Height must be between 130cm and 220cm", "error");
      return false;
    }

    if (!weight || weight < 40 || weight > 150) {
      showAlert("Weight must be between 40kg and 150kg", "error");
      return false;
    }

    if (!gender || !ageGroup || !goal) {
      showAlert("Please select gender, age group, and fitness goal", "error");
      return false;
    }

    return true;
  };

  const showAlert = (message, severity = "error") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (parentHandleSubmit) {
      parentHandleSubmit(e);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token);

      if (!userId || !token) {
        showAlert("You must be logged in to update your profile", "error");
        return;
      }

      const requestBody = {
        email: formData.email || (currentUser?.email || ""),
        password: formData.password || undefined,
        fullName: `${formData.firstName || (currentUser?.first_name || "")} ${formData.lastName || (currentUser?.last_name || "")}`,
        selectedAgeGroup: ageGroup.split("-")[0],
        selectedGender: gender,
        selectedHeight: height,
        selectedWeight: weight,
        selectedGoal: goal,
      };


      const response = await updateUser(Number(userId), requestBody, token);

      showAlert("Profile updated successfully!", "success");

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showAlert(error.message || "Failed to update profile", "error");
    }
  };

  const unitToggleStyle = {
    mb: 2,
    width: '100%',
    '.MuiToggleButtonGroup-root': {
      width: '100%',
      display: 'flex',
    },
    '.MuiToggleButton-root': {
      flex: 1,
      textTransform: 'none',
      fontWeight: 500,
      color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
      borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.23)',
      '&.Mui-selected': {
        backgroundColor: darkMode ? '#D4AF37' : '#6200ea',
        color: '#fff',
        '&:hover': {
          backgroundColor: darkMode ? '#b8860b' : '#5000d6',
        }
      }
    }
  };

  const numberInputStyle = {
    MozAppearance: 'textfield',
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
  };

  return (
    <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 1, textAlign: "left" }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            bgcolor: darkMode ? "#D4AF37" : "#6200ea",
            background: darkMode 
              ? "#D4AF37" 
              : "linear-gradient(90deg, #6200ea, #3f51b5)",
            mb: 2,
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
          }}
        >
          <Person sx={{ fontSize: 60 }} />
        </Avatar>
        <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 1 }}>
          Your Personal Information
        </Typography>
      </Box>

      <Typography 
        variant="h6" 
        fontWeight="600" 
        sx={{ 
          color: darkMode ? "#D4AF37" : "#6200ea", 
          mb: 2 
        }}
      >
        Account Details
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <ProfileField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleTextChange}
            placeholder="Enter your first name"
            required
            darkMode={darkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ProfileField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleTextChange}
            placeholder="Enter your last name"
            required
            darkMode={darkMode}
          />
        </Grid>
        <Grid item xs={12}>
          <ProfileField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleTextChange}
            placeholder="Enter your email"
            required
            darkMode={darkMode}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3, borderColor: "rgba(212, 175, 55, 0.3)" }} />
      
      <Typography 
        variant="h6" 
        fontWeight="600" 
        sx={{ 
          color: darkMode ? "#D4AF37" : "#6200ea", 
          mb: 2 
        }}
      >
        Change Password (Optional)
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <ProfileField
            label="New Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleTextChange}
            darkMode={darkMode}
            autoComplete="new-password"
            autoSave="off"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ProfileField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            placeholder="Confirm your new password"
            onChange={handleTextChange}
            darkMode={darkMode}
            autoComplete="new-password"
            autoSave="off"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3, borderColor: "rgba(212, 175, 55, 0.3)" }} />
      
      <Typography 
        variant="h6" 
        fontWeight="600" 
        sx={{ 
          color: darkMode ? "#D4AF37" : "#6200ea", 
          mb: 2 
        }}
      >
        Personal Fitness Profile
      </Typography> 

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <ProfileField
            label="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            select
            options={genderOptions}
            placeholder="Select your gender"
            required
            darkMode={darkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ProfileField
            label="Age Group"
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            select
            placeholder="Select your age group"
            options={ageGroupOptions}
            required
            darkMode={darkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 1, 
                color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)" 
              }}
            >
              Height
            </Typography>
            <ToggleButtonGroup
              value={heightUnit}
              exclusive
              onChange={handleHeightUnitChange}
              size="small"
              fullWidth
              sx={unitToggleStyle}
            >
              <ToggleButton value="cm">Centimeters </ToggleButton>
              <ToggleButton value="ft">Feet/Inches </ToggleButton>
            </ToggleButtonGroup>
            
            {heightUnit === 'cm' ? (
              <ProfileField
                label="Height (cm)"
                type="number"
                value={height || ''}
                onChange={handleCmChange}
                placeholder="Enter your height in cm"
                required
                darkMode={darkMode}
                inputProps={{
                  style: numberInputStyle,
                  step: 1,
                }}
                helperText="Valid range: 130cm - 220cm"
              />
            ) : (
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <ProfileField
                    label="Feet"
                    type="number"
                    value={feet || ''}
                    onChange={handleFeetChange}
                    required
                    darkMode={darkMode}
                    inputProps={{
                      style: numberInputStyle,
                      step: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ProfileField
                    label="Inches"
                    type="number"
                    value={inches || ''}
                    onChange={handleInchesChange}
                    required
                    darkMode={darkMode}
                    inputProps={{
                      style: numberInputStyle,
                      step: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography 
                    variant="caption" 
                    component="p"
                    sx={{ 
                      mt: 0.5, 
                      color: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.5)" 
                    }}
                  >
                    Valid range: 4'3" - 7'2" (130cm - 220cm)
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 1, 
                color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)" 
              }}
            >
              Weight
            </Typography>
            <ToggleButtonGroup
              value={weightUnit}
              exclusive
              onChange={handleWeightUnitChange}
              size="small"
              fullWidth
              sx={unitToggleStyle}
            >
              <ToggleButton value="kg">Kilograms</ToggleButton>
              <ToggleButton value="lb">Pounds </ToggleButton>
            </ToggleButtonGroup>
            
            {weightUnit === 'kg' ? (
              <ProfileField
                label="Weight (kg)"
                type="number"
                value={weight || ''}
                onChange={handleKgChange}
                placeholder="Enter your weight in kg"
                required
                darkMode={darkMode}
                inputProps={{
                  style: numberInputStyle,
                  step: 1,
                }}
                helperText="Valid range: 40kg - 150kg"
              />
            ) : (
              <ProfileField
                label="Weight (lb)"
                type="number"
                value={pounds || ''}
                onChange={handleLbChange}
                placeholder="Enter your weight in pounds"
                required
                darkMode={darkMode}
                inputProps={{
                  style: numberInputStyle,
                  step: 1,
                }}
                helperText="Valid range: 88lb - 330lb"
              />
            )}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <ProfileField
            label="Fitness Goal"
            value={goal}
            placeholder="Select your goal"
            onChange={(e) => setGoal(e.target.value)}
            select
            options={goalOptions}
            required
            darkMode={darkMode}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "space-between" }}>
        <Button
          onClick={handleReset}
          variant="outlined"
          size="large"
          startIcon={<Refresh />}
          sx={{
            flex: 1,
            textTransform: "none",
            color: darkMode ? "#D4AF37" : "#6200ea",
            borderColor: darkMode ? "#D4AF37" : "#6200ea",
            "&:hover": {
              borderColor: darkMode ? "#b8860b" : "#3f51b5",
              backgroundColor: darkMode 
                ? "rgba(212, 175, 55, 0.1)" 
                : "rgba(98, 0, 234, 0.1)",
            },
          }}
        >
          Reset Form
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          endIcon={<Save />}
          sx={{
            flex: 2,
            fontWeight: "bold",
            textTransform: "none",
            background: darkMode 
              ? "#D4AF37" 
              : "linear-gradient(90deg, #6200ea, #3f51b5)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": {
              background: darkMode 
                ? "#b8860b" 
                : "linear-gradient(90deg, #5000d6, #303f9f)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            },
          }}
        >
          Save Profile Changes
        </Button>
      </Box>

      <Snackbar 
        open={alertOpen} 
        autoHideDuration={6000} 
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setAlertOpen(false)} 
          severity={alertSeverity} 
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

ProfileForm.propTypes = {
  formData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    confirmPassword: PropTypes.string,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  gender: PropTypes.string,
  setGender: PropTypes.func.isRequired,
  ageGroup: PropTypes.string,
  setAgeGroup: PropTypes.func.isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setHeight: PropTypes.func.isRequired,
  weight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setWeight: PropTypes.func.isRequired,
  goal: PropTypes.string,
  setGoal: PropTypes.func.isRequired,
  isPopup: PropTypes.bool,
  darkMode: PropTypes.bool,
  onSuccess: PropTypes.func,
  currentUser: PropTypes.object,
};