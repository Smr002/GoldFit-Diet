import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Fade, Grid } from '@mui/material';
import { CalorieTracker, MacronutrientBreakdown, MealLogger, WaterTracker } from '../components/nutrition';
import SleepTracker from '../components/nutrition/SleepTracker';

const NutritionPage = () => {
  // Animation state
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // State for water intake
  const [waterIntake, setWaterIntake] = useState(750);
  const waterTarget = 2000;
  
  // State for sleep tracking
  const [sleepHours, setSleepHours] = useState(7);
  
  // Nutrition data state
  const [nutritionData, setNutritionData] = useState({
    calories: {
      consumed: 1000,
      target: 1961
    },
    macros: {
      protein: { consumed: 65, target: 98 },
      carbs: { consumed: 110, target: 196 },
      fat: { consumed: 35, target: 65 }
    },
    meals: [
      {
        id: 'breakfast',
        name: 'Breakfast',
        time: '8:00 AM',
        foods: [
          { id: 'b1', name: 'Scrambled Eggs', serving: '2 eggs', calories: 180, protein: 14, carbs: 2, fat: 12 },
          { id: 'b2', name: 'Whole Wheat Toast', serving: '1 slice', calories: 80, protein: 4, carbs: 15, fat: 1 },
          { id: 'b3', name: 'Avocado', serving: '1/2 medium', calories: 90, protein: 1, carbs: 5, fat: 8 }
        ]
      },
      {
        id: 'lunch',
        name: 'Lunch',
        time: '12:30 PM',
        foods: [
          { id: 'l1', name: 'Grilled Chicken Salad', serving: '1 bowl', calories: 320, protein: 35, carbs: 10, fat: 15 },
          { id: 'l2', name: 'Olive Oil Dressing', serving: '1 tbsp', calories: 130, protein: 0, carbs: 0, fat: 14 }
        ]
      },
      {
        id: 'afternoon-snack',
        name: 'Afternoon Snack',
        time: '3:30 PM',
        foods: [
          { id: 's1', name: 'Greek Yogurt', serving: '1 cup', calories: 120, protein: 18, carbs: 5, fat: 0 },
          { id: 's2', name: 'Blueberries', serving: '1/2 cup', calories: 80, protein: 1, carbs: 20, fat: 0 }
        ]
      },
      {
        id: 'dinner',
        name: 'Dinner',
        time: '7:00 PM',
        foods: []
      }
    ]
  });
  
  // Trigger page load animation
  useEffect(() => {
    setPageLoaded(true);
  }, []);
  
  // Handle adding water
  const handleAddWater = (amount) => {
    setWaterIntake(prev => Math.min(prev + amount, waterTarget * 1.5)); // Cap at 150% of target
  };
  
  // Handle adding a food to a meal
  const handleAddFood = (mealId, newFood) => {
    setNutritionData(prevData => {
      // Create a deep copy of the previous data
      const updatedData = JSON.parse(JSON.stringify(prevData));
      
      // Find the meal to update
      const mealIndex = updatedData.meals.findIndex(meal => meal.id === mealId);
      if (mealIndex === -1) return prevData; // Meal not found
      
      // Add the new food to the meal
      updatedData.meals[mealIndex].foods.push(newFood);
      
      // Update the total calories and macros
      updatedData.calories.consumed += newFood.calories;
      updatedData.macros.protein.consumed += newFood.protein;
      updatedData.macros.carbs.consumed += newFood.carbs;
      updatedData.macros.fat.consumed += newFood.fat;
      
      return updatedData;
    });
  };
  
  // Handle logging sleep hours
  const handleLogSleep = (hours) => {
    setSleepHours(hours);
    // In a real app, you would save this to your backend
    console.log(`Logged ${hours} hours of sleep`);
  };

  return (
    <Fade in={pageLoaded} timeout={500}>
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: 4,
          animation: 'fadeIn 0.8s ease-in-out',
          '@keyframes fadeIn': {
            from: { opacity: 0 },
            to: { opacity: 1 }
          }
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          fontWeight="bold" 
          gutterBottom
          sx={{
            position: 'relative',
            display: 'inline-block',
            '@keyframes growWidth': {
              from: { width: '0%' },
              to: { width: '100%' }
            }
          }}
        >
          Nutrition Tracker
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <CalorieTracker 
            caloriesConsumed={nutritionData.calories.consumed} 
            calorieTarget={nutritionData.calories.target} 
          />
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <MacronutrientBreakdown macros={nutritionData.macros} />
        </Box>
        
        {/* Meal Logger and Water Tracker Section */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {/* Meal Logger - Left Side */}
          <Grid item xs={12} md={6}>
            <MealLogger 
              meals={nutritionData.meals} 
              onAddFood={handleAddFood}
            />
          </Grid>
          
          {/* Water Tracker - Right Side */}
          <Grid item xs={12} md={6}>
            <WaterTracker 
              current={waterIntake} 
              target={waterTarget} 
              onAddWater={handleAddWater} 
            />
          </Grid>
        </Grid>
        
        {/* Sleep Tracker - Bottom Section */}
        <Box sx={{ my: 5 }}>
          <SleepTracker 
            currentHours={sleepHours}
            onLogSleep={handleLogSleep}
          />
        </Box>
      </Container>
    </Fade>
  );
};

export default NutritionPage;