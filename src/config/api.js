// API Configuration
// For development with Vite proxy, use relative URLs
// For production, use the full API URL from environment variable

const isDevelopment = import.meta.env.MODE === 'development';
const API_BASE_URL = isDevelopment
  ? '' // Use Vite proxy in development (relative URLs)
  : (import.meta.env.VITE_API_URL || 'https://alist.jutateknologi.com');

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
