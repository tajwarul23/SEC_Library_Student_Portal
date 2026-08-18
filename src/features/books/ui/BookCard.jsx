import React from 'react';
import {
  BookOpen,
  MapPin,
  Clock,
  CheckCircle2,
  ListOrdered,
  Info,
} from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { BookCover } from './BookCover';

export const BookCard = ({
  book,
  onReserve,
  onJoinWaitlist,
  onViewDetails,
  isReserving = false,
  isWaitlisting = false,
  hasFine = false,
}) => {
  const isAvailable = book.availableCopies > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden">
      <div>
        {/* Book Cover Image & Stock Header Strip */}
        <div className="relative h-44 bg-slate-100 overflow-hidden group border-b border-slate-100">
          <BookCover
            url={book.coverImage?.url}
            title={book.title}
            className="w-full h-full"
            iconClassName="w-10 h-10"
          />

          {/* Availability Floating Badge */}
          <div className="absolute top-2.5 right-2.5">
            {isAvailable ? (
              <Badge variant="success" className="shadow-2xs bg-white/95 backdrop-blur-2xs">
                {book.availableCopies} available
              </Badge>
            ) : (
              <Badge variant="warning" className="shadow-2xs bg-white/95 backdrop-blur-2xs">
                0 copies left
              </Badge>
            )}
          </div>

          {/* Category Chip */}
          <div className="absolute bottom-2.5 left-2.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-900/80 text-white backdrop-blur-2xs shadow-2xs">
              {book.category}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2">
          {/* Title */}
          <h3
            onClick={() => onViewDetails(book)}
            className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 hover:text-[#1E3A8A] cursor-pointer transition-colors"
            title={book.title}
          >
            {book.title}
          </h3>

          {/* Authors */}
          <p className="text-[10px] text-slate-500 font-mono line-clamp-1">
            {book.authors.join(', ')}
          </p>

          {/* Metadata Specs Grid */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-500">
            {book.location && (
              <div className="flex items-center gap-1 col-span-2 truncate">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{book.location}</span>
              </div>
            )}
            <div>ISBN: {book.isbn || 'N/A'}</div>
            
          </div>
        </div>
      </div>

      {/* Action Footer Button Group */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
        <Button
          size="xs"
          variant="secondary"
          className="flex-1"
          onClick={() => onViewDetails(book)}
          leftIcon={<Info className="w-3 h-3" />}
        >
          Details
        </Button>

        {isAvailable ? (
          <Button
            size="xs"
            variant="primary"
            className="flex-1"
            isLoading={isReserving}
            disabled={hasFine}
            onClick={() => onReserve(book)}
            leftIcon={<Clock className="w-3 h-3" />}
            title={hasFine ? 'Clear outstanding fine to reserve' : undefined}
          >
            Reserve (2h)
          </Button>
        ) : (
          <Button
            size="xs"
            variant="accent"
            className="flex-1"
            isLoading={isWaitlisting}
            onClick={() => onJoinWaitlist(book._id)}
            leftIcon={<ListOrdered className="w-3 h-3" />}
          >
            Join Waitlist
          </Button>
        )}
      </div>
    </div>
  );
};
