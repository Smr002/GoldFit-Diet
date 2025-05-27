import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const StepIndicator = ({ currentStep, isDarkMode }) => {
  const steps = [
    { number: 1, title: "Your Info" },
    { number: 2, title: "Address" },
    { number: 3, title: "Payment" },
    { number: 4, title: "Confirm" }
  ];

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        mb: 4,
        px: 2
      }}
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box 
              sx={{ 
                width: 36, 
                height: 36, 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: currentStep >= step.number 
                  ? isDarkMode ? '#FFD700' : '#6c63ff'
                  : isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                color: currentStep >= step.number 
                  ? isDarkMode ? '#000' : '#fff'
                  : isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
                fontWeight: 600,
                transition: 'all 0.3s ease'
              }}
            >
              {step.number}
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                mt: 1,
                color: currentStep >= step.number 
                  ? isDarkMode ? '#FFD700' : '#6c63ff'
                  : isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
                fontWeight: currentStep >= step.number ? 600 : 400,
                transition: 'all 0.3s ease'
              }}
            >
              {step.title}
            </Typography>
          </Box>
          
          {index < steps.length - 1 && (
            <Box 
              sx={{ 
                height: 2, 
                width: { xs: 20, sm: 40, md: 60 },
                mx: 1,
                mt: 2.2,
                bgcolor: currentStep > step.number 
                  ? isDarkMode ? '#FFD700' : '#6c63ff'
                  : isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}
            />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default StepIndicator;