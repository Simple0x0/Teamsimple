import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFingerprint } from '../../utils/getVisitorInfo';

const backendURL = import.meta.env.VITE_API_URL;

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const f = await getFingerprint();
      const response = await axios.get(`${backendURL}/api/projects`, {
        params: { f }, 
        headers: {
          Accept: 'application/json',
          "ngrok-skip-browser-warning": "69420"
        },
      });
      return response.data.Projects; // assuming server returns { projects: [...] }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch projects'
      );
    }
  }
);
