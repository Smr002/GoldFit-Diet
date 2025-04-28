import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

/**
 * Custom tooltip for charts
 */
const CustomTooltip = ({ active, payload, label }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          p: 2,
          borderRadius: 2,
          boxShadow: isDarkMode ? '0 4px 20px rgba(255,255,255,0.1)' : '0 4px 20px rgba(0,0,0,0.1)',
          border: 'none',
        }}
      >
        <Typography fontWeight="bold" mb={1}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: entry.color,
              }}
            />
            <Typography variant="body2">
              {entry.name}: {entry.value} {entry.name === 'Calories' ? 'kcal' : ''}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

export default CustomTooltip;