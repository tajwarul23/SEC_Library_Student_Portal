import React, { useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { usePaymentStatus } from './Hooks/useFine';
import { PAYMENT_HISTORY_QUERY_KEY } from './Hooks/useFine';
import { USER_QUERY_KEY } from '../../lib/queryClient';
import { Button } from '../../components/common/Button';

// SSLCommerz's success/fail/cancel redirect is UX-only and not proof of a
// cleared fine (the backend never trusts it) — this page polls the real,
// server-validated transaction status instead of trusting the `status` query param.
export const PaymentResultContainer = () => {
  const [searchParams] = useSearchParams();
  const tranId = searchParams.get('tran_id');
  const redirectStatus = searchParams.get('status');

  const queryClient = useQueryClient();
  const { data, isLoading } = usePaymentStatus(tranId);
  const transaction = data?.data;

  const notifiedRef = useRef(false);
  useEffect(() => {
    if (transaction?.status === 'VALID' && !notifiedRef.current) {
      notifiedRef.current = true;
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PAYMENT_HISTORY_QUERY_KEY] });
    }
  }, [transaction?.status, queryClient]);

  if (!tranId) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white border border-slate-200 rounded-lg p-8 text-center shadow-2xs">
        <p className="text-sm text-slate-600">No transaction reference found.</p>
        <Link to="/fine" className="inline-block mt-4">
          <Button variant="secondary">Back to Fine Payments</Button>
        </Link>
      </div>
    );
  }

  const isConfirming = isLoading || !transaction || transaction.status === 'PENDING';

  return (
    <div className="max-w-md mx-auto mt-12 bg-white border border-slate-200 rounded-lg p-8 text-center shadow-2xs">
      {isConfirming ? (
        <>
          <Loader2 className="w-10 h-10 text-[#1E3A8A] animate-spin mx-auto mb-4" />
          <h2 className="text-base font-bold text-slate-900">Confirming Payment...</h2>
          <p className="text-xs text-slate-500 mt-1">
            We're verifying your payment directly with SSLCommerz. This can take a few moments.
          </p>
        </>
      ) : transaction.status === 'VALID' ? (
        <>
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-base font-bold text-slate-900">Payment Confirmed</h2>
          <p className="text-xs text-slate-500 mt-1">
            ৳{transaction.amount} has been applied to your fine.
          </p>
        </>
      ) : (
        <>
          <XCircle className="w-10 h-10 text-red-600 mx-auto mb-4" />
          <h2 className="text-base font-bold text-slate-900">
            Payment {redirectStatus === 'cancel' ? 'Cancelled' : 'Not Completed'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Your fine was not cleared. You can try again from the Fine Payments page.
          </p>
        </>
      )}

      <Link to="/fine" className="inline-block mt-5">
        <Button variant="secondary">Back to Fine Payments</Button>
      </Link>
    </div>
  );
};
