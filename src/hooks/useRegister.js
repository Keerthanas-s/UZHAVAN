import { useState } from "react";
import authApi from "../api/authApi";

export default function useRegister() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const register = async (data) => {

        try {

            setLoading(true);
            setError("");

            const response = await authApi.register(data);

            return response.data;

        } catch (err) {

            setError(err.response?.data?.message || "Registration Failed");
            throw err;

        } finally {

            setLoading(false);

        }
    };

    return {
        register,
        loading,
        error
    };
}