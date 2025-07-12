import { createSlice } from '@reduxjs/toolkit';
import { fetchLatest } from '../actions/latestActions';

const initialState = {
  latest: [],
  loading: false,
  error: null,
  success: false,
  lastFetched: null, // TO BE IMPLEMENTED LATER
};

const latestReducer = createSlice({
  name: 'latest',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatest.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.latest = payload;
        state.success = true;
      })
      .addCase(fetchLatest.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default latestReducer.reducer;
