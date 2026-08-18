import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';

// Same confirm-dialog pattern as LeaveWaitlistModal — summary box + warning
// box + Cancel / confirm action. Amber (not red) since this isn't a
// destructive action, just a heads-up about the fine risk.
export const ReserveConfirmModal = ({ isOpen, onClose, book, onConfirm, isReserving = false }) => {
  if (!book) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Reservation"
      subtitle="2-hour collection window applies"
      maxWidth="sm"
      footer={
        <>
          <Button size="xs" variant="secondary" onClick={onClose} disabled={isReserving}>
            Cancel
          </Button>
          <Button
            size="xs"
            variant="primary"
            isLoading={isReserving}
            onClick={() => onConfirm(book)}
            leftIcon={<Clock className="w-3.5 h-3.5" />}
          >
            Confirm Reserve
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
          <div className="font-bold text-slate-900">{book.title}</div>
          <div className="text-slate-600 font-mono">
            {Array.isArray(book.authors) ? book.authors.join(', ') : book.authors || 'N/A'}
          </div>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            Reserving holds this copy for <strong>2 hours</strong>. If you don't collect it at the
            circulation desk within that window, the reservation expires and a{' '}
            <strong>৳20 fine</strong> will be added to your account.
          </p>
        </div>
      </div>
    </Modal>
  );
};
