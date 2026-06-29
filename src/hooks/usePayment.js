import { useState } from "react";
import paymentApi from "../api/paymentApi";

export default function usePayment() {

    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [error, setError] = useState("");

    const makePayment = async (paymentData) => {

        try {

            setLoading(true);
            setError("");

            const response = await paymentApi.makePayment(paymentData);

            setPaymentStatus(response.data.status);

            return response.data;

        } catch (err) {

            setError(err.response?.data?.message || "Payment failed");

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {

        makePayment,
        paymentStatus,
        loading,
        error

    };

}