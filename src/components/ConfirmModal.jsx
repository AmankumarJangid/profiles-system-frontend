import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import styles from './ConfirmModal.module.css';

export default function ConfirmModal({ isOpen, onConfirm, onCancel, title, message, confirmLabel = 'Delete', loading = false }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel} aria-modal="true" role="dialog">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onCancel} aria-label="Close">
          <X size={18} />
        </button>

        <div className={styles.iconWrap}>
          <AlertTriangle size={28} className={styles.icon} />
        </div>

        <h2 className={styles.title}>{title || 'Are you sure?'}</h2>
        <p className={styles.message}>{message || 'This action cannot be undone.'}</p>

        <div className={styles.actions}>
          <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : null}
            {loading ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
