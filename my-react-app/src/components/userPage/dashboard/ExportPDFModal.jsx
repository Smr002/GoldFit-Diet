import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  IconButton,
  Avatar,
  CircularProgress,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FileDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Chart from 'chart.js/auto';
import { 
  getUserBadges, 
  getWorkoutStreak, 
  getRecentExercises, 
  getPersonalBests, 
  getWeeklyProgress 
} from '@/api';

const ExportPDFModal = ({ open, onClose, token }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Generate a canvas with weekly progress chart
  const generateProgressChart = async (weeklyData) => {
    try {
      // Clean up previous chart if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      
      // Create a hidden canvas element if it doesn't exist
      if (!chartRef.current) {
        const canvas = document.createElement('canvas');
        canvas.id = 'progress-chart-canvas';
        canvas.width = 600;
        canvas.height = 400;
        canvas.style.display = 'none';
        document.body.appendChild(canvas);
        chartRef.current = canvas;
      }

      const ctx = chartRef.current.getContext('2d');
      
      // Extract data for the chart
      const labels = weeklyData.map(day => day.day);
      const data = weeklyData.map(day => day.totalWeight);
      
      // Create the chart
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Total Weight Lifted (lbs)',
            data: data,
            backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.2)' : 'rgba(126, 105, 171, 0.2)',
            borderColor: isDarkMode ? '#FFD700' : '#7E69AB',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          }]
        },
        options: {
          responsive: false, // Important to set false for PDF export
          maintainAspectRatio: false,
          animation: false, // Disable animations for PDF export
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Weight (lbs)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Day'
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            title: {
              display: true,
              text: 'Weekly Workout Progress'
            }
          }
        }
      });

      // Wait for chart to render completely
      await new Promise(resolve => setTimeout(resolve, 250));
      
      return chartRef.current;
    } catch (error) {
      console.error('Error generating chart:', error);
      throw new Error('Failed to generate progress chart');
    }
  };

  // Clean up function
  const cleanupResources = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }
    
    if (chartRef.current && document.body.contains(chartRef.current)) {
      document.body.removeChild(chartRef.current);
      chartRef.current = null;
    }
  };

  // Force download function
  const forceDownload = (blob, filename) => {
    // Create a link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    
    // Add to document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    
    // Small delay before removing to ensure download starts
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }, 100);
  };

  // Handle PDF export with error catching
  const handleExportPDF = async () => {
    if (!token) {
      setError('No authentication token available. Please log in again.');
      return;
    }
    
    setIsExporting(true);
    setProgress('Fetching your fitness data...');
    setError(null);
    
    try {
      console.log('Starting PDF generation with token:', token.substring(0, 10) + '...');
      
      // Fetch all required data in parallel with error handling
      let badgesResponse, streakResponse, recentExercisesResponse, personalBestsResponse, weeklyProgressResponse;
      
      try {
        [
          badgesResponse,
          streakResponse,
          recentExercisesResponse,
          personalBestsResponse,
          weeklyProgressResponse
        ] = await Promise.all([
          getUserBadges(token),
          getWorkoutStreak(token),
          getRecentExercises(token),
          getPersonalBests(token),
          getWeeklyProgress(token)
        ]);
      } catch (fetchError) {
        console.error('Error fetching data:', fetchError);
        throw new Error('Failed to fetch your fitness data. Please try again later.');
      }
      
      console.log('Data fetched successfully:', {
        badges: badgesResponse,
        streak: streakResponse,
        exercises: recentExercisesResponse.length,
        personalBests: personalBestsResponse.length,
        weeklyProgress: weeklyProgressResponse.length
      });
      
      setProgress('Generating your progress chart...');
      
      // Generate chart for weekly progress
      const progressChart = await generateProgressChart(weeklyProgressResponse);
      console.log('Chart generated');
      
      setProgress('Creating your PDF report...');
      
      // Create PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.setTextColor(isDarkMode ? '#FFD700' : '#7E69AB');
      doc.text('GoldFit Progress Report', 105, 20, { align: 'center' });
      doc.setDrawColor(isDarkMode ? '#FFD700' : '#7E69AB');
      doc.line(20, 25, 190, 25);
      
      // Add date
      doc.setFontSize(10);
      doc.setTextColor(100);
      const today = new Date();
      doc.text(`Generated on: ${today.toLocaleDateString()}`, 105, 32, { align: 'center' });
      
      // User achievements section
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text('Your Achievements', 20, 45);
      
      // Badges and streak
      doc.setFontSize(12);
      doc.text(`Badge: ${badgesResponse.badge}`, 25, 55);
      doc.text(`Total Workout Sessions: ${badgesResponse.totalSessions}`, 25, 62);
      doc.text(`Current Workout Streak: ${streakResponse.streak} days`, 25, 69);
      
      // Personal bests section
      doc.setFontSize(16);
      doc.text('Personal Bests', 20, 84);
      
      // Create personal bests table
      if (personalBestsResponse.length > 0) {
        autoTable(doc, {
          startY: 88,
          head: [['Exercise', 'Max Weight (lbs)']],
          body: personalBestsResponse.map(best => [best.name, best.maxWeight]),
          theme: isDarkMode ? 'grid' : 'striped',
          headStyles: { fillColor: isDarkMode ? [255, 215, 0] : [126, 105, 171], textColor: [255, 255, 255] },
          styles: { fontSize: 10 }
        });
      } else {
        doc.setFontSize(12);
        doc.text('No personal bests recorded yet.', 25, 88);
      }
      
      // Recent progress section
      doc.setFontSize(16);
      doc.text('Recent Exercise Progress', 20, doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : 120);
      
      // Create recent exercises table
      if (recentExercisesResponse.length > 0) {
        autoTable(doc, {
          startY: doc.previousAutoTable ? doc.previousAutoTable.finalY + 20 : 125,
          head: [['Exercise', 'Current Weight (lbs)', 'Previous Weight (lbs)', 'Change']],
          body: recentExercisesResponse.map(exercise => [
            exercise.name, 
            exercise.currentWeight, 
            exercise.previousWeight, 
            `${(exercise.currentWeight > exercise.previousWeight ? '+' : '')}${(exercise.currentWeight - exercise.previousWeight).toFixed(1)}`
          ]),
          theme: isDarkMode ? 'grid' : 'striped',
          headStyles: { fillColor: isDarkMode ? [255, 215, 0] : [126, 105, 171], textColor: [255, 255, 255] },
          styles: { fontSize: 10 }
        });
      } else {
        doc.setFontSize(12);
        doc.text('No recent exercises recorded yet.', 25, doc.previousAutoTable ? doc.previousAutoTable.finalY + 20 : 125);
      }
      
      // Add a new page for the chart
      doc.addPage();
      
      // Weekly progress section
      doc.setFontSize(16);
      doc.text('Weekly Progress', 20, 20);
      
      // Add chart to PDF
      if (weeklyProgressResponse.length > 0) {
        setProgress('Adding progress chart to your report...');
        try {
          // Ensure chart is fully rendered
          const imgData = progressChart.toDataURL('image/png', 1.0);
          doc.addImage(imgData, 'PNG', 15, 30, 180, 100);
        } catch (error) {
          console.error('Error adding chart to PDF:', error);
          doc.setFontSize(12);
          doc.text('Error generating chart. Please try again later.', 20, 40);
        }
      } else {
        doc.setFontSize(12);
        doc.text('No weekly progress data available yet.', 20, 40);
      }
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('GoldFit - Your Fitness Journey', 105, 285, { align: 'center' });
        doc.text(`Page ${i} of ${pageCount}`, 105, 292, { align: 'center' });
      }
      
      setProgress('Finalizing your PDF...');
      
      // Generate blob from PDF and force download
      try {
        const pdfBlob = doc.output('blob');
        forceDownload(pdfBlob, 'GoldFit-Progress-Report.pdf');
        console.log('PDF download initiated');
        
        // Clean up after successful download
        cleanupResources();
        
        setIsExporting(false);
        onClose();
      } catch (downloadError) {
        console.error('Error downloading PDF:', downloadError);
        setError('Failed to download PDF. Please try again.');
        setIsExporting(false);
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError(`Error: ${error.message || 'Failed to generate PDF'}`);
      setIsExporting(false);
      
      // Clean up on error
      cleanupResources();
    }
  };

  // Clean up on dialog close or unmount
  React.useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, []);

  return (
    <>
      <Dialog
        open={open}
        onClose={!isExporting ? onClose : undefined}
        PaperComponent={motion.div}
        PaperProps={{
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
          sx: {
            borderRadius: 3,
            maxWidth: 400,
            width: '100%',
            mx: 2,
            overflow: 'hidden',
            bgcolor: isDarkMode ? '#1e1e1e' : '#ffffff'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: isDarkMode 
              ? 'linear-gradient(45deg, #FFD700 30%, #DAA520 90%)' 
              : 'linear-gradient(45deg, #7E69AB 30%, #9B87F5 90%)',
            color: '#fff',
            p: 2
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
              <PictureAsPdfIcon />
            </Avatar>
            <Typography variant="h6" fontWeight="bold">Export Progress Report</Typography>
          </Box>
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={!isExporting ? onClose : undefined}
            disabled={isExporting}
            aria-label="close"
            sx={{ 
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, mt: 1 }}>
          <Typography variant="body1">
            Would you like to download a PDF report of your progress? This report will include your fitness achievements, personal bests, and progress tracking metrics.
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              mt: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
            }}
          >
            <Box flex={1}>
              <Typography fontWeight="medium" variant="body2" color="text.secondary">
                PDF Report includes:
              </Typography>
              <Typography variant="body2" component="div" mt={1}>
                • Your fitness badge and streak<br />
                • Personal best records<br />
                • Recent exercise progress<br />
                • Weekly workout statistics<br />
                • Progress visualization chart
              </Typography>
            </Box>
            <PictureAsPdfIcon 
              sx={{ 
                fontSize: 40, 
                color: isDarkMode ? theme.palette.primary.main : '#7E69AB',
                opacity: 0.8
              }} 
            />
          </Box>
          
          {isExporting && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <CircularProgress 
                size={40} 
                sx={{ color: isDarkMode ? theme.palette.primary.main : '#7E69AB' }} 
              />
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                {progress}
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button 
            onClick={onClose}
            disabled={isExporting}
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 'medium'
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleExportPDF}
            disabled={isExporting}
            startIcon={isExporting ? <CircularProgress size={20} /> : <FileDown size={18} />}
            sx={{
              bgcolor: isDarkMode ? theme.palette.primary.main : '#7E69AB',
              '&:hover': {
                bgcolor: isDarkMode ? '#DAA520' : '#6E59A5',
              },
              px: 3,
              py: 1,
              borderRadius: 2
            }}
          >
            {isExporting ? 'Generating...' : 'Download PDF'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Error notification */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExportPDFModal;