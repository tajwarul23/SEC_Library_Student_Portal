import axios from 'axios';
import toast from 'react-hot-toast';
import { queryClient, USER_QUERY_KEY } from './queryClient';

const apiBaseUrl = import.meta.env.VITE_API_URL || '';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor: clear error message extraction, plus session-expiry
// handling. A 401 during an active session (cache already held a user) means
// the auth cookie died mid-session — clear the cached user so App.jsx's
// `if (!user)` gate swaps to the login screen right away instead of waiting
// on the 5-minute staleTime. A 401 while there was no cached user yet (e.g.
// /api/user/me on first load, or a failed google-auth/check-regno attempt
// during login) is left alone — that's expected, not a session drop, and
// AuthContainer already renders its own error banner for those.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage =
      error.response?.data?.message || error.message || 'An unexpected error occurred.';
    error.extractedMessage = customMessage;

    if (error.response?.status === 401 && queryClient.getQueryData([USER_QUERY_KEY])) {
      queryClient.setQueryData([USER_QUERY_KEY], null);
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== USER_QUERY_KEY,
      });
      toast.error('Your session has expired. Please log in again.');
    }

    return Promise.reject(error);
  }
);
