import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidthClass?: string; // e.g., 'max-w-2xl'
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidthClass = 'max-w-2xl' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const focusables = containerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    const to = setTimeout(() => {
      containerRef.current?.focus();
    }, 50);

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(to);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        ref={containerRef}
        tabIndex={-1}
        className={`bg-pm-dark border border-pm-gold/20 rounded-lg shadow-2xl w-full ${maxWidthClass} max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || title === '') && (
          <header className="p-4 flex justify-between items-center border-b border-pm-gold/20 flex-shrink-0">
            <h2 className="text-2xl font-playfair text-pm-gold">{title}</h2>
            <button onClick={onClose} className="text-pm-off-white/70 hover:text-white" aria-label="Fermer">×</button>
          </header>
        )}
        <main className="p-6 overflow-y-auto flex-grow">{children}</main>
      </div>
    </div>
  );
};

export default Modal;
