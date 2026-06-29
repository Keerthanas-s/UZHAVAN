import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
} from "@mui/material";
import { AddCircle, Delete, Inventory } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import farmerApi from "../../api/farmerapi";

const globalFont = "system-ui, -apple-system, sans-serif";

function Products() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Vegetables",
    price: "",
    quantity: "",
    unit: "kg",
    description: "",
    imageUrl: "",
  });

  const categories = ["Vegetables", "Fruits", "Grains", "Pulses"];
  const units = ["kg", "bundle", "quintal", "box"];

  const getValidImageUrl = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500";
    let trimmed = url.trim();

    if (trimmed.includes("google.com/imgres") || trimmed.includes("google.co.in/imgres")) {
      try {
        const urlObj = new URL(trimmed);
        const imgurlParam = urlObj.searchParams.get("imgurl");
        if (imgurlParam) {
          trimmed = decodeURIComponent(imgurlParam);
        }
      } catch (e) {
        console.error("Failed to parse Google image URL:", e);
      }
    }

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:image/")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const loadProducts = () => {
    const farmerId = localStorage.getItem("userId");
    if (!farmerId) {
      toast.warning("Session expired or incomplete. Please LOG OUT and log back in to refresh your login details.");
      return;
    }

    setLoading(true);
    farmerApi
      .getProducts()
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setProducts(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load crops:", err);
        toast.error(err.response?.data?.message || "Failed to load crops from database");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchVal = params.get("search");
    if (searchVal) {
      setSearchQuery(searchVal);
    } else {
      setSearchQuery("");
    }
  }, [location.search]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.quantity) {
      toast.error("Please fill all required fields");
      return;
    }

    const farmerId = localStorage.getItem("userId");
    if (!farmerId) {
      toast.error("Session missing. Please log out and log back in.");
      return;
    }

    try {
      const parsedUrl = getValidImageUrl(newProduct.imageUrl);
      const payload = {
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        quantity: Number(newProduct.quantity),
        unit: newProduct.unit,
        description: newProduct.description,
        imageUrl: parsedUrl,
        available: true,
      };

      await farmerApi.addProduct(payload);
      toast.success("Crop listed in database successfully!");
      setOpenAddDialog(false);
      setNewProduct({
        name: "",
        category: "Vegetables",
        price: "",
        quantity: "",
        unit: "kg",
        description: "",
        imageUrl: "",
      });
      loadProducts();
    } catch (err) {
      console.error(err);
      const rawError = err.response?.data?.message || err.response?.data?.error || err.response?.data || err.message || "Failed to list crop";
      const errorString = typeof rawError === "object" ? JSON.stringify(rawError) : String(rawError);
      toast.error(errorString.substring(0, 150));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product listing?")) return;
    try {
      await farmerApi.deleteProduct(id);
      toast.success("Product listing deleted successfully");
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete crop listing");
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)", minHeight: "100vh", fontFamily: globalFont }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4.5 }}>
        <Box>
          <Typography variant="h4" fontWeight="900" sx={{ color: "#166534", fontFamily: globalFont, letterSpacing: "-0.8px" }}>
            Crop Inventory 🌾
          </Typography>
          <Typography color="text.secondary" sx={{ fontFamily: globalFont, fontWeight: "600", fontSize: "0.95rem", mt: 0.5 }}>
            Manage your listed products and stock availability.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddCircle />}
          onClick={() => setOpenAddDialog(true)}
          sx={{ 
            borderRadius: "20px", 
            fontWeight: "800", 
            fontFamily: globalFont, 
            px: 3, 
            py: 1, 
            textTransform: "none",
            bgcolor: "#166534",
            boxShadow: "0 4px 10px rgba(22,101,52,0.15)",
            "&:hover": { bgcolor: "#1b5e20" }
          }}
        >
          Add New Crop
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
            products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((prod) => (
              <Grid item xs={12} sm={6} md={3} key={prod.id}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background: "#ffffff",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 25px rgba(22,101,52,0.05)",
                      borderColor: "#81c784",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="150"
                    image={getValidImageUrl(prod.imageUrl)}
                    alt={prod.name}
                    sx={{ borderBottom: "1px solid #f1f5f9" }}
                  />
                  <CardContent sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="800" sx={{ color: "#0f172a", fontFamily: globalFont, lineHeight: 1.2 }}>
                          {prod.name}
                        </Typography>
                        <Chip label={prod.category} size="small" variant="outlined" color="success" sx={{ fontSize: "0.68rem", fontWeight: "700", fontFamily: globalFont, borderRadius: "6px" }} />
                      </Box>
                      {prod.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: globalFont, fontSize: "0.82rem", mt: 0.5, mb: 1, fontWeight: "500" }}>
                          {prod.description}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h5" color="success.main" fontWeight="900" sx={{ color: "#166534", fontFamily: globalFont, mb: 0.5 }}>
                        ₹{prod.price} <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>/ {prod.unit}</span>
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: globalFont, fontWeight: "600", fontSize: "0.82rem" }}>
                        Stock Available: <span style={{ color: "#0f172a", fontWeight: "800" }}>{prod.quantity} {prod.unit}</span>
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2.5, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="text"
                      startIcon={<Delete />}
                      onClick={() => handleDelete(prod.id)}
                      sx={{ 
                        borderRadius: "10px", 
                        fontWeight: "800", 
                        fontFamily: globalFont,
                        textTransform: "none",
                        bgcolor: "#fef2f2",
                        color: "#ef4444",
                        border: "1px solid #fecaca",
                        py: 0.8,
                        "&:hover": { bgcolor: "#fee2e2", borderColor: "#ef4444" }
                      }}
                    >
                      Delete Listing
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 6, textAlign: "center", border: "1px dashed #cbd5e1", borderRadius: "16px", bgcolor: "#f8fafc" }}>
                <Inventory sx={{ fontSize: 52, color: "action.disabled", mb: 2 }} />
                <Typography variant="h6" color="#0f172a" fontWeight="800" sx={{ fontFamily: globalFont, mb: 0.5 }}>
                  No crops listed yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: globalFont, mb: 3, fontWeight: "600", fontSize: "0.88rem" }}>
                  Start listing your harvest to sell directly to buyers.
                </Typography>
                <Button variant="contained" color="success" onClick={() => setOpenAddDialog(true)} sx={{ borderRadius: "20px", fontWeight: "800", px: 3, py: 1, textTransform: "none", bgcolor: "#166534", "&:hover": { bgcolor: "#1b5e20" } }}>
                  List Crop Now
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {/* Add Crop Dialog Form */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ fontWeight: "900", color: "#166534", fontFamily: globalFont, fontSize: "1.25rem" }}>List New Crop</DialogTitle>
        <form onSubmit={handleAddProduct}>
          <DialogContent dividers sx={{ p: 3 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Crop Name"
                  placeholder="e.g. Tomato (Fresh Hybrid)"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                >
                  {categories.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Unit"
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                >
                  {units.map((u) => (
                    <MenuItem key={u} value={u}>{u}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  label="Price per unit (₹)"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  label="Available Quantity"
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Image URL Link"
                  placeholder="Unsplash / external image link"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
                <Typography variant="body2" fontWeight="800" color="text.secondary" sx={{ mb: 1.5, fontFamily: globalFont, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Or select a beautiful preset crop image:
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {[
                    { label: "🍅 Tomato", url: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600" },
                    { label: "🧅 Onion", url: "https://images.unsplash.com/photo-1618228473302-9986f59b51a2?w=600" },
                    { label: "🥕 Carrot", url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600" },
                    { label: "🍆 Brinjal", url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600" },
                    { label: "🥔 Potato", url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600" },
                    { label: "🥬 Greens", url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600" },
                    { label: "🌾 Paddy", url: "https://images.unsplash.com/photo-1536304997881-a372c179924b?w=600" },
                  ].map((p, idx) => (
                    <Button
                      key={idx}
                      variant="outlined"
                      size="small"
                      color="success"
                      onClick={() => setNewProduct({ ...newProduct, imageUrl: p.url })}
                      sx={{ textTransform: "none", borderRadius: "12px", fontSize: "0.75rem", py: 0.5, fontWeight: "700" }}
                    >
                      {p.label}
                    </Button>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={2.5}
                  label="Description"
                  placeholder="Tell buyers about organic quality, harvest date, sorting grade etc."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenAddDialog(false)} color="inherit" sx={{ fontWeight: "800", fontFamily: globalFont, textTransform: "none" }}>Cancel</Button>
            <Button type="submit" variant="contained" color="success" sx={{ fontWeight: "800", fontFamily: globalFont, textTransform: "none", bgcolor: "#166534" }}>List Crop</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Products;