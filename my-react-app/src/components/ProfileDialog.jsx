// src/components/profile/ProfileDialog.jsx
import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Alert,
  AlertTitle,
  Button,
  Slide,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import { CheckCircleOutline, ErrorOutline, Home } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProfileDialog({ open, onClose, success, message }) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: theme.palette.background.default,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          maxWidth: "400px",
          width: "100%",
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          backgroundColor: success ? "rgba(46, 125, 50, 0.9)" : "rgba(211, 47, 47, 0.9)",
          textAlign: "center",
        }}
      >
        {success ? (
          <CheckCircleOutline sx={{ fontSize: 60, color: "#fff" }} />
        ) : (
          <ErrorOutline sx={{ fontSize: 60, color: "#fff" }} />
        )}
      </Box>
      <DialogTitle
        id="alert-dialog-title"
        sx={{ 
          textAlign: "center", 
          pb: 0, 
          pt: 3,
          fontWeight: 600 
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {success ? "Profile Updated!" : "Update Failed"}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Typography 
          align="center" 
          sx={{ 
            color: "text.secondary",
            fontSize: "1.1rem" 
          }}
        >
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", p: 3 }}>
        <Button
          onClick={onClose}
          color={success ? "success" : "error"}
          variant="contained"
          size="large"
          startIcon={success ? <Home /> : undefined}
          sx={{
            px: 4,
            py: 1,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          {success ? "Go to Home" : "Try Again"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ProfileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
};