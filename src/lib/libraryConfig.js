import { useQuery } from '@tanstack/react-query';
import { apiClient } from './axios';

// Used until the backend answers (and if it can't) — same as the backend defaults.
const DEFAULT_CONFIG = {
  reservationHoldMinutes: 2,
  reservationExpiryFine: 20,
  loanDurationDays: 7,
  lateFinePerDay: 5,
  maxActiveBooks: 3,
};

// Library rules come from the backend (GET /api/student/access/library-config)
// so labels like "Reserve (2 min hold)" never drift from the real rules.
export function useLibraryConfig() {
  const { data } = useQuery({
    queryKey: ['libraryConfig'],
    queryFn: async () => (await apiClient.get('/api/student/access/library-config')).data?.data,
    staleTime: Infinity,
    retry: false,
  });
  return { ...DEFAULT_CONFIG, ...(data || {}) };
}

// 2 -> "2 minutes", 120 -> "2 hours"
export function formatHold(minutes) {
  if (minutes % 60 === 0) {
    const hours = minutes / 60;
    return `${hours} hour${hours === 1 ? '' : 's'}`;
  }
  return `${minutes} minute${minutes === 1 ? '' : 's'}`;
}

// Compact form for buttons: 2 -> "2 min", 120 -> "2h"
export function formatHoldShort(minutes) {
  return minutes % 60 === 0 ? `${minutes / 60}h` : `${minutes} min`;
}
