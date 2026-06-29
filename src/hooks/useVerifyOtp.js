import { useState } from "react";
import authApi from "../api/authApi";

export default function useVerifyOtp() {

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const verifyOtp = async (data) => {

        try {

            setLoading(true);
            setSuccess("");
            setError("");

            const response = await authApi.verifyOtp(data);

            setSuccess(response.data.message);

            return response.data;

        } catch (err) {

            setError(err.response?.data?.message || "Invalid OTP");
            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        verifyOtp,
        loading,
        success,
        error
    };

}