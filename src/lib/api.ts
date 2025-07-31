// API utility functions for frontend-backend communication

const API_BASE_URL = '/api';

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    return { success: false, error: 'Network error' };
  }
}

// Task API functions
export const taskAPI = {
  getAll: () => apiRequest('/tasks'),
  getById: (id: string) => apiRequest(`/tasks/${id}`),
  create: (task: any) => apiRequest('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  update: (id: string, task: any) => apiRequest(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) }),
  delete: (id: string) => apiRequest(`/tasks/${id}`, { method: 'DELETE' }),
};

// Event API functions
export const eventAPI = {
  getAll: () => apiRequest('/events'),
  getById: (id: string) => apiRequest(`/events/${id}`),
  create: (event: any) => apiRequest('/events', { method: 'POST', body: JSON.stringify(event) }),
  update: (id: string, event: any) => apiRequest(`/events/${id}`, { method: 'PUT', body: JSON.stringify(event) }),
  delete: (id: string) => apiRequest(`/events/${id}`, { method: 'DELETE' }),
};

// Message API functions
export const messageAPI = {
  getAll: (params?: { folder?: string; limit?: number; page?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.folder) searchParams.append('folder', params.folder);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    
    const queryString = searchParams.toString();
    return apiRequest(`/messages${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id: string) => apiRequest(`/messages/${id}`),
  create: (message: any) => apiRequest('/messages', { method: 'POST', body: JSON.stringify(message) }),
  update: (id: string, message: any) => apiRequest(`/messages/${id}`, { method: 'PUT', body: JSON.stringify(message) }),
  delete: (id: string) => apiRequest(`/messages/${id}`, { method: 'DELETE' }),
  send: (message: any) => apiRequest('/messages/send', { method: 'POST', body: JSON.stringify(message) }),
};