import { apiClient } from '../../../lib/axios';

export const notificationService = {
  // GET /api/student/notifications?offset=&limit=
  async getNotifications({ offset = 0, limit = 10 } = {}) {
    const params = new URLSearchParams();
    params.append('offset', String(offset));
    params.append('limit', String(limit));
    const response = await apiClient.get(
      `/api/student/notifications?${params.toString()}`
    );
    return response.data;
  },

  // PATCH /api/student/notifications/:id/read
  async markAsRead(id) {
    const response = await apiClient.patch(`/api/student/notifications/${id}/read`);
    return response.data;
  },

  // PATCH /api/student/notifications/read-all
  async markAllAsRead() {
    const response = await apiClient.patch('/api/student/notifications/read-all');
    return response.data;
  },
};
