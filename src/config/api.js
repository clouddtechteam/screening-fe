// API Configuration
// Uses environment variable VITE_API_URL if specified, otherwise defaults to the live Render backend
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://screening-be-3mzl.onrender.com').replace(/\/+$/, '');

export const apiUrl = (endpoint = '') => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!API_BASE_URL) return cleanEndpoint;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

export default {
  API_BASE_URL,
  apiUrl
};
