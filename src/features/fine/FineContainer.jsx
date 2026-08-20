import React, { useEffect, useState } from 'react';
import { CreditCard, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../auth/Hooks/useAuth';
import { usePaymentHistory, useInitPayment } from './Hooks/useFine';
import { PaymentHistoryTable } from './ui/PaymentHistoryTable';
import { PaginationControls } from '../../components/common/PaginationControls';
import { Button } from '../../components/common/Button';

export const FineContainer = () => {
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);

  const { user, refetchUser } = useAuth();
  const fine = user?.fine || 0;

  // The cached user object (useAuth's staleTime) can lag behind fine changes
  // applied server-side (e.g. reservation-expiry cron). Force a fresh read
  // whenever this page is visited so the fine total shown is never stale.
  useEffect(() => {
    refetchUser();
  }, [refetchUser]);

  const { data, isLoading, isError, error, refetch } = usePaymentHistory({ offset, limit });
  const initPaymentMutation = useInitPayment();

  const totalCount = data?.totalCount || 0;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalCount / limit);

  const handlePayNow = async () => {
    try {
      const result = await initPaymentMutation.mutateAsync();
      window.location.href = result.data.gatewayUrl;
    } catch (err) {
      toast.error(err.extractedMessage || 'Failed to start payment. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold tracking-tight text-slate-900 font-serif">
        Fine Payments
      </h1>

      {fine > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 shadow-2xs flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-amber-200/60 rounded text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <div className="text-xs font-semibold text-amber-900">Outstanding Fine</div>
              <div className="text-lg font-bold text-amber-950 font-mono">৳{fine}</div>
            </div>
          </div>
          <Button
            variant="accent"
            isLoading={initPaymentMutation.isPending}
            onClick={handlePayNow}
            leftIcon={<CreditCard className="w-4 h-4" />}
          >
            Pay Now via SSLCommerz
          </Button>
        </div>
      )}

      {fine === 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 shadow-2xs text-emerald-900 text-sm font-medium">
          You have no outstanding fine.
        </div>
      )}

      <h2 className="text-sm font-bold tracking-tight text-slate-800 pt-2">Payment History</h2>

      <PaymentHistoryTable
        transactions={data?.transactions || []}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.extractedMessage}
        onRetry={() => refetch()}
      />

      {!isLoading && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPrevious={() => setOffset(Math.max(0, offset - limit))}
          onNext={() => setOffset(offset + limit)}
        />
      )}
    </div>
  );
};
