import { useState } from "react";
import cropApi from "../api/cropApi";

export default function useAddCrop() {

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const addCrop = async (cropData) => {

        try {

            setLoading(true);
            setSuccess("");
            setError("");

            const response = await cropApi.addCrop(cropData);

            setSuccess(response.data.message || "Crop added successfully");

            return response.data;

        } catch (err) {

            setError(err.response?.data?.message || "Failed to add crop");
            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        addCrop,
        loading,
        success,
        error
    };

}