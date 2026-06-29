import { useState } from "react";
import cropApi from "../api/cropApi";

export default function useUpdateCrop() {

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const updateCrop = async (id, cropData) => {

        try {

            setLoading(true);
            setSuccess("");
            setError("");

            const response = await cropApi.updateCrop(id, cropData);

            setSuccess(response.data.message || "Crop updated successfully");

            return response.data;

        } catch (err) {

            setError(err.response?.data?.message || "Failed to update crop");
            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        updateCrop,
        loading,
        success,
        error
    };

}