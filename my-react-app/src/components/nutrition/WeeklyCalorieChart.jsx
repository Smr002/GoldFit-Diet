import React, { useState, useEffect } from 'react';
import { Box, Typography, Fade, Zoom } from '@mui/material';
import { format, subDays, isToday } from 'date-fns';

const WeeklyCalorieChart = ({ calorieData, calorieTarget }) => {
  const [animatedBars, setAnimatedBars] = useState(Array(7).fill(0));
  const [highlightedDay, setHighlightedDay] = useState(null);
  
  // Generate days of the week (last 7 days)
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      label: format(date, 'EEE'), // Returns abbreviated day name (Mon, Tue, etc.)
      isToday: isToday(date),
      date: format(date, 'd') // Day number
    };
  });

  // Animation for bars
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedBars(calorieData);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [calorieData]);

  // Find the maximum value for scaling
  const maxCalories = Math.max(
    ...calorieData.map(c => c), 
    calorieTarget * 1.1 // Add 10% padding
  );

  // Helper function to determine bar color based on calorie value
  const getBarColor = (calories) => {
    const percentage = (calories / calorieTarget) * 100;
    if (percentage > 100) return '#e53935'; // Red if over target
    if (percentage > 90) return '#ff9800';  // Orange if close to target
    return '#4caf50';  // Green if below 90%
  };
  
  // Helper function to format calories with commas for thousands
  const formatCalories = (calories) => {
    return calories.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ pt: 1, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
          Weekly Calorie Overview
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            height: 160,
            position: 'relative',
            mb: 0.5,
            mt: 3,
            mx: 1
          }}
        >
          {/* Background grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <Box
              key={percent}
              sx={{
                position: 'absolute',
                top: `${100 - percent}%`,
                left: 0,
                right: 0,
                height: '1px',
                bgcolor: 'rgba(0,0,0,0.06)',
                zIndex: 0
              }}
            />
          ))}
          
          {/* Target line */}
          <Zoom in={true} style={{ transitionDelay: '300ms' }}>
            <Box 
              sx={{
                position: 'absolute',
                top: `${100 - ((calorieTarget / maxCalories) * 100)}%`,
                left: 0,
                right: 0,
                height: '2px',
                bgcolor: 'rgba(0,0,0,0.3)',
                zIndex: 1,
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: 'rgba(0,0,0,0.5)'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: 'rgba(0,0,0,0.5)'
                }
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  position: 'absolute',
                  top: -18,
                  right: -10,
                  fontSize: '0.7rem',
                  color: 'text.secondary',
                  bgcolor: 'rgba(255,255,255,0.8)',
                  px: 0.5,
                  borderRadius: 0.5
                }}
              >
                Target: {formatCalories(calorieTarget)}
              </Typography>
            </Box>
          </Zoom>

          {/* Bars for each day */}
          {days.map((day, index) => (
            <Box 
              key={day.label} 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                height: '100%',
                justifyContent: 'flex-end',
                position: 'relative',
                zIndex: 2,
                cursor: 'pointer'
              }}
              onMouseEnter={() => setHighlightedDay(index)}
              onMouseLeave={() => setHighlightedDay(null)}
            >
              {/* Fixed: Only show tooltip on hover for all days */}
              <Zoom 
                in={highlightedDay === index}
                timeout={200}
              >
                <Box
                  sx={{ 
                    position: 'absolute',
                    top: -28, // Moved closer to the bar (changed from -35)
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: getBarColor(calorieData[index]),
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1.5,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                    zIndex: 10,
                    minWidth: '70px',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      borderWidth: '5px',
                      borderStyle: 'solid',
                      borderColor: `${getBarColor(calorieData[index])} transparent transparent transparent`
                    }
                  }}
                >
                  {formatCalories(calorieData[index])}
                </Box>
              </Zoom>
              
              {/* Actual bar with enhanced styling for today */}
              <Box 
                sx={{
                  width: day.isToday ? '75%' : '65%',
                  height: `${(animatedBars[index] / maxCalories) * 100}%`,
                  bgcolor: getBarColor(calorieData[index]),
                  borderRadius: '4px 4px 0 0',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  minHeight: 4,
                  opacity: highlightedDay === index || highlightedDay === null ? 1 : 0.6,
                  transform: highlightedDay === index ? 'scaleX(1.1)' : 'scaleX(1)',
                  boxShadow: day.isToday 
                    ? '0 0 8px rgba(0,0,0,0.15)'
                    : highlightedDay === index 
                      ? '0 0 10px rgba(0,0,0,0.2)' 
                      : 'none',
                  '&::before': calorieData[index] > calorieTarget ? {
                    content: '""',
                    position: 'absolute',
                    top: `${(calorieTarget / calorieData[index]) * 100}%`,
                    left: 0,
                    right: 0,
                    height: '2px',
                    bgcolor: 'rgba(255,255,255,0.7)',
                    zIndex: 3
                  } : {}
                }}
              >
                {/* Today indicator - made more visible as compensation */}
                {day.isToday && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '40%',
                      height: '3px',
                      borderRadius: '2px',
                      bgcolor: 'rgba(255,255,255,0.8)'
                    }}
                  />
                )}
              </Box>
              
              {/* Date and Day label container */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mt: 1,
                  position: 'relative',
                  '&::after': day.isToday ? {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    bgcolor: getBarColor(calorieData[index])
                  } : {}
                }}
              >
                {/* Day of month number */}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: '0.7rem',
                    color: 'text.secondary',
                    lineHeight: 1
                  }}
                >
                  {day.date}
                </Typography>
                
                {/* Day label */}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: day.isToday ? getBarColor(calorieData[index]) : 'text.secondary',
                    fontWeight: day.isToday ? 'bold' : 'normal',
                    fontSize: '0.75rem'
                  }}
                >
                  {day.label}
                </Typography>
                
               
              </Box>
            </Box>
          ))}
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 3,
          borderTop: '1px solid rgba(0,0,0,0.06)',
          pt: 1.5,
          px: 1
        }}>
          {/* Average and Total Info */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              Average
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatCalories(Math.round(calorieData.reduce((sum, curr) => sum + curr, 0) / 7))} cal
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">
              Weekly Total
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatCalories(calorieData.reduce((sum, curr) => sum + curr, 0))} cal
            </Typography>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};

export default WeeklyCalorieChart;