import axios from 'axios';
const backendURL = import.meta.env.VITE_API_URL;

export const getAuthor = async (username, onError) => {
  try {
    const res = await axios.post(`${backendURL}/api/contributors`, {
      username: username,
    });
    
    return res.data.Contributor;
  } catch (error) {
    onError && onError(error);
  }
};
