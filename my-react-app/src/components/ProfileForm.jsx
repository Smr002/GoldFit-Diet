import React from "react";
import PropTypes from "prop-types";
import { Box, Button, Grid, Typography, Divider, Avatar } from "@mui/material";
import { ArrowForward, Person, Save, Refresh } from "@mui/icons-material";
import ProfileField from "./ProfileField";

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
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
  handleSubmit,
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
}) {
  const handleTextChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReset = () => {
    // This just resets the form without submitting
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, textAlign: "left" }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            bgcolor: "#D4AF37",
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

      <Typography variant="h6" fontWeight="600" sx={{ color: "#D4AF37", mb: 2 }}>
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
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3, borderColor: "rgba(212, 175, 55, 0.3)" }} />
      
      <Typography variant="h6" fontWeight="600" sx={{ color: "#D4AF37", mb: 2 }}>
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
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3, borderColor: "rgba(212, 175, 55, 0.3)" }} />
      
      <Typography variant="h6" fontWeight="600" sx={{ color: "#D4AF37", mb: 2 }}>
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
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ProfileField
            label="Height (cm)"
            type="number"
            value={height}
            placeholder="Enter your height in cm"
            onChange={(e) => setHeight(Number(e.target.value))}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ProfileField
            label="Weight (kg)"
            type="number"
            value={weight}
            placeholder="Enter your weight in kg"
            onChange={(e) => setWeight(Number(e.target.value))}
            required
          />
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
            color: "#D4AF37",
            borderColor: "#D4AF37",
            "&:hover": {
              borderColor: "#b8860b",
              backgroundColor: "rgba(212, 175, 55, 0.1)",
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
            backgroundColor: "#D4AF37",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": {
              backgroundColor: "#b8860b",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            },
          }}
        >
          Save Profile Changes
        </Button>
      </Box>
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
  handleSubmit: PropTypes.func.isRequired,
  gender: PropTypes.string,
  setGender: PropTypes.func.isRequired,
  ageGroup: PropTypes.string,
  setAgeGroup: PropTypes.func.isRequired,
  height: PropTypes.number,
  setHeight: PropTypes.func.isRequired,
  weight: PropTypes.number,
  setWeight: PropTypes.func.isRequired,
  goal: PropTypes.string,
  setGoal: PropTypes.func.isRequired,
};