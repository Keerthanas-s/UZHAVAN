import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@mui/material";
import { ShoppingBag } from "@mui/icons-material";
import { toast } from "react-toastify";
import customerApi from "../../api/customerApi";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const steps = ["Pending", "Confirmed", "Shipped", "Delivered"];

  const getStepIndex = (status) => {
    const s = (status || "Pending").toLowerCase();
    if (s === "pending") return 0;
    if (s === "confirmed") return 1;
    if (s === "shipped") return 2;
    if (s === "delivered" || s === "completed") return 4; // Highlight all steps
    return 0;
  };

  const loadOrders = () => {
    const customerId = localStorage.getItem("userId");
    if (!customerId) {
      toast.warning("Session expired. Please log out and log back in.");
      return;
    }

    setLoading(true);
    customerApi
      .getOrders()
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          const mapped = res.data.map((o) => ({
            id: o.id,
            date: o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "Recent",
            item: o.product ? `${o.product.name} (${o.orderedQuantity} ${o.product.unit || "kg"})` : "Produce",
            total: `₹${o.totalPrice}`,
            status: o.status ? o.status.charAt(0) + o.status.slice(1).toLowerCase() : "Pending",
          }));
          setOrders(mapped);
        }
      })
      .catch((err) => {
        console.error("Failed to load orders:", err);
        toast.error("Failed to load orders from database");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <Box sx={{ p: 4, background: "#fafafa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="800" sx={{ color: "#1b5e20", mb: 1 }}>
        Track My Orders 📦
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Check shipping updates and status timelines.
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {orders.length > 0 ? (
            orders.map((order) => (
              <Grid item xs={12} key={order.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: "1px solid #e0e0e0",
                    borderRadius: "16px",
                    bgcolor: "#ffffff",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 6px 15px rgba(0,0,0,0.03)",
                    },
                  }}
                >
                  {/* Header */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1, alignItems: "center", mb: 3 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="800" color="#2e7d32">
                        Order #{order.id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Ordered on: {order.date}
                      </Typography>
                    </Box>
                    <Chip
                      label={order.status}
                      color={order.status.toLowerCase() === "delivered" || order.status.toLowerCase() === "completed" ? "success" : "info"}
                      size="small"
                    />
                  </Box>

                  <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1 }}>
                    Items: {order.item}
                  </Typography>
                  <Typography variant="h6" fontWeight="800" sx={{ color: "#1b5e20", mb: 3 }}>
                    Total: {order.total}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {/* Horizontal Tracking Timeline */}
                  <Box sx={{ width: "100%", py: 1 }}>
                    <Stepper activeStep={getStepIndex(order.status)} alternativeLabel>
                      {steps.map((label) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>
                </Paper>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 5, textAlign: "center", border: "1px dashed #bdbdbd", borderRadius: "16px", bgcolor: "#fafafa" }}>
                <ShoppingBag sx={{ fontSize: 48, color: "action.disabled", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" fontWeight="700">
                  No Orders Yet
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