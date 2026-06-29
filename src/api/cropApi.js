import axiosConfig from "./axiosConfig";

const cropApi = {

    getAll: () => {
        return axiosConfig.get("/crops");
    },

    getCropById: (id) => {
        return axiosConfig.get(`/crops/${id}`);
    },

    addCrop: (data) => {
        return axiosConfig.post("/crops", data);
    },

    updateCrop: (id, data) => {
        return axiosConfig.put(`/crops/${id}`, data);
    },

    deleteCrop: (id) => {
        return axiosConfig.delete(`/crops/${id}`);
    }

};

export default cropApi;