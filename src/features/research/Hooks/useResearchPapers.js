import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { researchPaperService } from '../Services/researchPaperService';

export const PAPERS_QUERY_KEY = 'researchPapers';
export const PAPERS_SEARCH_KEY = 'researchPapersSearch';
export const MY_PAPERS_QUERY_KEY = 'myResearchPapers';

export function useResearchPapers({ page = 1, limit = 6 } = {}) {
  return useQuery({
    queryKey: [PAPERS_QUERY_KEY, { page, limit }],
    queryFn: () => researchPaperService.getPapers({ page, limit }),
    staleTime: 1000 * 60,
  });
}

export function useResearchPaperSearch({ query, page = 1, limit = 6 } = {}) {
  return useQuery({
    queryKey: [PAPERS_SEARCH_KEY, { query, page, limit }],
    queryFn: () => researchPaperService.searchPapers({ query, page, limit }),
    staleTime: 1000 * 30,
    enabled: Boolean(query && query.trim().length > 0),
  });
}

// The submitting student's own papers (pending/approved/rejected).
export function useMyResearchPapers({ status, page = 1, limit = 10 } = {}) {
  return useQuery({
    queryKey: [MY_PAPERS_QUERY_KEY, { status, page, limit }],
    queryFn: () => researchPaperService.getMyPapers({ status, page, limit }),
    staleTime: 1000 * 20,
  });
}

export function useSubmitResearchPaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => researchPaperService.submitPaper(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MY_PAPERS_QUERY_KEY] });
    },
  });
}
