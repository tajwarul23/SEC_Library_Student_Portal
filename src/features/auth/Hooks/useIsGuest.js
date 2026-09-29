import { useQuery } from '@tanstack/react-query';
import { authService } from '../Services/authService';
import { USER_QUERY_KEY } from '../../../lib/queryClient';

// Lightweight read of the cached current user (same query as useAuth), for
// components that only need to know whether this is a read-only guest.
export function useIsGuest() {
  const { data } = useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: () => authService.getCurrentUser(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
  return data?.role === 'guest';
}
