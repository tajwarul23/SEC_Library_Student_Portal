import React from 'react';
import { BookCard } from './BookCard';
import { EmptyState } from '../../../components/common/EmptyState';
import { LoadingState } from '../../../components/common/LoadingState';
import { ErrorState } from '../../../components/common/ErrorState';
import { BookOpen } from 'lucide-react';

export const BookGrid = ({
  books = [],
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  onReserve,
  onJoinWaitlist,
  onViewDetails,
  reservingId,
  waitlistingId,
  hasFine = false,
  emptyTitle = 'No Books Found',
  emptySubtext = 'No physical books match the current category filter or catalog query.',
}) => {
  if (isLoading) {
    return <LoadingState message="Loading catalog collection..." description="Syncing shelf holdings from library records." />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to retrieve books from library database."
        errorDetail={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  if (books.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen className="w-6 h-6 text-slate-400" />}
        title={emptyTitle}
        subtext={emptySubtext}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {books.map((book) => (
        <BookCard
          key={book._id}
          book={book}
          onReserve={onReserve}
          onJoinWaitlist={onJoinWaitlist}
          onViewDetails={onViewDetails}
          isReserving={reservingId === book._id}
          isWaitlisting={waitlistingId === book._id}
          hasFine={hasFine}
        />
      ))}
    </div>
  );
};
