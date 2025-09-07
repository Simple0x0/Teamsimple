// api.js
import axios from 'axios';
import getCsrfToken from './csrf.js';

const BASE_URL = import.meta.env.VITE_API_URL;

/* ====================================================
========================= HEADERS =====================
==================================================== */

/**
 * Build headers dynamically (no CSRF unless required).
 * Good for GET, safe reads, and public requests.
 */
function buildHeaders(extra = {}) {
  return {
    'Content-Type': 'application/json',
    ...extra,
  };
}

/**
 * Build headers for state-changing requests (POST, PUT, DELETE).
 * Automatically attaches CSRF token if present.
 */
function buildCsrfHeaders(extra = {}) {
  const csrfToken = getCsrfToken();
  return {
    'Content-Type': 'application/json',
    ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
    ...extra,
  };
}

/* ====================================================
========================= HELPERS =====================
==================================================== */
const handleError = (err) => {
  throw err.response?.data || { message: err.message } || 'An unknown error occurred';
};

/* ====================================================
========================= AUTH ========================
==================================================== */
export async function userLogin(data) {
  try {
    const res = await axios.post(`${BASE_URL}/api/auth/login`, data, {
      headers: buildCsrfHeaders(),
      withCredentials: true,
    });

    const msg = res.data?.message;
    return { success: true, message: msg, isFirstLogin: res.data?.isFirstLogin };
  } catch (err) {
    handleError(err);
  }
}

export async function resetUserPassword(action, formData) {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth/passwordmgmt`,
      { action, passwords: { old: formData.oldPassword, new: formData.newPassword } },
      { headers: buildCsrfHeaders(), withCredentials: true }
    );

    return { success: true, message: res.data.message };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
}

export async function logout() {
  try {
    await axios.post(
      `${BASE_URL}/api/auth/logout`,
      {},
      { headers: buildCsrfHeaders(), withCredentials: true }
    );
  } catch (err) {
    console.error('Logout failed:', err);
  }
}

export async function authVerify() {
  try {
    const res = await axios.get(`${BASE_URL}/api/auth/verify`, {
      headers: buildHeaders(),
      withCredentials: true,
    });
    return res;
  } catch (err) {
    handleError(err);
  }
}

export async function getCurrentUser() {
  try {
    const res = await axios.get(`${BASE_URL}/api/auth/memberinfo`, {
      headers: buildHeaders(),
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    handleError(err);
  }
}

/* ====================================================
========================= ANALYTICS ===================
==================================================== */
export async function getQuickanalytics() {
  const res = await axios.get(`${BASE_URL}/api/auth/quickanalytics`, {
    headers: buildHeaders(),
    withCredentials: true,
  });
  return res.data;
}

export async function TVisitorsStats() {
  const res = await axios.get(`${BASE_URL}/api/auth/tvisitors`, {
    headers: buildHeaders(),
    withCredentials: true,
  });
  return res.data;
}

export async function VisitorLikeStats({ timeline = 'week' }) {
  const res = await axios.get(`${BASE_URL}/api/auth/visitorslikes`, {
    params: { timeline },
    headers: buildHeaders(),
    withCredentials: true,
  });
  return res.data;
}

export async function TopLikes() {
  const res = await axios.get(`${BASE_URL}/api/auth/toplikes`, {
    headers: buildHeaders(),
    withCredentials: true,
  });
  return res.data;
}

/* ====================================================
========================= TAGS / CATEGORIES ===========
==================================================== */
export const fetchTags = async () => {
  const res = await axios.get(`${BASE_URL}/api/tagscattech`, {
    params: { type: 'tag' },
    headers: buildHeaders(),
  });
  return res.data;
};

export const addTag = async ({ name, type }) => {
  const res = await axios.post(
    `${BASE_URL}/api/tagscattech`,
    { name, type },
    { headers: buildCsrfHeaders(), withCredentials: true }
  );
  return res.data;
};

export const fetchCategories = async () => {
  const res = await axios.get(`${BASE_URL}/api/tagscattech`, {
    params: { type: 'category' },
    headers: buildHeaders(),
  });
  return res.data;
};

export const addCategory = async ({ name, description }) => {
  const res = await axios.post(
    `${BASE_URL}/api/tagscattech`,
    { type: 'category', name, description },
    { headers: buildCsrfHeaders(), withCredentials: true }
  );
  return res.data;
};

export const fetchTechStacks = async () => {
  const res = await axios.get(`${BASE_URL}/api/tagscattech`, {
    params: { type: 'techstack' },
    headers: buildHeaders(),
  });
  return res.data;
};

export const addTechStack = async ({ name, description }) => {
  const res = await axios.post(
    `${BASE_URL}/api/tagscattech`,
    { type: 'techstack', name, description },
    { headers: buildCsrfHeaders(), withCredentials: true }
  );
  return res.data;
};

/* ====================================================
========================= FILE UPLOADS ================
==================================================== */
export const fetchFilesUtil = async ({ type, contentType, uploadKey }) => {
  const res = await fetch(`${BASE_URL}/api/uploads/${type}/${contentType}/${uploadKey}`);
  return res;
};

export const uploadFile = async ({ file, type, contentType, uploadKey }) => {
  const formData = new FormData();
  formData.append('file', file);

  const uploadUrl = `${BASE_URL}/api/uploads/${type}/${contentType}/${uploadKey}`;

  const res = await axios.post(uploadUrl, formData, {
    headers: buildCsrfHeaders(), // CSRF required for POST
    withCredentials: true,
  });
  return res.data;
};

/* ====================================================
========================= SCHEDULED CONTENTS ==========
==================================================== */
export const fetchScheduledContents = async () => {
  const res = await axios.get(`${BASE_URL}/api/scheduledcontents`, {
    headers: buildHeaders(),
    withCredentials: true,
  });
  return res.data;
};
