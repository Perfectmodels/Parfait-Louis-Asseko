import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Prevent closing on backdrop click */
  persistent?: boolean;
}

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
  full: 'max-w-[95vw]',
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'lg',
  persistent = false,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && !persistent) onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose, persistent]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={persistent ? undefined : onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className={`relative w-full ${sizeClasses[size]} bg-[#0a0a0a] border border-pm-gold/20 rounded-2xl shadow-2xl shadow-black/60 flex flex-col max-h-[90vh]`}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
                <div className="text-xl font-playfair text-pm-gold">{title}</div>
                <button
                  onClick={onClose}
                  aria-label="Fermer"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 no-scrollbar">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-white/5 shrink-0 flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
