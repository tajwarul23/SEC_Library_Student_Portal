import { apiClient } from '../../../lib/axios';

export const authService = {
  // Step 1: look up the regNo against the student roster (read-only, no
  // Firebase call yet) — returns { regNo, name, department, Session, claimed }
  async checkRegNo(regNo) {
    const response = await apiClient.post('/api/user/check-regno', { regNo });
    return response.data?.data;
  },

  // Step 2: verified Firebase idToken + regNo — backend does the real
  // claim-or-login work and returns { user }
  async googleAuth({ regNo, idToken }) {
    const response = await apiClient.post('/api/user/google-auth', { regNo, idToken });
    return response.data?.data;
  },

  // Get current session user profile (returns null if unauthenticated / 401)
  // Real backend wraps the profile as { success, data: { user } } — unwrap here
  // so every consumer of useAuth().user gets the flat profile object.
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/api/user/me');
      return response.data?.data?.user || null;
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403 || err.response?.status === 404) {
        return null;
      }
      // If network error during initial dev boot, return null gracefully
      return null;
    }
  },

  // Logout session
  async logout() {
    try {
      const response = await apiClient.post('/api/user/logout');
      return response.data;
    } catch (err) {
      return { success: true };
    }
  },

  // TEMPORARY BRIDGE LOGIN — real backend still uses password-based
  // /api/user/login (Firebase claim/login endpoints don't exist yet).
  // Delete this method + BridgeLoginForm.jsx once real Google/Firebase
  // sign-in is wired up.
  async loginWithPassword({ regNo, password }) {
    const response = await apiClient.post('/api/user/login', { regNo, password });
    return response.data?.data?.user || null;
  },
};
