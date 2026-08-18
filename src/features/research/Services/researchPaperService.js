import { apiClient } from '../../../lib/axios';

export const researchPaperService = {
  // GET /api/student/access/research-papers?page=&limit=
  // Note: the real backend only supports page/limit here — no filter params
  // (no department/category) are read by getAllResearchPapers.
  async getPapers({ page = 1, limit = 6 } = {}) {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    const response = await apiClient.get(
      `/api/student/access/research-papers?${params.toString()}`
    );
    return response.data;
  },

  // GET /api/student/access/research-papers/search?query=&page=&limit=
  // Unlike book search, this endpoint IS paginated by the backend.
  async searchPapers({ query, page = 1, limit = 6 } = {}) {
    const params = new URLSearchParams();
    if (query) {
      params.append('query', query);
    }
    params.append('page', String(page));
    params.append('limit', String(limit));
    const response = await apiClient.get(
      `/api/student/access/research-papers/search?${params.toString()}`
    );
    return response.data;
  },

  // GET /api/student/access/research-papers/:id
  async getPaperById(id) {
    const response = await apiClient.get(`/api/student/access/research-papers/${id}`);
    return response.data;
  },

  // POST /api/student/access/research-papers
  // Submits a paper for admin review (saved as status: "pending" server-side).
  // Required: title, authors (array of { name, affiliation?, orcid? }),
  // category, paperLink. Optional: abstract, keywords, publicationDate,
  // journalName, conferenceName, doi.
  async submitPaper(data) {
    const response = await apiClient.post('/api/student/access/research-papers', data);
    return response.data;
  },

  // GET /api/student/access/research-papers/my-papers?status=&page=&limit=
  // The submitting student's own papers across every review state
  // (pending/approved/rejected). status is optional.
  async getMyPapers({ status, page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams();
    if (status && status !== 'ALL') {
      params.append('status', status);
    }
    params.append('page', String(page));
    params.append('limit', String(limit));
    const response = await apiClient.get(
      `/api/student/access/research-papers/my-papers?${params.toString()}`
    );
    return response.data;
  },
};
