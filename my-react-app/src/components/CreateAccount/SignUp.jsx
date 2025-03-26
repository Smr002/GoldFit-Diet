import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Zoom,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useCreateAccountStore } from "@/store/useCreateAccountStore";
import { createUser } from "@/api";

export default function SignUp() {
  const {
    selectedGender,
    selectedBodyType,
    selectedAgeGroup,
    selectedHeight,
    selectedWeight,
    selectedGoal,
    selectedBodyYouWant,
    selectedLoseWeight,
    selectedGainMuscle,
    selectedGetShredded,
    workoutFrequency,
  } = useCreateAccountStore();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      selectedGender,
      selectedBodyType,
      selectedAgeGroup,
      selectedHeight,
      selectedWeight,
      selectedGoal,
      selectedBodyYouWant,
      selectedLoseWeight,
      selectedGainMuscle,
      selectedGetShredded,
      workoutFrequency,
    };

    try {
      const response = await createUser(requestBody);
      console.log("User created successfully:", response);
    } catch (error) {
      console.error("Error creating user:", error.message);
    }
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1b1b2f, #0f172a)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Zoom in timeout={800}>
          <Box
            sx={{
              backgroundColor: "rgba(30, 41, 59, 0.85)",
              backdropFilter: "blur(8px)",
              borderRadius: 3,
              p: 4,
              textAlign: "center",
              boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "#fff", textShadow: "0px 2px 4px rgba(0,0,0,0.3)" }}
            >
              Sign Up
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 2, textAlign: "left" }}
            >
              <TextField
                fullWidth
                required
                id="fullName"
                label="Full Name"
                name="fullName"
                margin="normal"
                variant="outlined"
                value={formData.fullName}
                onChange={handleChange}
                InputLabelProps={{ sx: { color: "#fff" } }}
                InputProps={{
                  sx: {
                    color: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(212, 175, 55, 0.7)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#D4AF37",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#D4AF37",
                    },
                  },
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                required
                id="email"
                label="Email Address"
                name="email"
                type="email"
                margin="normal"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                InputLabelProps={{ sx: { color: "#fff" } }}
                InputProps={{
                  sx: {
                    color: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(212, 175, 55, 0.7)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#D4AF37",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#D4AF37",
                    },
                  },
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                required
                id="password"
                label="Password"
                name="password"
                type="password"
                margin="normal"
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                InputLabelProps={{ sx: { color: "#fff" } }}
                InputProps={{
                  sx: {
                    color: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(212, 175, 55, 0.7)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#D4AF37",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#D4AF37",
                    },
                  },
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                required
                id="confirmPassword"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                margin="normal"
                variant="outlined"
                value={formData.confirmPassword}
                onChange={handleChange}
                InputLabelProps={{ sx: { color: "#fff" } }}
                InputProps={{
                  sx: {
                    color: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(212, 175, 55, 0.7)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#D4AF37",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#D4AF37",
                    },
                  },
                }}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
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
                Sign Up
              </Button>
              <Typography
                variant="body2"
                align="center"
                sx={{ color: "#fff", mt: 2 }}
              >
                Already have an account?{" "}
                <Link
                  href="/login"
                  underline="hover"
                  sx={{ color: "#D4AF37", fontWeight: 500 }}
                >
                  Login here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Zoom>
      </Container>
    </Box>
  );
}
