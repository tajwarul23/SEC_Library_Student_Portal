import React from 'react';
import { BookOpenText, User } from 'lucide-react';
import { BookResultCard } from './BookResultCard';

// Only these response types carry a "books" payload worth rendering as
// cards — matches the backend's contract (SYSTEM_PROMPT: "books appears
// ONLY for book_list or single_book"). Every other type — including any
// the backend adds later — falls through to plain text.
const BOOK_RESPONSE_TYPES = new Set(['book_list', 'single_book']);

export const ChatMessage = ({ role, content, books, type, isError = false }) => {
  const isUser = role === 'user';
  const hasBooks = BOOK_RESPONSE_TYPES.has(type) && Array.isArray(books) && books.length > 0;

  return (
    <div className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
          isUser ? 'bg-[#1E3A8A]' : 'bg-slate-700'
        }`}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-white" />
        ) : (
          <BookOpenText className="w-3.5 h-3.5 text-white" />
        )}
      </div>

      <div className={`max-w-[85%] space-y-2 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {content && (
          <div
            className={`rounded-lg px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap wrap-break-word ${
              isUser
                ? 'bg-[#1E3A8A] text-white rounded-tr-none'
                : isError
                  ? 'bg-red-50 text-red-700 border border-red-200 rounded-tl-none'
                  : 'bg-slate-100 text-slate-800 rounded-tl-none'
            }`}
          >
            {content}
          </div>
        )}

        {hasBooks && (
          <div className="w-full space-y-2">
            {books.map((book, idx) => (
              <BookResultCard key={`${book.title || 'book'}-${idx}`} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
