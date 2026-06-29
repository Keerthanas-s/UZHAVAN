import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Paper,
  IconButton,
} from "@mui/material";
import { ShoppingCart, Delete, Favorite } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  const loadWishlist = () => {
    const items = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(items);
  };

  useEffect(() => {
    loadWishlist();
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
    
    // Remove from wishlist
    const updatedWishlist = wishlist.filter((item) => item.id !== product.id);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);
    
    toast.success(`${product.name} moved to shopping cart!`);
  };

  const handleRemove = (productId, name) => {
    const updated = wishlist.filter((item) => item.id !== productId);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setWishlist(updated);
    toast.info(`Removed ${name} from wishlist`);
  };

  return (
    <Box sx={{ p: 4, background: "#fafafa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="800" sx={{ color: "#1b5e20", mb: 4 }}>
        My Wishlist 💖
      </Typography>

      {wishlist.length > 0 ? (
        <Grid container spacing={3}>
          {wishlist.map((prod) => (
            <Grid item xs={12} sm={6} md={3} key={prod.id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: "16px",
                  border: "1px solid #e0e0e0",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                    borderColor: "#a5d6a7",
                  },
                }}
              >
                <IconButton
                  onClick={() => handleRemove(prod.id, prod.name)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(255,255,255,0.8)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.95)" },
                  }}
                  color="error"
                  size="small"
                >
                  <Delete fontSize="small" />
                </IconButton>

                <CardMedia
                  component="img"
                  height="140"
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
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 5, textAlign: "center", border: "1px dashed #bdbdbd", borderRadius: "16px", bgcolor: "#fafafa" }}>
          <Favorite sx={{ fontSize: 48, color: "action.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" fontWeight="700" sx={{ mb: 1 }}>
            Your Wishlist is Empty
          </Typography>
          <Button variant="outlined" color="success" onClick={() => navigate("/customer/dashboard")} sx={{ borderRadius: "20px", fontWeight: "bold" }}>
            Explore Crops
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default Wishlist;