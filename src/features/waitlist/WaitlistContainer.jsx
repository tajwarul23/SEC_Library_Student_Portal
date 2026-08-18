import React, { useState } from 'react';
import { useWaitlist, useLeaveWaitlist } from './Hooks/useWaitlist';
import { WaitlistTable } from './ui/WaitlistTable';
import { LeaveWaitlistModal } from './ui/LeaveWaitlistModal';
import { SearchFilterBar } from '../../components/common/SearchFilterBar';
import { PaginationControls } from '../../components/common/PaginationControls';
import toast from 'react-hot-toast';

export const WaitlistContainer = () => {
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [pendingLeaveItem, setPendingLeaveItem] = useState(null);

  const { data, isLoading, isError, error, refetch } = useWaitlist({
    offset,
    limit,
  });

  const leaveMutation = useLeaveWaitlist();

  const handleConfirmLeave = async (bookId) => {
    try {
      await leaveMutation.mutateAsync(bookId);
      toast.success('You have been removed from the waitlist.');
      setPendingLeaveItem(null);
    } catch (err) {
      toast.error(err.extractedMessage || 'Failed to leave waitlist.');
    }
  };

  const totalCount = data?.totalCount || 0;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold tracking-tight text-slate-900 font-serif">
        My Queued Waitlists
      </h1>

      {/* Stat Bar */}
      <SearchFilterBar
        showSearch={false}
        totalMatches={totalCount}
        totalMatchesLabel="active queue requests"
      />

      {/* Waitlist Table */}
      <WaitlistTable
        waitlists={data?.data || []}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.extractedMessage}
        onRetry={() => refetch()}
        onRequestLeave={(item) => setPendingLeaveItem(item)}
        leavingBookId={leaveMutation.isPending ? leaveMutation.variables : null}
      />

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPrevious={() => setOffset(Math.max(0, offset - limit))}
          onNext={() => setOffset(offset + limit)}
        />
      )}

      {/* Leave Confirmation Modal */}
      <LeaveWaitlistModal
        isOpen={Boolean(pendingLeaveItem)}
        onClose={() => setPendingLeaveItem(null)}
        item={pendingLeaveItem}
        onConfirm={handleConfirmLeave}
        isLeaving={leaveMutation.isPending}
      />
    </div>
  );
};
