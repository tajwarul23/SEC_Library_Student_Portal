import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../Services/notificationService';

export const NOTIFICATIONS_QUERY_KEY = 'notifications';

export function useNotifications({ offset = 0, limit = 10, enabled = true } = {}) {
  return useQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY, { offset, limit }],
    queryFn: () => notificationService.getNotifications({ offset, limit }),
    enabled: Boolean(enabled),
    refetchInterval: enabled ? 1000 * 30 : false, // 30s auto-polling only when enabled
    retry: false,
  });
}

export function useNotificationActions() {
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: (id) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });

  return {
    markAsReadMutation,
    markAllReadMutation,
  };
}
