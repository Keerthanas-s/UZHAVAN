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
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import axiosConfig from "../../api/axiosConfig";

function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const statusOptions = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosConfig.get("/orders");
      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Failed to load orders from database:", error);
      toast.error("Failed to fetch order history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosConfig.put(`/orders/${orderId}/status?status=${newStatus}`);
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
      loadOrders();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    }
  };

  return (
    <Box sx={{ p: 4, background: "#fafafa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="800" sx={{ color: "#1b5e20", mb: 4 }}>
        Orders Database 📦
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
                <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Product Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">Quantity</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">Total Value</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Delivery Address</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">Order Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell sx={{ fontWeight: "bold", color: "#2e7d32" }}>#ORD-{order.id}</TableCell>
                    <TableCell>
                      {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "Recent"}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600">{order.customer?.name || "Customer"}</Typography>
                      <Typography variant="caption" color="text.secondary">{order.customer?.phoneNumber}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600">{order.product?.name || "Produce"}</Typography>
                      <Typography variant="caption" color="text.secondary">Farmer: {order.farmer?.name}</Typography>
                    </TableCell>
                    <TableCell align="center">{order.orderedQuantity} {order.product?.unit || "kg"}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold", color: "#1b5e20" }}>
                      ₹{order.totalPrice}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {order.deliveryAddress}
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={order.status || "PENDING"}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          sx={{
                            borderRadius: "8px",
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                            color:
                              order.status === "DELIVERED"
                                ? "#2e7d32"
                                : order.status === "CANCELLED"
                                ? "#d32f2f"
                                : "#ffa000",
                          }}
                        >
                          {statusOptions.map((opt) => (
                            <MenuItem key={opt} value={opt} sx={{ fontWeight: "bold", fontSize: "0.85rem" }}>
                              {opt}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    No orders registered in database.
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

export default OrdersManagement;