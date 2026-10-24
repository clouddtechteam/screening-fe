
/**
 * API Configuration
 * Local backend for Windows desktop and local development.
 */

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL || "http://127.0.0.1:5001")

    // (import.meta.env.VITE_API_URL || "http://127.0.0.1:5001")
    .replace(/\/+$/, "");

export const apiUrl = (endpoint = "") => {
  const cleanEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  return `${API_BASE_URL}${cleanEndpoint}`;
};

export default {
  API_BASE_URL,
  apiUrl
};
