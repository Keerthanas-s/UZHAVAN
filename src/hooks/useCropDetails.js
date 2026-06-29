import { useEffect, useState } from "react";
import cropApi from "../api/cropApi";

export default function useCropDetails(id) {

    const [crop, setCrop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        if (id) {
            fetchCrop();
        }

    }, [id]);

    const fetchCrop = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await cropApi.getCropById(id);

            setCrop(response.data);

        } catch (err) {

            setError(err.response?.data?.message || "Failed to fetch crop");

        } finally {

            setLoading(false);

        }

    };

    return {
        crop,
        loading,
        error,
        fetchCrop
    };

}