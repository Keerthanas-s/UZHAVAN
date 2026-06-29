import axiosConfig from "./axiosConfig";

const orderApi = {

    getOrders() {
        return axiosConfig.get("/orders");
    },

    getOrder(id) {
        return axiosConfig.get(`/orders/${id}`);
    },

    placeOrder(data) {
        return axiosConfig.post("/orders", data);
    },

};

export default orderApi;