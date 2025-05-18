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
  Collapse,
  Stack,
  Fade,
  Avatar,
  Grow,
  Tooltip,
  useTheme,
  CircularProgress,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Add as AddIcon,
  WbSunny as MorningIcon,
  BrightnessLow as NoonIcon,
  Nightlight as EveningIcon,
  Fastfood as SnackIcon,
  ExpandMore as ExpandMoreIcon,
  RestaurantMenu as MenuIcon,
  Info as InfoIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import FoodSearchModal from './FoodSearchModal';
import { createNutritionLog, getNutritionLog, getUserIdFromToken } from '@/api';

const MealLogger = ({ onAddFood, selectedDay, onMealUpdate }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [foodSearchOpen, setFoodSearchOpen] = useState(false);
  const [activeMealId, setActiveMealId] = useState(null);
  const [hoveredMealId, setHoveredMealId] = useState(null);
  const [lastAddedMealId, setLastAddedMealId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localMeals, setLocalMeals] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isPastDay = selectedDay && new Date(selectedDay.date) < new Date().setHours(0, 0, 0, 0);

  const MEAL_IMAGES = {
    breakfast: 'https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    snack: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    lunch: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    dinner: 'https://images.unsplash.com/photo-1576402187878-974f70c890a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  };

  const defaultMeals = [
    { id: 'breakfast', name: 'Breakfast', icon: <MorningIcon />, time: '6:00 - 10:00 AM', calories: 0, foods: [] },
    { id: 'snack', name: 'Snack', icon: <SnackIcon />, time: '10:00 AM - 6:00 PM', calories: 0, foods: [] },
    { id: 'lunch', name: 'Lunch', icon: <NoonIcon />, time: '12:00 - 2:00 PM', calories: 0, foods: [] },
    { id: 'dinner', name: 'Dinner', icon: <EveningIcon />, time: '6:00 - 8:00 PM', calories: 0, foods: [] }
  ];

  // Function to fetch nutrition logs
  const fetchNutritionLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const userId = getUserIdFromToken(token);
      if (!userId) {
        throw new Error('No user ID found in token');
      }

      // Get the current date in the local timezone
      const today = new Date();
      const date = selectedDay && selectedDay.date
        ? new Date(selectedDay.date)
        : today;

      console.log('Fetching logs for date:', date.toISOString()); // Debug log

      const logs = await getNutritionLog(token, userId, date);
      console.log('Received logs:', logs); // Debug log
      
      if (logs && Array.isArray(logs) && logs.length > 0) {
        // Create a mapping between API meal types and our meal IDs
        const mealTypeMap = {
          'BREAKFAST': 'breakfast',
          'SNACK': 'snack',
          'LUNCH': 'lunch',
          'DINNER': 'dinner'
        };

        // Transform the logs into the meal format
        const updatedMeals = defaultMeals.map(defaultMeal => {
          // Find all logs that match this meal type
          const mealLogs = logs.filter(log => {
            if (!log || !log.mealType) return false;
            const apiMealType = log.mealType.toUpperCase();
            const mappedType = mealTypeMap[apiMealType];
            return mappedType === defaultMeal.id;
          });

          if (mealLogs.length > 0) {
            console.log(`Processing meal logs for ${defaultMeal.id}:`, mealLogs);
            
            // Create food items from all meal logs
            const foodItems = mealLogs.map(mealLog => ({
              id: `food-${mealLog.id || 'unknown'}`,
              name: mealLog.mealType || 'Unknown Food',
              serving: '1 serving',
              calories: parseFloat(mealLog.totalCalories || 0),
              protein: parseFloat(mealLog.protein || 0),
              carbs: parseFloat(mealLog.carbs || 0),
              fats: parseFloat(mealLog.fats || 0),
              foodId: mealLog.id || 'unknown'
            }));

            // Calculate total calories for the meal
            const totalCalories = foodItems.reduce((sum, food) => sum + (food.calories || 0), 0);

            return {
              ...defaultMeal,
              foods: foodItems,
              calories: totalCalories
            };
          }
          return defaultMeal;
        });

        console.log('Updated meals with API data:', updatedMeals); // Debug log
        setLocalMeals(updatedMeals);
      } else {
        console.log('No logs found for date:', date.toISOString()); // Debug log
        setLocalMeals(defaultMeals);
      }
      setIsLoaded(true);
    } catch (err) {
      console.error('Error fetching nutrition logs:', err);
      setError(err.message || 'Failed to load nutrition data');
      setLocalMeals(defaultMeals);
      setIsLoaded(true);
    }
  };

  // Initial fetch and refresh interval
  useEffect(() => {
    console.log('Component mounted or selectedDay changed:', selectedDay); // Debug log
    fetchNutritionLogs();

    // Set up refresh interval (every 30 seconds)
    const refreshInterval = setInterval(() => {
      console.log('Refreshing nutrition logs...'); // Debug log
      setIsRefreshing(true);
      fetchNutritionLogs().finally(() => {
        setIsRefreshing(false);
      });
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [selectedDay]); // Re-fetch when selected day changes

  const handleExpandMeal = (id) => {
    setExpandedMeal(expandedMeal === id ? null : id);
  };

  const handleOpenFoodSearch = (mealId) => {
    setActiveMealId(mealId);
    setFoodSearchOpen(true);
    const mealCard = document.getElementById(`meal-card-${mealId}`);
    if (mealCard) {
      mealCard.classList.add('pulse');
      setTimeout(() => mealCard.classList.remove('pulse'), 600);
    }
  };

  const handleAddFoodSuccess = async (mealId, food) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const userId = getUserIdFromToken(token);
      if (!userId) {
        throw new Error('No user ID found in token');
      }

      // Update local meals with the new food
      const updatedMeals = localMeals.map(meal => {
        if (meal.id === mealId) {
          // Add the new food to the existing foods array
          const updatedFoods = [...(meal.foods || []), food];
          return { 
            ...meal, 
            foods: updatedFoods
          };
        }
        return meal;
      });

      const mealToUpdate = updatedMeals.find(meal => meal.id === mealId);
      if (!mealToUpdate) {
        throw new Error('Meal not found');
      }

      // Map mealId to valid mealType
      const mealTypeMap = {
        'breakfast': 'BREAKFAST',
        'snack': 'SNACK',
        'lunch': 'LUNCH',
        'dinner': 'DINNER'
      };

      // Get the current date in the local timezone
      const today = new Date();
      const logDate = selectedDay && selectedDay.date
        ? new Date(selectedDay.date)
        : today;

      // Create nutrition log data
      const logData = {
        date: logDate.toISOString().split('T')[0],
        mealType: mealTypeMap[mealId] || 'SNACK',
        totalCalories: parseFloat((food.calories || 0).toString()),
        protein: parseFloat((food.protein || 0).toString()),
        carbs: parseFloat((food.carbs || 0).toString()),
        fats: parseFloat((food.fats || 0).toString()),
        hydration: 0,
        foodItems: [{
          fdcId: food.foodId || 'unknown',
          description: food.name || 'Unknown Food',
          servingSize: parseFloat((food.serving?.split(' ')[0] || 100).toString()),
          unit: food.serving?.split(' ')[1] || 'g',
          calories: parseFloat((food.calories || 0).toString()),
          protein: parseFloat((food.protein || 0).toString()),
          carbs: parseFloat((food.carbs || 0).toString()),
          fats: parseFloat((food.fats || 0).toString())
        }]
      };

      console.log('Sending nutrition log data:', logData); // Debug log

      // Send to backend
      await createNutritionLog(token, logData);

      // Update local state
      setLocalMeals(updatedMeals);
      setLastAddedMealId(mealId);
      setTimeout(() => setLastAddedMealId(null), 2000);
      setExpandedMeal(mealId);

      // Fetch updated data
      await fetchNutritionLogs();

      // Trigger parent component update
      if (onMealUpdate) {
        onMealUpdate();
      }

      if (onAddFood) {
        onAddFood(mealId, food);
      }
    } catch (err) {
      console.error('Error adding food:', err);
      setError(err.message || 'Failed to add food');
    } finally {
      setLoading(false);
    }
  };

  const getMealColor = (mealId) => {
    if (isDarkMode) {
      switch(mealId) {
        case 'breakfast': return '#FFD700';
        case 'snack': return '#F0E68C';
        case 'lunch': return '#DAA520';
        case 'dinner': return '#FFC107';
        default: return '#E0E0E0';
      }
    } else {
      switch(mealId) {
        case 'breakfast': return '#ff9800';
        case 'snack': return '#ffb74d';
        case 'lunch': return '#2196f3';
        case 'dinner': return '#673ab7';
        default: return '#9e9e9e';
      }
    }
  };

  return (
    <>
      <Fade in={isLoaded} timeout={1000}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: isDarkMode ? 'rgba(255, 215, 0, 0.05)' : 'rgba(103, 58, 183, 0.05)',
            position: 'relative'
          }}
        >
          {isRefreshing && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1
              }}
            />
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography
              variant="h6"
              component="h2"
              fontWeight="bold"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: theme.palette.text.primary,
              }}
            >
              <MenuIcon sx={{
                mr: 1,
                color: isDarkMode ? theme.palette.primary.main : '#673ab7'
              }} />
              {selectedDay ? `${new Date(selectedDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} Meals` : 'Meals'}
            </Typography>

            <Tooltip title="Log your meals throughout the day to track your nutritional intake">
              <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Divider sx={{
            mb: 2,
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : undefined
          }} />

          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Stack spacing={2}>
              {localMeals.map((meal, index) => {
                const isExpanded = expandedMeal === meal.id;
                const hasFoods = meal.foods && meal.foods.length > 0;
                console.log(`Meal ${meal.id} foods:`, meal.foods);
                console.log(`Meal ${meal.id} has foods:`, hasFoods);
                const totalCalories = hasFoods
                  ? meal.foods.reduce((sum, food) => {
                      console.log(`Adding calories for ${food.name}:`, food.calories);
                      return sum + (food.calories || 0);
                    }, 0)
                  : meal.calories || 0;

                console.log(`Meal ${meal.id} total calories:`, totalCalories);
                const isLastAdded = lastAddedMealId === meal.id;
                const isHovered = hoveredMealId === meal.id;
                const mealColor = getMealColor(meal.id);

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
                      whileHover={{ y: -4, boxShadow: isDarkMode
                        ? '0 4px 12px rgba(255, 215, 0, 0.2)'
                        : '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                      animate={isLastAdded ? {
                        boxShadow: isDarkMode
                          ? ['0 0 0 rgba(0,0,0,0.1)', `0 0 20px rgba(255, 215, 0, 0.5)`, '0 0 0 rgba(0,0,0,0.1)']
                          : ['0 0 0 rgba(0,0,0,0.1)', '0 0 20px rgba(103, 58, 183, 0.6)', '0 0 0 rgba(0,0,0,0.1)'],
                        scale: [1, 1.02, 1],
                      } : {}}
                      transition={{ duration: 0.8, repeat: isLastAdded ? 1 : 0 }}
                      variant="outlined"
                      sx={{
                        borderLeft: `4px solid ${mealColor}`,
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
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
                        ...(isLastAdded && {
                          border: isDarkMode
                            ? '1px solid rgba(255, 215, 0, 0.5)'
                            : '1px solid rgba(103, 58, 183, 0.5)',
                          boxShadow: isDarkMode
                            ? '0 0 8px rgba(255, 215, 0, 0.4)'
                            : '0 0 8px rgba(103, 58, 183, 0.4)',
                        })
                      }}
                    >
                      <Box
                        component={motion.div}
                        animate={isHovered ? { scale: 1.05, opacity: isDarkMode ? 0.1 : 0.15 } : { scale: 1, opacity: isDarkMode ? 0.07 : 0.1 }}
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
                            background: isDarkMode
                              ? 'linear-gradient(to right, rgba(30, 30, 30, 1), transparent)'
                              : 'linear-gradient(to right, white, transparent)',
                          }
                        }}
                      />

                      <CardContent sx={{
                        pb: hasFoods ? 0 : 2,
                        position: 'relative',
                        zIndex: 2,
                        color: theme.palette.text.primary
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={MEAL_IMAGES[meal.id] || MEAL_IMAGES.dinner}
                              alt={meal.name}
                              sx={{
                                width: 40,
                                height: 40,
                                mr: 1.5,
                                border: `2px solid ${mealColor}`,
                                boxShadow: isDarkMode
                                  ? '0 2px 4px rgba(0,0,0,0.4)'
                                  : '0 2px 4px rgba(0,0,0,0.1)',
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
                                  color: theme.palette.text.primary,
                                  position: 'relative',
                                  display: 'inline-block',
                                  '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    width: '0%',
                                    height: '2px',
                                    bottom: 0,
                                    left: 0,
                                    background: mealColor,
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
                                sx={{
                                  display: 'block',
                                  color: theme.palette.text.secondary
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
                                color: totalCalories > 0 ? mealColor : theme.palette.text.secondary,
                              }}
                            >
                              {totalCalories}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: theme.palette.text.secondary }}
                            >
                              kcal
                            </Typography>
                          </Box>
                        </Box>

                        {hasFoods && (
                          <Collapse in={isExpanded}>
                            <Box sx={{ mt: 1, pl: 2 }}>
                              {meal.foods && meal.foods.map((food, foodIndex) => (
                                <Box 
                                  key={foodIndex} 
                                  sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 1,
                                    p: 1,
                                    bgcolor: 'background.paper',
                                    borderRadius: 1
                                  }}
                                >
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      {food.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {food.serving}
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {food.calories} cal
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </Collapse>
                        )}
                      </CardContent>

                      <CardActions sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        px: 2,
                        py: 1,
                        position: 'relative',
                        zIndex: 2,
                        bgcolor: isDarkMode
                          ? 'rgba(0, 0, 0, 0.2)'
                          : 'rgba(0, 0, 0, 0.01)'
                      }}>
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
                              bgcolor: isDarkMode
                                ? `${mealColor}30`
                                : `${mealColor}20`,
                              color: mealColor,
                              boxShadow: 'none',
                              '&:hover': {
                                bgcolor: isDarkMode
                                  ? `${mealColor}50`
                                  : `${mealColor}40`,
                                boxShadow: isDarkMode
                                  ? `0 2px 8px rgba(255, 215, 0, 0.3)`
                                  : '0 2px 8px rgba(0,0,0,0.1)',
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
                              bgcolor: isExpanded
                                ? isDarkMode ? `${mealColor}30` : `${mealColor}10`
                                : 'transparent',
                              '&:hover': {
                                bgcolor: isDarkMode
                                  ? `${mealColor}40`
                                  : `${mealColor}20`,
                              }
                            }}
                          >
                            <ExpandMoreIcon
                              sx={{
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease-in-out',
                                color: mealColor
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

          <Grow in={isLoaded} timeout={1000} style={{ transformOrigin: '0 0 0' }}>
            <Box
              component={motion.div}
              whileHover={{
                scale: 1.01,
                boxShadow: isDarkMode
                  ? '0 4px 8px rgba(255, 215, 0, 0.15)'
                  : '0 4px 8px rgba(103, 58, 183, 0.15)'
              }}
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: isDarkMode
                  ? 'rgba(255, 215, 0, 0.05)'
                  : 'rgba(103, 58, 183, 0.05)',
                transition: 'all 0.3s ease',
                border: isDarkMode
                  ? '1px solid rgba(255, 215, 0, 0.1)'
                  : '1px solid rgba(103, 58, 183, 0.1)',
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                <MenuIcon sx={{
                  fontSize: 16,
                  mr: 0.5,
                  verticalAlign: 'text-bottom',
                  color: isDarkMode ? theme.palette.primary.main : '#673ab7'
                }} />
                Nutrition Tip: Try to include protein with every meal to help maintain muscle and keep you feeling full longer.
              </Typography>
            </Box>
          </Grow>
        </Paper>
      </Fade>

      <FoodSearchModal
        open={foodSearchOpen}
        onClose={() => setFoodSearchOpen(false)}
        onAddFood={(mealId, food) => handleAddFoodSuccess(mealId, food)}
        mealId={activeMealId}
        isDarkMode={isDarkMode}
      />
    </>
  );
};

export default MealLogger;