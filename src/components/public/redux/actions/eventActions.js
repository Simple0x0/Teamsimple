import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const backendURL = import.meta.env.VITE_API_URL;

export const fetchEvents = createAsyncThunk(
  'events/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendURL}/api/events`, {
        headers: {
          Accept: 'application/json',
          "ngrok-skip-browser-warning": "69420"
        },
      });
      return response.data.Events; 
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'No events found'
      );
    }
  }
);
