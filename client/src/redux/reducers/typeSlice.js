import { createSlice } from '@reduxjs/toolkit';

const typeSlice = createSlice({
  name: 'type',
  initialState: {
    type: {},
  },
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;
    },
  },
});

// Reducer
const typeProducer = typeSlice.reducer;

// Selector
export const typeSelector = (state) => state.typeProducer.type;

// Export action
export const { setType } = typeSlice.actions;

// Export reducer
export default typeProducer;
