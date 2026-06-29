import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Search, ShoppingCart } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosConfig from "../../api/axiosConfig";

const globalFont = "system-ui, -apple-system, sans-serif";

function Products() {
  const navigate = useNavigate();
  const location = useLocation();
  const farmerId = location.state?.farmerId;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFarmerName, setActiveFarmerName] = useState("");

  const categories = ["All", "Vegetables", "Fruits", "Grains", "Pulses"];

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosConfig.get("/products");
      if (res.data && Array.isArray(res.data)) {
        setProducts(res.data);
        if (farmerId) {
          const match = res.data.find((p) => p.farmer && p.farmer.id === farmerId);
          if (match && match.farmer) {
            setActiveFarmerName(match.farmer.name);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [farmerId]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchVal = params.get("search");
    if (searchVal) {
      setSearchQuery(searchVal);
    } else {
      setSearchQuery("");
    }
  }, [location.search]);

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
    const matchesFarmer = !farmerId || (p.farmer && p.farmer.id === farmerId);
    return matchesSearch && matchesCat && matchesFarmer;
  });

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)", minHeight: "100vh", fontFamily: globalFont }}>
      {/* Top Header Section */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="900" sx={{ color: "#166534", fontFamily: globalFont, letterSpacing: "-1px" }}>
            Farm Shop 🛒
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: "0.95rem", mt: 0.5, fontFamily: globalFont }}>
            {activeFarmerName
              ? `Browsing fresh harvests listed by ${activeFarmerName}`
              : "Browse and purchase fresh produce directly from local farmers."}
          </Typography>
          {farmerId && (
            <Button
              size="small"
              color="success"
              variant="outlined"
              onClick={() => navigate("/customer/products", { state: null })}
              sx={{ mt: 1.5, borderRadius: "20px", fontWeight: "700", textTransform: "none", py: 0.3, px: 2, fontSize: "0.75rem", fontFamily: globalFont }}
            >
              Clear Farmer Filter: {activeFarmerName} ✕
            </Button>
          )}
        </Box>
        <Button
          variant="contained"
          color="success"
          startIcon={<ShoppingCart />}
          onClick={() => navigate("/customer/cart")}
          sx={{ 
            borderRadius: "12px", 
            fontWeight: "800", 
            textTransform: "none", 
            px: 3, 
            py: 1.2,
            fontFamily: globalFont,
            bgcolor: "#166534", 
            boxShadow: "0 4px 12px rgba(22,101,52,0.15)",
            "&:hover": { bgcolor: "#14532d", boxShadow: "0 6px 16px rgba(22,101,52,0.25)" }
          }}
        >
          Go to Cart
        </Button>
      </Box>

      {/* Search & Category Filter Section (Aligned together) */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search fresh products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="success" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: "#ffffff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  border: "1px solid #e2e8f0",
                  "& fieldset": { border: "none" },
                  "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
                  "&.Mui-focused": { border: "1.5px solid #166534", boxShadow: "0 4px 12px rgba(22,101,52,0.08)" }
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", gap: 1, overflowX: "auto", py: 0.5, "::-webkit-scrollbar": { display: "none" } }}>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  variant={selectedCategory === cat ? "contained" : "outlined"}
                  color="success"
                  sx={{
                    borderRadius: "20px",
                    px: 3,
                    py: 1,
                    fontFamily: globalFont,
                    fontWeight: "800",
                    fontSize: "0.85rem",
                    textTransform: "none",
                    minWidth: "fit-content",
                    borderWidth: "1.5px",
                    borderColor: selectedCategory === cat ? "#166534" : "#e2e8f0",
                    bgcolor: selectedCategory === cat ? "#166534" : "#ffffff",
                    color: selectedCategory === cat ? "#ffffff" : "#475569",
                    "&:hover": {
                      borderColor: "#166534",
                      bgcolor: selectedCategory === cat ? "#14532d" : "#f8fafc",
                      borderWidth: "1.5px"
                    }
                  }}
                >
                  {cat}
                </Button>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Catalog Grid */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((prod) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={prod.id}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.06)",
                      borderColor: "#86efac",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={prod.imageUrl || "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=300"}
                    alt={prod.name}
                    sx={{ borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }}
                  />
                  <CardContent sx={{ p: 2, flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="800" sx={{ fontFamily: globalFont, fontSize: "1.05rem", color: "#0f172a" }}>
                      {prod.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "600", color: "#64748b", fontFamily: globalFont }}>
                      Farmer: {prod.farmer?.name || "Verified Farmer"}
                    </Typography>
                    <Typography variant="h6" color="#166534" fontWeight="900" sx={{ mt: 1.5, fontFamily: globalFont }}>
                      ₹{prod.price} <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>/ {prod.unit}</span>
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0, display: "flex", gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<ShoppingCart />}
                      onClick={() => handleAddToCart(prod)}
                      sx={{ 
                        borderRadius: "12px", 
                        fontWeight: "800", 
                        textTransform: "none", 
                        fontFamily: globalFont,
                        bgcolor: "#166534",
                        "&:hover": { bgcolor: "#14532d" }
                      }}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
                        if (wishlist.some(item => item.id === prod.id)) {
                          toast.info(`${prod.name} is already in your wishlist`);
                        } else {
                          wishlist.push(prod);
                          localStorage.setItem("wishlist", JSON.stringify(wishlist));
                          toast.success(`${prod.name} added to wishlist!`);
                        }
                      }}
                      sx={{ 
                        borderRadius: "12px", 
                        minWidth: "46px", 
                        px: 0, 
                        borderColor: "#fee2e2",
                        bgcolor: "#fef2f2",
                        color: "#ef4444",
                        "&:hover": { borderColor: "#fca5a5", bgcolor: "#fee2e2" }
                      }}
                    >
                      ❤️
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 6, textAlign: "center", border: "1.5px dashed #e2e8f0", borderRadius: "16px", bgcolor: "#f8fafc" }}>
                <Typography variant="subtitle1" color="text.secondary" fontWeight="700" sx={{ fontFamily: globalFont }}>
                  No Products Found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontFamily: globalFont }}>
                  Try clearing your search query or selecting a different category.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}

export default Products;