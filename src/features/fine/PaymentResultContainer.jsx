import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react';
import { usePaymentStatus, PAYMENT_STATUS_POLL_TIMEOUT_MS } from './Hooks/useFine';
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

  // Stop showing the spinner after the polling window (see usePaymentStatus)
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), PAYMENT_STATUS_POLL_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

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

  const isPending = isLoading || !transaction || transaction.status === 'PENDING';
  const isConfirming = isPending && !timedOut;

  return (
    <div className="max-w-md mx-auto mt-12 bg-white border border-slate-200 rounded-lg p-8 text-center shadow-2xs">
      {isPending && timedOut ? (
        <>
          <Clock className="w-10 h-10 text-amber-600 mx-auto mb-4" />
          <h2 className="text-base font-bold text-slate-900">Still Waiting for Confirmation</h2>
          <p className="text-xs text-slate-500 mt-1">
            SSLCommerz hasn't confirmed this payment yet. If you were charged, your fine will be
            cleared automatically once it's confirmed. Check your Payment History in a few minutes.
          </p>
        </>
      ) : isConfirming ? (
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
