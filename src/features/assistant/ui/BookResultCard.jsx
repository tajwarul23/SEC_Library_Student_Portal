import React from 'react';
import { Badge } from '../../../components/common/Badge';

export const BookResultCard = ({ book }) => {
  const { title, authors, category, isbn, topics, description } = book || {};

  return (
    <div className="bg-white border border-slate-200 rounded-md p-2.5 space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-xs font-bold text-slate-800 leading-snug">{title}</h4>
        {category && (
          <Badge variant="primary" className="shrink-0">
            {category}
          </Badge>
        )}
      </div>

      {authors && <p className="text-[11px] text-slate-500">{authors}</p>}

      {description && (
        <p className="text-[11px] text-slate-600 leading-relaxed">{description}</p>
      )}

      {Array.isArray(topics) && topics.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-0.5">
          {topics.map((topic) => (
            <Badge key={topic} variant="neutral">
              {topic}
            </Badge>
          ))}
        </div>
      )}

      {isbn && <p className="text-[10px] text-slate-400 font-mono pt-0.5">ISBN: {isbn}</p>}
    </div>
  );
};
