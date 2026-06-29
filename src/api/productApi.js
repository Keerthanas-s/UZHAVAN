import axiosConfig from "./axiosConfig";

const productApi = {

    getProducts() {
        return axiosConfig.get("/products");
    },

    getProduct(id) {
        return axiosConfig.get(`/products/${id}`);
    },

};

export default productApi;