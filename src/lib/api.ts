// API utility functions for frontend-backend communication

// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  // In production, use the deployed URL if specified, otherwise use relative paths
  if (typeof window !== 'undefined') {
    // Client-side: use relative paths for same-origin requests
    return '/api';
  } else {
    // Server-side: use the full URL if available
    return process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : '/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

// Generic API request function with enhanced error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    console.log(`🔄 API Request: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
      ...options,
    });

    // Log response status for debugging
    console.log(`📡 API Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error ${response.status}:`, errorText);
      
      // Try to parse as JSON, fallback to text
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || `HTTP ${response.status}` };
      }
      
      return { 
        success: false, 
        error: errorData.error || `Request failed with status ${response.status}` 
      };
    }

    const data = await response.json();
    console.log(`✅ API Success:`, data.success ? 'OK' : 'Failed');
    return data;
    
  } catch (error) {
    console.error(`❌ API request failed for ${endpoint}:`, error);
    
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { success: false, error: 'Network connection failed. Please check your internet connection.' };
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
}

// Task API functions
export const taskAPI = {
  getAll: () => apiRequest<any[]>('/tasks'),
  getById: (id: string) => apiRequest<any>(`/tasks/${id}`),
  create: (task: any) => apiRequest<any>('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  update: (id: string, task: any) => apiRequest<any>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) }),
  delete: (id: string) => apiRequest<any>(`/tasks/${id}`, { method: 'DELETE' }),
};

// Event API functions
export const eventAPI = {
  getAll: () => apiRequest<any[]>('/events'),
  getById: (id: string) => apiRequest<any>(`/events/${id}`),
  create: (event: any) => apiRequest<any>('/events', { method: 'POST', body: JSON.stringify(event) }),
  update: (id: string, event: any) => apiRequest<any>(`/events/${id}`, { method: 'PUT', body: JSON.stringify(event) }),
  delete: (id: string) => apiRequest<any>(`/events/${id}`, { method: 'DELETE' }),
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