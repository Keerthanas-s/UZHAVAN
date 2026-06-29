import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import cartReducer from "./cart/cartSlice";
import orderReducer from "./order/orderSlice";
import productReducer from "./product/productSlice";
import chatReducer from "./chat/chatSlice";
import priceReducer from "./price/priceSlice";

export const store = configureStore({

    reducer: {

        auth: authReducer,

        cart: cartReducer,

        order: orderReducer,

        product: productReducer,

        chat: chatReducer,

        price: priceReducer,

    }

});

export default store;