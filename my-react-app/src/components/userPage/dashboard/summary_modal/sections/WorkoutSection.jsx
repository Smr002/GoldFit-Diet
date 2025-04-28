import React from 'react';
import {
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TimerIcon from '@mui/icons-material/Timer';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { getThemeColors } from '../utils/constants';

const WorkoutSection = ({ workoutData }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const themeColors = getThemeColors(isDarkMode);
  const COLORS = themeColors.colors;

  return (
    <Grid item xs={12} md={6}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2.5, 
          borderRadius: 3,
          background: themeColors.paperBg,
          boxShadow: themeColors.paperShadow,
          height: '100%',
          minHeight: 450, // Increased height for better pie chart display
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
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
            bgcolor: themeColors.workout.bg,
            width: 36, 
            height: 36
          }}>
            <DirectionsRunIcon sx={{ color: themeColors.workout.primary }} />
          </Avatar>
          Workouts
        </Typography>
        <Divider sx={{ mb: 2, opacity: 0.6 }} />
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <Box sx={{ 
              textAlign: 'center',
              p: 1.5,
              borderRadius: 2,
              background: themeColors.workout.stat.bg
            }}>
              <Typography variant="body2" color="text.secondary">
                <Box component="span" display="flex" alignItems="center" justifyContent="center" mb={0.5}>
                  <FitnessCenterIcon fontSize="small" />
                </Box>
                Sessions
              </Typography>
              <Typography variant="h6" fontWeight="bold" color={themeColors.workout.primary}>
                {workoutData.completed}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ 
              textAlign: 'center',
              p: 1.5,
              borderRadius: 2,
              background: themeColors.workout.stat.bg
            }}>
              <Typography variant="body2" color="text.secondary">
                <Box component="span" display="flex" alignItems="center" justifyContent="center" mb={0.5}>
                  <TimerIcon fontSize="small" />
                </Box>
                Duration
              </Typography>
              <Typography variant="h6" fontWeight="bold" color={themeColors.workout.primary}>
                {workoutData.duration} min
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ 
              textAlign: 'center',
              p: 1.5,
              borderRadius: 2,
              background: themeColors.workout.stat.bg
            }}>
              <Typography variant="body2" color="text.secondary">
                <Box component="span" display="flex" alignItems="center" justifyContent="center" mb={0.5}>
                  <LocalFireDepartmentIcon fontSize="small" />
                </Box>
                Burned
              </Typography>
              <Typography variant="h6" fontWeight="bold" color={themeColors.workout.primary}>
                {workoutData.caloriesBurned} kcal
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        {/* Chart section with flex-grow so it takes remaining space */}
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center', 
          mt: 1,
          minHeight: 260, // Increased to make chart bigger
        }}>
          <Typography 
            variant="subtitle2" 
            fontWeight="medium" 
            color="text.secondary" 
            sx={{ mb: 1, textAlign: 'center' }}
          >
            Workout Type Distribution
          </Typography>
          
          <ResponsiveContainer width="100%" height="100%" minHeight={240}>
            <PieChart>
              <Pie
                data={workoutData.types}
                cx="50%"
                cy="50%"
                innerRadius={isMobile ? 40 : 50}
                outerRadius={isMobile ? 70 : 85}
                paddingAngle={3}
                dataKey="value"
                labelLine={true}
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {workoutData.types.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke={isDarkMode ? "#222" : "#fff"}
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} sessions`, name]} 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
                  borderColor: isDarkMode ? '#444' : '#ddd'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            gap: 1.5,
            mt: 1.5
          }}>
            {workoutData.types.map((entry, index) => (
              <Box 
                key={`legend-${index}`} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1
                }}
              >
                <Box 
                  sx={{ 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%', 
                    backgroundColor: COLORS[index % COLORS.length] 
                  }} 
                />
                <Typography variant="caption" fontWeight="medium">
                  {entry.name} ({entry.value})
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default WorkoutSection;