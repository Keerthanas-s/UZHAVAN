import { createSlice } from "@reduxjs/toolkit";

const priceSlice = createSlice({

    name: "price",

    initialState: {

        prices: []

    },

    reducers: {

        setPrices(state, action) {

            state.prices = action.payload;

        }

    }

});

export const {

    setPrices

} = priceSlice.actions;

export default priceSlice.reducer;