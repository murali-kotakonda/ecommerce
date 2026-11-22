import axios from 'axios';

// Central backend base URL. Override with REACT_APP_API_URL at build time.
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://127.0.0.1:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Resolves an image reference to a displayable URL.
 * - Absolute URLs (http/https) are returned as-is.
 * - Backend-relative upload paths (e.g. /ecom/uploads/x.png) are prefixed with the API base.
 * - Empty/undefined returns a neutral placeholder.
 */
export const resolveImageUrl = (url) => {
  if (!url) {
    return 'https://via.placeholder.com/300x200?text=No+Image';
  }
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default api;
