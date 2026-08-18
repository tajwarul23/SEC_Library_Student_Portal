import React from 'react';
import { AlertOctagon, RotateCw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  message = 'Failed to load records from library server.',
  errorDetail,
  onRetry,
  className = '',
}) => {
  return (
    <div className={`p-6 text-center bg-red-50/50 border border-red-200 rounded-lg shadow-2xs ${className}`}>
      <div className="w-10 h-10 rounded-full bg-red-100 border border-red-200 mx-auto flex items-center justify-center text-red-600 mb-2.5">
        <AlertOctagon className="w-5 h-5" />
      </div>
      <h3 className="text-xs font-bold text-red-900 uppercase font-mono tracking-tight">System Communication Error</h3>
      <p className="text-xs text-red-700 mt-1 max-w-md mx-auto">{message}</p>
      {errorDetail && (
        <p className="text-[10px] font-mono text-red-500 mt-1 max-w-md mx-auto truncate bg-red-100/60 py-1 px-2 rounded">
          {errorDetail}
        </p>
      )}
      {onRetry && (
        <div className="mt-3.5">
          <Button
            size="xs"
            variant="secondary"
            className="text-red-700 border-red-300 hover:bg-red-50"
            onClick={onRetry}
            leftIcon={<RotateCw className="w-3 h-3" />}
          >
            Retry Request
          </Button>
        </div>
      )}
    </div>
  );
};
