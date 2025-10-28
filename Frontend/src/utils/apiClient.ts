import { buildApiUrl } from './apiConfig';

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

class ApiClient {
  private static async getAuthToken(): Promise<string | null> {
    // Get the current user from Firebase
    const user = await import('firebase/auth').then(({ getAuth }) => getAuth().currentUser);
    if (!user) return null;
    return user.getIdToken();
  }

  private static async fetch<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { requiresAuth = true, ...fetchConfig } = config;
    const url = buildApiUrl(endpoint);

    try {
      // Add auth token if required
      if (requiresAuth) {
        const token = await this.getAuthToken();
        if (!token) {
          throw new Error('Authentication required');
        }
        fetchConfig.headers = {
          ...fetchConfig.headers,
          'Authorization': `Bearer ${token}`,
        };
      }

      // Add default headers
      fetchConfig.headers = {
        'Content-Type': 'application/json',
        ...fetchConfig.headers,
      };

      const response = await fetch(url, fetchConfig);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error: any) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // GET request
  static async get<T>(endpoint: string, config: RequestConfig = {}) {
    return this.fetch<T>(endpoint, {
      ...config,
      method: 'GET',
    });
  }

  // POST request
  static async post<T>(endpoint: string, data: any, config: RequestConfig = {}) {
    return this.fetch<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  static async put<T>(endpoint: string, data: any, config: RequestConfig = {}) {
    return this.fetch<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  static async delete<T>(endpoint: string, config: RequestConfig = {}) {
    return this.fetch<T>(endpoint, {
      ...config,
      method: 'DELETE',
    });
  }
}

export default ApiClient;
