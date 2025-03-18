import * as React from "react";
import { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { ArrowForward } from "@mui/icons-material";
import Zoom from "@mui/material/Zoom";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";

const ExerciseSlider = styled(Slider)(({ theme }) => ({
  color: "#D4AF37",
  height: 8,
  padding: "12px 0",
  "& .MuiSlider-track": {
    background: "linear-gradient(to right, #D4AF37, #b8860b)",
    border: "none",
    height: 8,
  },
  "& .MuiSlider-rail": {
    opacity: 0.5,
    backgroundColor: "#e3c16f",
    height: 8,
    borderRadius: 4,
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid #D4AF37",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      transform: "scale(1.15)",
      boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
    },
    "&:focus, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-markLabel": {
    color: "#fff", 
    fontSize: "14px",
    fontWeight: 500,
    marginTop: 6,
  },
  "& .MuiSlider-mark": {
    backgroundColor: "#fff",
    height: 2,
    width: 2,
    marginTop: -2,
  },
}));


const ActivityIcons = ({ count, animate }) => {
  const icons = [];

  for (let i = 0; i < count; i++) {
    icons.push(
      <DirectionsRunIcon
        key={i}
        sx={{
          color: "#D4AF37",
          fontSize: 22,
          opacity: animate ? 0.6 : 1,
          transform: animate ? "translateY(-3px)" : "none",
          transition: "all 0.2s ease",
          animationDelay: `${i * 0.1}s`,
          mx: 0.5,
        }}
      />
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", my: 1.5 }}>
      {icons}
    </Box>
  );
};

export default function EnhancedExerciseSlider() {
  const [value, setValue] = useState(3);
  const [animate, setAnimate] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeCommitted = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 600);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, #1b1b2f, #0f172a)`,
        transition: "background 0.5s ease",
        overflow: "hidden",
      }}
    >
      <Zoom in timeout={800}>
        <Card
          sx={{
            backgroundColor: "rgba(30, 41, 59, 0.85)",
            backdropFilter: "blur(8px)",
            borderRadius: "16px",
            padding: { xs: 2, sm: 3 },
            width: { xs: "90%", sm: "80%" },
            maxWidth: 480,
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Box
            sx={{
              backgroundColor: "rgba(212, 175, 55, 0.15)",
              borderRadius: "50%",
              p: 1.5,
              mb: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FitnessCenterIcon sx={{ color: "#D4AF37", fontSize: 32 }} />
          </Box>

          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              color: "#fff",
              mb: 0.5,
              textShadow: "0px 2px 4px rgba(0,0,0,0.3)",
              letterSpacing: "0.5px",
            }}
          >
            Set Your Weekly Exercise Goal
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#d1d5db",
              mb: 2,
              maxWidth: "90%",
              fontSize: "0.95rem",
            }}
          >
            How many days will you commit to your fitness journey?
          </Typography>

          <ActivityIcons count={value} animate={animate} />

          <Box sx={{ width: "90%", mt: 1, mb: 2 }}>
            <ExerciseSlider
              value={value}
              onChange={handleChange}
              onChangeCommitted={handleChangeCommitted}
              valueLabelDisplay="auto"
              step={1}
              marks={[
                { value: 3, label: "3 days" },
                { value: 4, label: "4 days" },
                { value: 5, label: "5 days" },
                { value: 6, label: "6 days" },
              ]}
              min={3}
              max={6}
            />
          </Box>

          <Box
            sx={{
              backgroundColor: "rgba(212, 175, 55, 0.1)",
              borderRadius: "10px",
              p: 1.5,
              width: "80%",
              mb: 2.5,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: "#fff",
                fontWeight: 500,
              }}
            >
              {value} days per week
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#D4AF37",
                fontWeight: 500,
                fontSize: "0.85rem",
              }}
            >
              {value >= 5 ? "Great commitment!" : "Good starting point!"}
            </Typography>
          </Box>

          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              padding: "8px 20px",
              borderRadius: "24px",
              backgroundColor: "#D4AF37",
              "&:hover": {
                backgroundColor: "#b8860b",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(212, 175, 55, 0.4)",
              },
              transition: "all 0.3s ease",
              fontSize: "0.95rem",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            }}
          >
            Continue
          </Button>
        </Card>
      </Zoom>
    </Box>
  );
}
