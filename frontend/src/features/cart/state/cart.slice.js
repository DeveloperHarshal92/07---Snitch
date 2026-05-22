import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    totalPrice: null,
    currency: null,
    items: [],
  },
  reducers: {
    setCart: (state, action) => {
      state.totalPrice = action.payload.totalPrice;
      state.currency = action.payload.currency;
      state.items = action.payload.items;
    },
    addToCart: (state, action) => {
      state.items.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
  },
});

export const { setCart, addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
