import React from "react";
import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Box
} from "@mui/material";
import {
  Dashboard,
  Agriculture,
  People,
  ShoppingCart,
  Assessment,
  TrendingUp,
  Settings,
  Logout,
  Inventory,
  Chat,
  AttachMoney,
  Person,
  Favorite,
  Notifications
} from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const drawerWidth = 240;

function Sidebar({ mobileOpen, handleDrawerToggle }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "CUSTOMER";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ================= ADMIN =================
  const adminMenu = [
    { title: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
    { title: "Posts", icon: <Assessment />, path: "/admin/posts" },
    { title: "Prices", icon: <TrendingUp />, path: "/admin/prices" },
    { title: "Farmers", icon: <Agriculture />, path: "/admin/farmers" },
    { title: "Customers", icon: <People />, path: "/admin/customers" },
    { title: "Orders", icon: <ShoppingCart />, path: "/admin/orders" },
    { title: "Analytics", icon: <TrendingUp />, path: "/admin/analytics" },
    { title: "Reports", icon: <Assessment />, path: "/admin/reports" },
    { title: "Settings", icon: <Settings />, path: "/admin/settings" }
  ];

  // ================= FARMER =================
  const farmerMenu = [
    { title: "Dashboard", icon: <Dashboard />, path: "/farmer/dashboard" },
    { title: "Crop Inventory", icon: <Inventory />, path: "/farmer/products" },
    { title: "Posts", icon: <Assessment />, path: "/farmer/posts" },
    { title: "Orders", icon: <ShoppingCart />, path: "/farmer/orders" },
    { title: "Customers", icon: <People />, path: "/farmer/customers" },
    { title: "Messages", icon: <Chat />, path: "/farmer/messages" },
    { title: "Price Tracker", icon: <TrendingUp />, path: "/farmer/prices" },
    { title: "Earnings", icon: <AttachMoney />, path: "/farmer/earnings" },
    { title: "Profile", icon: <Person />, path: "/farmer/profile" },
    { title: "Settings", icon: <Settings />, path: "/farmer/settings" }
  ];

  // ================= CUSTOMER =================
  const customerMenu = [
    { title: "Dashboard", icon: <Dashboard />, path: "/customer/dashboard" },
    { title: "Products", icon: <Inventory />, path: "/customer/products" },
    { title: "Posts", icon: <Assessment />, path: "/customer/posts" },
    { title: "Price Tracker", icon: <TrendingUp />, path: "/customer/prices" },
    { title: "Cart", icon: <ShoppingCart />, path: "/customer/cart" },
    { title: "Orders", icon: <Assessment />, path: "/customer/orders" },
    { title: "Wishlist", icon: <Favorite />, path: "/customer/wishlist" },
    { title: "Messages", icon: <Chat />, path: "/customer/messages" },
    { title: "Notifications", icon: <Notifications />, path: "/customer/notifications" },
    { title: "Profile", icon: <Person />, path: "/customer/profile" },
    { title: "Settings", icon: <Settings />, path: "/customer/settings" }
  ];

  let menu = customerMenu;
  if (role === "ADMIN") menu = adminMenu;
  if (role === "FARMER") menu = farmerMenu;

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3, pt: "80px", boxSizing: "border-box" }}>
      {/* Brand Header */}
      <Toolbar sx={{ display: "flex", gap: 1.5, alignItems: "center", p: "0 !important", mb: 4 }}>
        <Avatar sx={{ bgcolor: "#2E7D32", width: 44, height: 44, fontSize: "1.1rem", fontWeight: "bold" }}>
          🌾
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="900" sx={{ fontFamily: "'Outfit', sans-serif", color: "#2e7d32", letterSpacing: "-0.5px" }}>
            UZHAVAN
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: "700", color: "#888", textTransform: "uppercase", fontSize: "0.6rem", letterSpacing: "0.5px" }}>
            {role} PORTAL
          </Typography>
        </Box>
      </Toolbar>

      {/* Menu Options */}
      <List sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5, p: 0, overflowY: "auto" }}>
        {menu.map((item) => (
          <NavLink key={item.title} to={item.path} style={{ textDecoration: "none", color: "inherit" }}>
            {({ isActive }) => (
              <ListItemButton
                selected={isActive}
                sx={{
                  bgcolor: isActive ? "rgba(46,125,50,0.06) !important" : "transparent",
                  color: isActive ? "#000000 !important" : "#4d4d4d !important",
                  "& .MuiListItemIcon-root": {
                    color: isActive ? "#2e7d32 !important" : "#2d2d2d !important",
                    minWidth: 38,
                  },
                  "& .MuiTypography-root": {
                    fontWeight: isActive ? "800 !important" : "500 !important",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem"
                  },
                  borderRadius: "12px",
                  py: 1.2,
                  px: 1.8,
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.04) !important",
                    transform: "scale(1.02)",
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </List>

      {/* Logout Row */}
      <Box sx={{ pt: 2 }}>
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: "12px",
            color: "#d32f2f",
            px: 1.8,
            transition: "all 0.2s",
            "& .MuiListItemIcon-root": {
              color: "#d32f2f",
              minWidth: 38,
            },
            "&:hover": {
              bgcolor: "rgba(211,47,47,0.06)",
              transform: "scale(1.02)",
            }
          }}
        >
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontWeight: "700",
              fontSize: "0.9rem",
              fontFamily: "'Inter', sans-serif"
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box"
          }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #dbdbdb",
            boxShadow: "none",
            backgroundColor: "#ffffff"
          }
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export default Sidebar;