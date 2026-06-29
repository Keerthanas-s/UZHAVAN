import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import authApi from "../../api/authApi";
import "./Login.css";
import loginBg from "../../assets/images/uzhavan.png";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    role: "FARMER",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleTabChange = (selectedRole) => {
    setForm({
      role: selectedRole,
      username: "",
      email: "",
      password: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.role === "ADMIN" && !form.username) {
      toast.error("Please enter admin username");
      return;
    }
    if (form.role !== "ADMIN" && !form.email) {
      toast.error("Please enter email address");
      return;
    }
    if (!form.password) {
      toast.error("Please enter password");
      return;
    }

    try {
      setLoading(true);
      const response = await authApi.login(form);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      localStorage.setItem("role", response.data.role || form.role);
      localStorage.setItem("userId", response.data.id || "");
      localStorage.setItem("user", JSON.stringify(response.data.user || {}));

      toast.success("Login Successful");

      if (form.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (form.role === "FARMER") {
        navigate("/farmer/dashboard");
      } else if (form.role === "CUSTOMER") {
        navigate("/customer/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  // Dynamically compute titles based on active role selection
  const getRoleTitle = () => {
    if (form.role === "FARMER") return "Farmer Login";
    if (form.role === "CUSTOMER") return "Buyer Login";
    return "Admin Login";
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${loginBg})`,
      }}
    >
      <div className="wrapper">
        {/* Left Informative Content Section */}
        <div className="left">
          <div className="logo">
            <span className="logo-icon">🌾</span>
            <span className="logo-text">UZHAVAN</span>
          </div>

          <div className="badge">Agriculture 4.0 Platform</div>

          <h1>
            Connecting <span className="green-text">Farmers</span>, Buyers & Communities
          </h1>

          <p>
            A modern digital ecosystem helping farmers sell directly, buyers source quality products,
            and communities thrive through technology.
          </p>

          <div className="stats">
            <div className="stat-box">
              <h2>25K+</h2>
              <span>Farmers</span>
            </div>
            <div className="stat-box">
              <h2>10K+</h2>
              <span>Buyers</span>
            </div>
            <div className="stat-box">
              <h2>500+</h2>
              <span>Communities</span>
            </div>
          </div>
        </div>

        {/* Right Active Login Form Card */}
        <div className="login-card">
          <h2>{getRoleTitle()}</h2>
          <div className="subtitle">Welcome back to UZHAVAN</div>

          {/* Role selection tab buttons */}
          <div className="tabs">
            <button
              type="button"
              className={form.role === "FARMER" ? "active" : ""}
              onClick={() => handleTabChange("FARMER")}
            >
              Farmer
            </button>
            <button
              type="button"
              className={form.role === "CUSTOMER" ? "active" : ""}
              onClick={() => handleTabChange("CUSTOMER")}
            >
              Buyer
            </button>
            <button
              type="button"
              className={form.role === "ADMIN" ? "active" : ""}
              onClick={() => handleTabChange("ADMIN")}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Conditional input fields */}
            {form.role === "ADMIN" ? (
              <div className="input-box">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
            ) : (
              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="options">
              <label>
                <input type="checkbox" /> Remember
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); toast.info("Password recovery feature coming soon!"); }}>
                Forgot?
              </a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <CircularProgress size={20} color="inherit" /> : "Login Securely →"}
            </button>
          </form>

          {/* Mock Social Signins */}
          <div className="social">
            <button type="button" onClick={() => toast.info("Google sign-in is a mock interface for demo purposes")}>
              Google
            </button>
            <button type="button" onClick={() => toast.info("Microsoft sign-in is a mock interface for demo purposes")}>
              Microsoft
            </button>
          </div>

          {/* Conditional Register Navigation */}
          {form.role !== "ADMIN" && (
            <div className="register">
              Don't have an account?{" "}
              {form.role === "CUSTOMER" ? (
                <Link to="/customer/register">Register</Link>
              ) : (
                <Link to="/register">Register</Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;