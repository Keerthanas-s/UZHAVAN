// src/api/farmerApi.js
import axiosConfig from "./axiosConfig";

const farmerApi = {
  getProfile: () => {
    const id = localStorage.getItem("userId");
    return axiosConfig.get(`/farmers/${id}`);
  },

  getProducts: () => {
    const id = localStorage.getItem("userId");
    return axiosConfig.get(`/products/farmer/${id}`);
  },

  addProduct: (data) => {
    const id = localStorage.getItem("userId");
    return axiosConfig.post(`/products/farmer/${id}`, data);
  },

  deleteProduct: (id) => {
    return axiosConfig.delete(`/products/${id}`);
  },

  getOrders: () => {
    const id = localStorage.getItem("userId");
    return axiosConfig.get(`/orders/farmer/${id}`);
  },

  updateProfile: (data) => {
    const id = localStorage.getItem("userId");
    return axiosConfig.put(`/farmers/${id}`, data);
  },

  getEarnings: () => {
    const id = localStorage.getItem("userId");
    // If backend doesn't have an explicit earnings controller, we can calculate it from orders
    return axiosConfig.get(`/orders/farmer/${id}`);
  },

  getMessages: () => {
    const id = localStorage.getItem("userId");
    return axiosConfig.get(`/messages/inbox?receiverType=FARMER&receiverId=${id}`);
  },

  sendMessage: (data) => {
    const id = localStorage.getItem("userId");
    return axiosConfig.post("/messages", {
      senderType: "FARMER",
      senderId: Number(id),
      receiverType: "CUSTOMER",
      receiverId: Number(data.receiverId),
      content: data.content,
    });
  },

  getConversation: (customerId) => {
    const id = localStorage.getItem("userId");
    return axiosConfig.get(`/messages/conversation?type1=FARMER&id1=${id}&type2=CUSTOMER&id2=${customerId}`);
  }
};

export default farmerApi;