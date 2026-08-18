import React from 'react';
import {
  BookMarked,
  Calendar,
  AlertOctagon,
  CheckCircle2,
  Clock,
  BookOpen,
} from 'lucide-react';
import { Badge } from '../../../components/common/Badge';
import { EmptyState } from '../../../components/common/EmptyState';
import { LoadingState } from '../../../components/common/LoadingState';
import { ErrorState } from '../../../components/common/ErrorState';

export const IssuedBooksTable = ({
  issuedBooks = [],
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
}) => {
  if (isLoading) {
    return <LoadingState message="Accessing library ledger..." description="Retrieving borrowing records." />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Unable to load your borrowing history."
        errorDetail={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  if (issuedBooks.length === 0) {
    return (
      <EmptyState
        icon={<BookMarked className="w-6 h-6 text-slate-400" />}
        title="No Issued Books on Record"
        subtext="You do not have any active or previously returned books in the system."
      />
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'borrowed':
        return <Badge variant="primary">Currently Borrowed</Badge>;
      case 'overdue':
        return <Badge variant="danger">Overdue / Action Needed</Badge>;
      case 'returned':
        return <Badge variant="success">Returned</Badge>;
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
              <th className="py-3 px-4 font-bold">Issue ID / Book Title</th>
              <th className="py-3 px-4 font-bold">Borrow Date</th>
              <th className="py-3 px-4 font-bold">Return Due Date</th>
              <th className="py-3 px-4 font-bold text-right">Return Recorded</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {issuedBooks.map((item) => {
              const isOverdue = item.status === 'overdue';

              return (
                <tr
                  key={item.issuedId}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    isOverdue ? 'bg-red-50/30' : ''
                  }`}
                >
                  {/* Book Info */}
                  <td className="py-3 px-4 font-sans">
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-7 h-7 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                          isOverdue
                            ? 'bg-red-100 border-red-200 text-red-700'
                            : 'bg-blue-50 border-blue-200 text-[#1E3A8A]'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs line-clamp-1">
                          {item.bookTitle}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          ID: {item.issuedId} • Authors:{' '}
                          {Array.isArray(item.bookAuthors)
                            ? item.bookAuthors.join(', ')
                            : item.bookAuthors || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Borrowed Date */}
                  <td className="py-3 px-4 text-slate-600 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{new Date(item.borrowedAt).toLocaleDateString()}</span>
                    </div>
                  </td>

                  {/* Due Date */}
                  <td className="py-3 px-4 text-xs">
                    <div
                      className={`flex items-center gap-1 font-semibold ${
                        isOverdue ? 'text-red-700' : 'text-slate-800'
                      }`}
                    >
                      {isOverdue && <AlertOctagon className="w-3.5 h-3.5 text-red-600 animate-pulse" />}
                      <span>{new Date(item.dueDate).toLocaleDateString()}</span>
                    </div>
                    {isOverdue && (
                      <span className="text-[10px] text-red-600 font-mono">
                        Return as soon as possible
                      </span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">{getStatusBadge(item.status)}</td>

                  {/* Returned At */}
                  <td className="py-3 px-4 text-right text-xs text-slate-500 font-mono">
                    {item.returnedAt ? (
                      <span className="text-emerald-700 inline-flex items-center gap-1 justify-end">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {new Date(item.returnedAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">In Possession</span>
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
