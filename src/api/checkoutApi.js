import axiosConfig from "./axiosConfig";

const checkoutApi = {

    checkout: (data) => {
        return axiosConfig.post("/checkout", data);
    }

};

export default checkoutApi;