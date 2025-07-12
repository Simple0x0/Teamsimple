import { createSlice } from '@reduxjs/toolkit';
import { fetchProjects } from '../actions/projectActions';

const initialState = {
  projects: [],
  loading: false,
  error: null,
  success: false,
};

const projectReducer = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.projects = payload;
        state.success = true;
      })
      .addCase(fetchProjects.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default projectReducer.reducer;
