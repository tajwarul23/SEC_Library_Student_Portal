import React from 'react';
import {
  FileText,
  Calendar,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { EmptyState } from '../../../components/common/EmptyState';
import { LoadingState } from '../../../components/common/LoadingState';
import { ErrorState } from '../../../components/common/ErrorState';

const authorNames = (authors) =>
  Array.isArray(authors) ? authors.map((a) => a.name).join(', ') : 'N/A';

export const ResearchPaperList = ({
  papers = [],
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  onViewAbstract,
}) => {
  if (isLoading) {
    return <LoadingState message="Querying academic repository..." description="Retrieving faculty and student publications." />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Unable to access research database."
        errorDetail={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  if (papers.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="w-6 h-6 text-slate-400" />}
        title="No Research Publications Found"
        subtext="No articles or faculty papers match the selected department or query."
      />
    );
  }

  return (
    <div className="space-y-3.5">
      {papers.map((paper) => (
        <div
          key={paper._id}
          className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-start justify-between gap-4"
        >
          {/* Left Content Area */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge department={paper.category}>{paper.category}</Badge>
              {paper.journalName && (
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 truncate max-w-xs">
                  {paper.journalName}
                </span>
              )}
            </div>

            {/* Paper Title */}
            <h3
              onClick={() => onViewAbstract(paper)}
              className="text-sm font-bold text-slate-900 leading-snug hover:text-[#1E3A8A] cursor-pointer transition-colors"
            >
              {paper.title}
            </h3>

            {/* Authors */}
            <p className="text-xs text-slate-600 font-mono">
              Authors: <span className="text-slate-800 font-semibold">{authorNames(paper.authors)}</span>
            </p>

            {/* Abstract Preview */}
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100 font-sans">
              {paper.abstract}
            </p>

            {/* Keywords */}
            {paper.keywords && paper.keywords.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-mono text-slate-400">Keywords:</span>
                {paper.keywords.map((k) => (
                  <span
                    key={k}
                    className="text-[10px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200"
                  >
                    #{k}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Column */}
          <div className="flex md:flex-col items-center justify-between md:justify-start gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 min-w-[140px]">
            <div className="text-xs font-mono text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>
                {paper.publicationDate
                  ? new Date(paper.publicationDate).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>

            <div className="flex md:flex-col gap-1.5 w-full">
              <Button
                size="xs"
                variant="secondary"
                className="w-full"
                onClick={() => onViewAbstract(paper)}
                leftIcon={<Eye className="w-3 h-3" />}
              >
                View Details
              </Button>

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
        </div>
      ))}
    </div>
  );
};
