// utils/apiAchievementRequests.js

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

// ===========================
// ===== ACHIEVEMENTS API ====
// ===========================

export const fetchAchievements = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/achievementmgmt`, {
      withCredentials: true,
      headers: buildHeaders(),
    });

    return response.data.Achievements;

  } catch (err) {
    return formatError(err);
  }
};

export const postAchievement = async ({
  achievementData,
  action = 'new',
  submissionType = 'draft',
}) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth/achievementmgmt`,
      { action, submissionType, achievement: achievementData },
      { withCredentials: true, headers: buildCsrfHeaders() }
    );
    return { success: true, data: res.data, status: res.status };
  } catch (err) {
    return formatError(err);
  }
};

export const deleteAchievement = async ({ achievement, action = 'delete' }) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth/achievementmgmt`,
      { action, achievement },
      { withCredentials: true, headers: buildCsrfHeaders() }
    );
    return { success: true, data: res.data, status: res.status };
  } catch (err) {
    return formatError(err);
  }
};
