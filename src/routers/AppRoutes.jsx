import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

// Customer Auth
import CustomerRegister from "../pages/customer/CustomerRegister";
import CustomerLogin from "../pages/customer/CustomerLogin";

// Layouts
import FarmerLayout from "../layouts/FarmerLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import FarmerManagement from "../pages/admin/FarmerManagement";
import CustomerManagement from "../pages/admin/CustomerManagement";
import OrdersManagement from "../pages/admin/OrdersManagement";
import Analytics from "../pages/admin/Analytics";
import Reports from "../pages/admin/Reports";
import Settings from "../pages/admin/Settings";
import AdminPosts from "../pages/admin/Posts";
import AdminPrices from "../pages/admin/Prices";

// Farmer Pages
import FarmerDashboard from "../pages/farmer/FarmerDashboard";
import FarmerProducts from "../pages/farmer/Products";
import Orders from "../pages/farmer/Orders";
import Messages from "../pages/farmer/Messages";
import Chat from "../pages/farmer/Chat";
import Earnings from "../pages/farmer/Earnings";
import PriceTracker from "../pages/farmer/PriceTracker";
import Posts from "../pages/farmer/Posts";
import Profile from "../pages/farmer/Profile";
import FarmerSettings from "../pages/farmer/Settings";
import CustomerDetails from "../pages/farmer/CustomerDetails";

// Customer Pages
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import Products from "../pages/customer/Products";
import Cart from "../pages/customer/Cart";
import CustomerOrders from "../pages/customer/Orders";
import Wishlist from "../pages/customer/Wishlist";
import CustomerMessages from "../pages/customer/Messages";
import Notifications from "../pages/customer/Notifications";
import CustomerProfile from "../pages/customer/Profile";
import CustomerSettings from "../pages/customer/Settings";
import CustomerPosts from "../pages/customer/Posts";
import CustomerPrices from "../pages/customer/PriceTracker";

function AppRoutes() {
  return (
    <Routes>

      {/* Default */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Customer Auth */}
      <Route
        path="/customer/register"
        element={<CustomerRegister />}
      />

      <Route
        path="/customer/login"
        element={<CustomerLogin />}
      />

      {/* Customer */}
      <Route
        path="/customer"
        element={<CustomerLayout />}
      >
        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />

        <Route
          path="dashboard"
          element={<CustomerDashboard />}
        />

        <Route
          path="products"
          element={<Products />}
        />

        <Route
          path="cart"
          element={<Cart />}
        />

        <Route
          path="orders"
          element={<CustomerOrders />}
        />

        <Route
          path="wishlist"
          element={<Wishlist />}
        />

        <Route
          path="messages"
          element={<CustomerMessages />}
        />

        <Route
          path="notifications"
          element={<Notifications />}
        />

        <Route
          path="profile"
          element={<CustomerProfile />}
        />

        <Route
          path="settings"
          element={<CustomerSettings />}
        />

        <Route
          path="posts"
          element={<CustomerPosts />}
        />

        <Route
          path="prices"
          element={<CustomerPrices />}
        />
      </Route>

      {/* Farmer */}
      <Route
        path="/farmer"
        element={<FarmerLayout />}
      >
        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />

        <Route
          path="dashboard"
          element={<FarmerDashboard />}
        />

        <Route
          path="products"
          element={<FarmerProducts />}
        />

        <Route
          path="orders"
          element={<Orders />}
        />

        <Route
          path="messages"
          element={<Messages />}
        />

        <Route
          path="chat"
          element={<Chat />}
        />

        <Route
          path="earnings"
          element={<Earnings />}
        />

        <Route
          path="prices"
          element={<PriceTracker />}
        />

        <Route
          path="posts"
          element={<Posts />}
        />

        <Route
          path="profile"
          element={<Profile />}
        />

        <Route
          path="settings"
          element={<FarmerSettings />}
        />

        <Route
          path="customers"
          element={<CustomerDetails />}
        />
      </Route>

      {/* Admin */}
      <Route
        path="/admin"
        element={<AdminLayout />}
      >
        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />

        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="posts"
          element={<AdminPosts />}
        />

        <Route
          path="prices"
          element={<AdminPrices />}
        />

        <Route
          path="farmers"
          element={<FarmerManagement />}
        />

        <Route
          path="customers"
          element={<CustomerManagement />}
        />

        <Route
          path="orders"
          element={<OrdersManagement />}
        />

        <Route
          path="analytics"
          element={<Analytics />}
        />

        <Route
          path="reports"
          element={<Reports />}
        />

        <Route
          path="settings"
          element={<Settings />}
        />
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          <h1
            style={{
              textAlign: "center",
              marginTop: "50px"
            }}
          >
            404 - Page Not Found
          </h1>
        }
      />

    </Routes>
  );
}

export default AppRoutes;