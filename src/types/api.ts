// API response types for better TypeScript support

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TaskApiResponse extends ApiResponse {
  data?: any[];
}

export interface EventApiResponse extends ApiResponse {
  data?: any[];
}

export interface MessageApiResponse extends ApiResponse {
  data?: any[];
}

export interface SingleItemApiResponse extends ApiResponse {
  data?: any;
}