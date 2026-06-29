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
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import adminApi from "../../api/adminApi";

function CustomerManagement() {
  const location = useLocation();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getCustomers();
      if (response.data && Array.isArray(response.data)) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error("Failed to load customers from database:", error);
      toast.error("Failed to load customers list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
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

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove customer ${name} from the system?`)) return;
    try {
      await adminApi.deleteCustomer(id);
      toast.success(`Removed customer ${name} from database`);
      loadCustomers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete customer");
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const nameMatch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = (c.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const phoneMatch = (c.phoneNumber || "").toLowerCase().includes(searchQuery.toLowerCase());
    const locationMatch = (c.district || "").toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || emailMatch || phoneMatch || locationMatch;
  });

  return (
    <Box sx={{ p: 4, background: "#fafafa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="800" sx={{ color: "#1b5e20", mb: 4 }}>
        Customer Directory 👤
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
                <TableCell sx={{ fontWeight: "bold" }}>Customer ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Contact Info</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>#CST-{customer.id}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{customer.name}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{customer.email}</Typography>
                      <Typography variant="caption" color="text.secondary">{customer.phoneNumber}</Typography>
                    </TableCell>
                    <TableCell>{customer.district || "N/A"}</TableCell>
                    <TableCell align="center">
                      <IconButton color="error" onClick={() => handleDelete(customer.id, customer.name)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    No registered customers match your search.
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

export default CustomerManagement;