import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';

// Styled after the admin portal's delete-confirmation modals
// (DeleteBookModal.jsx / DeleteStudentModal.jsx): summary box + red warning
// box + Cancel / destructive confirm action.
export const LeaveWaitlistModal = ({ isOpen, onClose, item, onConfirm, isLeaving = false }) => {
  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Leave Waitlist"
      subtitle="This removes you from the queue for this title"
      maxWidth="sm"
      footer={
        <>
          <Button size="xs" variant="secondary" onClick={onClose} disabled={isLeaving}>
            Cancel
          </Button>
          <Button
            size="xs"
            variant="danger"
            isLoading={isLeaving}
            onClick={() => onConfirm(item.book)}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Confirm Leave
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
          <div className="font-bold text-slate-900">{item.bookTitle}</div>
          <div className="text-slate-600 font-mono">
            {Array.isArray(item.bookAuthors) ? item.bookAuthors.join(', ') : item.bookAuthors || 'N/A'}
          </div>
        </div>

        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p>
            Are you sure you want to leave the waitlist for <strong>"{item.bookTitle}"</strong>? You'll
            lose your position in the queue and won't be notified if a copy becomes available.
          </p>
        </div>
      </div>
    </Modal>
  );
};
