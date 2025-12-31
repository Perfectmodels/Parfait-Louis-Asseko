import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from './ui/Button';

const NewsletterPopup: React.FC = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check if user has already subscribed or closed the popup
    const hasInteracted = localStorage.getItem('newsletter_interacted');

    if (!hasInteracted) {
      const timer = setTimeout(() => setShow(true), 15000); // Show after 15 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem('newsletter_interacted', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your API
    setSubmitted(true);
    setTimeout(() => {
        handleClose();
    }, 2000);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-pm-dark border border-pm-gold/30 rounded-2xl p-8 max-w-md w-full relative shadow-2xl shadow-pm-gold/10"
          >
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
                <XMarkIcon className="w-6 h-6" />
            </button>

            {!submitted ? (
                <>
                    <h3 className="text-3xl font-playfair text-white mb-2">
                    Restez Informé <span className="text-pm-gold">📬</span>
                    </h3>
                    <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                    Recevez en avant-première nos castings, événements exclusifs et actualités du magazine.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Votre adresse email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-black border border-pm-gold/20 rounded-lg text-white focus:border-pm-gold outline-none transition-colors"
                        />
                        <Button type="submit" className="w-full py-3">
                            S'inscrire
                        </Button>
                        <p className="text-xs text-gray-600 text-center mt-4">
                            Nous respectons votre vie privée. Désabonnement à tout moment.
                        </p>
                    </form>
                </>
            ) : (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">✓</span>
                    </div>
                    <h3 className="text-2xl font-playfair text-white mb-2">Merci !</h3>
                    <p className="text-gray-400">Vous êtes maintenant inscrit à notre newsletter.</p>
                </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;
