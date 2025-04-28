import React, { useState } from 'react';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FileDown } from 'lucide-react';
import { motion } from 'framer-motion';

const ExportPDFModal = ({ open, onClose }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [isExporting, setIsExporting] = useState(false);

  // Handle PDF export
  const handleExportPDF = async () => {
    setIsExporting(true);
    
    try {
      // Simulate PDF generation with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically call an API service to generate the PDF
      // For example: await ExportPDFService.generateProgressReport();
      
      // Create a fake download to simulate PDF download
      const link = document.createElement('a');
      link.href = '#'; // In a real implementation, this would be a blob URL or API endpoint
      link.setAttribute('download', 'GoldFit-Progress-Report.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Close the modal when done
      setIsExporting(false);
      onClose();
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsExporting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          onClick={onClose} 
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
          Would you like to download a PDF report of your progress? This report will include weight trends, fitness achievements, and goal tracking.
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
              • Weight changes & trends<br />
              • Fitness achievements<br />
              • Goal progress metrics<br />
              • Daily activity summary
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
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button 
          onClick={onClose}
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
  );
};

export default ExportPDFModal;