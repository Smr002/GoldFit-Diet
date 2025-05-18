import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Fade,
  Box,
  Button,
  Alert,
  AlertTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const CustomModal = ({
  openModal,
  handleCloseModal,
  isSuccess,
  submitStatus,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={openModal}
      onClose={handleCloseModal}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 600 }}
      PaperProps={{
        sx: {
          minWidth: { xs: "85%", sm: "420px" },
          p: 4,
          borderRadius: 5,
          textAlign: "center",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(145deg, #2c2c2c, #1e1e1e)"
              : "linear-gradient(145deg, #ffffff, #f4f4f4)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
          animation: "slideUp 0.6s ease-out",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          backdropFilter: "blur(6px)",
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", pb: 0 }}>
        <Box display="flex" justifyContent="center" mb={1}>
          {isSuccess ? (
            <CheckCircleOutlineIcon
              color="primary"
              sx={{
                fontSize: 48,
                animation: "pop 0.5s ease-out",
              }}
            />
          ) : (
            <ErrorOutlineIcon
              color="error"
              sx={{
                fontSize: 48,
                animation: "pop 0.5s ease-out",
              }}
            />
          )}
        </Box>
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          fontWeight={800}
          sx={{
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {isSuccess ? "Success!" : "Oops!"}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        <Alert
          severity={isSuccess ? "success" : "error"}
          variant="outlined"
          sx={{ borderRadius: 2, px: 2, py: 1, mb: 3 }}
        >
          <AlertTitle>
            {isSuccess ? "Your action was successful!" : "There was an error"}
          </AlertTitle>
          {submitStatus.message}
        </Alert>

        <Button
          variant="contained"
          size="large"
          onClick={handleCloseModal}
          sx={{
            borderRadius: "999px",
            px: 5,
            py: 1.5,
            fontWeight: 600,
            fontSize: "1rem",
            textTransform: "none",
            boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
            backgroundColor: isSuccess
              ? theme.palette.success.main
              : theme.palette.error.main,
            "&:hover": {
              backgroundColor: isSuccess
                ? theme.palette.success.dark
                : theme.palette.error.dark,
            },
          }}
        >
          {isSuccess ? "Go to Login" : "Close"}
        </Button>
      </DialogContent>

      <style>
        {`
          @keyframes pop {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }

          @keyframes slideUp {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </Dialog>
  );
};

export default CustomModal;
