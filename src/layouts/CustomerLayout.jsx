import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Home,
  HomeOutlined,
  Inventory,
  Inventory2Outlined,
  PhotoLibrary,
  PhotoLibraryOutlined,
  TrendingUp,
  TrendingUpOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
  ReceiptLong,
  ReceiptLongOutlined,
  Favorite,
  FavoriteBorder,
  Mail,
  MailOutline,
  Notifications,
  NotificationsOutlined,
  AccountCircle,
  AccountCircleOutlined,
} from "@mui/icons-material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Home", path: "/customer/dashboard", icon: <HomeOutlined />, activeIcon: <Home /> },
    { text: "Products", path: "/customer/products", icon: <Inventory2Outlined />, activeIcon: <Inventory /> },
    { text: "Posts", path: "/customer/posts", icon: <PhotoLibraryOutlined />, activeIcon: <PhotoLibrary /> },
    { text: "Price Tracker", path: "/customer/prices", icon: <TrendingUpOutlined />, activeIcon: <TrendingUp /> },
    { text: "Cart", path: "/customer/cart", icon: <ShoppingCartOutlined />, activeIcon: <ShoppingCart /> },
    { text: "Orders", path: "/customer/orders", icon: <ReceiptLongOutlined />, activeIcon: <ReceiptLong /> },
    { text: "Wishlist", path: "/customer/wishlist", icon: <FavoriteBorder />, activeIcon: <Favorite /> },
    { text: "Messages", path: "/customer/messages", icon: <MailOutline />, activeIcon: <Mail /> },
    { text: "Notifications", path: "/customer/notifications", icon: <NotificationsOutlined />, activeIcon: <Notifications /> },
    { text: "Profile", path: "/customer/profile", icon: <AccountCircleOutlined />, activeIcon: <AccountCircle /> },
  ];

  return (
    <Box sx={{ display: "flex", bgcolor: "#fafafa", minHeight: "100vh" }}>
      {/* Instagram-Style Left Sidebar */}
      <Box
        sx={{
          width: 240,
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bgcolor: "#ffffff",
          borderRight: "1px solid #dbdbdb",
          display: "flex",
          flexDirection: "column",
          p: 3,
          boxSizing: "border-box",
          zIndex: 1100,
        }}
      >
        {/* Dynamic Logo */}
        <Typography
          variant="h5"
          fontWeight="900"
          onClick={() => navigate("/customer/dashboard")}
          sx={{
            color: "#2e7d32",
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: "-0.5px",
            mb: 4,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.05)" },
          }}
        >
          🌾 Uzhavan
        </Typography>

        {/* Navigation list */}
        <List sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5, p: 0, overflowY: "auto" }}>
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <ListItemButton
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  py: 1,
                  px: 1.8,
                  borderRadius: "12px",
                  color: isActive ? "#000000" : "#4d4d4d",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.04)",
                    transform: "scale(1.02)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 38,
                    color: isActive ? "#2e7d32" : "#2d2d2d",
                  }}
                >
                  {isActive ? item.activeIcon : item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: isActive ? "800" : "500",
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          marginLeft: "240px",
          p: 0,
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default CustomerLayout;