import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Container,
  Slider,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCreateAccountStore } from "@/store/useCreateAccountStore";
import ThemeToggle from "../ThemeToggle";

export default function WeightInput({ prevLink, nextLink }) {
  const navigate = useNavigate();
  const { setWeight } = useCreateAccountStore();

  const [value, setValue] = useState(70);
  const [unit, setUnit] = useState("kg");

  const kgToLb = (kg) => Math.round(kg * 2.20462);
  const lbToKg = (lb) => Math.round(lb / 2.20462);

  const changeUnit = (newUnit) => {
    if (newUnit === unit) return;
    if (newUnit === "kg") {
      setValue(lbToKg(value));
    } else {
      setValue(kgToLb(value));
    }
    setUnit(newUnit);
  };

  const getMinMax = () => {
    return unit === "kg" ? { min: 40, max: 150 } : { min: 88, max: 330 };
  };

  const { min, max } = getMinMax();

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  // Calculate the percentage used for the circular gauge indicator
  const valueToPercentage = () => {
    const weightKg = unit === "kg" ? value : lbToKg(value);
    let percentage = ((weightKg - 40) / (150 - 40)) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  const getWeightColor = () => {
    const percentage = valueToPercentage();
    if (percentage < 25) return "#4caf50";
    else if (percentage < 50) return "#8bc34a";
    else if (percentage < 75) return "#ffeb3b";
    else return "#ff9800";
  };

  const displayValue = () => {
    return `${value} ${unit}`;
  };

  const handleSave = () => {
    const weightInKg = unit === "kg" ? value : lbToKg(value);
    setWeight(weightInKg);
    navigate(nextLink);
  };

  return (
    <div className="weightInput">
      <Container maxWidth="sm">
        <Paper
          elevation={5}
          sx={{
            borderRadius: 4,
            bgcolor: "rgba(30, 30, 40, 0.85)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            p: 2,
            textAlign: "center",
            height: "auto",
            maxHeight: "90vh",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, var(--primary-color), transparent 70%)",
              zIndex: 0,
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                mb: 2,
                background: "linear-gradient(90deg, #fff, #ccc)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              What's your current weight?
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  position: "relative",
                  borderRadius: 50,
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  p: 0.5,
                  width: 160,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: "50%",
                    height: "85%",
                    top: "7.5%",
                    left: unit === "kg" ? "2.5%" : "47.5%",
                    borderRadius: 50,
                    background:
                      "linear-gradient(90deg, var(--primary-color), var(--secondary-color))",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px var(--shadow-color)",
                    zIndex: 0,
                  }}
                />

                <Button
                  onClick={() => changeUnit("kg")}
                  sx={{
                    py: 0.5,
                    px: 2,
                    width: "50%",
                    borderRadius: 50,
                    fontWeight: "bold",
                    color: unit === "kg" ? "#fff" : "rgba(255, 255, 255, 0.7)",
                    transition: "all 0.3s ease",
                    zIndex: 1,
                    "&:hover": { bgcolor: "transparent" },
                  }}
                >
                  kg
                </Button>

                <Button
                  onClick={() => changeUnit("lb")}
                  sx={{
                    py: 0.5,
                    px: 2,
                    width: "50%",
                    borderRadius: 50,
                    fontWeight: "bold",
                    color: unit === "lb" ? "#fff" : "rgba(255, 255, 255, 0.7)",
                    transition: "all 0.3s ease",
                    zIndex: 1,
                    "&:hover": { bgcolor: "transparent" },
                  }}
                >
                  lb
                </Button>
              </Box>
            </Box>

            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                mb: 2,
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                background: "linear-gradient(135deg, #fff, #e0e0e0)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {displayValue()}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Box
                sx={{
                  position: "relative",
                  width: 140,
                  height: 140,
                  borderRadius: "50%",
                  bgcolor: "rgba(0, 0, 0, 0.2)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: `${valueToPercentage()}%`,
                    background:
                      "linear-gradient(0deg, #4caf50, #8bc34a, #ffeb3b, #ff9800)",
                    transition: "height 0.3s ease-out",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    bgcolor: "rgba(20, 20, 30, 0.85)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    zIndex: 1,
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    width: "43%",
                    height: 3,
                    bgcolor: "#fff",
                    borderRadius: 4,
                    transformOrigin: "center left",
                    transform: `rotate(${-90 + valueToPercentage() * 1.8}deg)`,
                    left: "50%",
                    top: "50%",
                    zIndex: 2,
                    transition: "transform 0.3s ease-out",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      right: -3,
                      top: -3,
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      bgcolor: "#fff",
                      boxShadow: "0 0 4px rgba(255, 255, 255, 0.8)",
                    },
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    zIndex: 0,
                  }}
                >
                  {[0, 45, 90, 135, 180].map((angle) => (
                    <Box
                      key={angle}
                      sx={{
                        position: "absolute",
                        width: 6,
                        height: 1,
                        bgcolor: "rgba(255, 255, 255, 0.5)",
                        transform: `rotate(${angle}deg)`,
                        transformOrigin: "center center",
                        left: "calc(50% - 3px)",
                        bottom: 10,
                      }}
                    />
                  ))}
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: getWeightColor(),
                    top: 30,
                    zIndex: 2,
                    boxShadow: `0 0 8px ${getWeightColor()}`,
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                px: 3,
                py: 2,
                bgcolor: "rgba(0, 0, 0, 0.25)",
                borderRadius: 3,
                width: "100%",
                position: "relative",
                boxShadow: "inset 0 2px 5px rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                <Typography variant="caption">{min}</Typography>
                <Typography variant="caption">{max}</Typography>
              </Box>

              <Slider
                value={value}
                onChange={handleChange}
                min={min}
                max={max}
                step={1}
                sx={{
                  color: "transparent",
                  height: 6,
                  "& .MuiSlider-track": {
                    background:
                      "linear-gradient(90deg, var(--primary-color), var(--secondary-color))",
                    border: "none",
                    height: 6,
                    boxShadow: "0 0 5px var(--shadow-color)",
                  },
                  "& .MuiSlider-rail": {
                    background: "rgba(255, 255, 255, 0.1)",
                    height: 6,
                    boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.2)",
                  },
                  "& .MuiSlider-thumb": {
                    width: 20,
                    height: 20,
                    background:
                      "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
                    border: "2px solid rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 2px 5px var(--shadow-color)",
                    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
                      boxShadow: "0 0 0 5px var(--shadow-color-light)",
                    },
                    "&:before": {
                      display: "none",
                    },
                  },
                }}
              />

              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  mt: 1,
                  width: "100%",
                  background:
                    "linear-gradient(90deg, var(--primary-color), var(--secondary-color))",
                  borderRadius: "50px",
                  padding: "6px 0",
                  fontSize: 14,
                  color: "#fff",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, var(--secondary-color), var(--primary-color))",
                  },
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
      <ThemeToggle />
      <style jsx global>{`
        :root {
          --primary-color: #6c63ff;
          --secondary-color: #4834d4;
          --shadow-color: rgba(108, 99, 255, 0.5);
          --shadow-color-light: rgba(108, 99, 255, 0.3);
          --background-color: #ffffff;
        }

        .dark-mode {
          --primary-color: #ffd700;
          --secondary-color: #daa520;
          --shadow-color: rgba(255, 215, 0, 0.5);
          --shadow-color-light: rgba(255, 215, 0, 0.3);
          --background-color: #1a1a1a;
        }

        .weightInput {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: var(--background-color);
          position: relative;
          color: #fff;
          padding: 5px;
          transition: background-color 0.3s ease;
        }

        .weightInput::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          opacity: 0.03;
          background-image: 
            linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
            linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }

        .dark-mode .weightInput {
          background-image: radial-gradient(
              circle at top right,
              var(--primary-color) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at bottom left,
              var(--primary-color) 0%,
              transparent 50%
            );
        }

        .dark-mode .weightInput::before {
          display: none;
        }
      `}</style>
    </div>
  );
}