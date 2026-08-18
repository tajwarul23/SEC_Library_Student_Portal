import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookService } from '../Services/bookService';
import { RESERVATIONS_QUERY_KEY } from '../../reservations/Hooks/useReservations';
import { WAITLIST_QUERY_KEY } from '../../waitlist/Hooks/useWaitlist';

export const BOOKS_QUERY_KEY = 'books';
export const BOOKS_SEARCH_KEY = 'booksSearch';

export function useBooks({ offset = 0, limit = 6, category = '' } = {}) {
  return useQuery({
    queryKey: [BOOKS_QUERY_KEY, { offset, limit, category }],
    queryFn: () => bookService.getBooks({ offset, limit, category }),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useBookSearch(query) {
  return useQuery({
    queryKey: [BOOKS_SEARCH_KEY, query],
    queryFn: () => bookService.searchBooks(query),
    staleTime: 1000 * 20,
    // Real backend 400s when query is missing/empty — don't fire until the
    // student has actually typed something.
    enabled: Boolean(query && query.trim().length > 0),
  });
}

export function useBookActions() {
  const queryClient = useQueryClient();

  const reserveMutation = useMutation({
    mutationFn: (bookId) => bookService.reserveBook(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOKS_SEARCH_KEY] });
      queryClient.invalidateQueries({ queryKey: [RESERVATIONS_QUERY_KEY] });
    },
  });

  const waitlistMutation = useMutation({
    mutationFn: (bookId) => bookService.joinWaitlist(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WAITLIST_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOKS_SEARCH_KEY] });
    },
  });

  const leaveWaitlistMutation = useMutation({
    mutationFn: (bookId) => bookService.leaveWaitlist(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WAITLIST_QUERY_KEY] });
    },
  });

  return {
    reserveMutation,
    waitlistMutation,
    leaveWaitlistMutation,
  };
}
