import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const productExist = state.cart.findIndex(
        (item) => item._id === action.payload._id,
      );

      if (productExist >= 0) {
        state.cart[productExist].cart_quantity += 1;
      } else {
        const productTmp = { ...action.payload, cart_quantity: 1 };
        state.cart.push(productTmp);
      }
    },
    updateQuantity: (state, action) => {
      const productExist = state.cart.findIndex(
        (item) => item._id === action.payload.id,
      );

      if (productExist >= 0) {
        state.cart[productExist].cart_quantity = action.payload.cart_quantity;
      }
    },
    removeFromCart: (state, action) => {
      const productExist = state.cart.find(
        (item) => item._id === action.payload,
      );

      if (productExist)
        state.cart = state.cart.filter(
          (product) => product._id !== action.payload,
        );
    },
    deleteCart: (state, action) => {
      state.cart = [];
    },
  },
});

// Reducer
const cartReducer = cartSlice.reducer;

// Selector
export const cartSelector = (state) => state.cartReducer.cart;

// Export action
export const { addToCart } = cartSlice.actions;
export const { removeFromCart } = cartSlice.actions;
export const { updateQuantity } = cartSlice.actions;
export const { deleteCart } = cartSlice.actions;

// Export reducer
export default cartReducer;
