import { useQuery, useMutation } from '@tanstack/react-query';
import { fineService } from '../Services/fineService';

export const PAYMENT_HISTORY_QUERY_KEY = 'paymentHistory';
export const PAYMENT_STATUS_QUERY_KEY = 'paymentStatus';

export function usePaymentHistory({ offset = 0, limit = 10 } = {}) {
  return useQuery({
    queryKey: [PAYMENT_HISTORY_QUERY_KEY, { offset, limit }],
    queryFn: () => fineService.getPaymentHistory({ offset, limit }),
  });
}

export function usePaymentStatus(tranId) {
  return useQuery({
    queryKey: [PAYMENT_STATUS_QUERY_KEY, tranId],
    queryFn: () => fineService.getPaymentStatus(tranId),
    enabled: Boolean(tranId),
    refetchInterval: (query) => (query.state.data?.data ? false : 3000),
  });
}

export function useInitPayment() {
  return useMutation({
    mutationFn: () => fineService.initPayment(),
  });
}
