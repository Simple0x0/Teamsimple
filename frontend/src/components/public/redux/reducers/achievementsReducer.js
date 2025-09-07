import { createSlice } from '@reduxjs/toolkit';
import { fetchAchievements } from '../actions/achievementsActions';

const initialState = {
  achievements: [],
  loading: false,
  error: null,
  success: false,
};

const achievementReducer = createSlice({
  name: 'achievements',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAchievements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAchievements.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.achievements = payload;
        state.success = true;
      })
      .addCase(fetchAchievements.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default achievementReducer.reducer;
