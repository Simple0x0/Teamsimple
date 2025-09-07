import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;
const HEADERS = {
  'ngrok-skip-browser-warning': '69420',
  'Content-Type': 'application/json',
};

const handleError = (err) => {
  throw err.response?.data || { message: err.message };
};

// ========== TEAM MEMBERS ==========

export const fetchTeamMembers = async (username = "") => {
  try {
    const res = await axios.get(`${BASE_URL}/api/auth/teammgmt`, {
      params: { username },
      headers: HEADERS,
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const postTeamMember = async ({
  action = 'new', // 'new', 'edit', 'suspend', 'banned'
  memberData
}) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth/teammgmt`,
      { action, member: memberData },
      {
        withCredentials: true,
        headers: HEADERS,
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
