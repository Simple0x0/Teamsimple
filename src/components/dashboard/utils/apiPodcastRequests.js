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

// ===========================
// ======== PODCASTS =========
// ===========================

export const fetchPodcasts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/podcastmgmt`, {
      withCredentials: true,
      headers: HEADERS,
    });

    return response.data.Podcasts;

  } catch (err) {
    return formatError(err);
  }
};

export const postPodcast = async ({
  podcastData,
  action = 'new',
  submissionType = 'draft',
}) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth/podcastmgmt`,
      { action, submissionType, podcast: podcastData },
      { withCredentials: true, headers: HEADERS }
    );
    return { success: true, data: res.data, status: res.status };
  } catch (err) {
    return formatError(err);
  }
};

export const deletePodcast = async ({ podcast, action = 'delete' }) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth/podcastmgmt`,
      { action, podcast },
      { withCredentials: true, headers: HEADERS }
    );
    return { success: true, data: res.data, status: res.status };
  } catch (err) {
    return formatError(err);
  }
};
