import { apiClient } from '../../../lib/axios';

export const reservationService = {
  // GET /api/student/access/reservations?offset=&limit=&status=
  async getReservations({ offset = 0, limit = 10, status = '' } = {}) {
    const params = new URLSearchParams();
    params.append('offset', String(offset));
    params.append('limit', String(limit));
    if (status && status !== 'all') {
      params.append('status', status);
    }
    const response = await apiClient.get(
      `/api/student/access/reservations?${params.toString()}`
    );
    return response.data;
  },
};
