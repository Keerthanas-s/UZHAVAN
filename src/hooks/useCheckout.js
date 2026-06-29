import { useState } from "react";
import checkoutApi from "../api/checkoutApi";

export default function useCheckout() {

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const checkout = async (checkoutData) => {

        try {

            setLoading(true);
            setSuccess("");
            setError("");

            const response = await checkoutApi.checkout(checkoutData);

            setSuccess("Order placed successfully");

            return response.data;

        } catch (err) {

            setError(err.response?.data?.message || "Checkout failed");

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {

        checkout,
        loading,
        success,
        error

    };

}