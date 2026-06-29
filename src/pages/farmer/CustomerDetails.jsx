import React from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from "@mui/material";
import { Message, Call, LocationOn, LocalMall } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

function CustomerDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get customer info from state or fallback
  const customer = location.state?.customer || {
    name: "Priya Sharma",
    avatar: "PS",
    email: "p.sharma@email.com",
    phone: "+91 98765-43210",
    address: "12, Green Park Society, Pune, Maharashtra - 411001",
    totalOrders: 5,
    totalSpent: "₹1,240",
  };

  const orderHistory = [
    { id: "ORD12345", date: "24 May 2024", item: "Tomato - 10 kg", amount: "₹220" },
    { id: "ORD12340", date: "20 May 2024", item: "Onion - 15 kg", amount: "₹240" },
    { id: "ORD12338", date: "15 May 2024", item: "Potato - 20 kg", amount: "₹480" },
    { id: "ORD12320", date: "10 May 2024", item: "Tomato - 15 kg", amount: "₹300" },
  ];

  return (
    <Box sx={{ p: 4, background: "#fafafa", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <Paper elevation={0} sx={{ width: "100%", maxWidth: "800px", p: 4, border: "1px solid #e0e0e0", borderRadius: "16px" }}>
        {/* Header */}
        <Box sx={{ display: "flex", gap: 3, alignItems: "center", mb: 4, flexWrap: "wrap" }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: "#2e7d32", fontSize: "2rem", fontWeight: "bold" }}>
            {customer.avatar || customer.name.substring(0, 2)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="800">
              {customer.name}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              {customer.email}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Call fontSize="small" /> {customer.phone}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="success"
            startIcon={<Message />}
            onClick={() => navigate("/farmer/chat", { state: { contact: customer } })}
            sx={{ borderRadius: "20px", fontWeight: "bold" }}
          >
            Message Customer
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Address and Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight="800" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOn color="success" /> Delivery Address
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {customer.address}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight="800" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocalMall color="success" /> Purchase Summary
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box sx={{ p: 2, bgcolor: "#f9fbe7", borderRadius: "12px", textAlign: "center", flex: 1 }}>
                <Typography variant="h5" fontWeight="800" sx={{ color: "#2e7d32" }}>
                  {customer.totalOrders}
                </Typography>
                <Typography variant="caption" color="text.secondary">Total Orders</Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: "#f9fbe7", borderRadius: "12px", textAlign: "center", flex: 1 }}>
                <Typography variant="h5" fontWeight="800" sx={{ color: "#2e7d32" }}>
                  {customer.totalSpent}
                </Typography>
                <Typography variant="caption" color="text.secondary">Total Spent</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Order History */}
        <Typography variant="h6" fontWeight="800" sx={{ mb: 2, color: "#1b5e20" }}>
          Order History
        </Typography>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#fafafa" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Items purchased</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderHistory.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ color: "#2e7d32", fontWeight: "bold" }}>{row.id}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.item}</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>{row.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default CustomerDetails;
