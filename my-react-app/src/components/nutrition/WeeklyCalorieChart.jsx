import React, { useState, useEffect } from 'react';
import { Box, Typography, Fade, Zoom, CircularProgress } from '@mui/material';
import { format, subDays, isToday } from 'date-fns';

const WeeklyCalorieChart = ({ calorieTarget, onDaySelect, calorieData }) => {
  const [animatedBars, setAnimatedBars] = useState(Array(7).fill(0));
  const [highlightedDay, setHighlightedDay] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  
  // Generate days of the week (last 7 days)
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      label: format(date, 'EEE'), // Returns abbreviated day name (Mon, Tue, etc.)
      isToday: isToday(date),
      date: format(date, 'd'), // Day number
      fullDate: date
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

  // Helper function to determine bar color based on calorie value - UPDATED to use only green and orange
  const getBarColor = (calories) => {
    const percentage = (calories / calorieTarget) * 100;
    if (percentage > 90) return '#ff9800';  // Orange if over 90% of target
    return '#4caf50';  // Green for everything 90% and below
  };
  
  // Helper function to format calories with commas for thousands
  const formatCalories = (calories) => {
    return calories.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get the currently displayed day (either selected or hovered)
  const getDisplayedDay = () => {
    // If hovering, show hover state
    if (highlightedDay !== null) {
      return highlightedDay;
    }
    // Otherwise show selected day
    return selectedDay;
  };
  
  // Handle bar click for day selection
  const handleBarClick = (index) => {
    // If same day clicked again, reset selection
    if (selectedDay === index) {
      setSelectedDay(null);
      onDaySelect && onDaySelect(null);
    } else {
      setSelectedDay(index);
      onDaySelect && onDaySelect({
        index,
        date: days[index].fullDate,
        calories: calorieData[index],
        formattedDate: format(days[index].fullDate, 'MMM d, yyyy'),
        dayOfWeek: days[index].label
      });
    }
  };
  
  // Handle mouse enter - for hover effects
  const handleMouseEnter = (index) => {
    setHighlightedDay(index);
  };
  
  // Handle mouse leave - restore selected day or null
  const handleMouseLeave = () => {
    setHighlightedDay(null);
  };
  
  // Determine which day to highlight (for visual feedback)
  const getHighlight = (index) => {
    if (highlightedDay === index) return true;
    if (highlightedDay === null && selectedDay === index) return true;
    return false;
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
          {days.map((day, index) => {
            const isHighlighted = getHighlight(index);
            
            return (
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
                onClick={() => handleBarClick(index)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Show tooltip for highlighted or selected day */}
                <Zoom 
                  in={isHighlighted || selectedDay === index}
                  timeout={200}
                >
                  <Box
                    sx={{ 
                      position: 'absolute',
                      top: -28,
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
                
                {/* Actual bar with enhanced styling for today/selected */}
                <Box 
                  sx={{
                    width: selectedDay === index ? '75%' : '65%',
                    height: `${(animatedBars[index] / maxCalories) * 100}%`,
                    bgcolor: getBarColor(calorieData[index]),
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    minHeight: 4,
                    opacity: isHighlighted || selectedDay === index || highlightedDay === null ? 1 : 0.6,
                    transform: isHighlighted ? 'scaleX(1.1)' : selectedDay === index ? 'scaleX(1.05)' : 'scaleX(1)',
                    boxShadow: selectedDay === index
                      ? '0 0 8px rgba(0,0,0,0.15)'
                      : isHighlighted 
                        ? '0 0 10px rgba(0,0,0,0.2)' 
                        : 'none'
                  }}
                >
                  {/* Selected indicator - only show when selected */}
                  {selectedDay === index && (
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
                    '&::after': selectedDay === index ? {
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
                      color: selectedDay === index ? getBarColor(calorieData[index]) : 'text.secondary',
                      fontWeight: selectedDay === index ? 'bold' : 'normal',
                      fontSize: '0.75rem'
                    }}
                  >
                    {day.label}
                  </Typography>
                </Box>
              </Box>
            );
          })}
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