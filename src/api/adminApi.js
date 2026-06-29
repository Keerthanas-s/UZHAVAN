// src/api/adminApi.js
import axiosConfig from "./axiosConfig";

const adminApi = {
  getDashboard: () => {
    return axiosConfig.get("/admin/dashboard");
  },

  getPendingFarmers: () => {
    return axiosConfig.get("/admin/farmers/pending");
  },

  approveFarmer: (id) => {
    return axiosConfig.put(`/admin/farmers/${id}/approve`);
  },

  rejectFarmer: (id) => {
    return axiosConfig.put(`/admin/farmers/${id}/reject`);
  },

  deleteFarmer: (id) => {
    return axiosConfig.delete(`/admin/farmers/${id}`);
  },

  deleteCustomer: (id) => {
    return axiosConfig.delete(`/admin/customers/${id}`);
  },

  getFarmers: () => {
    // Falls back to retrieving all farmers
    return axiosConfig.get("/farmers");
  },

  getCustomers: () => {
    // Falls back to retrieving all customers
    return axiosConfig.get("/customers");
  },
};

export default adminApi;