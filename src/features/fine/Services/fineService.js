import { apiClient } from '../../../lib/axios';

export const fineService = {
  // POST /api/student/payment/init
  async initPayment() {
    const response = await apiClient.post('/api/student/payment/init');
    return response.data;
  },

  // GET /api/student/payment/history?offset=&limit=
  async getPaymentHistory({ offset = 0, limit = 10 } = {}) {
    const params = new URLSearchParams();
    params.append('offset', String(offset));
    params.append('limit', String(limit));
    const response = await apiClient.get(
      `/api/student/payment/history?${params.toString()}`
    );
    return response.data;
  },

  // GET /api/student/payment/status/:tranId
  async getPaymentStatus(tranId) {
    const response = await apiClient.get(`/api/student/payment/status/${tranId}`);
    return response.data;
  },
};
