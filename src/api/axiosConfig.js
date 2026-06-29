import axios from "axios";
import { toast } from "react-toastify";

const axiosConfig = axios.create({

  baseURL: "http://localhost:8098/api",

  timeout: 15000,

  headers: {
    "Content-Type": "application/json"
  },

  withCredentials: true

});


// ================= REQUEST INTERCEPTOR =================

axiosConfig.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem("token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    console.log(
      `API Request: ${config.method?.toUpperCase()} ${config.url}`
    );

    return config;

  },

  (error) => {

    console.error(
      "Request Error:",
      error
    );

    return Promise.reject(error);

  }

);


// ================= RESPONSE INTERCEPTOR =================

axiosConfig.interceptors.response.use(

  (response) => {

    console.log(
      `API Success: ${response.config.url}`
    );

    return response;

  },

  (error) => {

    console.error(
      "API Error:",
      error
    );

    // Unauthorized

    if (error.response?.status === 401) {

      toast.error(
        "Session Expired. Please Login Again."
      );

      localStorage.removeItem("token");
      localStorage.removeItem("role");

      setTimeout(() => {

        window.location.href = "/login";

      }, 1500);

    }

    // Forbidden

    else if (error.response?.status === 403) {

      toast.error(
        "Access Denied"
      );

    }

    // Not Found

    else if (error.response?.status === 404) {

      toast.error(
        "Resource Not Found"
      );

    }

    // Server Error

    else if (error.response?.status === 500) {

      toast.error(
        "Internal Server Error"
      );

    }

    // Network Error

    else if (!error.response) {

      toast.error(
        "Backend Server Not Running"
      );

    }

    return Promise.reject(error);

  }

);

export default axiosConfig;