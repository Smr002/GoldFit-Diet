import React from "react";
import {
  Paper,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckIcon from "@mui/icons-material/Check";
import { Link } from "react-router-dom";

const OrderCompleteStep = ({
  orderId,
  // eslint-disable-next-line no-unused-vars
  formData,
  plan,
  onClose,
  isDarkMode,
}) => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        margin: "0 auto",
        marginLeft: { xs: 10, sm: "auto" },
      }}
    >
      <Paper
        elevation={isDarkMode ? 2 : 1}
        sx={{
          p: { xs: 2, sm: 3 },
          textAlign: "center",
          bgcolor: isDarkMode
            ? "rgba(40, 40, 40, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          borderRadius: 2,
          transition: "all 0.3s ease",
          width: "100%",
        }}
      >
        <CheckCircleIcon
          sx={{
            fontSize: { xs: 48, sm: 56 },
            color: isDarkMode ? "#FFD700" : "#6c63ff",
            mb: 1.5,
          }}
        />

        <Typography
          variant="h4"
          sx={{
            color: isDarkMode ? "#FFD700" : "#6c63ff",
            fontSize: { xs: "1.5rem", sm: "2rem" },
          }}
        >
          Your Order is Complete!
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "text.secondary",
          }}
        >
          Order ID: {orderId}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            maxWidth: 500,
            mx: "auto",
            my: 2,
            color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : "inherit",
          }}
        >
          Thank you for joining GoldFit!
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mx: "auto",
            mb: 2,
            textAlign: "left",
            bgcolor: isDarkMode
              ? "rgba(30, 30, 30, 0.7)"
              : "rgba(246, 246, 246, 0.7)",
            borderColor: isDarkMode ? "rgba(255, 215, 0, 0.3)" : undefined,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: isDarkMode ? "#FFD700" : "#6c63ff",
                fontWeight: 600,
              }}
            >
              Your {plan.title} Membership
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{
                color: isDarkMode ? "#DAA520" : "#4834d4",
                fontWeight: "bold",
              }}
            >
              ${plan.price} / {plan.period}
            </Typography>
          </Box>

          <Divider
            sx={{
              my: 1,
              borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : undefined,
            }}
          />

          <List dense disablePadding>
            {plan.features.slice(0, 4).map((feature, index) => (
              <ListItem key={index} disableGutters sx={{ py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <CheckIcon
                    fontSize="small"
                    sx={{ color: isDarkMode ? "#FFD700" : "#6c63ff" }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={feature}
                  primaryTypographyProps={{
                    color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : "inherit",
                    variant: "body2",
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mx: "auto",
            mb: 2.5,
            textAlign: "left",
            bgcolor: isDarkMode
              ? "rgba(30, 30, 30, 0.7)"
              : "rgba(246, 246, 246, 0.7)",
            borderColor: isDarkMode ? "rgba(255, 215, 0, 0.3)" : undefined,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: isDarkMode ? "#FFD700" : "#6c63ff",
              fontWeight: 600,
              mb: 1,
            }}
          >
            Next Steps
          </Typography>

          <List dense>
            <ListItem disableGutters sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    bgcolor: isDarkMode ? "#FFD700" : "#6c63ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isDarkMode ? "#000" : "white",
                    fontSize: "0.75rem",
                  }}
                >
                  1
                </Box>
              </ListItemIcon>
              <ListItemText
                primary="Download our mobile app"
                primaryTypographyProps={{
                  color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : "inherit",
                  variant: "body2",
                }}
              />
            </ListItem>

            <ListItem disableGutters sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    bgcolor: isDarkMode ? "#FFD700" : "#6c63ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isDarkMode ? "#000" : "white",
                    fontSize: "0.75rem",
                  }}
                >
                  2
                </Box>
              </ListItemIcon>
              <ListItemText
                primary="Visit your nearest GoldFit location"
                primaryTypographyProps={{
                  color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : "inherit",
                  variant: "body2",
                }}
              />
            </ListItem>

            <ListItem disableGutters sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    bgcolor: isDarkMode ? "#FFD700" : "#6c63ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isDarkMode ? "#000" : "white",
                    fontSize: "0.75rem",
                  }}
                >
                  3
                </Box>
              </ListItemIcon>
              <ListItemText
                primary="Schedule your fitness assessment"
                primaryTypographyProps={{
                  color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : "inherit",
                  variant: "body2",
                }}
              />
            </ListItem>
          </List>
        </Paper>

        <Link to="/user-home" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            size="medium"
            onClick={onClose}
            sx={{
              backgroundColor: isDarkMode ? "#FFD700" : "#6c63ff",
              color: isDarkMode ? "#000" : "#fff",
              "&:hover": {
                backgroundColor: isDarkMode ? "#DAA520" : "#4834d4",
              },
              px: 3,
              py: 1,
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            Done
          </Button>
        </Link>
      </Paper>
    </Container>
  );
};

export default OrderCompleteStep;