import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { waitlistService } from '../Services/waitlistService';
import { BOOKS_QUERY_KEY } from '../../books/Hooks/useBooks';

export const WAITLIST_QUERY_KEY = 'waitlists';

export function useWaitlist({ offset = 0, limit = 10 } = {}) {
  return useQuery({
    queryKey: [WAITLIST_QUERY_KEY, { offset, limit }],
    queryFn: () => waitlistService.getWaitlist({ offset, limit }),
    staleTime: 1000 * 20,
  });
}

export function useLeaveWaitlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId) => waitlistService.leaveWaitlist(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WAITLIST_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] });
    },
  });
}
