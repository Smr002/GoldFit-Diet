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
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ThemeTogglee from "../ThemeToggle";
import { useCreateAccountStore } from "@/store/useCreateAccountStore";

export default function DynamicSelection({
  title,
  description,
  data,
  linkPrefix,
  nextLink,
  prevLink,
}) {
  const navigate = useNavigate();

  const {
    setBodyType,
    setAgeGroup,
    setHeight,
    setWeight,
    setGoal,
    setBodyYouWant,
    setGender,
  } = useCreateAccountStore();

  const handleSelect = (itemLabel) => {
    if (linkPrefix.includes("body-type")) {
      setBodyType(itemLabel);
    } else if (linkPrefix.includes("age-selection")) {
      setAgeGroup(itemLabel);
    } else if (linkPrefix.includes("height-selection")) {
      setHeight(itemLabel);
    } else if (linkPrefix.includes("weight-selection")) {
      setWeight(itemLabel);
    } else if (linkPrefix.includes("your-goal")) {
      setGoal(itemLabel);
    } else if (linkPrefix.includes("body-you-want")) {
      setBodyYouWant(itemLabel);
    } else if (linkPrefix.includes("gender")) {
      setGender(itemLabel);
    }

    navigate(nextLink || `${linkPrefix}/${itemLabel.toLowerCase()}`);
  };

  return (
    <div className="dynamicSelection">
      <Box
        sx={{
          textAlign: "center",
          padding: { xs: 2, sm: 4 },
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
          {(data || []).map((item) => (
            <Card
              key={item.label}
              sx={{
                backgroundColor: "#1b1b2f",
                borderRadius: "12px",
                overflow: "hidden",
                transition: "transform 0.4s",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.6)",
                },
              }}
              onClick={() => handleSelect(item.label)}
            >
              <Box
                component="img"
                src={item.image}
                alt={item.label}
                sx={{
                  height: 400,
                  objectFit: "cover",
                }}
              />
              <Box
                sx={{
                  background:
                    "linear-gradient(90deg, var(--primary-color), var(--secondary-color))",
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
                <IconButton sx={{ color: "#fff" }}>
                  <ArrowForward />
                </IconButton>
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
                  background:
                    "linear-gradient(90deg, var(--primary-color), var(--secondary-color))",
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
