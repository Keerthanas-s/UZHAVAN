import { useState } from "react";
import authApi from "../api/authApi";

export default function useResetPassword() {

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const resetPassword = async (data) => {

        try {

            setLoading(true);
            setSuccess("");
            setError("");

            const response = await authApi.resetPassword(data);

            setSuccess(response.data.message);

            return response.data;

        } catch (err) {

            setError(err.response?.data?.message || "Password reset failed");
            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        resetPassword,
        loading,
        success,
        error
    };

}