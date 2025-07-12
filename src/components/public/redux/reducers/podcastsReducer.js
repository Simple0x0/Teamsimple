import { createSlice } from '@reduxjs/toolkit';
import { fetchPodcasts } from '../actions/podcastActions';

const initialState = {
  podcasts: [],
  loading: false,
  error: null,
  success: false,
};

const podcastReducer = createSlice({
  name: 'podcasts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPodcasts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPodcasts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.podcasts = payload;
        state.success = true;
      })
      .addCase(fetchPodcasts.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default podcastReducer.reducer;
