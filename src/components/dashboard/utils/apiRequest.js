import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;
const HEADERS = {
  'ngrok-skip-browser-warning': '69420',
  'Content-Type': 'application/json',
};
const handleError = (err) => {
  throw err.response?.data || { message: err.message };
};

export async function userLogin(data) {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      data,
      {
        headers: { 'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420',
         },
        withCredentials: true,
      }
    );

    if (res.status === 200 && res.data?.message === 'Login successful') {
      if (res.data.csrf_token) {
        sessionStorage.setItem('csrf_token', res.data.csrf_token);
      }
      return true;
    } else {
      throw new Error('Login failed');
    }
  } catch (err) {
    throw err.response?.data || { message: err.message };
  }
}

export async function logout() {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/logout`,
      {}, // Empty data payload
      { withCredentials: true,
      headers: {
        'ngrok-skip-browser-warning': '69420',
      }, }
    );
  } catch (err) {
    console.error('Logout failed:', err);
  }
}


export async function authVerify() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
      withCredentials: true,
      headers: {
        'ngrok-skip-browser-warning': '69420',
      },
    });
    return res;
  } catch (err) {
    throw err.response?.data || { message: err.message };
  }
}

export async function getCurrentUser() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/memberinfo`, {
      withCredentials: true,
      headers: {
        'ngrok-skip-browser-warning': '69420',
      },
    });
    return res.data;
    
  } catch (err) {
    throw err.response?.data || { message: err.message };
  }
}

export async function getQuickanalytics() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/quickanalytics`, {
      withCredentials: true,
      headers: {
        'ngrok-skip-browser-warning': '69420',
      },
    });
    return res.data;
    
  } catch (err) {
    throw err.response?.data || { message: err.message };
  }
}

export async function TVisitorsStats() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/tvisitors`, {
      withCredentials: true,
      headers: {
        'ngrok-skip-browser-warning': '69420',
      },
    });
    return res.data;
    
  } catch (err) {
    throw err.response?.data || { message: err.message };
  }
}

export async function VisitorLikeStats({ timeline = "week" }) {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/visitorslikes`,
      JSON.stringify({ timeline }), 
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420',
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: err.message };
  }
}

export async function TopLikes() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/toplikes`, {
      withCredentials: true,
      headers: {
        'ngrok-skip-browser-warning': '69420',
      },
    });
    return res.data;
    
  } catch (err) {
    throw err.response?.data || { message: err.message };
  }
}


// ========== TAGS ==========
export const fetchTags = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/tagscattech`, {
      params: { type: 'tag' },
      headers: HEADERS,
    });
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const addTag = async ({ name, type }) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/tagscattech`,
      { name, type },
      {
        withCredentials: true,
        headers: HEADERS,
      }
    );
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// ========== CATEGORIES ==========
export const fetchCategories = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/tagscattech`, {
      params: { type: 'category' },
      headers: HEADERS,
    });
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const addCategory = async ({ name, description }) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/tagscattech`,
      { type: 'category', name, description },
      {
        withCredentials: true,
        headers: HEADERS,
      }
    );
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// ========== TECH STACK ==========
export const fetchTechStacks = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/tagscattech`, {
      params: { type: 'techstack' },
      headers: HEADERS,
    });
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const addTechStack = async ({ name, description }) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/tagscattech`,
      { type: 'techstack', name, description },
      {
        withCredentials: true,
        headers: HEADERS,
      }
    );
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// ========== CONTRIBUTORS ==========
export const fetchContributors = async (content, slug) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/auth/contributorsmgmt`, {
      params: { 
        content: content,
        slug: slug
      },
      headers: HEADERS,
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const addContributors = async ({ content, slug, contributors }) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth/contributorsmgmt`,
      { content, slug, contributors },
      {
        withCredentials: true,
        headers: HEADERS,
      }
    );
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const fetchFilesUtil = async ({type, contentType, uploadKey}) => {
    try {
      //console.log(uploadKey);
      const res = await fetch(`${BASE_URL}/api/uploads/${type}/${contentType}/${uploadKey}`);
      return res ;
    } catch (err) {
      handleError(err);
    }
  };

export const uploadFile = async ({ file, type, contentType, uploadKey }) => {
  const formData = new FormData();
  formData.append('file', file);

  const uploadUrl = `${BASE_URL}/api/uploads/${type}/${contentType}/${uploadKey}`;

  const res = await axios.post(uploadUrl, formData, {
    headers: {
    },
    withCredentials: true,
  });
  return res.data;
};


