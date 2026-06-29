import { useEffect, useState } from "react";
import orderApi from "../api/orderApi";

export default function useOrders() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {

        fetchOrders();

    }, []);

    const fetchOrders = async () => {

        const response = await orderApi.getOrders();

        setOrders(response.data);

    };

    return {

        orders,
        fetchOrders

    };

}