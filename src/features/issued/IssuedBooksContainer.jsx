import React, { useState } from 'react';
import { useIssuedBooks } from './Hooks/useIssuedBooks';
import { IssuedBooksTable } from './ui/IssuedBooksTable';
import { SearchFilterBar } from '../../components/common/SearchFilterBar';
import { PaginationControls } from '../../components/common/PaginationControls';

const STATUS_FILTERS = [
  { label: 'All Circulation Records', value: 'all' },
  { label: 'Currently Borrowed', value: 'borrowed' },
  { label: 'Overdue Books', value: 'overdue' },
  { label: 'Returned Books', value: 'returned' },
];

export const IssuedBooksContainer = () => {
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [status, setStatus] = useState('all');

  const { data, isLoading, isError, error, refetch } = useIssuedBooks({
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
        Circulation Ledger &amp; Issued Books
      </h1>

      {/* Filter Bar */}
      <SearchFilterBar
        showSearch={false}
        filters={[
          {
            id: 'status',
            label: 'Circulation Status',
            value: status,
            onChange: (val) => {
              setStatus(val);
              setOffset(0);
            },
            options: STATUS_FILTERS,
          },
        ]}
        totalMatches={totalCount}
        totalMatchesLabel="issued transaction records"
        isFilterActive={status !== 'all'}
        onResetAll={() => {
          setStatus('all');
          setOffset(0);
        }}
      />

      {/* Table */}
      <IssuedBooksTable
        issuedBooks={data?.data || []}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.extractedMessage}
        onRetry={() => refetch()}
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
    </div>
  );
};
