import { createSlice } from '@reduxjs/toolkit';
import { fetchWriteups } from '../actions/writeupActions';

const initialState = {
  writeups: [],
  loading: false,
  error: null,
  success: false,
};

const writeupReducer = createSlice({
  name: 'writeups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWriteups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWriteups.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.writeups = payload;
        state.success = true;
      })
      .addCase(fetchWriteups.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default writeupReducer.reducer;
