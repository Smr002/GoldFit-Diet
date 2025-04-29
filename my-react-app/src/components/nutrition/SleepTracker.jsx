import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Slider, 
  Button, 
  IconButton, 
  Tooltip, 
  Divider,
  Fade,
  Zoom,
  Grow,
  Stack
} from '@mui/material';
import { 
  Nightlight as MoonIcon,
  Info as InfoIcon,
  Bedtime as BedtimeIcon,
  HourglassEmpty as HourglassIcon
} from '@mui/icons-material';

const SleepTracker = ({ currentHours = 7, onLogSleep, selectedDay }) => {
  // Animation states
  const [showComponent, setShowComponent] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [showDivider, setShowDivider] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [sliderAnimated, setSliderAnimated] = useState(false);
  
  // Sleep hours state
  const [sleepHours, setSleepHours] = useState(currentHours);
  
  // Theme colors
  const themeColors = {
    primary: '#4caf50',
    secondary: '#81c784',
    light: '#c8e6c9',
    dark: '#2e7d32',
    warning: '#ff9800',
    danger: '#f44336'
  };
  
  // Define sleep quality ranges (keeping color logic for status text)
  const getSleepQuality = (hours) => {
    if (hours < 6) return { text: 'Not Enough', color: themeColors.danger };
    if (hours >= 6 && hours < 7) return { text: 'Borderline', color: themeColors.warning };
    if (hours >= 7 && hours <= 9) return { text: 'Optimal', color: themeColors.primary };
    return { text: 'Too Much', color: themeColors.warning };
  };
  
  const sleepQuality = getSleepQuality(sleepHours);
  
  // Format selected day for display
  const getFormattedDate = () => {
    if (selectedDay && selectedDay.date) {
      try {
        // Try to format the date if it's a valid Date object or string
        return new Date(selectedDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } catch (error) {
        return '';
      }
    }
    return '';
  };
  
  // Determine if this is a past day or today
  const isPastDay = selectedDay && new Date(selectedDay.date) < new Date().setHours(0,0,0,0);
  
  // Sequential animations
  useEffect(() => {
    const timer1 = setTimeout(() => setShowComponent(true), 100);
    const timer2 = setTimeout(() => setShowHeader(true), 400);
    const timer3 = setTimeout(() => setShowDivider(true), 700);
    const timer4 = setTimeout(() => setShowContent(true), 900);
    const timer5 = setTimeout(() => setSliderAnimated(true), 1300);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [selectedDay]);
  
  // Handle sleep hours change
  const handleSliderChange = (event, newValue) => {
    if (!isPastDay) {
      setSleepHours(newValue);
      
      // Add ripple effect to the sleep quality indicator
      const indicator = document.getElementById('sleep-quality-circle');
      if (indicator) {
        indicator.classList.add('ripple');
        setTimeout(() => {
          indicator.classList.remove('ripple');
        }, 600);
      }
    }
  };
  
  // Handle log sleep button click
  const handleLogSleep = () => {
    if (onLogSleep && !isPastDay) {
      onLogSleep(sleepHours);
    
      // Visual feedback animations
      const sleepTracker = document.getElementById('sleep-tracker-container');
      if (sleepTracker) {
        sleepTracker.classList.add('pulse');
        setTimeout(() => {
          sleepTracker.classList.remove('pulse');
        }, 600);
      }
      
      // Celebratory animation when logging optimal sleep
      if (sleepHours >= 7 && sleepHours <= 9) {
        const sleepCircle = document.getElementById('sleep-quality-circle');
        if (sleepCircle) {
          sleepCircle.classList.add('celebrate');
          setTimeout(() => {
            sleepCircle.classList.remove('celebrate');
          }, 1200);
        }
      }
    }
  };
  
  return (
    <Fade in={showComponent} timeout={600}>
      <Paper
        id="sleep-tracker-container"
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: 'white',
          width: '100%',
          height: '100%',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          },
          '&.pulse': {
            animation: 'pulse 0.6s ease-out',
          },
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.01)' },
            '100%': { transform: 'scale(1)' }
          },
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Fade in={showHeader} timeout={600}>
            <Typography 
              variant="h6" 
              component="h2" 
              fontWeight="bold" 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                animation: 'slideRight 0.7s ease-out',
                '@keyframes slideRight': {
                  from: { opacity: 0, transform: 'translateX(-20px)' },
                  to: { opacity: 1, transform: 'translateX(0)' }
                }
              }}
            >
              <MoonIcon sx={{ mr: 1, color: themeColors.primary }} />
              {selectedDay ? `${getFormattedDate()} Sleep` : 'Sleep Tracker'}
            </Typography>
          </Fade>
          
          <Tooltip title="7-9 hours of sleep is recommended for most adults">
            <IconButton 
              size="small" 
              sx={{
                animation: 'pulse 2s infinite',
                color: themeColors.dark,
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                  '100%': { transform: 'scale(1)' }
                }
              }}
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Grow in={showDivider} timeout={500}>
          <Divider sx={{ mb: 3 }} />
        </Grow>
        
        <Fade in={showContent} timeout={800}>
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography 
              variant="body1" 
              color="text.primary" 
              sx={{ 
                mb: 3, 
                textAlign: 'center',
                fontWeight: 500,
                color: themeColors.dark,
                fontSize: '1.1rem',
                animation: 'fadeSlideUp 0.8s ease',
                '@keyframes fadeSlideUp': {
                  from: { opacity: 0, transform: 'translateY(10px)' },
                  to: { opacity: 1, transform: 'translateY(0)' }
                }
              }}
            >
              How many hours did you sleep last night?
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 4 
              }}
            >
              <Zoom in={showContent} timeout={400}>
                <Box
                  id="sleep-quality-circle"
                  sx={{
                    position: 'relative',
                    width: 180,
                    height: 180,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `conic-gradient(${sleepQuality.color} ${sleepHours/12 * 100}%, ${themeColors.light} 0)`,
                    transition: 'background 0.5s ease, transform 0.3s ease, box-shadow 0.3s ease',
                    boxShadow: `0 4px 20px rgba(0,0,0,0.1), 0 0 0 5px ${themeColors.light}30`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      width: 150,
                      height: 150,
                      borderRadius: '50%',
                      background: 'white',
                      zIndex: 1,
                      transition: 'all 0.3s ease',
                      boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)'
                    },
                    '&.ripple': {
                      animation: 'rippleEffect 0.6s ease-out',
                    },
                    '&.celebrate': {
                      animation: 'celebrateEffect 1.2s ease-out',
                    },
                    '@keyframes rippleEffect': {
                      '0%': { boxShadow: `0 4px 20px rgba(0,0,0,0.1), 0 0 0 5px ${themeColors.light}30` },
                      '50%': { boxShadow: `0 4px 25px rgba(0,0,0,0.15), 0 0 0 15px ${sleepQuality.color}40` },
                      '100%': { boxShadow: `0 4px 20px rgba(0,0,0,0.1), 0 0 0 5px ${themeColors.light}30` }
                    },
                    '@keyframes celebrateEffect': {
                      '0%': { transform: 'scale(1)' },
                      '25%': { transform: 'scale(1.05)' },
                      '50%': { transform: 'scale(1)' },
                      '75%': { transform: 'scale(1.03)' },
                      '100%': { transform: 'scale(1)' }
                    },
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: `0 6px 25px rgba(0,0,0,0.12), 0 0 0 8px ${sleepQuality.color}30`
                    },
                    opacity: isPastDay ? 0.8 : 1
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'relative',
                      zIndex: 2,
                      textAlign: 'center' 
                    }}
                  >
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: sleepQuality.color,
                        animation: 'countUp 1.5s ease-out',
                        transition: 'color 0.3s ease',
                        '@keyframes countUp': {
                          from: { opacity: 0, transform: 'translateY(10px)' },
                          to: { opacity: 1, transform: 'translateY(0)' }
                        }
                      }}
                    >
                      {sleepHours}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0,
                        animation: 'fadeIn 0.5s ease forwards 0.5s',
                        color: 'text.secondary',
                        '@keyframes fadeIn': {
                          from: { opacity: 0 },
                          to: { opacity: 1 }
                        }
                      }}
                    >
                      hours
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block',
                        color: sleepQuality.color,
                        fontWeight: 'bold',
                        mt: 0.5,
                        opacity: 0,
                        animation: 'fadeSlideUp 0.5s ease forwards 0.7s',
                        transition: 'color 0.3s ease',
                        '@keyframes fadeSlideUp': {
                          from: { opacity: 0, transform: 'translateY(5px)' },
                          to: { opacity: 1, transform: 'translateY(0)' }
                        }
                      }}
                    >
                      {sleepQuality.text}
                    </Typography>
                  </Box>
                </Box>
              </Zoom>
            </Box>
            
            <Box sx={{ px: 3, mb: 3, position: 'relative' }}>
              <Stack 
                direction="row" 
                spacing={2} 
                alignItems="center"
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  opacity: 0,
                  animation: 'fadeSlideUp 0.5s ease forwards 0.9s',
                  '@keyframes fadeSlideUp': {
                    from: { opacity: 0, transform: 'translateY(10px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                <BedtimeIcon sx={{ color: themeColors.dark }} />
                <Slider
                  value={sleepHours}
                  onChange={handleSliderChange}
                  aria-label="Sleep hours"
                  min={0}
                  max={12}
                  step={0.5}
                  disabled={isPastDay}
                  marks={[
                    { value: 0, label: '0h' },
                    { value: 6, label: '6h' },
                    { value: 7, label: '7h' },
                    { value: 9, label: '9h' },
                    { value: 12, label: '12h' }
                  ]}
                  sx={{
                    color: themeColors.primary,
                    opacity: isPastDay ? 0.7 : 1,
                    '& .MuiSlider-rail': {
                      opacity: 0.5,
                      backgroundColor: themeColors.light,
                    },
                    '& .MuiSlider-track': {
                      transition: 'background-color 0.3s ease',
                      backgroundColor: themeColors.primary,
                    },
                    '& .MuiSlider-thumb': {
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      backgroundColor: themeColors.primary,
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: `0 0 0 8px ${themeColors.primary}20`,
                        transform: 'scale(1.1)'
                      }
                    },
                    '& .MuiSlider-mark': {
                      backgroundColor: themeColors.light,
                      '&.MuiSlider-markActive': {
                        opacity: 1,
                        backgroundColor: themeColors.primary,
                      },
                    },
                    '& .MuiSlider-markLabel': {
                      fontWeight: 'bold',
                      color: themeColors.dark,
                      fontSize: '0.75rem',
                      '&.MuiSlider-markLabelActive': {
                        color: themeColors.primary
                      }
                    },
                    // Highlight optimal region directly on the rail
                    '& .MuiSlider-rail': {
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        left: `${7/12 * 100}%`,
                        right: `${(12-9)/12 * 100}%`,
                        top: 0,
                        height: '100%',
                        backgroundColor: `${themeColors.primary}40`,
                        borderRadius: 4,
                      }
                    }
                  }}
                />
                <HourglassIcon sx={{ color: themeColors.dark }} />
              </Stack>
              
              {/* Add recommended range text below slider */}
              <Typography
                variant="caption"
                align="center"
                sx={{
                  display: 'block',
                  mt: 3,
                  color: themeColors.primary,
                  fontWeight: 'medium',
                  opacity: sliderAnimated ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                  textAlign: 'center'
                }}
              >
                7-9 hours recommended for optimal health
              </Typography>
            </Box>
            
            {!isPastDay && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  mt: 'auto',
                  mb: 2,
                  opacity: 0,
                  animation: 'fadeSlideUp 0.5s ease forwards 1.1s',
                  '@keyframes fadeSlideUp': {
                    from: { opacity: 0, transform: 'translateY(10px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleLogSleep}
                  sx={{
                    bgcolor: themeColors.primary,
                    paddingX: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: themeColors.dark,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      transition: 'all 0.6s ease',
                    },
                    '&:hover::after': {
                      left: '100%'
                    }
                  }}
                >
                  Log Sleep
                </Button>
              </Box>
            )}
          </Box>
        </Fade>
        
        {/* Sleep Tips */}
        <Box 
          sx={{ 
            mt: 'auto',
            p: 2,
            borderRadius: 2,
            bgcolor: `${themeColors.light}50`,
            opacity: 0,
            animation: 'fadeIn 1s ease-in-out forwards',
            animationDelay: '1.2s',
            '@keyframes fadeIn': {
              from: { opacity: 0 },
              to: { opacity: 1 }
            }
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <MoonIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom', color: themeColors.primary }} />
            Sleep Tip: Maintain a consistent sleep schedule, even on weekends, to regulate your body's internal clock.
          </Typography>
        </Box>
      </Paper>
    </Fade>
  );
};

export default SleepTracker;