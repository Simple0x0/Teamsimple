import { createSlice } from '@reduxjs/toolkit';
import { fetchBlogs } from '../actions/blogActions';

const initialState = {
  blogs: [],
  loading: false,
  error: null,
  success: false,
  lastFetched: null, // NEW TO BE IMPLEMENTED LATER
};

const blogReducer = createSlice({
  name: 'blogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.blogs = payload;
        state.success = true;
      })
      .addCase(fetchBlogs.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default blogReducer.reducer;
