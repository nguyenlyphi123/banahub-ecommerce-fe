import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './reducers/cartSlice';
import typeProducer from './reducers/typeSlice';

// Store
const store = configureStore({
  reducer: {
    typeProducer,
    cartReducer,
  },
});

// Export
export default store;
