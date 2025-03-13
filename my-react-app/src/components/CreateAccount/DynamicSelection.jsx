import React from "react";
import {
  Card,
  Typography,
  Box,
  IconButton,
  Link,
  Divider,
  Button,
} from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import ThemeTogglee from "../ThemeToggle";

export default function DynamicSelection({
  title,
  description,
  data,
  linkPrefix,
  nextLink,
  imageHeight,
  prevLink,
}) {
  return (
    <div className="dynamicSelection">
      <Box
        sx={{
          textAlign: "center",
          padding: { xs: 2, sm: 4 }, // Responsive padding: 16px on mobile, 32px on larger screens
          width: "100%",
        }}
      >
        <Typography variant="h3" fontWeight="bold" sx={{ marginBottom: 2 }}>
          {title}
        </Typography>

        {description && (
          <Typography
            variant="subtitle1"
            sx={{ marginBottom: 4, color: "#ccc" }}
          >
            {description}
          </Typography>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 3,
          }}
        >
          {data.map((item) => (
            <Card
              key={item.label}
              sx={{
                backgroundColor: "#1b1b2f",
                borderRadius: "12px",
                overflow: "hidden",
                transition: "transform 0.4s",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)", // Regular shadow
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.6)", // Enhanced shadow on hover
                },
              }}
            >
              <Box
                component="img"
                src={item.image}
                alt={item.label}
                sx={{
                  width: { imageHeight } || "100%",
                  height: 320,
                  objectFit: "cover",
                }}
              />
              <Box
                sx={{
                  background: "linear-gradient(90deg, #6c63ff, #4834d4)",
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#fff", fontWeight: "bold", letterSpacing: 1 }}
                >
                  {item.label}
                </Typography>
                <Link
                  href={nextLink || `${linkPrefix}/${item.label.toLowerCase()}`}
                >
                  <IconButton sx={{ color: "#fff" }}>
                    <ArrowForward />
                  </IconButton>
                </Link>
              </Box>
            </Card>
          ))}
        </Box>
        {prevLink && (
          <>
            <Divider sx={{ marginY: 2 }}>or</Divider>
            <RouterLink to={prevLink} style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                startIcon={<ArrowBack />}
                sx={{
                  marginBottom: 2,
                  background: "linear-gradient(90deg, #6c63ff, #4834d4)",
                  color: "#fff",
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                Go Back
              </Button>
            </RouterLink>
          </>
        )}
      </Box>
      <ThemeTogglee />
      <style jsx>{`
        .dynamicSelection {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}
