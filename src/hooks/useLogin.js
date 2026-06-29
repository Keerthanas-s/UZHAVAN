import { useState } from "react";
import authApi from "../api/authApi";

export default function useLogin() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const login = async (data) => {

        try {

            setLoading(true);
            setError("");

            const response = await authApi.login(data);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            return response.data;

        } catch (err) {

            setError(err.response?.data?.message || "Login Failed");
            throw err;

        } finally {

            setLoading(false);

        }
    };

    return {
        login,
        loading,
        error
    };
}