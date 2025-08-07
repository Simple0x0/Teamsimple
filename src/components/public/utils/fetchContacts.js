import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;
const HEADERS = {
  'ngrok-skip-browser-warning': '69420',
  'Content-Type': 'application/json',
};
export default async function fetchContacts() {
  const res = await fetch(`${BASE_URL}/api/contacts`);
  if (!res.ok) throw new Error('Failed to fetch contacts');
  const data = await res.json();

  if (!data.success) throw new Error(data.message || 'Failed to fetch contacts');
  console.log(data.contacts);
  return data.contacts;
}
