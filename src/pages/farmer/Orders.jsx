import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  LocalShipping,
  Assignment,
  Schedule,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import farmerApi from "../../api/farmerapi";
import axiosConfig from "../../api/axiosConfig";

const globalFont = "system-ui, -apple-system, sans-serif";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    farmerApi
      .getOrders()
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          // Normalize backend structure to display correctly
          const mapped = res.data.map(o => ({
            id: o.id,
            buyer: o.customer?.name || "Customer",
            date: o.orderDate ? new Date(o.orderDate).toLocaleString() : "Recently",
            item: o.product?.name || "Produce",
            weight: `${o.orderedQuantity} ${o.product?.unit || "kg"}`,
            total: `₹${o.totalPrice}`,
            status: o.status || "Pending",
          }));
          setOrders(mapped);
        }
      })
      .catch((err) => {
        console.error("Failed to load farmer orders:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const updateStatus = async (orderId, newStatus) => {
    // Map UI statuses to backend enums
    let statusEnum = "PENDING";
    if (newStatus === "Confirmed") statusEnum = "CONFIRMED";
    if (newStatus === "Rejected") statusEnum = "CANCELLED";
    if (newStatus === "Completed") statusEnum = "DELIVERED";

    try {
      await axiosConfig.put(`/orders/${orderId}/status?status=${statusEnum}`);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update order status");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return order.status.toLowerCase() === "pending";
    if (tabValue === 2) return order.status.toLowerCase() === "confirmed" || order.status.toLowerCase() === "shipped";
    if (tabValue === 3) return order.status.toLowerCase() === "completed" || order.status.toLowerCase() === "delivered";
    return true;
  });

  const getStatusChip = (status) => {
    const s = status.toLowerCase();
    if (s === "pending") {
      return (
        <Chip 
          icon={<Schedule fontSize="small" style={{ color: "#d97706" }} />} 
          label="Pending" 
          sx={{ 
            bgcolor: "#fffbeb", 
            color: "#d97706", 
            borderColor: "#fef3c7", 
            fontFamily: globalFont, 
            fontWeight: "700",
            borderRadius: "6px"
          }} 
          variant="outlined" 
          size="small" 
        />
      );
    } else if (s === "confirmed" || s === "shipped") {
      return (
        <Chip 
          icon={<LocalShipping fontSize="small" style={{ color: "#2563eb" }} />} 
          label={status} 
          sx={{ 
            bgcolor: "#eff6ff", 
            color: "#2563eb", 
            borderColor: "#dbeafe", 
            fontFamily: globalFont, 
            fontWeight: "700",
            borderRadius: "6px"
          }} 
          variant="outlined" 
          size="small" 
        />
      );
    } else {
      return (
        <Chip 
          icon={<CheckCircle fontSize="small" style={{ color: "#166534" }} />} 
          label="Completed" 
          sx={{ 
            bgcolor: "#f0fdf4", 
            color: "#166534", 
            borderColor: "#bbf7d0", 
            fontFamily: globalFont, 
            fontWeight: "700",
            borderRadius: "6px"
          }} 
          variant="outlined"
          size="small" 
        />
      );
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)", minHeight: "100vh", fontFamily: globalFont }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4.5 }}>
        <Box>
          <Typography variant="h4" fontWeight="900" sx={{ color: "#166534", fontFamily: globalFont, letterSpacing: "-0.8px" }}>
            My Orders 📦
          </Typography>
          <Typography color="text.secondary" sx={{ fontFamily: globalFont, fontWeight: "600", fontSize: "0.95rem", mt: 0.5 }}>
            Manage buyer orders, approvals, and fulfillment.
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          color="success" 
          onClick={fetchOrders} 
          size="medium" 
          disabled={loading}
          sx={{ borderRadius: "20px", fontWeight: "800", textTransform: "none", fontFamily: globalFont }}
        >
          {loading ? "Refreshing..." : "Refresh Status"}
        </Button>
      </Box>

      {/* Tabs Menu */}
      <Paper elevation={0} sx={{ borderBottom: 1, borderColor: "divider", mb: 4, borderRadius: "12px", overflow: "hidden", background: "#ffffff", border: "1px solid #e2e8f0" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": { fontWeight: "800", fontFamily: globalFont, textTransform: "none", fontSize: "0.95rem" },
            "& .Mui-selected": { color: "#166534 !important" },
            "& .MuiTabs-indicator": { backgroundColor: "#166534", height: "3px" },
          }}
        >
          <Tab label="All Bookings" />
          <Tab label="Pending Review" />
          <Tab label="In Progress" />
          <Tab label="Flipped/Delivered" />
        </Tabs>
      </Paper>

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress color="success" />
        </Box>
      )}

      {/* Orders List */}
      {!loading && (
        <Grid container spacing={3}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Grid item xs={12} md={6} key={order.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    background: "#ffffff",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      boxShadow: "0 12px 25px rgba(22,101,52,0.04)",
                      borderColor: "#81c784",
                    },
                  }}
                >
                  {/* Order header */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="900" sx={{ color: "#166534", fontFamily: globalFont }}>
                      #ORD-{order.id}
                    </Typography>
                    {getStatusChip(order.status)}
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontFamily: globalFont, fontWeight: "600" }}>
                    Customer: <span style={{ color: "#0f172a", fontWeight: "800" }}>{order.buyer}</span>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontFamily: globalFont, fontWeight: "600" }}>
                    Ordered On: <span style={{ color: "#475569" }}>{order.date}</span>
                  </Typography>

                  <Divider sx={{ my: 2, borderColor: "#f1f5f9" }} />

                  {/* Order details */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="800" sx={{ fontFamily: globalFont, color: "#0f172a", fontSize: "0.95rem" }}>
                        {order.item}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: globalFont, fontWeight: "600" }}>
                        Quantity: {order.weight}
                      </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight="900" sx={{ color: "#166534", fontFamily: globalFont }}>
                      {order.total}
                    </Typography>
                  </Box>

                  {/* Order Actions */}
                  {order.status.toLowerCase() === "pending" && (
                    <Box sx={{ display: "flex", gap: 1.5, mt: 2.5 }}>
                      <Button
                        fullWidth
                        variant="text"
                        startIcon={<CheckCircle />}
                        onClick={() => updateStatus(order.id, "Confirmed")}
                        sx={{ 
                          borderRadius: "10px", 
                          fontWeight: "800",
                          fontFamily: globalFont,
                          textTransform: "none",
                          bgcolor: "#f0fdf4",
                          color: "#166534",
                          border: "1px solid #bbf7d0",
                          py: 1,
                          "&:hover": { bgcolor: "#dcfce7", borderColor: "#166534" }
                        }}
                      >
                        Confirm Booking
                      </Button>
                      <Button
                        fullWidth
                        variant="text"
                        startIcon={<Cancel />}
                        onClick={() => updateStatus(order.id, "Rejected")}
                        sx={{ 
                          borderRadius: "10px", 
                          fontWeight: "800",
                          fontFamily: globalFont,
                          textTransform: "none",
                          bgcolor: "#fef2f2",
                          color: "#ef4444",
                          border: "1px solid #fecaca",
                          py: 1,
                          "&:hover": { bgcolor: "#fee2e2", borderColor: "#ef4444" }
                        }}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}

                  {(order.status.toLowerCase() === "confirmed" || order.status.toLowerCase() === "shipped") && (
                    <Button
                      fullWidth
                      variant="text"
                      startIcon={<CheckCircle />}
                      onClick={() => updateStatus(order.id, "Completed")}
                      sx={{ 
                        mt: 2.5, 
                        borderRadius: "10px", 
                        fontWeight: "800",
                        fontFamily: globalFont,
                        textTransform: "none",
                        bgcolor: "#eff6ff",
                        color: "#2563eb",
                        border: "1px solid #bfdbfe",
                        py: 1,
                        "&:hover": { bgcolor: "#dbeafe", borderColor: "#2563eb" }
                      }}
                    >
                      Mark Completed & Dispatched
                    </Button>
                  )}
                </Paper>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 6, textAlign: "center", borderRadius: "16px", border: "1px dashed #cbd5e1", bgcolor: "#f8fafc" }}>
                <Assignment sx={{ fontSize: 52, color: "action.disabled", mb: 2 }} />
                <Typography variant="h6" color="#0f172a" fontWeight="800" sx={{ fontFamily: globalFont, mb: 0.5 }}>
                  No Orders Found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: globalFont, fontWeight: "600", fontSize: "0.88rem" }}>
                  There are no orders listed under this queue category.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}

export default Orders;