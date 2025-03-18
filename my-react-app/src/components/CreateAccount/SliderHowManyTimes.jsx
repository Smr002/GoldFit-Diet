import * as React from "react";
import { useState } from "react";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { ArrowForward } from "@mui/icons-material";
import Zoom from "@mui/material/Zoom";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

const ExerciseSlider = styled(Slider)({
  color: "#52af77",
  height: 8,
  "& .MuiSlider-track": {
    background: "linear-gradient(to right, #52af77, #429964)",
    border: "none",
  },
  "& .MuiSlider-rail": {
    color: "#a5d6a7",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: "scale(1.2)",
    },
    "&:focus, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#52af77",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&::before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
  "& .MuiSlider-markLabel": {
    color: "#52af77",
    fontSize: "14px",
  },
});

export default function EnhancedExerciseSlider() {
  const [value, setValue] = useState(3);
  const [animate, setAnimate] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeCommitted = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);
  };

  return (
    <Box
      sx={{
        width: "100%",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 4,
        background: "linear-gradient(to bottom, #f5f5f5, #e0e0e0)",
      }}
    >
      <Zoom in timeout={500}>
        <Card
          sx={{
            backgroundColor: "#1b1b2f",
            borderRadius: "12px",
            padding: 4,
            width: { xs: "100%", sm: "80%" },
            maxWidth: 500,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0px 4px 12px rgba(82, 175, 119, 0.4)",
          }}
        >
          <FitnessCenterIcon
            sx={{ color: "#52af77", fontSize: 50, marginBottom: 2 }}
          />
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: "#fff", marginBottom: 2 }}
          >
            Set Your Weekly Exercise Goal
          </Typography>
          <Typography variant="body1" sx={{ color: "#ccc", marginBottom: 4 }}>
            Choose how many days you want to exercise per week.
          </Typography>
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
          <Typography variant="h6" sx={{ color: "#fff", marginTop: 3 }}>
            Selected: {value} days per week
          </Typography>
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              marginTop: 3,
              backgroundColor: "#52af77",
              "&:hover": { backgroundColor: "#429964" },
            }}
          >
            Next
          </Button>
        </Card>
      </Zoom>
    </Box>
  );
}
