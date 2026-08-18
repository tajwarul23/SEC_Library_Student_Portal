import React, { useState } from 'react';
import { useReservations } from './Hooks/useReservations';
import { ReservationList } from './ui/ReservationList';
import { SearchFilterBar } from '../../components/common/SearchFilterBar';
import { PaginationControls } from '../../components/common/PaginationControls';

const STATUS_OPTIONS = [
  { label: 'All Holds & Statuses', value: 'all' },
  { label: 'Pending Collection (Active)', value: 'pending' },
  { label: 'Issued (Completed)', value: 'issued' },
  { label: 'Expired', value: 'expired' },
];

export const ReservationsContainer = () => {
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [status, setStatus] = useState('all');

  const { data, isLoading, isError, error, refetch } = useReservations({
    offset,
    limit,
    status,
  });

  const totalCount = data?.totalCount || 0;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold tracking-tight text-slate-900 font-serif">
        My Active Reservations
      </h1>

      {/* Header & Filter */}
      <SearchFilterBar
        showSearch={false}
        filters={[
          {
            id: 'status',
            label: 'Hold Status',
            value: status,
            onChange: (val) => {
              setStatus(val);
              setOffset(0);
            },
            options: STATUS_OPTIONS,
          },
        ]}
        totalMatches={totalCount}
        totalMatchesLabel="total reservations"
        isFilterActive={status !== 'all'}
        onResetAll={() => {
          setStatus('all');
          setOffset(0);
        }}
      />

      {/* Reservation Table */}
      <ReservationList
        reservations={data?.data || []}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.extractedMessage}
        onRetry={() => refetch()}
        onTimerExpire={() => refetch()}
      />

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPrevious={() => setOffset(Math.max(0, offset - limit))}
          onNext={() => setOffset(offset + limit)}
        />
      )}
    </div>
  );
};
