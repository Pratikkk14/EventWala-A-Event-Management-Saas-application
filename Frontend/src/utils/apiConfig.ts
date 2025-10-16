/**
 * API utilities for managing backend URLs and endpoints
 * This centralizes API URL configuration for deployment
 */

// Get the base URL from environment variables or fall back to a default
export const getApiBaseUrl = () => {
  // For production deployment, use the environment variable
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  
  // Default to local development
  return 'http://localhost:5000';
};

// Create a function to build API URLs
export const buildApiUrl = (endpoint: string) => {
  const baseUrl = getApiBaseUrl();
  // Ensure endpoint starts with /api
  const formattedEndpoint = endpoint.startsWith('/api') 
    ? endpoint 
    : `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
  // Handle both absolute URLs (from env var) and relative URLs
  if (baseUrl.includes('://')) {
    return `${baseUrl}${formattedEndpoint}`;
  }
  
  return formattedEndpoint;
};

// Examples:
// buildApiUrl('/explore-events') => 'http://localhost:5000/api/explore-events' (local dev)
// buildApiUrl('/explore-events') => 'https://your-backend-url.vercel.app/api/explore-events' (production)