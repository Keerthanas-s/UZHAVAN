import { useEffect, useState } from "react";
import axiosConfig from "../api/axiosConfig";

export default function useFarmerDashboard() {

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            setLoading(true);

            const response = await axiosConfig.get("/farmer/dashboard");

            setDashboard(response.data);

        } catch (err) {

            setError(

                err.response?.data?.message ||

                "Unable to load dashboard"

            );

        } finally {

            setLoading(false);

        }

    };

    return {

        dashboard,

        loading,

        error,

        loadDashboard

    };

}