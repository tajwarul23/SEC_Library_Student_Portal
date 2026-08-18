import React from 'react';
import {
  BookmarkCheck,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { Badge } from '../../../components/common/Badge';
import { CountdownTimer } from '../../../components/common/CountdownTimer';
import { EmptyState } from '../../../components/common/EmptyState';
import { LoadingState } from '../../../components/common/LoadingState';
import { ErrorState } from '../../../components/common/ErrorState';

export const ReservationList = ({
  reservations = [],
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  onTimerExpire,
}) => {
  if (isLoading) {
    return <LoadingState message="Fetching reservations..." description="Checking active hold expirations." />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Unable to load your reservation history."
        errorDetail={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  if (reservations.length === 0) {
    return (
      <EmptyState
        icon={<BookmarkCheck className="w-6 h-6 text-slate-400" />}
        title="No Reservations Recorded"
        subtext="You do not have any pending or past reservations. Browse the catalog to hold available books."
      />
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="primary">Pending Collection</Badge>;
      case 'issued':
        return <Badge variant="success">Collected & Issued</Badge>;
      case 'expired':
        return <Badge variant="danger">Expired Hold</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 font-bold">Hold ID / Book Title</th>
              <th className="py-3 px-4 font-bold">Reserved At</th>
              <th className="py-3 px-4 font-bold">Hold Status</th>
              <th className="py-3 px-4 font-bold">2-Hour Expiration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {reservations.map((res) => {
              const isPending = res.status === 'pending';

              return (
                <tr key={res.reservedId} className="hover:bg-slate-50/70 transition-colors">
                  {/* Book Title & ID */}
                  <td className="py-3 px-4 font-sans">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1E3A8A] shrink-0 mt-0.5">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs line-clamp-1">
                          {res.bookTitle}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          ID: {res.reservedId} • Authors:{' '}
                          {Array.isArray(res.bookAuthors)
                            ? res.bookAuthors.join(', ')
                            : res.bookAuthors || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Reserved At */}
                  <td className="py-3 px-4 text-slate-600 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{new Date(res.reservedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(res.reservedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">{getStatusBadge(res.status)}</td>

                  {/* Countdown Timer or Final Time */}
                  <td className="py-3 px-4">
                    {isPending ? (
                      <CountdownTimer
                        expiresAt={res.expiresAt}
                        onExpire={onTimerExpire}
                      />
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(res.expiresAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
