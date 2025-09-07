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
// ======== PROJECTS =========
// ===========================

export const fetchProjects = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/projectsmgmt`, {
      withCredentials: true,
      headers: buildHeaders(),
    });

    return response.data.Projects;

  } catch (err) {
    return formatError(err);
  }
};

export const postProject = async ({
  projectData,
  action = 'new',
  submissionType = 'draft',
}) => {
    console.log(projectData)
  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth/projectsmgmt`,
      { action, submissionType, project: projectData },
      { withCredentials: true, headers: buildCsrfHeaders() }
    );
    return { success: true, data: res.data, status: res.status };
  } catch (err) {
    return formatError(err);
  }
};

export const deleteProject = async ({ project, action = 'delete' }) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth/projectsmgmt`,
      { action, project },
      { withCredentials: true, headers: buildCsrfHeaders() }
    );
    return { success: true, data: res.data, status: res.status };
  } catch (err) {
    return formatError(err);
  }
};
