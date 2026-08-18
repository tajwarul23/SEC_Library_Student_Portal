import { apiClient } from '../../../lib/axios';

export const bookService = {
  // GET /api/student/access/books?offset=&limit=&category=
  async getBooks({ offset = 0, limit = 6, category = '' }) {
    const params = new URLSearchParams();
    params.append('offset', String(offset));
    params.append('limit', String(limit));
    if (category && category !== 'All') {
      params.append('category', category);
    }
    const response = await apiClient.get(`/api/student/access/books?${params.toString()}`);
    return response.data;
  },

  // GET /api/student/access/books/search?query=
  async searchBooks(query) {
    const params = new URLSearchParams();
    if (query) {
      params.append('query', query);
    }
    const response = await apiClient.get(`/api/student/access/books/search?${params.toString()}`);
    return response.data;
  },

  // POST /api/student/access/books/:bookId/reserve
  async reserveBook(bookId) {
    const response = await apiClient.post(`/api/student/access/books/${bookId}/reserve`);
    return response.data;
  },

  // POST /api/student/access/books/:bookId/waitlist
  async joinWaitlist(bookId) {
    const response = await apiClient.post(`/api/student/access/books/${bookId}/waitlist`);
    return response.data;
  },

  // DELETE /api/student/access/books/:bookId/waitlist
  async leaveWaitlist(bookId) {
    const response = await apiClient.delete(`/api/student/access/books/${bookId}/waitlist`);
    return response.data;
  },
};
