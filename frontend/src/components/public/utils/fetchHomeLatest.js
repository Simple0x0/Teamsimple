import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;
const HEADERS = {
  'ngrok-skip-browser-warning': '69420',
  'Content-Type': 'application/json',
};

export async function fetchHomeLatest() {
    try {
        const res = await axios.get(`${BASE_URL}/api/home_latest`);
        return res.data.home_latest || [];
    } catch (err) {
        throw new Error('Failed to load home content');
    }
}
