import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export const PaginationControls = ({
  currentPage,
  totalPages,
  totalCount,
  onPrevious,
  onNext,
  isLoading = false,
  className = '',
}) => {
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-slate-200 text-xs font-mono ${className}`}
    >
      <div className="text-slate-500">
        Page <strong className="text-slate-800">{currentPage}</strong> of{' '}
        <strong className="text-slate-800">{Math.max(1, totalPages)}</strong>
        {totalCount !== undefined && (
          <span className="text-slate-400 ml-1.5">({totalCount} total records)</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="xs"
          variant="secondary"
          disabled={!hasPrevious || isLoading}
          onClick={onPrevious}
          leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
        >
          Previous
        </Button>
        <Button
          size="xs"
          variant="secondary"
          disabled={!hasNext || isLoading}
          onClick={onNext}
          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
