import { useQuery } from '@tanstack/react-query';
import { issuedService } from '../Services/issuedService';

export const ISSUED_BOOKS_QUERY_KEY = 'issuedBooks';

export function useIssuedBooks({ offset = 0, limit = 10, status = '' } = {}) {
  return useQuery({
    queryKey: [ISSUED_BOOKS_QUERY_KEY, { offset, limit, status }],
    queryFn: () => issuedService.getIssuedBooks({ offset, limit, status }),
    staleTime: 1000 * 30,
  });
}
