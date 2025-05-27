import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  ButtonGroup,
  Slider,
  Container,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCreateAccountStore } from "@/store/useCreateAccountStore";

// Import all your images
import male1829 from "../../assets/male_18_29.png";
import male3039 from "../../assets/male_30_39.png";
import male4049 from "../../assets/male_40_49.png";
import male50 from "../../assets/male_50.png";
import female1829 from "../../assets/female_18_29.png";
import female3039 from "../../assets/female_30_39.png";
import female4049 from "../../assets/female_40_49.png";
import female50 from "../../assets/female_50.png";
import ThemeToggle from "../ThemeToggle";

export default function HeightInput({ type, prevLink, nextLink }) {
  const navigate = useNavigate();
  const { setHeight } = useCreateAccountStore();
  const selectedGender =
    useCreateAccountStore((state) => state.selectedGender) || "Male";
  const selectedAgeGroup =
    useCreateAccountStore((state) => state.selectedAgeGroup) || "Age: 30-39";

  const ageGroupImages = {
    "Age: 18-29": selectedGender === "Female" ? female1829 : male1829,
    "Age: 30-39": selectedGender === "Female" ? female3039 : male3039,
    "Age: 40-49": selectedGender === "Female" ? female4049 : male4049,
    "Age: 50+": selectedGender === "Female" ? female50 : male50,
  };

  const imagePath = ageGroupImages[selectedAgeGroup] || male3039;

  // State for height and unit toggle
  const [value, setValue] = useState(170);
  const [unit, setUnit] = useState("cm");

  // Conversion functions for height
  const cmToFt = (cm) => (cm / 30.48).toFixed(1);
  const ftToCm = (ft) => Math.round(ft * 30.48);

  const toggleUnit = () => {
    if (unit === "cm") {
      setUnit("ft");
      setValue(cmToFt(value));
    } else {
      setUnit("cm");
      setValue(ftToCm(value));
    }
  };

  // Slider range for height
  const getMinMax = () => {
    return unit === "cm" ? { min: 130, max: 220 } : { min: 4.3, max: 7.2 };
  };

  const { min, max } = getMinMax();

  // Handle slider change for height
  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  // Display height value with unit
  const displayValue = () => {
    if (unit === "ft") {
      const feet = Math.floor(value);
      const inches = Math.round((value - feet) * 12);
      return `${feet}'${inches}"`;
    }
    return `${value} ${unit}`;
  };

  // Handle save and navigation for height
  const handleSave = () => {
    const heightInCm = unit === "cm" ? value : ftToCm(value);
    setHeight(heightInCm);
    navigate(nextLink);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
      className="height-input-container"
    >
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            backgroundColor: "var(--card-bg)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            border: "1px solid var(--border-color)",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              textAlign: "center",
              color: "var(--primary-color)",
              letterSpacing: 1,
              mb: 3,
            }}
          >
            What's your height?
          </Typography>

          {/* Unit toggle buttons for height */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <ButtonGroup size="large" aria-label="unit toggle">
              <Button
                sx={{
                  borderRadius: "20px 0 0 20px",
                  px: 3,
                  bgcolor:
                    unit === "cm" ? "var(--primary-color)" : "transparent",
                  borderColor: "var(--primary-color)",
                  color: unit === "cm" ? "#fff" : "var(--primary-color)",
                  fontWeight: "bold",
                  letterSpacing: "0.5px",
                  "&:hover": {
                    bgcolor:
                      unit === "cm"
                        ? "var(--primary-hover)"
                        : "rgba(255, 255, 255, 0.1)",
                  },
                }}
                variant={unit === "cm" ? "contained" : "outlined"}
                onClick={toggleUnit}
              >
                cm
              </Button>
              <Button
                sx={{
                  borderRadius: "0 20px 20px 0",
                  px: 3,
                  bgcolor:
                    unit === "ft" ? "var(--primary-color)" : "transparent",
                  borderColor: "var(--primary-color)",
                  color: unit === "ft" ? "#fff" : "var(--primary-color)",
                  fontWeight: "bold",
                  letterSpacing: "0.5px",
                  "&:hover": {
                    bgcolor:
                      unit === "ft"
                        ? "var(--primary-hover)"
                        : "rgba(108, 99, 255, 0.1)",
                  },
                }}
                variant={unit === "ft" ? "contained" : "outlined"}
                onClick={toggleUnit}
              >
                ft
              </Button>
            </ButtonGroup>
          </Box>

          {/* Main container with scale on the left and person in the center */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
              position: "relative",
            }}
          >
            {/* Vertical Slider on the left */}
            <Box
              sx={{
                position: "relative",
                height: { xs: 300, md: 400 },
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  height: "100%",
                  width: 6,
                  bgcolor: "var(--slider-rail)",
                  borderRadius: 3,
                }}
              />
              <Slider
                orientation="vertical"
                value={value}
                onChange={handleChange}
                min={min}
                max={max}
                step={unit === "ft" ? 0.1 : 1}
                sx={{
                  height: { xs: 200, md: 300 },
                  "& .MuiSlider-track": {
                    background: "var(--slider-gradient)",
                    border: "none",
                    width: "6px",
                  },
                  "& .MuiSlider-rail": {
                    background: "#e0e0e0",
                    opacity: 1,
                    width: "6px",
                    "@media (prefers-color-scheme: dark)": {
                      background: "#404040",
                      opacity: 1,
                    },
                  },
                  "& .MuiSlider-thumb": {
                    width: 24,
                    height: 24,
                    background: "var(--primary-color)",
                    boxShadow: "var(--thumb-shadow)",
                    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
                      boxShadow: "var(--thumb-focus-shadow)",
                    },
                    "&:before": {
                      display: "none",
                    },
                  },
                }}
              />
              <Typography
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: "calc(50% + 15px)",
                  color: "var(--primary-color)",
                  transform: "translateX(-50%)",
                  fontSize: 14,
                }}
              >
                {min}
              </Typography>
              <Typography
                sx={{
                  position: "absolute",
                  top: 0,
                  left: "calc(50% + 15px)",
                  color: "var(--primary-color)",
                  transform: "translateX(-50%)",
                  fontSize: 14,
                }}
              >
                {max}
              </Typography>
            </Box>

            {/* Person and displayed height */}
            <Box sx={{ position: "relative", textAlign: "center" }}>
              <Typography
                variant="h2"
                fontWeight="bold"
                sx={{
                  color: "var(--primary-color)",
                  mb: 2,
                  textShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  letterSpacing: "1px",
                }}
              >
                {displayValue()}
              </Typography>

              <Box
                component="img"
                src={imagePath}
                alt={`${selectedGender} ${selectedAgeGroup}`}
                sx={{
                  height: { xs: 280, md: 360 },
                  position: "relative",
                  zIndex: 1,
                  filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.2))",
                }}
              />
            </Box>
          </Box>

          {/* Save Button */}
          <Box sx={{ mt: 4, maxWidth: 400, mx: "auto" }}>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                width: "100%",
                background: "var(--button-gradient)",
                color: "#fff",
                borderRadius: "50px",
                padding: "14px 0",
                fontSize: "18px",
                fontWeight: "bold",
                textTransform: "none",
                letterSpacing: "0.5px",
                boxShadow: "var(--button-shadow)",
                transition: "all 0.3s ease-in-out",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  background: "var(--button-hover-gradient)",
                  transform: "translateY(-2px)",
                  boxShadow: "var(--button-hover-shadow)",
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "var(--button-active-shadow)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  transition: "0.5s",
                },
                "&:hover::before": {
                  left: "100%",
                },
              }}
            >
              Save
            </Button>
          </Box>
        </Paper>
      </Container>

      <style jsx global>{`
        /* Light mode */
        html[data-theme="light"],
        @media (prefers-color-scheme: light) {
          body,
          #root,
          .height-input-container {
            background-color: #ffffff !important;
          }
        }

        /* Dark mode */
        html[data-theme="dark"],
        @media (prefers-color-scheme: dark) {
          body,
          #root,
          .height-input-container {
            background-color: #000000 !important;
          }
        }

        /* Ensure that the parent container adapts properly */
        html[data-theme="dark"] .MuiBox-root.height-input-container {
          background-color: #000000 !important;
        }

        html[data-theme="light"] .MuiBox-root.height-input-container {
          background-color: #ffffff !important;
        }
        :root {
          --primary-color: #6c63ff;
          --secondary-color: #4a3f8c;
          --slider-gradient: linear-gradient(0deg, #6c63ff, #4a3f8c);
          --button-gradient: linear-gradient(135deg, #6c63ff, #4a3f8c);
          --button-hover-gradient: linear-gradient(135deg, #5a52e6, #3a2f7c);
          --thumb-shadow: 0 2px 8px rgba(107, 99, 255, 0.4);
          --thumb-focus-shadow: 0 0 0 8px rgba(107, 99, 255, 0.2);
          --button-shadow: 0 4px 15px rgba(107, 99, 255, 0.3);
          --button-hover-shadow: 0 6px 20px rgba(107, 99, 255, 0.4);
          --button-active-shadow: 0 2px 10px rgba(107, 99, 255, 0.3);
        }

        body.dark-mode {
          --primary-color: #d4af37;
          --secondary-color: #ffd700;
          --slider-gradient: linear-gradient(0deg, #d4af37, #ffd700);
          --button-gradient: linear-gradient(135deg, #d4af37, #ffd700);
          --button-hover-gradient: linear-gradient(135deg, #c19b2e, #e6c200);
          --thumb-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
          --thumb-focus-shadow: 0 0 0 8px rgba(212, 175, 55, 0.2);
          --button-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
          --button-hover-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
          --button-active-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
        }
      `}</style>
      <ThemeToggle />
    </Box>
  );
}
