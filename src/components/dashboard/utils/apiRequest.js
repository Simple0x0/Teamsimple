import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;
const HEADERS = {
  'ngrok-skip-browser-warning': '69420',
  'Content-Type': 'application/json',
};
const handleError = (err) => {
  throw err.response?.data || { message: err.message } || 'An unknown error occurred';
};

/* ====================================================
========================= LOGIN ======================
====================================================
*/

export async function userLogin(data) {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420',
        },
        withCredentials: true,
      }
    );

    const msg = res.data?.message;
    const isFirstLogin = res.data?.isFirstLogin;

    if (res.status === 200 && msg) {
      return { success: true, message: msg, isFirstLogin };
    } else {
      throw { message: msg || 'Login failed' };
    }

  } catch (err) {
    handleError(err);
  }
}

/* ====================================================
========================= PASSWORD RESET ==================
====================================================
*/

export async function resetUserPassword(action, formData) {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/passwordmgmt`,
      {
        action: action,
        passwords: {
          old: formData.oldPassword,
          new: formData.newPassword,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420',
        },
        withCredentials: true,
      }
    );

    if (res.status === 200 && res.data.message) {
      return { success: true, message: res.data.message };
    } else {
      return { success: false, message: res.data?.message || 'Password reset failed.' };
    }

  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Unexpected error';
    return { success: false, message };
  }
}


/* ====================================================
========================= LOGOUT ==================
====================================================
*/
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


