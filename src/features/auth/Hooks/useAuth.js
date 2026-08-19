import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../Services/authService';
import { useNavigate } from 'react-router-dom';
import { nav } from 'motion/react-client';
import { USER_QUERY_KEY } from '../../../lib/queryClient';

export { USER_QUERY_KEY };

export function useAuth() {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: () => authService.getCurrentUser(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const checkRegNoMutation = useMutation({
    mutationFn: (regNo) => authService.checkRegNo(regNo),
  });

  const googleAuthMutation = useMutation({
    mutationFn: (payload) => authService.googleAuth(payload),
    onSuccess: (data) => {
      queryClient.setQueryData([USER_QUERY_KEY], data.user);
      queryClient.invalidateQueries();
    },
  });
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Drop every other cached query, but leave the currentUser key alone —
      // queryClient.clear() would also evict it, and since it's still an
      // actively mounted query, that triggers an immediate refetch of
      // /api/user/me. If the logout request silently failed to actually
      // clear the auth cookie server-side (network blip, cold-starting
      // backend), that refetch hands the same user right back, making
      // logout look like a no-op. setQueryData below is the last word.
      navigate("/login")
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== USER_QUERY_KEY,
      });
      queryClient.setQueryData([USER_QUERY_KEY], null);
    },
  });

  // TEMPORARY BRIDGE LOGIN — see authService.loginWithPassword.
  const passwordLoginMutation = useMutation({
    mutationFn: (payload) => authService.loginWithPassword(payload),
    onSuccess: (user) => {
      queryClient.setQueryData([USER_QUERY_KEY], user);
      queryClient.invalidateQueries();
    },
  });

  return {
    user: userQuery.data || null,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    error: userQuery.error,
    refetchUser: userQuery.refetch,
    checkRegNoMutation,
    googleAuthMutation,
    logoutMutation,
    passwordLoginMutation,
  };
}
