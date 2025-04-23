import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  IconButton, 
  Tooltip, 
  Slider, 
  Divider,
  Stack,
  Fade,
  Zoom,
  Grow
} from '@mui/material';
import { 
  Opacity as WaterIcon, 
  AddCircle as AddIcon,
  Info as InfoIcon,
  LocalDrink as DrinkIcon
} from '@mui/icons-material';

const WaterTracker = ({ current = 0, target = 2000, onAddWater }) => {
  // Animation states
  const [fillAnimation, setFillAnimation] = useState(0);
  const [showComponent, setShowComponent] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [showDivider, setShowDivider] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  // Local state for water amount to add
  const [waterToAdd, setWaterToAdd] = useState(250);
  
  // Calculate percentage filled
  const percentFilled = Math.min(Math.round((current / target) * 100), 100);
  
  // Trigger sequential animations
  useEffect(() => {
    const timer1 = setTimeout(() => setShowComponent(true), 100);
    const timer2 = setTimeout(() => setShowHeader(true), 400);
    const timer3 = setTimeout(() => setShowDivider(true), 700); 
    const timer4 = setTimeout(() => setShowContent(true), 900);
    const timer5 = setTimeout(() => {
      setFillAnimation(percentFilled);
    }, 1200);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [percentFilled]);
  
  // Handle water amount changed from slider
  const handleSliderChange = (event, newValue) => {
    setWaterToAdd(newValue);
  };
  
  // Handle add water click
  const handleAddWater = () => {
    if (onAddWater) {
      onAddWater(waterToAdd);
    }
    
    // Visual feedback animation
    const waterContainer = document.getElementById('water-container');
    if (waterContainer) {
      waterContainer.classList.add('pulse');
      setTimeout(() => {
        waterContainer.classList.remove('pulse');
      }, 600);
    }
  };
  
  // Quick add buttons
  const quickAddOptions = [100, 250, 500];
  
  return (
    <>
      <Fade in={showComponent} timeout={600}>
        <Paper
          elevation={1}
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: 'white',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
            }
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
                <DrinkIcon sx={{ mr: 1, color: '#2196f3' }} />
                Water Intake
              </Typography>
            </Fade>
            
            <Tooltip title="Experts recommend drinking at least 2 liters of water daily for optimal hydration">
              <IconButton 
                size="small" 
                sx={{
                  animation: 'pulse 2s infinite',
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
            <Divider sx={{ mb: 2 }} />
          </Grow>
          
          <Fade in={showContent} timeout={800}>
            <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', mb: 3 }}>
              <Box 
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                {/* Water Glass Container */}
                <Zoom in={showContent} timeout={800}>
                  <Box
                    id="water-container"
                    sx={{
                      width: 120,
                      height: 220,
                      borderRadius: '10px 10px 20px 20px',
                      border: '6px solid #e0e0e0',
                      borderBottom: '10px solid #e0e0e0',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
                      mb: 2,
                      transition: 'transform 0.3s ease-out',
                      '&.pulse': {
                        animation: 'pulse 0.6s ease-out',
                      },
                      '@keyframes pulse': {
                        '0%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.03)' },
                        '100%': { transform: 'scale(1)' }
                      }
                    }}
                  >
                    {/* Water Fill */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: `${fillAnimation}%`,
                        backgroundColor: 'rgba(33, 150, 243, 0.7)',
                        transition: 'height 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderRadius: '0 0 14px 14px',
                        boxShadow: 'inset 0 0 15px rgba(255,255,255,0.5)',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '10px',
                          background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0))',
                          borderRadius: '100% 100% 0 0 / 10px'
                        },
                        animation: percentFilled > 0 ? 'waterWave 2s ease-in-out infinite' : 'none',
                        '@keyframes waterWave': {
                          '0%': { transform: 'translateY(0)' },
                          '50%': { transform: 'translateY(5px)' },
                          '100%': { transform: 'translateY(0)' }
                        }
                      }}
                    />
                    
                    {/* Mark lines on the glass */}
                    {[25, 50, 75].map((mark) => (
                      <Box
                        key={mark}
                        sx={{
                          position: 'absolute',
                          left: -6,
                          right: -6,
                          height: '1px',
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          bottom: `${mark}%`,
                          zIndex: 1
                        }}
                      />
                    ))}
                    
                    {/* Water level indicator */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2,
                        textAlign: 'center',
                        color: percentFilled > 50 ? 'white' : 'text.primary',
                        fontWeight: 'bold',
                        textShadow: percentFilled > 50 ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                        opacity: 0,
                        animation: 'fadeIn 1s ease-in-out forwards',
                        animationDelay: '1s',
                        '@keyframes fadeIn': {
                          from: { opacity: 0 },
                          to: { opacity: 1 }
                        }
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        fontWeight="bold"
                        sx={{ 
                          fontSize: '1.2rem', 
                          transition: 'color 0.5s ease',
                          animation: 'pulse 2s infinite ease',
                          '@keyframes pulse': {
                            '0%': { transform: 'scale(1)' },
                            '50%': { transform: 'scale(1.05)' },
                            '100%': { transform: 'scale(1)' }
                          }
                        }}
                      >
                        {percentFilled}%
                      </Typography>
                    </Box>
                  </Box>
                </Zoom>
                
                {/* Progress Text */}
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  sx={{ 
                    opacity: 0,
                    animation: 'fadeSlideIn 0.5s ease forwards 1.5s',
                    '@keyframes fadeSlideIn': {
                      from: { opacity: 0, transform: 'translateY(5px)' },
                      to: { opacity: 1, transform: 'translateY(0)' }
                    }
                  }}
                >
                  {current} / {target} ML
                </Typography>
              </Box>
            </Box>
          </Fade>
          
          {/* Add Water Controls */}
          <Box 
            sx={{ 
              mb: 2,
              opacity: 0,
              animation: 'fadeSlideUp 1s ease-in-out forwards',
              animationDelay: '1s',
              '@keyframes fadeSlideUp': {
                from: { opacity: 0, transform: 'translateY(10px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
              }
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Add water intake:
            </Typography>
            
            <Slider
              value={waterToAdd}
              onChange={handleSliderChange}
              aria-label="Water amount"
              min={50}
              max={1000}
              step={50}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value} ml`}
              sx={{
                color: '#2196f3',
                '& .MuiSlider-thumb': {
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0 0 0 8px rgba(33, 150, 243, 0.16)',
                    transform: 'scale(1.1)'
                  }
                }
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Stack direction="row" spacing={1}>
                {quickAddOptions.map((amount, index) => (
                  <Zoom 
                    in={true} 
                    style={{ transitionDelay: `${index * 100}ms` }}
                    key={amount}
                  >
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => setWaterToAdd(amount)}
                      sx={{ 
                        minWidth: 'auto',
                        color: waterToAdd === amount ? 'white' : '#2196f3',
                        bgcolor: waterToAdd === amount ? '#2196f3' : 'transparent',
                        borderColor: '#2196f3',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          bgcolor: 'rgba(33, 150, 243, 0.1)',
                          borderColor: '#2196f3',
                          transform: 'translateY(-2px)'
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
                      {amount}ml
                    </Button>
                  </Zoom>
                ))}
              </Stack>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddWater}
                sx={{ 
                  bgcolor: '#2196f3',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#1976d2',
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
                Add
              </Button>
            </Box>
          </Box>
          
          {/* Hydration Tips */}
          <Box 
            sx={{ 
              mt: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(33, 150, 243, 0.05)',
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
              <DrinkIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom', color: '#2196f3' }} />
              Hydration Tip: Try to drink water regularly throughout the day instead of large amounts at once.
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </>
  );
};

export default WaterTracker;