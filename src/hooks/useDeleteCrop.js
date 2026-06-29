import { useState } from "react";
import cropApi from "../api/cropApi";

export default function useDeleteCrop() {

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const deleteCrop = async (id) => {

        try {

            setLoading(true);
            setSuccess("");
            setError("");

            const response = await cropApi.deleteCrop(id);

            setSuccess(response.data.message || "Crop deleted successfully");

            return response.data;

        } catch (err) {

            setError(err.response?.data?.message || "Failed to delete crop");
            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        deleteCrop,
        loading,
        success,
        error
    };

}