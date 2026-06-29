import axiosConfig from "./axiosConfig";

const cartApi = {

    getCart: () => {
        return axiosConfig.get("/cart");
    },

    addToCart: (data) => {
        return axiosConfig.post("/cart", data);
    },

    updateQuantity: (id, quantity) => {
        return axiosConfig.put(`/cart/${id}`, {
            quantity
        });
    },

    removeItem: (id) => {
        return axiosConfig.delete(`/cart/${id}`);
    },

    clearCart: () => {
        return axiosConfig.delete("/cart");
    }

};

export default cartApi;