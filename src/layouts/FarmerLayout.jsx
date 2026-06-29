import React, { useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
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
  ReceiptLong,
  ReceiptLongOutlined,
  Mail,
  MailOutline,
  AccountBalanceWallet,
  AccountBalanceWalletOutlined,
  AccountCircle,
  AccountCircleOutlined,
  Settings,
  SettingsOutlined,
  Menu,
  Close,
} from "@mui/icons-material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 240;
const globalFont = "system-ui, -apple-system, sans-serif";

function FarmerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Dashboard", path: "/farmer/dashboard", icon: <HomeOutlined />, activeIcon: <Home /> },
    { text: "Products", path: "/farmer/products", icon: <Inventory2Outlined />, activeIcon: <Inventory /> },
    { text: "Posts", path: "/farmer/posts", icon: <PhotoLibraryOutlined />, activeIcon: <PhotoLibrary /> },
    { text: "Price Tracker", path: "/farmer/prices", icon: <TrendingUpOutlined />, activeIcon: <TrendingUp /> },
    { text: "Orders", path: "/farmer/orders", icon: <ReceiptLongOutlined />, activeIcon: <ReceiptLong /> },
    { text: "Messages", path: "/farmer/messages", icon: <MailOutline />, activeIcon: <Mail /> },
    { text: "Earnings", path: "/farmer/earnings", icon: <AccountBalanceWalletOutlined />, activeIcon: <AccountBalanceWallet /> },
    { text: "Profile", path: "/farmer/profile", icon: <AccountCircleOutlined />, activeIcon: <AccountCircle /> },
    { text: "Settings", path: "/farmer/settings", icon: <SettingsOutlined />, activeIcon: <Settings /> },
  ];

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3, boxSizing: "border-box" }}>
      {/* Drawer Header Close Button for Mobile */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography
          variant="h5"
          fontWeight="900"
          onClick={() => {
            navigate("/farmer/dashboard");
            setMobileOpen(false);
          }}
          sx={{
            color: "#2e7d32",
            fontFamily: globalFont,
            letterSpacing: "-0.5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.03)" },
          }}
        >
          🌾 Uzhavan
        </Typography>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ display: { xs: "flex", md: "none" }, border: "1px solid #eee" }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {/* Navigation menuItems list */}
      <List sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.8, p: 0 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.text}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                py: 1.2,
                px: 2,
                borderRadius: "12px",
                color: isActive ? "#000000" : "#4a5568",
                bgcolor: isActive ? "#f1f8e9" : "transparent",
                border: isActive ? "1px solid #e6efe6" : "1px solid transparent",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  bgcolor: isActive ? "#f1f8e9" : "rgba(0,0,0,0.03)",
                  transform: "scale(1.02)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 38,
                  color: isActive ? "#2e7d32" : "#4a5568",
                  transition: "transform 0.2s",
                }}
              >
                {isActive ? item.activeIcon : item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.92rem",
                  fontWeight: isActive ? "800" : "600",
                  fontFamily: globalFont,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", bgcolor: "#f8fafc", minHeight: "100vh", fontFamily: globalFont }}>
      {/* Mobile Top Header Navigation Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: { xs: "block", md: "none" },
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          zIndex: 1090,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, color: "#2e7d32", border: "1px solid #e2e8f0", borderRadius: "10px", p: 0.8 }}
            >
              <Menu />
            </IconButton>
            <Typography
              variant="h6"
              fontWeight="900"
              sx={{ color: "#2e7d32", letterSpacing: "-0.5px", fontFamily: globalFont, cursor: "pointer" }}
              onClick={() => navigate("/farmer/dashboard")}
            >
              🌾 Uzhavan
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              onClick={() => navigate("/farmer/profile")}
              sx={{ width: 34, height: 34, bgcolor: "#2e7d32", fontSize: "0.85rem", fontWeight: "bold", cursor: "pointer" }}
            >
              FM
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar navigation drawers */}
      {/* 1. Temporary Collapsible Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile devices
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, borderRight: "1px solid #e2e8f0" },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* 2. Permanent Desktop Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, borderRight: "1px solid #dbdbdb", bgcolor: "#ffffff" },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: "64px", md: 0 }, // Add top padding on mobile to clear the AppBar
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default FarmerLayout;