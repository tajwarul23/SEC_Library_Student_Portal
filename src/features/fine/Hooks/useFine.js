import { useState } from 'react';
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

// How long the result page keeps checking a PENDING payment before telling
// the student to check back later (SSLCommerz's confirmation can lag).
export const PAYMENT_STATUS_POLL_TIMEOUT_MS = 60 * 1000;

export function usePaymentStatus(tranId) {
  const [startedAt] = useState(() => Date.now());

  return useQuery({
    queryKey: [PAYMENT_STATUS_QUERY_KEY, tranId],
    queryFn: () => fineService.getPaymentStatus(tranId),
    enabled: Boolean(tranId),
    // Keep polling while the payment is still PENDING (this used to stop at
    // the first response, leaving the page on "Confirming..." forever).
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      if (status && status !== 'PENDING') return false;
      if (Date.now() - startedAt > PAYMENT_STATUS_POLL_TIMEOUT_MS) return false;
      return 3000;
    },
  });
}

export function useInitPayment() {
  return useMutation({
    mutationFn: () => fineService.initPayment(),
  });
}
