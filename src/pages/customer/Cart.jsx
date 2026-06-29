import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Add, Remove, Delete, ShoppingBag } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import orderApi from "../../api/orderApi";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(items);
  }, []);

  const updateQuantity = (id, amount) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const qty = item.quantity + amount;
        return { ...item, quantity: qty > 0 ? qty : 1 };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const filtered = cartItems.filter((item) => item.id !== id);
    setCartItems(filtered);
    localStorage.setItem("cart", JSON.stringify(filtered));
    toast.info("Item removed from cart");
  };

  const computeSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const customerId = localStorage.getItem("userId");
    if (!customerId) {
      toast.error("Please login again to place an order");
      return;
    }

    let userAddress = "Default Address";
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      userAddress = user.address || "Default Address";
    } catch {
      userAddress = "Default Address";
    }

    try {
      // Loop through all items and place individual order transactions in the database
      for (const item of cartItems) {
        await orderApi.placeOrder({
          customerId: Number(customerId),
          productId: Number(item.id),
          orderedQuantity: Number(item.quantity),
          deliveryAddress: userAddress,
        });
      }
      toast.success("Orders placed successfully in database!");
      
      // Clear cart
      setCartItems([]);
      localStorage.removeItem("cart");
      navigate("/customer/orders");
    } catch (err) {
      console.error("Order placement failed:", err);
      const rawError = err.response?.data?.message || err.response?.data?.error || err.response?.data || err.message || "Failed to place order in database";
      const errorString = typeof rawError === "object" ? JSON.stringify(rawError) : String(rawError);
      toast.error(errorString.substring(0, 150));
    }
  };

  const subtotal = computeSubtotal();
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const grandTotal = subtotal + deliveryFee;

  return (
    <Box sx={{ p: 4, background: "#fafafa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="800" sx={{ color: "#1b5e20", mb: 4 }}>
        My Cart 🛒
      </Typography>

      {cartItems.length > 0 ? (
        <Grid container spacing={4}>
          {/* Cart list items */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: "16px" }}>
              <List>
                {cartItems.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    <ListItem
                      secondaryAction={
                        <IconButton edge="end" onClick={() => removeItem(item.id)}>
                          <Delete color="error" />
                        </IconButton>
                      }
                      sx={{ py: 2 }}
                    >
                      <ListItemText
                        primary={<Typography variant="subtitle1" fontWeight="700">{item.name}</Typography>}
                        secondary={
                          <Typography variant="body2" color="success.main" fontWeight="bold">
                            ₹{item.price} / {item.unit || "kg"}
                          </Typography>
                        }
                      />
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mr: 5 }}>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, -1)} sx={{ border: "1px solid #ccc" }}>
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography variant="body1" fontWeight="bold">
                          {item.quantity}
                        </Typography>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, 1)} sx={{ border: "1px solid #ccc" }}>
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItem>
                    {idx < cartItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Pricing breakdown summary */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: "16px", bgcolor: "#ffffff" }}>
              <Typography variant="h6" fontWeight="800" sx={{ mb: 3 }}>
                Order Summary
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography fontWeight="bold">₹{subtotal}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography color="text.secondary">Delivery Charge</Typography>
                <Typography fontWeight="bold">₹{deliveryFee}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
                <Typography variant="h6" fontWeight="800" color="success.main">
                  ₹{grandTotal}
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={handleCheckout}
                sx={{ borderRadius: "12px", py: 1.5, fontWeight: "bold" }}
              >
                Checkout & Place Order
              </Button>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Paper sx={{ p: 5, textAlign: "center", border: "1px dashed #bdbdbd", borderRadius: "16px", bgcolor: "#fafafa" }}>
          <ShoppingBag sx={{ fontSize: 48, color: "action.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" fontWeight="700" sx={{ mb: 1 }}>
            Your Cart is Empty
          </Typography>
          <Button variant="outlined" color="success" onClick={() => navigate("/customer/products")} sx={{ borderRadius: "20px", fontWeight: "bold" }}>
            Start Shopping
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default Cart;