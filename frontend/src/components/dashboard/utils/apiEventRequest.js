import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

import getCsrfToken from './csrf.js';


function buildHeaders(extra = {}) {
  return {
    'Content-Type': 'application/json',
    ...extra,
  };
}


function buildCsrfHeaders(extra = {}) {
  const csrfToken = getCsrfToken();
  return {
    'Content-Type': 'application/json',
    ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
    ...extra,
  };
}

const handleError = (err) => {
  throw err.response?.data || { message: err.message };
};

// ========== EVENTS ==========

export const fetchEvents = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/auth/eventsmgmt`, {
      withCredentials: true,
      headers: buildHeaders(),
    });
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const postEvent = async ({
  action = 'new', // 'new', 'edit', 'delete', 'archive', etc.
  event,
  submissionType,
}) => {
  try {
    const body =
      submissionType !== undefined
        ? { action, event, submission_type: submissionType }
        : { action, event };
    const res = await axios.post(
      `${BASE_URL}/api/auth/eventsmgmt`,
      body,
      {
        withCredentials: true,
        headers: buildCsrfHeaders(),
      }
    );
    return { success: true, data: res.data, status: res.status };
  } catch (err) {
    return {
      success: false,
      error: err?.response?.data?.message || err?.response?.data?.error || err.message,
      status: err?.response?.status || 500,
    };
  }
};

export const fetchEventParticipants = async (eventId) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/api/auth/eventsmgmt/participants/${eventId}`,
      {
        withCredentials: true,
        headers: buildHeaders(),
      }
    );
    console.log(res.data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};
