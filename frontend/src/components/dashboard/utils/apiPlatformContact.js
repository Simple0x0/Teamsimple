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

// ================================
// ===== PLATFORM CONTACTS API ====
// ================================

export const fetchPlatformContacts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/contacts`, {
      withCredentials: true,
      headers: buildHeaders(),
    });
    return response.data.contacts;
  } catch (err) {
    return formatError(err);
  }
};

export const updatePlatformContacts = async ({ contacts, action = 'edit' }) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/contacts`,
      { contacts, action },
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