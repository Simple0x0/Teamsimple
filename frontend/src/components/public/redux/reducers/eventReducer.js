import { createSlice } from '@reduxjs/toolkit';
import { fetchEvents } from '../actions/eventActions';

const initialState = {
  events: [],
  loading: false,
  error: null,
  success: false,
  lastFetched: null, // TO BE IMPLEMENTED LATER
};

const eventReducer = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.events = payload;
        state.success = true;
      })
      .addCase(fetchEvents.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default eventReducer.reducer;
