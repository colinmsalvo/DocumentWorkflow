import * as SecureStore from 'expo-secure-store';

// Base URL for your backend API  
const API_BASE_URL = 'https://2d3a7bfe-4c02-470c-96b4-65bf22c05c43-00-1zrxlj5luzgb5.kirk.replit.dev'; // Your current Replit URL

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = await SecureStore.getItemAsync('auth_token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      await SecureStore.deleteItemAsync('auth_token');
      throw new Error('Authentication required');
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed: ${response.status}`);
  }

  return response.json();
}

// Mobile-specific API helpers with company isolation
export const mobileApi = {
  async login(email: string, password: string) {
    return apiRequest('/api/auth/mobile-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async verifyToken() {
    return apiRequest('/api/auth/verify');
  },

  // Company-isolated endpoints
  async getJobs() {
    return apiRequest('/api/mobile/jobs');
  },

  async getJob(id: number) {
    return apiRequest(`/api/mobile/jobs/${id}`);
  },

  async getJobElements(jobId: number) {
    return apiRequest(`/api/mobile/jobs/${jobId}/elements`);
  },

  async getElement(id: number) {
    return apiRequest(`/api/mobile/elements/${id}`);
  },

  async getElementByElementId(elementId: string) {
    return apiRequest(`/api/mobile/elements/lookup/${elementId}`);
  },

  async updateElement(id: number, updates: any) {
    return apiRequest(`/api/mobile/elements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async getDashboardStats() {
    return apiRequest('/api/mobile/dashboard/stats');
  },

  async getDashboardActivities() {
    return apiRequest('/api/mobile/dashboard/activities');
  },
};

export { API_BASE_URL };