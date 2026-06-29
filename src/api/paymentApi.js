import axiosConfig from "./axiosConfig";

const paymentApi = {

    makePayment: (data) => {
        return axiosConfig.post("/payments", data);
    }

};

export default paymentApi;