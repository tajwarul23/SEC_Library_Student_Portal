import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || '';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for clear error message extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage =
      error.response?.data?.message || error.message || 'An unexpected error occurred.';
    error.extractedMessage = customMessage;
    return Promise.reject(error);
  }
);
