import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Fade, 
  Grid, 
  CssBaseline, 
  ThemeProvider,
  createTheme,
  useMediaQuery 
} from '@mui/material';
import { CalorieTracker, MacronutrientBreakdown, MealLogger, WaterTracker } from '../components/nutrition';
import SleepTracker from '../components/nutrition/SleepTracker';
import NutritionPageSkeleton from '../components/nutrition/NutritionSkeletons';
import Footer from '@/components/Footer';
import MobileFooter from '../components/MobileFooter';
import SecondNavbar from '@/components/SecondNavbar';

// Use the same theme as UserHomePage
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#9c27b0",
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 1,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
      },
    },
  },
});

const NutritionPage = () => {
  // Check for mobile/tablet view
  const isMobileOrTablet = useMediaQuery("(max-width:1024px)");
  
  // Animation state
  const [pageLoaded, setPageLoaded] = useState(false);
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  // Sample weekly data
  const weeklyCalorieData = [1550, 1720, 1840, 1650, 2100, 1790, nutritionData.calories.consumed];

  // Trigger loading and page animation
  useEffect(() => {
    // First show the skeleton
    setIsLoading(true);
    
    // Simulate loading data from API
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setPageLoaded(true);
    }, 1500); // Show skeleton for 1.5 seconds
    
    return () => clearTimeout(loadingTimer);
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

  // Layout rendering with ThemeProvider
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Navigation Bar */}
      <SecondNavbar />
      
      <Box sx={{ minHeight: "100vh" }}>
        {/* Show skeleton during loading */}
        {isLoading ? (
          <Container maxWidth="lg" sx={{ mt: 12 }}> {/* Added top margin for navbar */}
            <NutritionPageSkeleton />
          </Container>
        ) : (
          <Fade in={pageLoaded} timeout={500}>
            <Container 
              maxWidth="lg" 
              sx={{ 
                py: 4,
                mt: 8, // Added top margin for navbar
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
                  mt: 4, // Added top margin for better spacing below navbar
                }}
              >
                Nutrition Tracker
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <CalorieTracker 
                  caloriesConsumed={nutritionData.calories.consumed} 
                  calorieTarget={nutritionData.calories.target} 
                  weeklyData={weeklyCalorieData}
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
              <Box sx={{ my: 5, pb: { xs: 8, sm: 5 } }}> {/* Added padding bottom for mobile footer */}
                <SleepTracker 
                  currentHours={sleepHours}
                  onLogSleep={handleLogSleep}
                />
              </Box>
            </Container>
          </Fade>
        )}
      </Box>
      
      {/* Footer based on screen size */}
      {isMobileOrTablet ? <MobileFooter /> : <Footer />}
    </ThemeProvider>
  );
};

export default NutritionPage;