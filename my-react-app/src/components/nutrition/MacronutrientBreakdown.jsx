import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  useMediaQuery,
  Fade,
  Grow,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PieChart } from "@mui/x-charts/PieChart";

const MACRO_COLORS = {
  protein: "#7b1fa2",
  carbs: "#ff6f00",
  fat: "#1565c0",
  noData: "#e0e0e0",
};

const colorArray = [MACRO_COLORS.protein, MACRO_COLORS.carbs, MACRO_COLORS.fat];

const MacronutrientBreakdown = ({ macros }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [showRecommended, setShowRecommended] = useState(false);
  const [showActual, setShowActual] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const { protein, carbs, fat } = macros;

  const recommendedTotal = protein.target + carbs.target + fat.target;
  const recommendedData = [
    {
      id: 0,
      value: Math.round((protein.target / recommendedTotal) * 100),
      label: "Protein",
      color: MACRO_COLORS.protein,
    },
    {
      id: 1,
      value: Math.round((carbs.target / recommendedTotal) * 100),
      label: "Carbs",
      color: MACRO_COLORS.carbs,
    },
    {
      id: 2,
      value: Math.round((fat.target / recommendedTotal) * 100),
      label: "Fat",
      color: MACRO_COLORS.fat,
    },
  ];

  const actualTotal = protein.consumed + carbs.consumed + fat.consumed;
  const actualData =
    actualTotal === 0
      ? [{ id: 0, value: 100, label: "No data", color: MACRO_COLORS.noData }]
      : [
          {
            id: 0,
            value: Math.round((protein.consumed / actualTotal) * 100),
            label: "Protein",
            color: MACRO_COLORS.protein,
          },
          {
            id: 1,
            value: Math.round((carbs.consumed / actualTotal) * 100),
            label: "Carbs",
            color: MACRO_COLORS.carbs,
          },
          {
            id: 2,
            value: Math.round((fat.consumed / actualTotal) * 100),
            label: "Fat",
            color: MACRO_COLORS.fat,
          },
        ];

  const chartSize = isMobile ? 160 : 200;

  useEffect(() => {
    const timer1 = setTimeout(() => setShowRecommended(true), 300);
    const timer2 = setTimeout(() => setShowActual(true), 600);
    const timer3 = setTimeout(() => setShowDetails(true), 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const MacroLegend = ({ data, colors }) => (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 2,
        mt: 1,
        animation: "fadeIn 1s ease-in-out",
        "@keyframes fadeIn": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {data.map((item, index) => (
        <Box
          key={item.id}
          sx={{
            display: "flex",
            alignItems: "center",
            opacity: 0,
            animation: "fadeIn 0.5s ease-in-out forwards",
            animationDelay: `${index * 0.2}s`,
            "@keyframes fadeIn": {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: colors[index],
              mr: 0.5,
            }}
          />
          <Typography variant="caption">
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
        bgcolor: "white",
        mb: 3,
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        fontWeight="bold"
        sx={{
          mb: 2,
          animation: "slideRight 0.7s ease-out",
          "@keyframes slideRight": {
            from: { opacity: 0, transform: "translateX(-20px)" },
            to: { opacity: 1, transform: "translateX(0)" },
          },
        }}
      >
        Macronutrient Breakdown
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Fade in={showRecommended} timeout={800}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  animation: "rotateIn 1.2s ease-out",
                  "@keyframes rotateIn": {
                    from: { opacity: 0, transform: "rotate(-30deg)" },
                    to: { opacity: 1, transform: "rotate(0)" },
                  },
                }}
              >
                <PieChart
                  series={[
                    {
                      data: recommendedData,
                      innerRadius: 30,
                      outerRadius: chartSize / 2 - 10,
                      paddingAngle: 1,
                      cornerRadius: 4,
                      startAngle: -90,
                      endAngle: 270,
                      cx: chartSize / 2,
                      cy: chartSize / 2,
                    },
                  ]}
                  width={chartSize}
                  height={chartSize}
                  slotProps={{ legend: { hidden: true } }}
                />
              </Box>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={{
                  mt: 1,
                  opacity: 0,
                  animation: "fadeIn 0.8s ease-in-out forwards",
                  animationDelay: "0.6s",
                  "@keyframes fadeIn": {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                  },
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  animation: "rotateIn 1.2s ease-out",
                  animationDelay: "0.3s",
                  "@keyframes rotateIn": {
                    from: { opacity: 0, transform: "rotate(30deg)" },
                    to: { opacity: 1, transform: "rotate(0)" },
                  },
                }}
              >
                <PieChart
                  series={[
                    {
                      data: actualData,
                      innerRadius: 30,
                      outerRadius: chartSize / 2 - 10,
                      paddingAngle: 1,
                      cornerRadius: 4,
                      startAngle: -90,
                      endAngle: 270,
                      cx: chartSize / 2,
                      cy: chartSize / 2,
                      colors:
                        actualTotal === 0 ? [MACRO_COLORS.noData] : colorArray,
                    },
                  ]}
                  width={chartSize}
                  height={chartSize}
                  slotProps={{ legend: { hidden: true } }}
                />
              </Box>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={{
                  mt: 1,
                  opacity: 0,
                  animation: "fadeIn 0.8s ease-in-out forwards",
                  animationDelay: "0.9s",
                  "@keyframes fadeIn": {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                  },
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
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box
                sx={{
                  textAlign: "center",
                  animation: "slideUp 0.8s ease-out",
                  "@keyframes slideUp": {
                    from: { opacity: 0, transform: "translateY(20px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Protein
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="medium"
                  sx={{ color: MACRO_COLORS.protein }}
                >
                  {protein.consumed}g
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {` / ${protein.target}g`}
                  </Typography>
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box
                sx={{
                  textAlign: "center",
                  animation: "slideUp 0.8s ease-out",
                  animationDelay: "0.2s",
                  "@keyframes slideUp": {
                    from: { opacity: 0, transform: "translateY(20px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Carbs
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="medium"
                  sx={{ color: MACRO_COLORS.carbs }}
                >
                  {carbs.consumed}g
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {` / ${carbs.target}g`}
                  </Typography>
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box
                sx={{
                  textAlign: "center",
                  animation: "slideUp 0.8s ease-out",
                  animationDelay: "0.4s",
                  "@keyframes slideUp": {
                    from: { opacity: 0, transform: "translateY(20px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Fat
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="medium"
                  sx={{ color: MACRO_COLORS.fat }}
                >
                  {fat.consumed}g
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {` / ${fat.target}g`}
                  </Typography>
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
