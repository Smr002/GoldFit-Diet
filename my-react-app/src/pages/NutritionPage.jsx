import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Fade,
  Grid,
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import {
  CalorieTracker,
  MacronutrientBreakdown,
  MealLogger,
  WaterTracker,
} from "../components/nutrition";
import SleepTracker from "../components/nutrition/SleepTracker";
import NutritionPageSkeleton from "../components/nutrition/NutritionSkeletons";
import Footer from "../components/Footer";
import MobileFooter from "../components/MobileFooter";
import SecondNavbar from "../components/SecondNavbar";
import ThemeToggle from "../components/ThemeToggle";
import { format, subDays } from "date-fns";

const NutritionPage = () => {
  // Check for mobile/tablet view
  const isMobileOrTablet = useMediaQuery("(max-width:1024px)");

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Animation state
  const [pageLoaded, setPageLoaded] = useState(false);
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  // Selected day state
  const [selectedDay, setSelectedDay] = useState(null);

  // State for water intake
  const [waterIntake, setWaterIntake] = useState(750);
  const waterTarget = 2000;

  // State for sleep tracking
  const [sleepHours, setSleepHours] = useState(7);

  // State for refresh trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Create theme based on dark mode preference
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: isDarkMode ? "#FFD700" : "#1976d2", // Gold in dark mode, blue in light mode
        light: isDarkMode ? "#FFEB3B" : "#42a5f5",
        dark: isDarkMode ? "#DAA520" : "#1565c0",
        contrastText: "#fff",
      },
      secondary: {
        main: isDarkMode ? "#DAA520" : "#9c27b0", // Goldenrod in dark mode, purple in light mode
        light: isDarkMode ? "#FFC107" : "#ba68c8",
        dark: isDarkMode ? "#B8860B" : "#7b1fa2",
        contrastText: "#fff",
      },
      background: {
        default: isDarkMode ? "#121212" : "#fff",
        paper: isDarkMode ? "#1e1e1e" : "#fff",
      },
    },
    typography: {
      fontFamily:
        '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });

  // Nutrition data state
  const [nutritionData, setNutritionData] = useState({
    calories: {
      consumed: 1000,
      target: 1961,
    },
    macros: {
      protein: { consumed: 65, target: 98 },
      carbs: { consumed: 110, target: 196 },
      fats: { consumed: 35, target: 65 },
    },
    meals: [
      {
        id: "breakfast",
        name: "Breakfast",
        time: "8:00 AM",
        foods: [
          {
            id: "b1",
            name: "Scrambled Eggs",
            serving: "2 eggs",
            calories: 180,
            protein: 14,
            carbs: 2,
            fats: 12,
          },
          {
            id: "b2",
            name: "Whole Wheat Toast",
            serving: "1 slice",
            calories: 80,
            protein: 4,
            carbs: 15,
            fats: 1,
          },
          {
            id: "b3",
            name: "Avocado",
            serving: "1/2 medium",
            calories: 90,
            protein: 1,
            carbs: 5,
            fats: 8,
          },
        ],
      },
      {
        id: "lunch",
        name: "Lunch",
        time: "12:30 PM",
        foods: [
          {
            id: "l1",
            name: "Grilled Chicken Salad",
            serving: "1 bowl",
            calories: 320,
            protein: 35,
            carbs: 10,
            fats: 15,
          },
          {
            id: "l2",
            name: "Olive Oil Dressing",
            serving: "1 tbsp",
            calories: 130,
            protein: 0,
            carbs: 0,
            fats: 14,
          },
        ],
      },
      {
        id: "afternoon-snack",
        name: "Afternoon Snack",
        time: "3:30 PM",
        foods: [
          {
            id: "s1",
            name: "Greek Yogurt",
            serving: "1 cup",
            calories: 120,
            protein: 18,
            carbs: 5,
            fats: 0,
          },
          {
            id: "s2",
            name: "Blueberries",
            serving: "1/2 cup",
            calories: 80,
            protein: 1,
            carbs: 20,
            fats: 0,
          },
        ],
      },
      {
        id: "dinner",
        name: "Dinner",
        time: "7:00 PM",
        foods: [],
      },
    ],
  });

  // Check for dark mode preference and load user data on component mount
  useEffect(() => {
    // Theme setup
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    } else {
      setIsDarkMode(false);
      document.body.classList.remove("dark-mode");
    }
  }, []);

  // Listen for theme changes from ThemeToggle component
  useEffect(() => {
    const handleThemeChange = (e) => {
      const newTheme = e.detail?.theme || localStorage.getItem("theme");
      setIsDarkMode(newTheme === "dark");
    };

    // Listen for custom theme change events
    document.addEventListener("themeChanged", handleThemeChange);
    
    // Listen for localStorage changes (fallback for other pages changing theme)
    window.addEventListener("storage", () => {
      const currentTheme = localStorage.getItem("theme");
      setIsDarkMode(currentTheme === "dark");
    });

    return () => {
      document.removeEventListener("themeChanged", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  // Create weekly nutrition data for each day
  const weeklyNutritionData = Array.from({ length: 7 }, (_, index) => {
    const date = subDays(new Date(), 6 - index);
    const calorieValue = [
      1550,
      1720,
      1840,
      1650,
      2100,
      1790,
      nutritionData.calories.consumed,
    ][index];

    // Generate different data for each day
    return {
      date: date,
      formattedDate: format(date, "MMM d"),
      dayOfWeek: format(date, "EEEE"),
      calories: {
        consumed: calorieValue,
        target: nutritionData.calories.target,
      },
      macros: {
        protein: {
          consumed: Math.round((calorieValue * 0.25) / 4), // 25% of calories from protein (4 cal/g)
          target: nutritionData.macros.protein.target,
        },
        carbs: {
          consumed: Math.round((calorieValue * 0.5) / 4), // 50% of calories from carbs (4 cal/g)
          target: nutritionData.macros.carbs.target,
        },
        fats: {
          consumed: Math.round((calorieValue * 0.25) / 9), // 25% of calories from fats (9 cal/g)
          target: nutritionData.macros.fats.target,
        },
      },
      waterIntake: Math.round(500 + Math.random() * 1500), // Random water intake between 500-2000ml
      sleepHours: Math.round(5 + Math.random() * 4), // Random sleep between 5-9 hours
      meals: [
        {
          id: "breakfast",
          name: "Breakfast",
          time: "8:00 AM",
          foods:
            index % 7 === 6
              ? nutritionData.meals[0].foods
              : [
                  {
                    id: `b${index}`,
                    name: `Day ${index + 1} Breakfast`,
                    serving: "1 serving",
                    calories: Math.round(calorieValue * 0.25),
                    protein: Math.round((calorieValue * 0.25 * 0.3) / 4),
                    carbs: Math.round((calorieValue * 0.25 * 0.5) / 4),
                    fats: Math.round((calorieValue * 0.25 * 0.2) / 9),
                  },
                ],
        },
        {
          id: "lunch",
          name: "Lunch",
          time: "12:30 PM",
          foods:
            index % 7 === 6
              ? nutritionData.meals.find((m) => m.id === "lunch")?.foods || []
              : [
                  {
                    id: `l${index}`,
                    name: `Day ${index + 1} Lunch`,
                    serving: "1 serving",
                    calories: Math.round(calorieValue * 0.35),
                    protein: Math.round((calorieValue * 0.35 * 0.4) / 4),
                    carbs: Math.round((calorieValue * 0.35 * 0.4) / 4),
                    fats: Math.round((calorieValue * 0.35 * 0.2) / 9),
                  },
                ],
        },
        {
          id: "dinner",
          name: "Dinner",
          time: "7:00 PM",
          foods:
            index % 7 === 6
              ? nutritionData.meals.find((m) => m.id === "dinner")?.foods || []
              : [
                  {
                    id: `d${index}`,
                    name: `Day ${index + 1} Dinner`,
                    serving: "1 serving",
                    calories: Math.round(calorieValue * 0.4),
                    protein: Math.round((calorieValue * 0.4 * 0.3) / 4),
                    carbs: Math.round((calorieValue * 0.4 * 0.5) / 4),
                    fats: Math.round((calorieValue * 0.4 * 0.2) / 9),
                  },
                ],
        },
      ],
    };
  });

  // Extract just the calorie values for the chart
  const weeklyCalorieData = weeklyNutritionData.map(
    (day) => day.calories.consumed
  );

  // Handler for when a day is selected in the chart
  const handleDaySelect = (dayData) => {
    if (!dayData) {
      // If null is passed (deselection), show today's data
      setSelectedDay(null);
      return;
    }

    // Find the corresponding day's full data in our weekly data
    const selectedDayData = weeklyNutritionData[dayData.index];
    setSelectedDay(selectedDayData);
  };

  // Handler for adding water
  const handleAddWater = (amount) => {
    setWaterIntake((prev) => prev + amount);
  };

  // Handler for logging sleep
  const handleLogSleep = (hours, quality) => {
    setSleepHours(hours);
    // In a real app, would also save quality and other details
  };

  // Handler for adding food
  const handleAddFood = (mealId) => {
    // In a real app, would open a modal to add food
  };

  // Animation and loading effect
  useEffect(() => {
    // Simulate loading data from API
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const pageTimer = setTimeout(() => {
      setPageLoaded(true);
    }, 1200);

    return () => {
      clearTimeout(timer);
      clearTimeout(pageTimer);
    };
  }, []);

  // Get active day's data - either selected day or current day
  const getActiveData = () => {
    if (selectedDay) {
      return {
        calories: selectedDay.calories,
        macros: selectedDay.macros,
        waterIntake: selectedDay.waterIntake,
        sleepHours: selectedDay.sleepHours,
        meals: selectedDay.meals,
      };
    }

    return {
      calories: nutritionData.calories,
      macros: nutritionData.macros,
      waterIntake: waterIntake,
      sleepHours: sleepHours,
      meals: nutritionData.meals,
    };
  };

  // Get active data
  const activeData = getActiveData();

  const handleMealUpdate = () => {
    // Increment refreshTrigger to force child components to re-fetch data
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Navigation Bar */}
      <SecondNavbar />

      <Box sx={{ minHeight: "100vh" }}>
        {/* Show skeleton during loading */}
        {isLoading ? (
          <Container maxWidth="lg" sx={{ mt: 12 }}>
            <NutritionPageSkeleton />
          </Container>
        ) : (
          <Fade in={pageLoaded} timeout={500}>
            <Container
              maxWidth="lg"
              sx={{
                py: 4,
                mt: 8,
                animation: "fadeIn 0.8s ease-in-out",
                "@keyframes fadeIn": {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                gutterBottom
                sx={{
                  position: "relative",
                  display: "inline-block",
                  mt: 4,
                }}
              >
                {selectedDay
                  ? `Nutrition for ${selectedDay.formattedDate}`
                  : "Nutrition Tracker"}

                {selectedDay && (
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      ml: 1.5,
                      px: 1.5,
                      py: 0.5,
                      bgcolor: "primary.light",
                      color: "white",
                      borderRadius: "12px",
                      verticalAlign: "middle",
                    }}
                  >
                    {selectedDay.dayOfWeek}
                  </Typography>
                )}
              </Typography>

              <Box sx={{ mb: 4 }}>
                <CalorieTracker
                  caloriesConsumed={activeData.calories.consumed}
                  calorieTarget={activeData.calories.target}
                  weeklyData={weeklyCalorieData}
                  onDaySelect={handleDaySelect}
                  refreshTrigger={refreshTrigger}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <MacronutrientBreakdown
                  macros={activeData.macros}
                  selectedDay={selectedDay}
                  refreshTrigger={refreshTrigger}
                />
              </Box>

              {/* Meal Logger and Water Tracker Section */}
              <Grid container spacing={3} sx={{ mb: 5 }}>
                {/* Meal Logger - Left Side */}
                <Grid item xs={12} md={6}>
                  <MealLogger
                    meals={activeData.meals}
                    onAddFood={handleAddFood}
                    selectedDay={selectedDay}
                    onMealUpdate={handleMealUpdate}
                  />
                </Grid>

                {/* Water Tracker - Right Side */}
                <Grid item xs={12} md={6}>
                  <WaterTracker
                    current={activeData.waterIntake}
                    target={waterTarget}
                    onAddWater={handleAddWater}
                    selectedDay={selectedDay}
                  />
                </Grid>
              </Grid>

              {/* Sleep Tracker - Bottom Section */}
              <Box sx={{ my: 5, pb: { xs: 8, sm: 5 } }}>
                <SleepTracker
                  currentHours={activeData.sleepHours}
                  onLogSleep={handleLogSleep}
                  selectedDay={selectedDay}
                />
              </Box>
            </Container>
          </Fade>
        )}
      </Box>

      {/* Footer based on screen size */}
      {isMobileOrTablet ? <MobileFooter /> : <Footer />}
      
      {/* Add the ThemeToggle component */}
      <ThemeToggle />
    </ThemeProvider>
  );
};

export default NutritionPage;
