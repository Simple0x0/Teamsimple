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

export const fetchBlogs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/blogsmgmt`, {
      withCredentials: true,
      headers: HEADERS
    });
    
    return response.data.Blogs;
    
  } catch (err) {
    const error = err.response?.data?.message || 'No contents found';
    const status = err.response?.status || 500;  // Define status here
    return { success: false, error, status };
  }
};


export const postBlog = async ({
  blogData,
  action = 'new',
  submissionType = 'draft',
}) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth/blogsmgmt`,
      { action, submissionType, blog: blogData },
      { withCredentials: true, headers: HEADERS }
    );
    return { success: true, data: res.data, status: res.status };
  } catch (err) {
    const status = err?.response?.status || 500;
    const error = err?.response?.data?.error || 'Unknown error occurred';
    return { success: false, error, status };
  }
};

export const BlogDelete = async ({ blog, action = 'delete' }) => {
  console.log(blog);
  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth/blogsmgmt`,
      { action, blog },
      { withCredentials: true, headers: HEADERS }
    );
    return { success: true, data: res.data, status: res.status };
  } catch (err) {
    const status = err?.response?.status || 500;
    const error = err?.response?.data?.error || 'Unknown error occurred';
    return { success: false, error, status };
  }
};


