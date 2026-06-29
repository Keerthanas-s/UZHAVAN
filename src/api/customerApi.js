// src/api/customerApi.js
import axiosConfig from "./axiosConfig";

const customerApi = {
  // Products
  getProducts: () => {
    return axiosConfig.get("/products");
  },

  searchProducts: (keyword) => {
    return axiosConfig.get(`/products/search?name=${keyword}`);
  },

  // Orders
  placeOrder: (data) => {
    // Expected parameters: customerId, productId, orderedQuantity, deliveryAddress
    const customerId = localStorage.getItem("userId");
    return axiosConfig.post("/orders", {
      customerId: customerId,
      productId: data.productId,
      orderedQuantity: data.orderedQuantity,
      deliveryAddress: data.deliveryAddress,
    });
  },

  getOrders: () => {
    const customerId = localStorage.getItem("userId");
    return axiosConfig.get(`/orders/customer/${customerId}`);
  },

  // Messages
  getMessages: () => {
    const customerId = localStorage.getItem("userId");
    return axiosConfig.get(`/messages/inbox?receiverType=CUSTOMER&receiverId=${customerId}`);
  },

  sendMessage: (data) => {
    // Expected fields in Message: senderType, senderId, receiverType, receiverId, content
    const customerId = localStorage.getItem("userId");
    return axiosConfig.post("/messages", {
      senderType: "CUSTOMER",
      senderId: customerId,
      receiverType: "FARMER",
      receiverId: data.receiverId,
      content: data.content,
    });
  },

  // Profile
  getProfile: () => {
    const customerId = localStorage.getItem("userId");
    return axiosConfig.get(`/customers/${customerId}`);
  },

  updateProfile: (data) => {
    const customerId = localStorage.getItem("userId");
    return axiosConfig.put(`/customers/${customerId}`, data);
  },

  getConversation: (farmerId) => {
    const customerId = localStorage.getItem("userId");
    return axiosConfig.get(`/messages/conversation?type1=CUSTOMER&id1=${customerId}&type2=FARMER&id2=${farmerId}`);
  },
};

export default customerApi;