import { useQuery } from '@tanstack/react-query';
import { reservationService } from '../Services/reservationService';

export const RESERVATIONS_QUERY_KEY = 'reservations';

export function useReservations({ offset = 0, limit = 10, status = '' } = {}) {
  return useQuery({
    queryKey: [RESERVATIONS_QUERY_KEY, { offset, limit, status }],
    queryFn: () => reservationService.getReservations({ offset, limit, status }),
    staleTime: 1000 * 15,
  });
}
