import React from 'react';
import { Receipt, Calendar } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';
import { EmptyState } from '../../../components/common/EmptyState';
import { LoadingState } from '../../../components/common/LoadingState';
import { ErrorState } from '../../../components/common/ErrorState';

const statusVariant = {
  VALID: 'success',
  PENDING: 'warning',
  FAILED: 'danger',
  CANCELLED: 'neutral',
};

export const PaymentHistoryTable = ({
  transactions = [],
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
}) => {
  if (isLoading) {
    return <LoadingState message="Loading your payment history..." description="Fetching past fine payments." />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Unable to load your payment history."
        errorDetail={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<Receipt className="w-6 h-6 text-slate-400" />}
        title="No Payments Yet"
        subtext="Fine payments made through SSLCommerz will appear here."
      />
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 font-bold">Transaction ID</th>
              <th className="py-3 px-4 font-bold">Date</th>
              <th className="py-3 px-4 font-bold">Amount</th>
              <th className="py-3 px-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {transactions.map((txn) => (
              <tr key={txn._id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 text-slate-700 text-xs">{txn.tran_id}</td>
                <td className="py-3 px-4 text-slate-600 text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{new Date(txn.createdAt).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-bold text-slate-900">৳{txn.amount}</td>
                <td className="py-3 px-4">
                  <Badge variant={statusVariant[txn.status] || 'neutral'}>{txn.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
