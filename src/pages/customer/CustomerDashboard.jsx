import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Avatar,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Search, ShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosConfig from "../../api/axiosConfig";

function CustomerDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = ["All", "Vegetables", "Fruits", "Grains", "Pulses"];

  const customerName = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.name || "Customer";
    } catch {
      return "Customer";
    }
  })();

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch live products from database
      const productsRes = await axiosConfig.get("/products");
      if (productsRes.data && Array.isArray(productsRes.data)) {
        setProducts(productsRes.data);
      }

      // 2. Fetch live registered farmers from database
      const farmersRes = await axiosConfig.get("/farmers");
      if (farmersRes.data && Array.isArray(farmersRes.data)) {
        setFarmers(farmersRes.data);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleAddToCart = (product) => {
    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = localCart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      localCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit || "kg",
        quantity: 1,
        imageUrl: product.imageUrl,
      });
    }
    localStorage.setItem("cart", JSON.stringify(localCart));
    toast.success(`${product.name} added to cart!`);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, background: "linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)", minHeight: "100vh" }}>
      {/* Hello bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{ color: "#1b5e20" }}>
            Hello, {customerName}! 👋
          </Typography>
          <Typography color="text.secondary">
            Find fresh products straight from local farms.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="success"
          startIcon={<ShoppingCart />}
          onClick={() => navigate("/customer/cart")}
          sx={{ borderRadius: "20px", fontWeight: "bold" }}
        >
          View Cart
        </Button>
      </Box>

      {/* Search Input */}
      <TextField
        fullWidth
        placeholder="Search vegetables, fruits, grains..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 4,
          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            bgcolor: "#ffffff",
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
          },
        }}
      />

      {/* Popular Farmers (Stories) */}
      <Typography variant="h6" fontWeight="800" sx={{ mb: 2, color: "#1b5e20" }}>
        Popular Farmers
      </Typography>
      <Paper elevation={0} sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: "16px", mb: 4, display: "flex", gap: 3, overflowX: "auto" }}>
        {farmers.length > 0 ? (
          farmers.map((farmer) => (
            <Box
              key={farmer.id}
              sx={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", minWidth: "70px" }}
              onClick={() => navigate("/customer/products", { state: { farmerId: farmer.id } })}
            >
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: "#2e7d32",
                  color: "white",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  border: "3px solid #4caf50",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                {farmer.name.substring(0, 2).toUpperCase()}
              </Avatar>
              <Typography variant="caption" sx={{ mt: 1, fontWeight: "600" }} noWrap>
                {farmer.name.split(" ")[0]}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography color="text.secondary" sx={{ p: 2 }}>No active farmers registered in database.</Typography>
        )}
      </Paper>

      {/* Categories Toggle */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 4, overflowX: "auto", pb: 1 }}>
        {categories.map((cat) => (
          <Button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            variant={selectedCategory === cat ? "contained" : "outlined"}
            color="success"
            sx={{
              borderRadius: "20px",
              px: 3,
              fontWeight: "bold",
              textTransform: "none",
              boxShadow: selectedCategory === cat ? "0 4px 10px rgba(76,175,80,0.2)" : "none",
            }}
          >
            {cat}
          </Button>
        ))}
      </Box>

      {/* Popular Products List */}
      <Typography variant="h6" fontWeight="800" sx={{ mb: 2, color: "#1b5e20" }}>
        Popular Products
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((prod) => (
              <Grid item xs={12} sm={6} md={3} key={prod.id}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: "16px",
                    border: "1px solid #e0e0e0",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                      borderColor: "#a5d6a7",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="150"
                    image={prod.imageUrl || "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=300"}
                    alt={prod.name}
                  />
                  <CardContent sx={{ p: 2, flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="700">
                      {prod.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Farmer: {prod.farmer?.name || "Verified Farmer"}
                    </Typography>
                    <Typography variant="h6" color="success.main" fontWeight="800" sx={{ mt: 1 }}>
                      ₹{prod.price} <span style={{ fontSize: "0.8rem", color: "#666" }}>/ {prod.unit}</span>
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<ShoppingCart />}
                      onClick={() => handleAddToCart(prod)}
                      sx={{ borderRadius: "10px", fontWeight: "bold" }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 5, textAlign: "center", border: "1px dashed #bdbdbd", borderRadius: "16px" }}>
                <Typography color="text.secondary">No products currently available for purchase.</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}

export default CustomerDashboard;