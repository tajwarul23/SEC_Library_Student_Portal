import { apiClient } from '../../../lib/axios';

export const assistantService = {
  // POST /api/student/rag/access — body: { input, threadId }
  async ask({ input, threadId }) {
    const response = await apiClient.post('/api/student/rag/access', {
      input,
      threadId,
    });
    return response.data; // { success, ai }
  },
};
