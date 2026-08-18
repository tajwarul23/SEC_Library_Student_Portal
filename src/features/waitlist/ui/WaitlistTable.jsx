import React from 'react';
import {
  ListOrdered,
  Calendar,
  Trash2,
  Bell,
  Clock,
  BookOpen,
} from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { EmptyState } from '../../../components/common/EmptyState';
import { LoadingState } from '../../../components/common/LoadingState';
import { ErrorState } from '../../../components/common/ErrorState';

export const WaitlistTable = ({
  waitlists = [],
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  onRequestLeave,
  leavingBookId,
}) => {
  if (isLoading) {
    return <LoadingState message="Checking your queued waitlists..." description="Fetching current positions." />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Unable to load your waitlist records."
        errorDetail={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  if (waitlists.length === 0) {
    return (
      <EmptyState
        icon={<ListOrdered className="w-6 h-6 text-slate-400" />}
        title="Your Waitlist Queue is Empty"
        subtext="You have not queued for any currently borrowed books. When books with 0 available copies are returned, queued students receive instant notifications."
      />
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 font-bold">Book Title & Authors</th>
              <th className="py-3 px-4 font-bold">Queued Date</th>
              <th className="py-3 px-4 font-bold">Availability Alert</th>
              <th className="py-3 px-4 font-bold">Queue Status</th>
              <th className="py-3 px-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {waitlists.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                {/* Book Info */}
                <td className="py-3 px-4 font-sans">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs line-clamp-1">
                        {item.bookTitle}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        Authors:{' '}
                        {Array.isArray(item.bookAuthors)
                          ? item.bookAuthors.join(', ')
                          : item.bookAuthors || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Queued Date */}
                <td className="py-3 px-4 text-slate-600 text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </td>

                {/* Notified status */}
                <td className="py-3 px-4">
                  {item.notified ? (
                    <Badge variant="success" className="gap-1">
                      <Bell className="w-3 h-3" />
                      Copy Available Alert Sent
                    </Badge>
                  ) : (
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Awaiting Return
                    </span>
                  )}
                </td>

                {/* Active status */}
                <td className="py-3 px-4">
                  <Badge variant="primary">Active in Queue</Badge>
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right">
                  <Button
                    size="xs"
                    variant="danger"
                    isLoading={leavingBookId === item.book}
                    onClick={() => onRequestLeave(item)}
                    leftIcon={<Trash2 className="w-3 h-3" />}
                  >
                    Leave Queue
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
