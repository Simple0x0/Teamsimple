import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;
const HEADERS = {
  'ngrok-skip-browser-warning': '69420',
  'Content-Type': 'application/json',
};

const formatError = (err, defaultMsg = 'Unknown error occurred') => ({
  success: false,
  error: err?.response?.data?.message || err?.response?.data?.error || defaultMsg,
  status: err?.response?.status || 500,
});


export const fetchWriteUps = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/writeupsmgmt`, {
      withCredentials: true,
      headers: HEADERS,
    });

    return response.data.Writeups;

  } catch (err) {
    return formatError(err);
  }
};

export const postWriteUp = async ({
  writeupData,
  action = 'new',
  submissionType = 'draft',
}) => {
  console.log(writeupData);
  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth/writeupsmgmt`,
      { action, submissionType, writeup: writeupData },
      { withCredentials: true, headers: HEADERS }
    );
    return { success: true, data: res.data, status: res.status };
  } catch (err) {
    return formatError(err);
  }
};

export const deleteWriteUp = async ({ writeup, action = 'delete' }) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth/writeupsmgmt`,
      { action, writeup },
      { withCredentials: true, headers: HEADERS }
    );
    return { success: true, data: res.data, status: res.status };
  } catch (err) {
    return formatError(err);
  }
};
