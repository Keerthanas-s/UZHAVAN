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
  Button,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Delete, CheckCircle } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import adminApi from "../../api/adminApi";

function FarmerManagement() {
  const location = useLocation();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadFarmers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getFarmers();
      if (response.data && Array.isArray(response.data)) {
        setFarmers(response.data);
      }
    } catch (error) {
      console.error("Failed to load farmers from database:", error);
      toast.error("Failed to load farmers list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmers();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const val = params.get("search");
    if (val) {
      setSearchQuery(val);
    } else {
      setSearchQuery("");
    }
  }, [location.search]);

  const handleApprove = async (id, name) => {
    try {
      await adminApi.approveFarmer(id);
      toast.success(`${name} account has been verified and approved`);
      loadFarmers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve farmer");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete farmer ${name}? This will remove all their crop listings.`)) return;
    try {
      await adminApi.deleteFarmer(id);
      toast.success(`Removed farmer ${name} from database`);
      loadFarmers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete farmer");
    }
  };

  const filteredFarmers = farmers.filter((f) => {
    const nameMatch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const districtMatch = (f.district || "").toLowerCase().includes(searchQuery.toLowerCase());
    const villageMatch = (f.village || "").toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || districtMatch || villageMatch;
  });

  return (
    <Box sx={{ p: 4, background: "#fafafa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="800" sx={{ color: "#1b5e20", mb: 4 }}>
        Farmer Directory 👨‍🌾
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <Paper elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: "16px", overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#fafafa" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Farmer ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Contact Info</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>District</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">Approval Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFarmers.length > 0 ? (
                filteredFarmers.map((farmer) => (
                  <TableRow key={farmer.id}>
                    <TableCell>#FMR-{farmer.id}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{farmer.name}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{farmer.email}</Typography>
                      <Typography variant="caption" color="text.secondary">{farmer.phoneNumber}</Typography>
                    </TableCell>
                    <TableCell>{farmer.district || "N/A"}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={farmer.approved ? "Approved" : "Pending Verification"}
                        color={farmer.approved ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {!farmer.approved && (
                        <Button
                          variant="outlined"
                          size="small"
                          color="success"
                          startIcon={<CheckCircle />}
                          onClick={() => handleApprove(farmer.id, farmer.name)}
                          sx={{ mr: 1.5, borderRadius: "8px", fontWeight: "bold" }}
                        >
                          Approve
                        </Button>
                      )}
                      <IconButton color="error" onClick={() => handleDelete(farmer.id, farmer.name)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    No registered farmers match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}

export default FarmerManagement;