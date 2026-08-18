import { apiClient } from '../../../lib/axios';

export const waitlistService = {
  // GET /api/student/access/waitlist?offset=&limit=
  async getWaitlist({ offset = 0, limit = 10 } = {}) {
    const params = new URLSearchParams();
    params.append('offset', String(offset));
    params.append('limit', String(limit));
    const response = await apiClient.get(
      `/api/student/access/waitlist?${params.toString()}`
    );
    return response.data;
  },

  // DELETE /api/student/access/books/:bookId/waitlist
  async leaveWaitlist(bookId) {
    const response = await apiClient.delete(
      `/api/student/access/books/${bookId}/waitlist`
    );
    return response.data;
  },
};
