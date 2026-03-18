import React from 'react';
import Modal from './Modal';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  isLoading?: boolean;
}

const variantStyles = {
  danger: 'bg-red-600 hover:bg-red-500 text-white',
  warning: 'bg-yellow-500 hover:bg-yellow-400 text-black',
  default: 'bg-pm-gold hover:bg-pm-gold/80 text-pm-dark',
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmer l\'action',
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'danger',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" persistent={isLoading}>
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
          variant === 'danger' ? 'bg-red-500/10' : variant === 'warning' ? 'bg-yellow-500/10' : 'bg-pm-gold/10'
        }`}>
          <ExclamationTriangleIcon className={`w-7 h-7 ${
            variant === 'danger' ? 'text-red-400' : variant === 'warning' ? 'text-yellow-400' : 'text-pm-gold'
          }`} />
        </div>
        <div>
          <h3 className="text-lg font-playfair text-pm-off-white mb-1">{title}</h3>
          <p className="text-sm text-pm-off-white/60 leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-sm font-bold rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 text-sm font-bold rounded-xl transition-all disabled:opacity-50 ${variantStyles[variant]}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Traitement...
              </span>
            ) : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
