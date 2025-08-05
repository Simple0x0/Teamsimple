import axios from 'axios';

export async function registerEventParticipant(eventId, data) {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/events`, {
      ...data,
      EventID: eventId,
    });
    // Axios returns data in res.data
    return { ok: true, ...res.data };
  } catch (err) {
    // If backend returns error response, try to extract message
    const errorMsg = err.response?.data?.error || 'Network error';
    return { ok: false, error: errorMsg };
  }
}