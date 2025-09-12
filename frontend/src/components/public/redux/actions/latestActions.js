import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const backendURL = import.meta.env.VITE_API_URL;

export const fetchLatest = createAsyncThunk(
  'latest/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendURL}/api/home_latest`, {
        headers: {
          Accept: 'application/json'
        },
      });
      return response.data.Latest; 
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'No latest content found'
      );
    }
  }
);
