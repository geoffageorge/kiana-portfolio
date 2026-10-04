import { useEffect, useRef } from 'react';
import './Modal.css';

export default function Modal({ open, onClose, title, children, className = '' }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open) { if (dialog.open) dialog.close(); return; }
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; if (dialog.open) dialog.close(); };
  }, [open]);

  return (
    <dialog ref={dialogRef} className={`portfolio-modal ${className}`} aria-labelledby="modal-title" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="portfolio-modal__inner">
        <button type="button" className="portfolio-modal__close" onClick={onClose} aria-label="Close dialog" autoFocus><span aria-hidden="true">×</span></button>
        <h2 id="modal-title">{title}</h2>
        {children}
      </div>
    </dialog>
  );
}
