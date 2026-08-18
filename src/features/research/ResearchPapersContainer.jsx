import React, { useState, useEffect } from 'react';
import { useResearchPapers, useResearchPaperSearch, useMyResearchPapers } from './Hooks/useResearchPapers';
import { ResearchPaperList } from './ui/ResearchPaperList';
import { MyResearchPapersList } from './ui/MyResearchPapersList';
import { SubmitResearchPaperForm } from './ui/SubmitResearchPaperForm';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SearchFilterBar } from '../../components/common/SearchFilterBar';
import { PaginationControls } from '../../components/common/PaginationControls';
import { ExternalLink } from 'lucide-react';

const SEARCH_DEBOUNCE_MS = 300;

const TABS = [
  { key: 'browse', label: 'Browse Repository' },
  { key: 'submit', label: 'Submit a Paper' },
  { key: 'my-submissions', label: 'My Submissions' },
];

const MY_STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'ALL' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

const BrowseTab = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isSearching = Boolean(debouncedQuery.trim());

  // Browse and search both hit real, paginated backend endpoints — unlike
  // book search, research paper search DOES support page/limit server-side,
  // so pagination stays active in both modes off the same `page` state.
  const papersQuery = useResearchPapers({ page, limit });
  const searchQueryResult = useResearchPaperSearch({ query: debouncedQuery, page, limit });

  const activeResult = isSearching ? searchQueryResult : papersQuery;
  const papers = activeResult.data?.papers || [];
  const totalCount = activeResult.data?.pagination?.totalPapers || 0;
  const totalPages = activeResult.data?.pagination?.totalPages || 1;

  const handleViewAbstract = (paper) => {
    setSelectedPaper(paper);
    setIsModalOpen(true);
  };

  const authorNames = (authors) =>
    Array.isArray(authors) ? authors.map((a) => a.name).join(', ') : 'N/A';

  return (
    <div className="space-y-4">
      {/* Search Bar — the real backend has no department/category filter on
          the plain browse endpoint, so there's no filter dropdown here. */}
      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setPage(1);
        }}
        onSearchClear={() => {
          setSearchQuery('');
          setDebouncedQuery('');
          setPage(1);
        }}
        searchPlaceholder="Search academic publications, authors, keywords, DOI..."
        totalMatches={totalCount}
        totalMatchesLabel={
          isSearching ? `articles matching "${debouncedQuery}"` : 'indexed research papers'
        }
      />

      {/* Publications List */}
      <ResearchPaperList
        papers={papers}
        isLoading={activeResult.isLoading}
        isError={activeResult.isError}
        errorMessage={activeResult.error?.extractedMessage}
        onRetry={() => activeResult.refetch()}
        onViewAbstract={handleViewAbstract}
      />

      {/* Pagination Controls */}
      {!activeResult.isLoading && totalPages > 1 && (
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          totalCount={totalCount}
          onPrevious={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      )}

      {/* Abstract Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPaper?.title || 'Academic Paper Abstract'}
        subtitle={selectedPaper?.journalName || selectedPaper?.conferenceName}
        maxWidth="lg"
        footer={
          <>
            <Button size="xs" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            {selectedPaper?.paperLink && (
              <a
                href={selectedPaper.paperLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#1E3A8A] text-white hover:bg-blue-900 transition-colors shadow-2xs font-mono"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Full Text / DOI</span>
              </a>
            )}
          </>
        }
      >
        {selectedPaper && (
          <div className="space-y-4 text-xs text-slate-700">
            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-100">
              <Badge department={selectedPaper.category}>{selectedPaper.category}</Badge>
              {selectedPaper.doi && (
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  DOI: {selectedPaper.doi}
                </span>
              )}
            </div>

            {/* Title & Authors */}
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-snug">
                {selectedPaper.title}
              </h2>
              <p className="text-xs text-slate-600 font-mono mt-1">
                <strong>Authors:</strong> {authorNames(selectedPaper.authors)}
              </p>
              {selectedPaper.publicationDate && (
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  <strong>Published Date:</strong>{' '}
                  {new Date(selectedPaper.publicationDate).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Abstract Full Text */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                Full Abstract
              </h4>
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
                {selectedPaper.abstract || 'No abstract available for this paper.'}
              </div>
            </div>

            {/* Keywords */}
            {selectedPaper.keywords && selectedPaper.keywords.length > 0 && (
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-500 font-semibold">
                  Field Descriptors:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPaper.keywords.map((k) => (
                    <span
                      key={k}
                      className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

const MySubmissionsTab = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { data, isLoading, isError, error, refetch } = useMyResearchPapers({
    status: statusFilter,
    page,
    limit,
  });

  const papers = data?.papers || [];
  const totalCount = data?.pagination?.totalPapers || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="space-y-4">
      <SearchFilterBar
        showSearch={false}
        filters={[
          {
            id: 'status',
            label: 'Status',
            value: statusFilter,
            onChange: (val) => {
              setStatusFilter(val);
              setPage(1);
            },
            options: MY_STATUS_OPTIONS,
          },
        ]}
        isFilterActive={statusFilter !== 'ALL'}
        onResetAll={() => {
          setStatusFilter('ALL');
          setPage(1);
        }}
        totalMatches={totalCount}
        totalMatchesLabel="submissions"
      />

      <MyResearchPapersList
        papers={papers}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.extractedMessage}
        onRetry={() => refetch()}
      />

      {!isLoading && totalPages > 1 && (
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          totalCount={totalCount}
          onPrevious={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      )}
    </div>
  );
};

export const ResearchPapersContainer = () => {
  const [activeTab, setActiveTab] = useState('browse');

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 font-serif">
          Institutional Research Papers
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Browse the approved repository, submit your own work for review, or track your submissions.
        </p>
      </div>

      <div className="flex items-center gap-1 border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
              activeTab === tab.key
                ? 'border-[#1E3A8A] text-[#1E3A8A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'browse' && <BrowseTab />}
      {activeTab === 'submit' && (
        <SubmitResearchPaperForm onSuccess={() => setActiveTab('my-submissions')} />
      )}
      {activeTab === 'my-submissions' && <MySubmissionsTab />}
    </div>
  );
};
