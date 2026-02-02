// API Configuration
// For Vercel deployment, both frontend and API are on the same domain
// so relative URLs work in both development and production

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const API_URL = API_BASE_URL;

// Helper function to build API endpoints
export const getApiUrl = (endpoint) => {
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_URL}${cleanEndpoint}`;
};

export default {
  API_URL,
  getApiUrl
};
