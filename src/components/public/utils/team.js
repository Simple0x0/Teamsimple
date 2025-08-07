import axios from 'axios';

export async function fetchTeamSection(section) {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/aboutteam`, { params: { section } });
    return res.data?.AboutTeam?.Description || '';
  } catch (err) {
    throw new Error('Failed to load section');
  }
}

export async function fetchAllTeamMembers() {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/memberinfo`, { member: 'all' });
    console.log(res.data.team);
    return res.data.team || [];
  } catch (err) {
    throw new Error('Failed to load team members');
  }
}
