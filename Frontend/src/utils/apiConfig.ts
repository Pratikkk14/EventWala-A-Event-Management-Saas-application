/**
 * API utilities for managing backend URLs and endpoints
 * This centralizes API URL configuration for deployment
 */

// Get the base URL from environment variables or fall back to a default
export const getApiBaseUrl = () => {
  // For production deployment, use the environment variable
  if (import.meta.env.PROD) {
    return 'https://eventwala-a-event-management-saas.onrender.com';
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

export class ApiClient {
  private static async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async get<T>(endpoint: string, token?: string): Promise<T> {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return this.request<T>(endpoint, { headers });
  }

  static async post<T>(endpoint: string, data: any, token?: string): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
  }

  static async put<T>(endpoint: string, data: any, token?: string): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
  }

  static async delete<T>(endpoint: string, token?: string): Promise<T> {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers
    });
  }
}