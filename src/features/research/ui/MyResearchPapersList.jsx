import React from 'react';
import { FileText, Calendar, ExternalLink } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';
import { EmptyState } from '../../../components/common/EmptyState';
import { LoadingState } from '../../../components/common/LoadingState';
import { ErrorState } from '../../../components/common/ErrorState';
import { ResearchPaperStatusBadge } from './ResearchPaperStatusBadge';

const authorNames = (authors) =>
  Array.isArray(authors) ? authors.map((a) => a.name).join(', ') : 'N/A';

export const MyResearchPapersList = ({
  papers = [],
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
}) => {
  if (isLoading) {
    return <LoadingState message="Loading your submissions..." description="Retrieving your submitted research papers." />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Unable to load your submissions."
        errorDetail={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  if (papers.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="w-6 h-6 text-slate-400" />}
        title="No Submissions Yet"
        subtext="Papers you submit for review will show up here with their approval status."
      />
    );
  }

  return (
    <div className="space-y-3.5">
      {papers.map((paper) => (
        <div
          key={paper._id}
          className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs flex flex-col md:flex-row md:items-start justify-between gap-4"
        >
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge department={paper.category}>{paper.category}</Badge>
              <ResearchPaperStatusBadge status={paper.status} />
            </div>

            <h3 className="text-sm font-bold text-slate-900 leading-snug">{paper.title}</h3>

            <p className="text-xs text-slate-600 font-mono">
              Authors: <span className="text-slate-800 font-semibold">{authorNames(paper.authors)}</span>
            </p>

            {paper.status === 'rejected' && paper.rejectedBy?.reason && (
              <p className="text-xs text-red-700 bg-red-50 border border-red-200 p-2.5 rounded leading-relaxed">
                <strong>Rejection reason:</strong> {paper.rejectedBy.reason}
              </p>
            )}
          </div>

          <div className="flex md:flex-col items-center justify-between md:justify-start gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 min-w-[140px]">
            <div className="text-xs font-mono text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>
                {paper.createdAt ? new Date(paper.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>

            {paper.paperLink && (
              <a
                href={paper.paperLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-[#1E3A8A] text-white hover:bg-blue-900 transition-colors shadow-2xs font-mono"
              >
                <ExternalLink className="w-3 h-3" />
                <span>PDF / DOI</span>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
