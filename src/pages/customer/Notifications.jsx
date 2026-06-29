import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  CheckCircle,
  Schedule,
  LocalShipping,
  Cancel,
  NotificationsActive,
} from "@mui/icons-material";
import customerApi from "../../api/customerApi";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const compileNotifications = (orders) => {
    const list = [];
    orders.forEach((o) => {
      let message = "";
      let icon = <Schedule sx={{ color: "#ffa000" }} />;
      let bg = "#fff3e0";

      if (o.status === "PENDING") {
        message = `Your order #ORD-${o.id} for ${o.product?.name || "produce"} (${o.orderedQuantity} ${o.product?.unit || "kg"}) is pending confirmation from the farmer.`;
        icon = <Schedule sx={{ color: "#ffa000" }} />;
        bg = "#fff3e0";
      } else if (o.status === "CONFIRMED") {
        message = `Good news! Your order #ORD-${o.id} for ${o.product?.name} has been CONFIRMED by the farmer.`;
        icon = <CheckCircle sx={{ color: "#1976d2" }} />;
        bg = "#e3f2fd";
      } else if (o.status === "SHIPPED") {
        message = `Out for Delivery: Your order #ORD-${o.id} for ${o.product?.name} has been shipped!`;
        icon = <LocalShipping sx={{ color: "#0288d1" }} />;
        bg = "#e0f7fa";
      } else if (o.status === "DELIVERED") {
        message = `Delivered! Your order #ORD-${o.id} for ${o.product?.name} has been successfully completed.`;
        icon = <CheckCircle sx={{ color: "#2e7d32" }} />;
        bg = "#e8f5e9";
      } else if (o.status === "CANCELLED") {
        message = `Notice: Your order #ORD-${o.id} for ${o.product?.name} has been cancelled.`;
        icon = <Cancel sx={{ color: "#d32f2f" }} />;
        bg = "#ffebee";
      }

      list.push({
        id: o.id,
        message,
        icon,
        bg,
        date: o.orderDate ? new Date(o.orderDate) : new Date(),
      });
    });

    // Sort by most recent date
    return list.sort((a, b) => b.date - a.date);
  };

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await customerApi.getOrders();
      if (response.data && Array.isArray(response.data)) {
        const list = compileNotifications(response.data);
        setNotifications(list);
      }
    } catch (error) {
      console.error("Failed to load notifications from orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <Box sx={{ p: 4, background: "#fafafa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="800" sx={{ color: "#1b5e20", mb: 4 }}>
        Notifications 🔔
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: "16px" }}>
          {notifications.length > 0 ? (
            <List>
              {notifications.map((n, idx) => (
                <React.Fragment key={idx}>
                  <ListItem sx={{ py: 2 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: n.bg, width: 45, height: 45 }}>
                        {n.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="body1" fontWeight="600" color="text.primary">{n.message}</Typography>}
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {n.date.toLocaleString()}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {idx < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 5, textAlign: "center" }}>
              <NotificationsActive sx={{ fontSize: 48, color: "action.disabled", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" fontWeight="700">
                All Caught Up!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You have no notifications at this moment.
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default Notifications;