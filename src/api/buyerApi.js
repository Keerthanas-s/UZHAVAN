import axiosConfig from "./axiosConfig";

const buyerApi = {

    getDashboard() {
        return axiosConfig.get("/buyer/dashboard");
    },

    getProducts() {
        return axiosConfig.get("/buyer/products");
    },

    getOrders() {
        return axiosConfig.get("/buyer/orders");
    },

    addToCart(id) {
        return axiosConfig.post(`/buyer/cart/${id}`);
    },

};

export default buyerApi;