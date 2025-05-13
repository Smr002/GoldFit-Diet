import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

const API_KEY = "Q0OdBuGbK6sKKOj7YhXNN7ECmpVig2YL7za67Ge8"; // Store in .env in production

const FoodSearchModal = ({ open, onClose, onAddFood, mealId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [servingSize, setServingSize] = useState("100");
  const [servingUnit, setServingUnit] = useState("g");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSelectedFood(null);

    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${API_KEY}&query=${encodeURIComponent(
          searchQuery
        )}&pageSize=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch food data");
      }

      const data = await response.json();
      setSearchResults(data.foods || []);

      if (data.foods?.length === 0) {
        setError("No foods found matching your search");
      }
    } catch (err) {
      console.error("Error searching for foods:", err);
      setError("Error searching for foods. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedFood(null);
    setError(null);
  };

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setServingSize("100");
    setServingUnit("g");
  };

  const handleAddFood = async () => {
    if (!selectedFood) return;

    try {
      setLoading(true);
      setError(null);

      const nutrients = selectedFood.foodNutrients || [];
      const calories =
        nutrients.find(
          (n) => n.nutrientName === "Energy" || n.nutrientNumber === "208"
        )?.value || 0;
      const protein =
        nutrients.find(
          (n) => n.nutrientName === "Protein" || n.nutrientNumber === "203"
        )?.value || 0;
      const carbs =
        nutrients.find(
          (n) =>
            n.nutrientName === "Carbohydrate, by difference" ||
            n.nutrientNumber === "205"
        )?.value || 0;
      const fats =
        nutrients.find(
          (n) =>
            n.nutrientName === "Total lipid (fat)" || n.nutrientNumber === "204"
        )?.value || 0;

      const multiplier = parseFloat(servingSize) / 100;

      const newFood = {
        id: `food-${Date.now()}`,
        name: selectedFood.description,
        serving: `${servingSize} ${servingUnit}`,
        calories: Math.round(calories * multiplier),
        protein: Math.round(protein * multiplier * 10) / 10,
        carbs: Math.round(carbs * multiplier * 10) / 10,
        fats: Math.round(fats * multiplier * 10) / 10, // Changed from "fat" to "fats"
        foodId: selectedFood.fdcId,
      };

      await onAddFood(mealId, newFood);
      onClose();
    } catch (err) {
      console.error('Error adding food:', err);
      setError(err.message || 'Failed to add food');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          Add Food to Meal
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Search for a food"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchQuery && (
                    <IconButton
                      aria-label="clear search"
                      onClick={handleClearSearch}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                  <IconButton
                    aria-label="search"
                    onClick={handleSearch}
                    edge="end"
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 0.5 }}
          >
            Search for foods like "apple", "chicken breast", or "greek yogurt"
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <CircularProgress />
          </Box>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {searchResults.length > 0 && !loading && (
              <Paper
                variant="outlined"
                sx={{ maxHeight: "50vh", overflow: "auto", p: 1 }}
              >
                <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
                  {searchResults.length} results found
                </Typography>
                <List dense>
                  {searchResults.map((food) => (
                    <React.Fragment key={food.fdcId}>
                      <ListItem
                        selected={selectedFood?.fdcId === food.fdcId}
                        onClick={() => handleSelectFood(food)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <ListItemText
                          primary={food.description}
                          secondary={food.brandName || food.foodCategory}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {selectedFood && (
              <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                <Typography variant="h6" fontWeight="bold">
                  {selectedFood.description}
                </Typography>

                {selectedFood.brandName && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {selectedFood.brandName}
                  </Typography>
                )}

                <Chip
                  label={selectedFood.foodCategory}
                  size="small"
                  sx={{ mb: 2 }}
                />

                <Typography variant="subtitle2" gutterBottom>
                  Serving Size
                </Typography>

                <Box sx={{ display: "flex", mb: 3, gap: 1 }}>
                  <TextField
                    label="Amount"
                    type="number"
                    value={servingSize}
                    onChange={(e) => setServingSize(e.target.value)}
                    InputProps={{ inputProps: { min: 0 } }}
                    size="small"
                  />

                  <FormControl size="small" sx={{ minWidth: 80 }}>
                    <InputLabel id="serving-unit-label">Unit</InputLabel>
                    <Select
                      labelId="serving-unit-label"
                      value={servingUnit}
                      onChange={(e) => setServingUnit(e.target.value)}
                      label="Unit"
                    >
                      <MenuItem value="g">g</MenuItem>
                      <MenuItem value="ml">ml</MenuItem>
                      <MenuItem value="oz">oz</MenuItem>
                      <MenuItem value="cup">cup</MenuItem>
                      <MenuItem value="tbsp">tbsp</MenuItem>
                      <MenuItem value="tsp">tsp</MenuItem>
                      <MenuItem value="piece">piece</MenuItem>
                      <MenuItem value="slice">slice</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Nutrition (based on serving size)
                </Typography>

                <Box sx={{ mb: 2 }}>
                  {(() => {
                    const nutrients = selectedFood.foodNutrients || [];
                    const multiplier = parseFloat(servingSize) / 100;

                    const calories =
                      nutrients.find(
                        (n) =>
                          n.nutrientName === "Energy" ||
                          n.nutrientNumber === "208"
                      )?.value || 0;
                    const protein =
                      nutrients.find(
                        (n) =>
                          n.nutrientName === "Protein" ||
                          n.nutrientNumber === "203"
                      )?.value || 0;
                    const carbs =
                      nutrients.find(
                        (n) =>
                          n.nutrientName === "Carbohydrate, by difference" ||
                          n.nutrientNumber === "205"
                      )?.value || 0;
                    const fats =
                      nutrients.find(
                        (n) =>
                          n.nutrientName === "Total lipid (fat)" ||
                          n.nutrientNumber === "204"
                        )?.value || 0;

                    return (
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            Calories:{" "}
                            <strong>{Math.round(calories * multiplier)}</strong>{" "}
                            kcal
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            Protein:{" "}
                            <strong>{(protein * multiplier).toFixed(1)}</strong>{" "}
                            g
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            Carbs:{" "}
                            <strong>{(carbs * multiplier).toFixed(1)}</strong> g
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            Fats:{" "}
                            <strong>{(fats * multiplier).toFixed(1)}</strong> g
                          </Typography>
                        </Grid>
                      </Grid>
                    );
                  })()}
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <InfoIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                  Nutrition information from USDA FoodData Central
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleAddFood}
          variant="contained"
          startIcon={<AddIcon />}
          disabled={!selectedFood}
        >
          Add to Meal
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FoodSearchModal;