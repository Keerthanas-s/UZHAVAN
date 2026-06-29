import { useEffect, useState } from "react";
import cropApi from "../api/cropApi";

export default function useCrops() {

    const [crops, setCrops] = useState([]);

    useEffect(() => {

        fetchCrops();

    }, []);

    const fetchCrops = async () => {

        const response = await cropApi.getAll();

        setCrops(response.data);

    };

    return {

        crops,
        fetchCrops

    };

}