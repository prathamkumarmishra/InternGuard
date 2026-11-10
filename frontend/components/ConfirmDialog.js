'use client';
import { Modal } from './Modal';

export function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirm action', message = 'Are you sure you want to proceed?', confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'primary', loading = false }) {
  const buttonClass = variant === 'danger'
    ? 'rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-50'
    : 'button-primary disabled:opacity-50';

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm leading-6 text-muted">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button className="button-secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </button>
        <button
          className={buttonClass}
          onClick={() => { onConfirm(); }}
          disabled={loading}
        >
          {loading ? 'Processing…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
