import React from 'react';
import { BookOpenText, User } from 'lucide-react';

export const ChatMessage = ({ role, content, isError = false }) => {
  const isUser = role === 'user';

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

      <div
        className={`max-w-[80%] rounded-lg px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-[#1E3A8A] text-white rounded-tr-none'
            : isError
              ? 'bg-red-50 text-red-700 border border-red-200 rounded-tl-none'
              : 'bg-slate-100 text-slate-800 rounded-tl-none'
        }`}
      >
        {content}
      </div>
    </div>
  );
};
