import React, { useState, useEffect } from 'react';
import { useBooks, useBookSearch, useBookActions } from './Hooks/useBooks';
import { useAuth } from '../auth/Hooks/useAuth';
import { BookGrid } from './ui/BookGrid';
import { BookDetailModal } from './ui/BookDetailModal';
import { ReserveConfirmModal } from './ui/ReserveConfirmModal';
import { PaginationControls } from '../../components/common/PaginationControls';
import { SearchFilterBar } from '../../components/common/SearchFilterBar';
import toast from 'react-hot-toast';

const SEARCH_DEBOUNCE_MS = 300;

// Values must match the real Book.category enum (book-model.js) exactly —
// the backend rejects/ignores anything outside this list.
const CATEGORIES = [
  { label: 'All Disciplines', value: 'All' },
  { label: 'CSE', value: 'CSE' },
  { label: 'EEE', value: 'EEE' },
  { label: 'CE', value: 'CE' },
  { label: 'Physics', value: 'PHYSICS' },
  { label: 'Chemistry', value: 'CHEMISTRY' },
  { label: 'Math', value: 'MATH' },
  { label: 'Arts', value: 'ARTS' },
  { label: 'History', value: 'HISTORY' },
  { label: 'General', value: 'GENERAL' },
  { label: 'Others', value: 'OTHERS' },
];

// Browse + Search live on one screen. The real search endpoint doesn't
// support category filtering or pagination (it returns its whole match set
// in one response), so those two controls are hidden while a search is
// active — same pattern used for the admin portal's student search.
export const BrowseBooksContainer = () => {
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [category, setCategory] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingReserveBook, setPendingReserveBook] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const isSearching = debouncedQuery.trim().length > 0;

  const browseQuery = useBooks({ offset, limit, category });
  const searchQuery = useBookSearch(debouncedQuery);

  const { data, isLoading, isError, error, refetch } = isSearching ? searchQuery : browseQuery;

  const { reserveMutation, waitlistMutation } = useBookActions();

  const handleRequestReserve = (book) => {
    setPendingReserveBook(book);
    setIsModalOpen(false); // avoid stacking the confirm modal on top of the detail modal
  };

  const handleConfirmReserve = async (book) => {
    try {
      const res = await reserveMutation.mutateAsync(book._id);
      toast.success(res.message || 'Book reserved successfully.');
      setPendingReserveBook(null);
    } catch (err) {
      toast.error(err.extractedMessage || 'Failed to reserve book.');
    }
  };

  const handleWaitlist = async (bookId) => {
    try {
      const res = await waitlistMutation.mutateAsync(bookId);
      toast.success(res.message || 'Joined waitlist successfully.');
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.extractedMessage || 'Failed to join waitlist.');
    }
  };

  const handleViewDetails = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const totalCount = data?.totalCount || 0;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold tracking-tight text-slate-900 font-serif">Library Catalog</h1>

      {/* Search + Category Filter Head Bar */}
      <SearchFilterBar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchClear={() => {
          setSearchInput('');
          setDebouncedQuery('');
        }}
        searchPlaceholder="Search by title, author, ISBN, or category..."
        filters={
          isSearching
            ? []
            : [
                {
                  id: 'category',
                  label: 'Discipline',
                  value: category,
                  onChange: (val) => {
                    setCategory(val);
                    setOffset(0);
                  },
                  options: CATEGORIES,
                },
              ]
        }
        totalMatches={totalCount}
        totalMatchesLabel={isSearching ? `books matching "${debouncedQuery}"` : 'books in catalog'}
        isFilterActive={isSearching || category !== 'All'}
        onResetAll={() => {
          setSearchInput('');
          setDebouncedQuery('');
          setCategory('All');
          setOffset(0);
        }}
      />

      {/* Grid Canvas */}
      <BookGrid
        books={data?.data || []}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.extractedMessage}
        onRetry={() => refetch()}
        onReserve={handleRequestReserve}
        onJoinWaitlist={handleWaitlist}
        onViewDetails={handleViewDetails}
        reservingId={reserveMutation.isPending ? reserveMutation.variables : null}
        waitlistingId={waitlistMutation.isPending ? waitlistMutation.variables : null}
        hasFine={(user?.fine || 0) > 0}
        emptyTitle={isSearching ? 'No Matching Books Found' : 'No Books Found'}
        emptySubtext={
          isSearching
            ? `No titles or authors matched your search query "${debouncedQuery}". Try searching with alternate keywords.`
            : 'No physical books match the current category filter or catalog query.'
        }
      />

      {/* Pagination Footer — search results are unpaginated by the backend,
          so this only applies in browse mode. */}
      {!isSearching && !isLoading && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPrevious={() => setOffset(Math.max(0, offset - limit))}
          onNext={() => setOffset(offset + limit)}
        />
      )}

      {/* Detail Modal */}
      <BookDetailModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReserve={handleRequestReserve}
        onJoinWaitlist={handleWaitlist}
        isReserving={reserveMutation.isPending}
        isWaitlisting={waitlistMutation.isPending}
        hasFine={(user?.fine || 0) > 0}
      />

      {/* Reserve Confirmation Modal */}
      <ReserveConfirmModal
        isOpen={Boolean(pendingReserveBook)}
        onClose={() => setPendingReserveBook(null)}
        book={pendingReserveBook}
        onConfirm={handleConfirmReserve}
        isReserving={reserveMutation.isPending}
      />
    </div>
  );
};
