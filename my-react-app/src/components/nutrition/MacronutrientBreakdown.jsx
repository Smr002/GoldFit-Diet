import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  useMediaQuery,
  Fade,
  Grow,
  CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { PieChart } from '@mui/x-charts/PieChart';
import { getNutritionLog, getUserIdFromToken } from '@/api';

const MacronutrientBreakdown = ({ refreshTrigger }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';

  // State for data and loading
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [macros, setMacros] = useState({
    protein: 0,
    carbs: 0,
    fat: 0
  });
  const [totalCalories, setTotalCalories] = useState(0);
  
  // Animation states
  const [animateProgress, setAnimateProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  // Updated color scheme based on theme
  const MACRO_COLORS = {
    protein: isDarkMode ? '#FFD700' : '#7b1fa2', // Gold in dark mode, purple in light
    carbs: isDarkMode ? '#FFC107' : '#ff6f00',   // Amber in dark mode, orange in light
    fat: isDarkMode ? '#DAA520' : '#1565c0',     // Goldenrod in dark mode, blue in light
    noData: isDarkMode ? '#555555' : '#e0e0e0'   // Darker gray in dark mode
  };

  const colorArray = [
    MACRO_COLORS.protein,
    MACRO_COLORS.carbs,
    MACRO_COLORS.fat
  ];

  const [showRecommended, setShowRecommended] = useState(false);
  const [showActual, setShowActual] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const { protein, carbs, fat } = macros;

  const recommendedTotal = 98 + 196 + 65;
  const recommendedData = [
    { id: 0, value: Math.round((98 / recommendedTotal) * 100), label: 'Protein', color: MACRO_COLORS.protein },
    { id: 1, value: Math.round((196 / recommendedTotal) * 100), label: 'Carbs', color: MACRO_COLORS.carbs },
    { id: 2, value: Math.round((65 / recommendedTotal) * 100), label: 'Fat', color: MACRO_COLORS.fat }
  ];
  
  const actualTotal = protein + carbs + fat;
  const actualData = actualTotal === 0
    ? [{ id: 0, value: 100, label: 'No data', color: MACRO_COLORS.noData }]
    : [
        { id: 0, value: Math.round((protein / actualTotal) * 100), label: 'Protein', color: MACRO_COLORS.protein },
        { id: 1, value: Math.round((carbs / actualTotal) * 100), label: 'Carbs', color: MACRO_COLORS.carbs },
        { id: 2, value: Math.round((fat / actualTotal) * 100), label: 'Fat', color: MACRO_COLORS.fat }
      ];

  const chartSize = isMobile ? 160 : 200;

  // Fetch nutrition data
  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Get user ID from token
        const userId = getUserIdFromToken(token);
        if (!userId) {
          throw new Error('No user ID found in token');
        }

        // Get today's date
        const today = new Date();
        
        // Fetch today's nutrition data
        const result = await getNutritionLog(token, userId, today);
        
        console.log('Raw API result:', result); // Debug log
        
        // Process the data
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        let totalCal = 0;

        if (result) {
          // If result is an array, sum up all entries
          if (Array.isArray(result)) {
            result.forEach(entry => {
              if (entry) {
                totalProtein += entry.protein || 0;
                totalCarbs += entry.carbs || 0;
                totalFat += entry.fat || 0;
                totalCal += entry.totalCalories || 0;
              }
            });
          } else {
            // If result is a single object
            totalProtein = result.protein || 0;
            totalCarbs = result.carbs || 0;
            totalFat = result.fat || 0;
            totalCal = result.totalCalories || 0;
          }
        }

        setMacros({
          protein: Number(totalProtein.toFixed(2)),
          carbs: Number(totalCarbs.toFixed(2)),
          fat: Number(totalFat.toFixed(2))
        });
        setTotalCalories(Number(totalCal.toFixed(2)));
      } catch (err) {
        console.error('Error fetching nutrition data:', err);
        setError(err.message || 'Failed to load nutrition data');
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionData();
  }, [refreshTrigger]); // Add refreshTrigger to dependency array

  // Animation effects
  useEffect(() => {
    if (!loading) {
      const timer1 = setTimeout(() => setShowRecommended(true), 300);
      const timer2 = setTimeout(() => setShowActual(true), 600);
      const timer3 = setTimeout(() => setShowDetails(true), 900);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [loading]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const MacroLegend = ({ data, colors }) => (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 2,
        mt: 1,
        animation: 'fadeIn 1s ease-in-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }}
    >
      {data.map((item, index) => (
        <Box
          key={item.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            opacity: 0,
            animation: 'fadeIn 0.5s ease-in-out forwards',
            animationDelay: `${index * 0.2}s`,
            '@keyframes fadeIn': {
              from: { opacity: 0 },
              to: { opacity: 1 }
            }
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: colors[index],
              mr: 0.5
            }}
          />
          <Typography 
            variant="caption" 
            sx={{ color: theme.palette.text.secondary }}
          >
            {item.label}: {item.value}%
          </Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        mb: 3,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: isDarkMode 
            ? '0 8px 16px rgba(255, 215, 0, 0.15)' 
            : '0 8px 16px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        fontWeight="bold"
        sx={{
          mb: 2,
          color: theme.palette.text.primary,
          animation: 'slideRight 0.7s ease-out',
          '@keyframes slideRight': {
            from: { opacity: 0, transform: 'translateX(-20px)' },
            to: { opacity: 1, transform: 'translateX(0)' }
          }
        }}
      >
        Macronutrient Breakdown
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Fade in={showRecommended} timeout={800}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
            }}>
              <Box
                sx={{
                  animation: 'rotateIn 1.2s ease-out',
                  '@keyframes rotateIn': {
                    from: { opacity: 0, transform: 'rotate(-30deg)' },
                    to: { opacity: 1, transform: 'rotate(0)' }
                  },
                  filter: isDarkMode ? 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.2))' : 'none'
                }}
              >
                <PieChart
                  series={[{
                    data: recommendedData,
                    innerRadius: 30,
                    outerRadius: chartSize / 2 - 10,
                    paddingAngle: 1,
                    cornerRadius: 4,
                    startAngle: -90,
                    endAngle: 270,
                    cx: chartSize / 2,
                    cy: chartSize / 2,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -2, color: 'gray' }
                  }]}
                  width={chartSize}
                  height={chartSize}
                  slotProps={{ legend: { hidden: true } }}
                  sx={{
                    '--ChartsLegend-label-color': theme.palette.text.primary,
                    '--ChartsLegend-item-gap': '8px',
                  }}
                />
              </Box>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={{
                  mt: 1,
                  color: theme.palette.text.primary,
                  opacity: 0,
                  animation: 'fadeIn 0.8s ease-in-out forwards',
                  animationDelay: '0.6s',
                  '@keyframes fadeIn': {
                    from: { opacity: 0 },
                    to: { opacity: 1 }
                  }
                }}
              >
                Recommended
              </Typography>
              <MacroLegend data={recommendedData} colors={colorArray} />
            </Box>
          </Fade>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Fade in={showActual} timeout={800}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
            }}>
              <Box
                sx={{
                  animation: 'rotateIn 1.2s ease-out',
                  animationDelay: '0.3s',
                  '@keyframes rotateIn': {
                    from: { opacity: 0, transform: 'rotate(30deg)' },
                    to: { opacity: 1, transform: 'rotate(0)' }
                  },
                  filter: isDarkMode ? 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.2))' : 'none'
                }}
              >
                <PieChart
                  series={[{
                    data: actualData,
                    innerRadius: 30,
                    outerRadius: chartSize / 2 - 10,
                    paddingAngle: 1,
                    cornerRadius: 4,
                    startAngle: -90,
                    endAngle: 270,
                    cx: chartSize / 2,
                    cy: chartSize / 2,
                    colors: actualTotal === 0 ? [MACRO_COLORS.noData] : colorArray,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -2, color: 'gray' }
                  }]}
                  width={chartSize}
                  height={chartSize}
                  slotProps={{ legend: { hidden: true } }}
                  sx={{
                    '--ChartsLegend-label-color': theme.palette.text.primary,
                    '--ChartsLegend-item-gap': '8px',
                  }}
                />
              </Box>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={{
                  mt: 1,
                  color: theme.palette.text.primary,
                  opacity: 0,
                  animation: 'fadeIn 0.8s ease-in-out forwards',
                  animationDelay: '0.9s',
                  '@keyframes fadeIn': {
                    from: { opacity: 0 },
                    to: { opacity: 1 }
                  }
                }}
              >
                Actual
              </Typography>
              <MacroLegend
                data={actualData}
                colors={actualTotal === 0 ? [MACRO_COLORS.noData] : colorArray}
              />
            </Box>
          </Fade>
        </Grid>
      </Grid>

      <Grow in={showDetails} timeout={800}>
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.12)' : theme.palette.divider}`
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box
                sx={{
                  textAlign: 'center',
                  animation: 'slideUp 0.8s ease-out',
                  '@keyframes slideUp': {
                    from: { opacity: 0, transform: 'translateY(20px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ mb: 0.5, color: theme.palette.text.secondary }}
                >
                  Protein
                </Typography>
                <Typography 
                  variant="body1" 
                  fontWeight="medium" 
                  sx={{ color: MACRO_COLORS.protein }}
                >
                  {protein}g
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box
                sx={{
                  textAlign: 'center',
                  animation: 'slideUp 0.8s ease-out',
                  animationDelay: '0.2s',
                  '@keyframes slideUp': {
                    from: { opacity: 0, transform: 'translateY(20px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ mb: 0.5, color: theme.palette.text.secondary }}
                >
                  Carbs
                </Typography>
                <Typography 
                  variant="body1" 
                  fontWeight="medium" 
                  sx={{ color: MACRO_COLORS.carbs }}
                >
                  {carbs}g
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box
                sx={{
                  textAlign: 'center',
                  animation: 'slideUp 0.8s ease-out',
                  animationDelay: '0.4s',
                  '@keyframes slideUp': {
                    from: { opacity: 0, transform: 'translateY(20px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ mb: 0.5, color: theme.palette.text.secondary }}
                >
                  Fat
                </Typography>
                <Typography 
                  variant="body1" 
                  fontWeight="medium" 
                  sx={{ color: MACRO_COLORS.fat }}
                >
                  {fat}g
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grow>
    </Paper>
  );
};

export default MacronutrientBreakdown;