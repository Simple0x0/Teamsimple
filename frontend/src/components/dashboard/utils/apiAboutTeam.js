// utils/apiAboutTeamRequests.js

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

const formatError = (err, defaultMsg = 'Unknown error occurred') => ({
  success: false,
  error: err?.response?.data?.message || err?.response?.data?.error || defaultMsg,
  status: err?.response?.status || 500,
});

// ===============================
// ===== WHO WE ARE API =========
// ===============================

export const fetchAboutTeamContent = async (section) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/aboutteam?section=${section}`, {
      withCredentials: true,
      headers: buildHeaders(),
    });

    return { success: true, data: response.data};
  } catch (err) {
    return formatError(err);
  }
};

export const updateAboutTeamContent = async ({
      title,
      description,
      section,
}) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth/aboutteam`,
      {
        title,
        description,
        section
      },
      {
        withCredentials: true,
        headers: buildCsrfHeaders(),
      }
    );

    return { success: true, data: res.data, status: res.status };
  } catch (err) {
    return formatError(err);
  }
};
