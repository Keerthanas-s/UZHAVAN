import { useEffect, useState } from "react";
import cartApi from "../api/cartApi";

export default function useCart() {

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {

        try {

            setLoading(true);

            const response = await cartApi.getCart();

            setCartItems(response.data);

        } catch (err) {

            setError(err.response?.data?.message || "Unable to load cart");

        } finally {

            setLoading(false);

        }

    };

    const addToCart = async (cropId, quantity) => {

        try {

            await cartApi.addToCart({
                cropId,
                quantity
            });

            loadCart();

        } catch (err) {

            setError(err.response?.data?.message);

        }

    };

    const updateQuantity = async (cartId, quantity) => {

        try {

            await cartApi.updateQuantity(cartId, quantity);

            loadCart();

        } catch (err) {

            setError(err.response?.data?.message);

        }

    };

    const removeItem = async (cartId) => {

        try {

            await cartApi.removeItem(cartId);

            loadCart();

        } catch (err) {

            setError(err.response?.data?.message);

        }

    };

    const clearCart = async () => {

        try {

            await cartApi.clearCart();

            setCartItems([]);

        } catch (err) {

            setError(err.response?.data?.message);

        }

    };

    return {

        cartItems,
        loading,
        error,
        loadCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart

    };

}