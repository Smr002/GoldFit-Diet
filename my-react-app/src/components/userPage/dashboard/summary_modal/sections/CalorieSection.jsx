import React from 'react';
import {
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { getThemeColors, weekDays } from '../utils/constants';
import CustomTooltip from '../utils/CustomTooltip';

const CalorieSection = ({ calorieData }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const themeColors = getThemeColors(isDarkMode);

  // Prepare data for charts
  const chartData = calorieData.daily.map((calories, index) => ({
    day: weekDays[index],
    calories
  }));
  
  // Calculate total calories
  const totalCalories = calorieData.daily.reduce((acc, curr) => acc + curr, 0);

  return (
    <Grid item xs={12}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2.5, 
          borderRadius: 3,
          background: themeColors.paperBg,
          boxShadow: themeColors.paperShadow,
          mb: 1,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            mb: 1, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            fontWeight: 600
          }}
        >
          <Avatar sx={{ 
            bgcolor: themeColors.calorie.bg,
            width: 36, 
            height: 36
          }}>
            <LocalFireDepartmentIcon sx={{ color: themeColors.calorie.primary }} />
          </Avatar>
          Calorie Tracking
        </Typography>
        <Divider sx={{ mb: 2, opacity: 0.6 }} />
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={4}>
            <Box sx={{ 
              textAlign: 'center',
              p: 1.5,
              borderRadius: 2,
              background: themeColors.calorie.goal.bg
            }}>
              <Typography variant="body2" color="text.secondary">Daily Goal</Typography>
              <Typography variant="h6" fontWeight="bold" color={themeColors.calorie.goal.text}>
                {calorieData.goal} kcal
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Box sx={{ 
              textAlign: 'center',
              p: 1.5,
              borderRadius: 2,
              background: themeColors.calorie.average.bg
            }}>
              <Typography variant="body2" color="text.secondary">Daily Average</Typography>
              <Typography variant="h6" fontWeight="bold" color={themeColors.calorie.average.text}>
                {calorieData.average} kcal
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ 
              textAlign: 'center',
              p: 1.5,
              borderRadius: 2,
              background: themeColors.calorie.total.bg
            }}>
              <Typography variant="body2" color="text.secondary">Weekly Total</Typography>
              <Typography variant="h6" fontWeight="bold" color={themeColors.calorie.total.text}>
                {totalCalories} kcal
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ height: 200, mt: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="day" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="5%" 
                    stopColor={isDarkMode ? '#FFD700' : '#2196F3'} 
                    stopOpacity={0.8}
                  />
                  <stop 
                    offset="95%" 
                    stopColor={isDarkMode ? '#FFD700' : '#2196F3'} 
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>
              <Bar 
                dataKey="calories" 
                name="Calories"
                fill="url(#colorCalories)" 
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Grid>
  );
};

export default CalorieSection;