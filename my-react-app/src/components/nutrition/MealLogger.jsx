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
  Fade,
  Avatar,
  Grow,
  Tooltip,
  Zoom
} from '@mui/material';
import { motion } from 'framer-motion'; // Add framer motion for advanced animations
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

const MealLogger = ({ meals = [], onAddFood, selectedDay }) => {
  // State for expansion of meals that have foods
  const [expandedMeal, setExpandedMeal] = useState(null);
  
  // Simplified animation states - reduced number of states
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Food search modal state
  const [foodSearchOpen, setFoodSearchOpen] = useState(false);
  const [activeMealId, setActiveMealId] = useState(null);
  
  // Add state for button hover animations
  const [hoveredMealId, setHoveredMealId] = useState(null);
  
  // Add state for food add animation
  const [lastAddedMealId, setLastAddedMealId] = useState(null);
  
  // Determine if this is a past day or today
  const isPastDay = selectedDay && new Date(selectedDay.date) < new Date().setHours(0,0,0,0);

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
  
  // Simplified animation effect - single timeout instead of multiple
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, [meals, selectedDay]);
  
  // Handler for expanding meal details
  const handleExpandMeal = (id) => {
    setExpandedMeal(expandedMeal === id ? null : id);
  };
  
  // Enhanced handler for opening food search modal
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
  
  // Handle food added animation
  const handleAddFoodSuccess = (mealId, food) => {
    // Call the original onAddFood function
    onAddFood(mealId, food);
    
    // Set the last added meal ID for animation
    setLastAddedMealId(mealId);
    
    // Clear the animation state after a delay
    setTimeout(() => {
      setLastAddedMealId(null);
    }, 2000);
    
    // Expand the meal to show the newly added food
    setExpandedMeal(mealId);
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
      <Fade in={isLoaded} timeout={800}>
        <Paper
          component={motion.div}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          elevation={1}
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: 'white',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography 
              variant="h6" 
              component="h2" 
              fontWeight="bold" 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <MenuIcon sx={{ mr: 1, color: '#673ab7' }} />
              {selectedDay ? `${new Date(selectedDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} Meals` : 'Meals'}
            </Typography>
            
            <Tooltip title="Log your meals throughout the day to track your nutritional intake">
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Stack spacing={2}>
              {mealsToShow.map((meal, index) => {
                const isExpanded = expandedMeal === meal.id;
                const hasFoods = meal.foods && meal.foods.length > 0;
                const totalCalories = hasFoods
                  ? meal.foods.reduce((sum, food) => sum + food.calories, 0)
                  : meal.calories || 0;
                
                const isLastAdded = lastAddedMealId === meal.id;
                const isHovered = hoveredMealId === meal.id;
                  
                return (
                  <Fade 
                    in={isLoaded} 
                    timeout={500}
                    style={{ transitionDelay: `${index * 60}ms` }}
                    key={meal.id}
                  >
                    <Card
                      id={`meal-card-${meal.id}`}
                      component={motion.div}
                      whileHover={{ y: -4, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                      animate={isLastAdded ? { 
                        boxShadow: ['0 0 0 rgba(0,0,0,0.1)', '0 0 20px rgba(103, 58, 183, 0.6)', '0 0 0 rgba(0,0,0,0.1)'],
                        scale: [1, 1.02, 1],
                      } : {}}
                      transition={{ duration: 0.8, repeat: isLastAdded ? 1 : 0 }}
                      variant="outlined"
                      sx={{
                        borderLeft: `4px solid ${getMealColor(meal.id)}`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&.pulse': {
                          animation: 'pulse 0.4s ease-out',
                        },
                        '@keyframes pulse': {
                          '0%': { transform: 'scale(1)' },
                          '50%': { transform: 'scale(1.02)' },
                          '100%': { transform: 'scale(1)' }
                        },
                        // Add focus highlight for newly added meal
                        ...(isLastAdded && {
                          border: '1px solid rgba(103, 58, 183, 0.5)',
                          boxShadow: '0 0 8px rgba(103, 58, 183, 0.4)',
                        })
                      }}
                    >
                      {/* Meal image with subtle parallax effect */}
                      <Box
                        component={motion.div}
                        animate={isHovered ? { scale: 1.05, opacity: 0.15 } : { scale: 1, opacity: 0.1 }}
                        transition={{ duration: 0.5 }}
                        sx={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          width: '80px',
                          height: '100%',
                          backgroundImage: `url(${MEAL_IMAGES[meal.id] || MEAL_IMAGES.dinner})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          zIndex: 1,
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '100%',
                            height: '100%',
                            background: `linear-gradient(to right, white, transparent)`,
                          }
                        }}
                      />
                      
                      <CardContent sx={{ pb: hasFoods ? 0 : 2, position: 'relative', zIndex: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={MEAL_IMAGES[meal.id] || MEAL_IMAGES.dinner}
                              alt={meal.name}
                              sx={{ 
                                width: 40, 
                                height: 40, 
                                mr: 1.5,
                                border: `2px solid ${getMealColor(meal.id)}`,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                              }}
                            >
                              {meal.icon || <MenuIcon />}
                            </Avatar>
                            <Box>
                              <Typography 
                                variant="h6" 
                                component="div" 
                                sx={{ 
                                  fontWeight: 600, 
                                  lineHeight: 1.2,
                                  mb: 0.5,
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
                                sx={{ display: 'block' }}
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
                              }}
                            >
                              {totalCalories}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                            >
                              kcal
                            </Typography>
                          </Box>
                        </Box>
                        
                        {hasFoods && (
                          <Collapse 
                            in={isExpanded} 
                            timeout={300}
                            unmountOnExit
                          >
                            <Box sx={{ mt: 2, ml: 5, mb: 1 }}>
                              {meal.foods.map((food) => (
                                <Box 
                                  key={food.id} 
                                  sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    py: 0.75,
                                    borderBottom: '1px dashed rgba(0, 0, 0, 0.1)',
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
                        {!isPastDay && (
                          <Button 
                            component={motion.button}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            variant="contained" 
                            size="small" 
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenFoodSearch(meal.id)}
                            onMouseEnter={() => setHoveredMealId(meal.id)}
                            onMouseLeave={() => setHoveredMealId(null)}
                            sx={{ 
                              bgcolor: `${getMealColor(meal.id)}20`,
                              color: getMealColor(meal.id),
                              boxShadow: 'none',
                              '&:hover': {
                                bgcolor: `${getMealColor(meal.id)}40`,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              }
                            }}
                          >
                            Add Food
                          </Button>
                        )}
                        
                        <Box sx={{ flex: 1 }} />
                        
                        {hasFoods && (
                          <IconButton 
                            component={motion.button}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
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
                  </Fade>
                );
              })}
            </Stack>
          </Box>
          
          {/* Nutrition Tip Box - enhanced animation */}
          <Grow in={isLoaded} timeout={1000} style={{ transformOrigin: '0 0 0' }}>
            <Box 
              component={motion.div}
              whileHover={{ scale: 1.01, boxShadow: '0 4px 8px rgba(103, 58, 183, 0.15)' }}
              sx={{ 
                mt: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(103, 58, 183, 0.05)',
                transition: 'all 0.3s ease',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                <MenuIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom', color: '#673ab7' }} />
                Nutrition Tip: Try to include protein with every meal to help maintain muscle and keep you feeling full longer.
              </Typography>
            </Box>
          </Grow>
        </Paper>
      </Fade>
      
      {/* Updated Food Search Modal with animation callback */}
      <FoodSearchModal
        open={foodSearchOpen}
        onClose={() => setFoodSearchOpen(false)}
        onAddFood={(mealId, food) => handleAddFoodSuccess(mealId, food)}
        mealId={activeMealId}
      />
    </>
  );
};

export default MealLogger;