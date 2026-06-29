import { useState } from "react";
import authApi from "../api/authApi";

export default function useForgotPassword() {

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const forgotPassword = async (email) => {

        try {

            setLoading(true);
            setSuccess("");
            setError("");

            const response = await authApi.forgotPassword(email);

            setSuccess(response.data.message);

        } catch (err) {

            setError(err.response?.data?.message || "Something went wrong");

        } finally {

            setLoading(false);

        }

    };

    return {
        forgotPassword,
        loading,
        success,
        error
    };

}