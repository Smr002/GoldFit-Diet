import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  IconButton, 
  Divider,
  Chip,
  Collapse,
  Stack,
  Zoom,
  Fade,
  Avatar,
  Grow,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  WbSunny as MorningIcon,
  BrightnessLow as NoonIcon,
  Nightlight as EveningIcon,
  Fastfood as SnackIcon,
  ExpandMore as ExpandMoreIcon,
  RestaurantMenu as MenuIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import FoodSearchModal from './FoodSearchModal';

// Meal images
const MEAL_IMAGES = {
  breakfast: 'https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'morning-snack': 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  lunch: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'afternoon-snack': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  dinner: 'https://images.unsplash.com/photo-1576402187878-974f70c890a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'evening-snack': 'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
};

const MealLogger = ({ meals = [], onAddFood }) => {
  // State for expansion of meals that have foods
  const [expandedMeal, setExpandedMeal] = useState(null);
  
  // Animation states
  const [animatedItems, setAnimatedItems] = useState(0);
  const [showComponent, setShowComponent] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [showDivider, setShowDivider] = useState(false);
  const [showMeals, setShowMeals] = useState(false);
  
  // Food search modal state
  const [foodSearchOpen, setFoodSearchOpen] = useState(false);
  const [activeMealId, setActiveMealId] = useState(null);

  // Default meal list if none provided
  const defaultMeals = [
    { 
      id: 'breakfast', 
      name: 'Breakfast', 
      icon: <MorningIcon />, 
      time: '6:00 - 10:00 AM', 
      calories: 0, 
      foods: [] 
    },
    { 
      id: 'morning-snack', 
      name: 'Morning Snack', 
      icon: <SnackIcon />, 
      time: '10:00 - 12:00 PM', 
      calories: 0, 
      foods: [] 
    },
    { 
      id: 'lunch', 
      name: 'Lunch', 
      icon: <NoonIcon />, 
      time: '12:00 - 2:00 PM', 
      calories: 0, 
      foods: [] 
    },
    { 
      id: 'afternoon-snack', 
      name: 'Afternoon Snack', 
      icon: <SnackIcon />, 
      time: '2:00 - 6:00 PM', 
      calories: 0, 
      foods: [] 
    },
    { 
      id: 'dinner', 
      name: 'Dinner', 
      icon: <EveningIcon />, 
      time: '6:00 - 8:00 PM', 
      calories: 0, 
      foods: [] 
    },
    { 
      id: 'evening-snack', 
      name: 'Evening Snack', 
      icon: <SnackIcon />, 
      time: '8:00 - 10:00 PM', 
      calories: 0, 
      foods: [] 
    }
  ];
  
  // Merge provided meals with defaults (to ensure all meal types are present)
  const mealsToShow = meals.length > 0 ? 
    defaultMeals.map(defaultMeal => {
      const matchedMeal = meals.find(meal => meal.id === defaultMeal.id);
      return matchedMeal || defaultMeal;
    }) : defaultMeals;
  
  // Sequential animations
  useEffect(() => {
    const timer1 = setTimeout(() => setShowComponent(true), 100);
    const timer2 = setTimeout(() => setShowHeader(true), 400);
    const timer3 = setTimeout(() => setShowDivider(true), 700);
    const timer4 = setTimeout(() => setShowMeals(true), 900);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);
  
  // Animate meals sequentially
  useEffect(() => {
    if (!showMeals) return;
    
    const intervalId = setInterval(() => {
      setAnimatedItems(prev => {
        if (prev < mealsToShow.length) {
          return prev + 1;
        }
        clearInterval(intervalId);
        return prev;
      });
    }, 150);
    
    return () => clearInterval(intervalId);
  }, [mealsToShow.length, showMeals]);
  
  // Handler for expanding meal details
  const handleExpandMeal = (id) => {
    setExpandedMeal(expandedMeal === id ? null : id);
  };
  
  // Handler for opening food search modal
  const handleOpenFoodSearch = (mealId) => {
    setActiveMealId(mealId);
    setFoodSearchOpen(true);
    
    // Visual feedback animation
    const mealCard = document.getElementById(`meal-card-${mealId}`);
    if (mealCard) {
      mealCard.classList.add('pulse');
      setTimeout(() => {
        mealCard.classList.remove('pulse');
      }, 600);
    }
  };
  
  // Get color based on meal type
  const getMealColor = (mealId) => {
    switch(mealId) {
      case 'breakfast': return '#ff9800'; // Orange
      case 'morning-snack': return '#ffb74d'; // Light Orange
      case 'lunch': return '#2196f3'; // Blue
      case 'afternoon-snack': return '#90caf9'; // Light Blue
      case 'dinner': return '#673ab7'; // Deep Purple
      case 'evening-snack': return '#9575cd'; // Light Purple
      default: return '#9e9e9e'; // Grey
    }
  };
  
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
                <MenuIcon sx={{ mr: 1, color: '#673ab7' }} />
                Meals
              </Typography>
            </Fade>
            
            <Tooltip title="Log your meals throughout the day to track your nutritional intake">
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
          
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Stack spacing={2}>
              {mealsToShow.map((meal, index) => {
                const isExpanded = expandedMeal === meal.id;
                const hasFoods = meal.foods && meal.foods.length > 0;
                const totalCalories = hasFoods
                  ? meal.foods.reduce((sum, food) => sum + food.calories, 0)
                  : meal.calories || 0;
                  
                return (
                  <Zoom 
                    in={showMeals && index < animatedItems} 
                    timeout={500} 
                    style={{ 
                      transitionDelay: `${index * 70}ms`,
                    }}
                    key={meal.id}
                  >
                    <Card
                      id={`meal-card-${meal.id}`}
                      variant="outlined"
                      sx={{
                        borderLeft: `4px solid ${getMealColor(meal.id)}`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          transform: 'translateY(-3px) scale(1.01)',
                        },
                        position: 'relative',
                        overflow: 'hidden',
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
                      {/* Meal image in background */}
                      <Box
                        sx={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          width: '80px',
                          height: '100%',
                          opacity: 0.1,
                          backgroundImage: `url(${MEAL_IMAGES[meal.id]})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          zIndex: 1,
                          transition: 'all 0.5s ease',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '100%',
                            height: '100%',
                            background: `linear-gradient(to right, white, transparent)`,
                          },
                          '&:hover': {
                            opacity: 0.15,
                            width: '100px',
                          }
                        }}
                      />
                      
                      <CardContent sx={{ pb: hasFoods ? 0 : 2, position: 'relative', zIndex: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={MEAL_IMAGES[meal.id]}
                              alt={meal.name}
                              sx={{ 
                                width: 40, 
                                height: 40, 
                                mr: 1.5,
                                border: `2px solid ${getMealColor(meal.id)}`,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                  boxShadow: `0 0 0 2px ${getMealColor(meal.id)}50`
                                },
                                animation: `${showMeals ? 'avatarPulse 3s infinite ease' : 'none'}`,
                                '@keyframes avatarPulse': {
                                  '0%': { transform: 'scale(1)' },
                                  '50%': { transform: 'scale(1.05)' },
                                  '100%': { transform: 'scale(1)' }
                                }
                              }}
                            >
                              {meal.icon}
                            </Avatar>
                            <Box>
                              <Typography 
                                variant="h6" 
                                component="div" 
                                sx={{ 
                                  fontWeight: 600, 
                                  lineHeight: 1.2,
                                  position: 'relative',
                                  display: 'inline-block',
                                  mb: 0.5, // Add bottom margin for spacing
                                  '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    width: '0%',
                                    height: '2px',
                                    bottom: 0,
                                    left: 0,
                                    background: getMealColor(meal.id),
                                    transition: 'width 0.3s ease',
                                  },
                                  '&:hover::after': {
                                    width: '100%'
                                  }
                                }}
                              >
                                {meal.name}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{
                                  display: 'block', // Make it a block element
                                  opacity: 0,
                                  animation: `fadeSlideIn 0.5s ease forwards ${index * 0.1 + 0.3}s`,
                                  '@keyframes fadeSlideIn': {
                                    from: { opacity: 0, transform: 'translateY(5px)' },
                                    to: { opacity: 1, transform: 'translateY(0)' }
                                  }
                                }}
                              >
                                {meal.time}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography 
                              variant="subtitle1" 
                              fontWeight="bold"
                              sx={{
                                color: totalCalories > 0 ? getMealColor(meal.id) : 'text.secondary',
                                transition: 'color 0.3s ease, transform 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.05)'
                                },
                                animation: totalCalories > 0 ? `${index * 0.2 + 0.5}s countUp ease-out forwards` : 'none',
                                '@keyframes countUp': {
                                  from: { opacity: 0, transform: 'translateY(10px)' },
                                  to: { opacity: 1, transform: 'translateY(0)' }
                                }
                              }}
                            >
                              {totalCalories}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{
                                opacity: 0,
                                animation: `fadeIn 0.5s ease forwards ${index * 0.1 + 0.5}s`,
                                '@keyframes fadeIn': {
                                  from: { opacity: 0 },
                                  to: { opacity: 1 }
                                }
                              }}
                            >
                              kcal
                            </Typography>
                          </Box>
                        </Box>
                        
                        {hasFoods && (
                          <Collapse 
                            in={isExpanded} 
                            timeout={{ enter: 500, exit: 300 }}
                            unmountOnExit
                          >
                            <Box sx={{ mt: 2, ml: 5, mb: 1 }}>
                              {meal.foods.map((food, foodIndex) => (
                                <Box 
                                  key={food.id} 
                                  sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    py: 0.75,
                                    borderBottom: '1px dashed rgba(0, 0, 0, 0.1)',
                                    opacity: 0,
                                    animation: `fadeSlideUp 0.4s ease forwards ${foodIndex * 0.1}s`,
                                    '@keyframes fadeSlideUp': {
                                      from: { opacity: 0, transform: 'translateY(10px)' },
                                      to: { opacity: 1, transform: 'translateY(0)' }
                                    }
                                  }}
                                >
                                  <Box>
                                    <Typography variant="body2">{food.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {food.serving}
                                    </Typography>
                                  </Box>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      fontWeight: 500,
                                      color: getMealColor(meal.id),
                                      transition: 'transform 0.2s ease',
                                      '&:hover': {
                                        transform: 'scale(1.05)'
                                      }
                                    }}
                                  >
                                    {food.calories} kcal
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </Collapse>
                        )}
                      </CardContent>
                      
                      <CardActions sx={{ display: 'flex', justifyContent: 'space-between', px: 2, py: 1, position: 'relative', zIndex: 2 }}>
                        <Button 
                          variant="contained" 
                          size="small" 
                          startIcon={<AddIcon />}
                          onClick={() => handleOpenFoodSearch(meal.id)}
                          sx={{ 
                            bgcolor: `${getMealColor(meal.id)}20`,
                            color: getMealColor(meal.id),
                            boxShadow: 'none',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: `${getMealColor(meal.id)}40`,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              transform: 'translateY(-2px)'
                            },
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: '-100%',
                              width: '100%',
                              height: '100%',
                              background: `linear-gradient(90deg, transparent, ${getMealColor(meal.id)}30, transparent)`,
                              transition: 'all 0.6s ease',
                            },
                            '&:hover::after': {
                              left: '100%'
                            }
                          }}
                        >
                          Add Food
                        </Button>
                        
                        {hasFoods && (
                          <IconButton 
                            size="small" 
                            onClick={() => handleExpandMeal(meal.id)}
                            sx={{ 
                              transition: 'all 0.3s ease-in-out',
                              bgcolor: isExpanded ? `${getMealColor(meal.id)}10` : 'transparent',
                              '&:hover': {
                                bgcolor: `${getMealColor(meal.id)}20`,
                              }
                            }}
                          >
                            <ExpandMoreIcon 
                              sx={{
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease-in-out',
                                color: getMealColor(meal.id)
                              }}
                            />
                          </IconButton>
                        )}
                      </CardActions>
                    </Card>
                  </Zoom>
                );
              })}
            </Stack>
          </Box>
          
          {/* Nutrition Tip Box */}
          <Box 
            sx={{ 
              mt: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(103, 58, 183, 0.05)',
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
              <MenuIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom', color: '#673ab7' }} />
              Nutrition Tip: Try to include protein with every meal to help maintain muscle and keep you feeling full longer.
            </Typography>
          </Box>
        </Paper>
      </Fade>
      
      {/* Food Search Modal */}
      <FoodSearchModal
        open={foodSearchOpen}
        onClose={() => setFoodSearchOpen(false)}
        onAddFood={onAddFood}
        mealId={activeMealId}
      />
    </>
  );
};

export default MealLogger;