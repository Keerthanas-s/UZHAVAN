import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  Grid,
  IconButton,
  MenuItem,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { Delete, AttachMoney, Edit, Refresh } from "@mui/icons-material";
import { toast } from "react-toastify";
import axiosConfig from "../../api/axiosConfig";

function Prices() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [district, setDistrict] = useState("");
  const [stateVal, setStateVal] = useState("Tamil Nadu");
  const [category, setCategory] = useState("Vegetables");
  const [productName, setProductName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [imageUrl, setImageUrl] = useState("");

  const districtsList = [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Trichy",
    "Salem",
    "Erode",
    "Dindigul",
    "Thanjavur",
  ];

  const categoriesList = ["Vegetables", "Fruits", "Pulses", "Grains"];

  const loadPrices = () => {
    setLoading(true);
    axiosConfig
      .get("/prices")
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setPrices(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load prices:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPrices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!district || !stateVal.trim() || !category || !productName.trim() || !minPrice || !maxPrice || !unit) {
      toast.error("Please fill in all fields");
      return;
    }

    if (Number(minPrice) > Number(maxPrice)) {
      toast.error("Min price cannot exceed max price");
      return;
    }

    const payload = {
      district,
      state: stateVal.trim(),
      category,
      productName: productName.trim(),
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      unit,
      imageUrl: imageUrl.trim() || null,
    };

    try {
      await axiosConfig.post("/prices", payload);
      toast.success("Market price saved successfully!");
      // Reset input fields
      setProductName("");
      setMinPrice("");
      setMaxPrice("");
      setImageUrl("");
      loadPrices();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save market price");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this price record?")) return;
    try {
      await axiosConfig.delete(`/prices/${id}`);
      toast.success("Price record deleted");
      loadPrices();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete price record");
    }
  };

  const handleEditSelect = (row) => {
    setDistrict(row.district);
    setStateVal(row.state || "Tamil Nadu");
    setCategory(row.category || "Vegetables");
    setProductName(row.productName);
    setMinPrice(row.minPrice);
    setMaxPrice(row.maxPrice);
    setUnit(row.unit);
    setImageUrl(row.imageUrl || "");
    toast.info("Pricing loaded to form for editing");
  };

  return (
    <Box sx={{ p: 4, background: "#fafafa", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{ color: "#1b5e20" }}>
            Market Pricing Intelligence Desk 📊
          </Typography>
          <Typography color="text.secondary">
            Publish and manage official crop price sheets across regulated district APMC markets.
          </Typography>
        </Box>
        <IconButton onClick={loadPrices} color="success">
          <Refresh />
        </IconButton>
      </Box>

      <Grid container spacing={4}>
        {/* Left Form Panel */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: "16px", bgcolor: "#ffffff" }}>
            <Typography variant="h6" fontWeight="800" sx={{ color: "#1b5e20", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <AttachMoney /> Publish Price Sheet
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Enter District"
                placeholder="e.g. Chennai, Coimbatore, Madurai"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              />

              <TextField
                fullWidth
                label="State"
                placeholder="e.g. Tamil Nadu"
                value={stateVal}
                onChange={(e) => setStateVal(e.target.value)}
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              />

              <TextField
                select
                fullWidth
                label="Select Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              >
                {categoriesList.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Enter Crop Name"
                placeholder="e.g. Tomato, Onion, Ragi, Wheat"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              />

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Min Price (₹)"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Max Price (₹)"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Unit (e.g. kg, piece, bundle)"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              />

              <TextField
                fullWidth
                label="Crop Image Link (Optional)"
                placeholder="Paste crop picture URL..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="success"
                sx={{ borderRadius: "12px", py: 1.5, fontWeight: "bold" }}
              >
                Save Price Record
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Right Data Table Panel */}
        <Grid item xs={12} md={8}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress color="success" />
            </Box>
          ) : (
            <Paper elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: "16px", overflow: "hidden" }}>
              <Table>
                <TableHead sx={{ bgcolor: "#f1f8e9" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Crop Image</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>State</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>District</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Crop Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">Min Price</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">Max Price</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">Average</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">Unit</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prices.length > 0 ? (
                    prices.map((row) => {
                      const avg = ((row.minPrice + row.maxPrice) / 2).toFixed(2);
                      return (
                        <TableRow key={row.id} sx={{ "&:hover": { bgcolor: "#f9fbe7" } }}>
                          <TableCell>
                            <Avatar
                              src={row.imageUrl || ""}
                              variant="rounded"
                              sx={{ 
                                width: 70, 
                                height: 70, 
                                bgcolor: "#2e7d32", 
                                fontSize: "1.2rem", 
                                fontWeight: "bold",
                                border: "1px solid #e0e0e0",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                                transition: "all 0.2s ease-in-out",
                                "&:hover": {
                                  transform: "scale(1.2)",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                  zIndex: 10
                                }
                              }}
                            >
                              {row.productName.substring(0, 2).toUpperCase()}
                            </Avatar>
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold", color: "#166534" }}>{row.state || "Tamil Nadu"}</TableCell>
                          <TableCell sx={{ fontWeight: "600" }}>{row.district}</TableCell>
                          <TableCell>{row.category || "Vegetables"}</TableCell>
                          <TableCell>{row.productName}</TableCell>
                          <TableCell align="center">₹{row.minPrice}</TableCell>
                          <TableCell align="center">₹{row.maxPrice}</TableCell>
                          <TableCell align="center" sx={{ color: "#2e7d32", fontWeight: "bold" }}>₹{avg}</TableCell>
                          <TableCell align="center">per {row.unit}</TableCell>
                          <TableCell align="center">
                            <IconButton color="primary" onClick={() => handleEditSelect(row)}>
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDelete(row.id)}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No pricing sheets published. Use the form on the left to add your first record.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Prices;
