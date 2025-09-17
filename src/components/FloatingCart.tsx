import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { 
  ShoppingCartIcon, 
  XMarkIcon, 
  TrashIcon,
  PlusIcon,
  MinusIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const FloatingCart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (serviceId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(serviceId);
    } else {
      updateQuantity(serviceId, newQuantity);
    }
  };

  return (
    <>
      {/* Bouton flottant du panier */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-pm-gold to-yellow-400 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
        >
          <ShoppingCartIcon className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Modal du panier */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pm-gold to-yellow-400 rounded-full flex items-center justify-center">
                  <ShoppingCartIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Mon Panier</h3>
                  <p className="text-sm text-gray-500">{totalItems} article{totalItems > 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Contenu du panier */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Votre panier est vide</h4>
                  <p className="text-gray-500">Ajoutez des services pour commencer votre commande</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.service.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-pm-gold to-yellow-400 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {item.service.title.charAt(0)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{item.service.title}</h4>
                        <p className="text-sm text-gray-500 truncate">{item.service.category}</p>
                        <p className="text-sm font-semibold text-pm-gold">
                          {formatPrice(getServicePrice(item.service))}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1">
                          <button
                            onClick={() => handleQuantityChange(item.service.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <MinusIcon className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="font-semibold text-gray-900 min-w-[20px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.service.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <PlusIcon className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.service.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer avec total et actions */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-pm-gold">{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Vider le panier
                  </button>
                  
                  <Link
                    to="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 bg-gradient-to-r from-pm-gold to-yellow-400 text-white font-semibold py-3 px-4 rounded-xl hover:from-yellow-400 hover:to-pm-gold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
                  >
                    <CheckIcon className="w-5 h-5" />
                    Commander
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Fonction utilitaire pour obtenir le prix d'un service
const getServicePrice = (service: any): number => {
  const priceMap: Record<string, number> = {
    'Formation Mannequinat': 150000,
    'Séance Photo': 80000,
    'Coaching Personnalisé': 120000,
    'Développement de Carrière': 200000,
    'Styling': 60000,
    'Maquillage Professionnel': 40000,
    'Événementiel': 300000,
    'Défilé': 500000,
  };

  for (const [key, price] of Object.entries(priceMap)) {
    if (service.title.toLowerCase().includes(key.toLowerCase()) || 
        service.category?.toLowerCase().includes(key.toLowerCase())) {
      return price;
    }
  }
  return 100000;
};

export default FloatingCart;
