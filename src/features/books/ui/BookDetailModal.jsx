import React from 'react';
import {
  BookOpen,
  MapPin,
  Calendar,
  Building,
  Hash,
  Layers,
  Clock,
  ListOrdered,
  AlertTriangle,
} from 'lucide-react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';

export const BookDetailModal = ({
  book,
  isOpen,
  onClose,
  onReserve,
  onJoinWaitlist,
  isReserving = false,
  isWaitlisting = false,
  hasFine = false,
}) => {
  if (!book) return null;

  const isAvailable = book.availableCopies > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={book.title}
      subtitle={`ISBN: ${book.isbn || 'N/A'}`}
      maxWidth="lg"
      footer={
        <>
          <Button size="xs" variant="secondary" onClick={onClose}>
            Close
          </Button>

          {isAvailable ? (
            <Button
              size="xs"
              variant="primary"
              isLoading={isReserving}
              disabled={hasFine}
              onClick={() => onReserve(book)}
              leftIcon={<Clock className="w-3.5 h-3.5" />}
            >
              Reserve Book (2 Hours Hold)
            </Button>
          ) : (
            <Button
              size="xs"
              variant="accent"
              isLoading={isWaitlisting}
              onClick={() => onJoinWaitlist(book._id)}
              leftIcon={<ListOrdered className="w-3.5 h-3.5" />}
            >
              Join Queue Waitlist
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4 text-xs text-slate-700">
        {/* Top Split: Cover and Core Meta */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-36 h-48 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
            {book.coverImage?.url ? (
              <img
                src={book.coverImage.url}
                alt={book.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <BookOpen className="w-8 h-8" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2.5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={isAvailable ? 'success' : 'warning'}>
                  {isAvailable ? `${book.availableCopies} of ${book.totalCopies} Available` : 'All Copies In Use'}
                </Badge>
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {book.category}
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-900 leading-snug">{book.title}</h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                by {book.authors.join(', ')}
              </p>
            </div>

            {/* Hold Rule Warning if fine */}
            {hasFine && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>You have an outstanding fine on record. Reservations are locked until settled.</span>
              </div>
            )}

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              {book.location && (
                <div className="flex items-center gap-1.5 col-span-2 text-slate-800 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#0EA5E9]" />
                  <span>Physical Location: {book.location}</span>
                </div>
              )}
              {book.publisher && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Publisher: {book.publisher}</span>
                </div>
              )}
              {book.publishedYear && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Year: {book.publishedYear}</span>
                </div>
              )}
              {book.edition && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edition: {book.edition}</span>
                </div>
              )}
              {book.isbn && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  <span>ISBN: {book.isbn}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Synopsis / Description */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded border border-slate-200">
            {book.description ||
              'Use the Library Assistant Tool for more information about this book'}
          </p>
        </div>
      </div>
    </Modal>
  );
};
