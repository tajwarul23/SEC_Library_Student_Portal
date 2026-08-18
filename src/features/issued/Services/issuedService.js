import { apiClient } from '../../../lib/axios';

export const issuedService = {
  // GET /api/student/access/issued?offset=&limit=&status=
  async getIssuedBooks({ offset = 0, limit = 10, status = '' } = {}) {
    const params = new URLSearchParams();
    params.append('offset', String(offset));
    params.append('limit', String(limit));
    if (status && status !== 'all') {
      params.append('status', status);
    }
    const response = await apiClient.get(
      `/api/student/access/issued?${params.toString()}`
    );
    return response.data;
  },
};
