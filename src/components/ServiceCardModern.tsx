import React, { useState } from 'react';
import { Service } from '../types';
import { useCart } from '../contexts/CartContext';
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  StarIcon, 
  ClockIcon,
  UserGroupIcon,
  SparklesIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface ServiceCardModernProps {
  service: Service;
  onQuickView?: (service: Service) => void;
}

const ServiceCardModern: React.FC<ServiceCardModernProps> = ({ service, onQuickView }) => {
  const { addToCart, removeFromCart, updateQuantity, isInCart, items } = useCart();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);

  const cartItem = items.find(item => item.service.id === service.id);
  const quantity = cartItem?.quantity || 0;
  const inCart = isInCart(service.id);

  const handleAddToCart = () => {
    if (inCart) {
      setShowQuantitySelector(true);
    } else {
      addToCart(service, 1);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(service.id);
      setShowQuantitySelector(false);
    } else {
      updateQuantity(service.id, newQuantity);
    }
  };

  const getServicePrice = (service: Service): number => {
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

  const price = getServicePrice(service);
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(price);

  const getServiceIcon = (service: Service) => {
    // Mapping des icônes basé sur le titre ou la catégorie
    if (service.title.toLowerCase().includes('formation') || service.title.toLowerCase().includes('coaching')) {
      return '🎓';
    } else if (service.title.toLowerCase().includes('photo') || service.title.toLowerCase().includes('shooting')) {
      return '📸';
    } else if (service.title.toLowerCase().includes('styling') || service.title.toLowerCase().includes('mode')) {
      return '👗';
    } else if (service.title.toLowerCase().includes('maquillage') || service.title.toLowerCase().includes('beauté')) {
      return '💄';
    } else if (service.title.toLowerCase().includes('défilé') || service.title.toLowerCase().includes('événement')) {
      return '🌟';
    }
    return '✨';
  };

  const getServiceGradient = (service: Service) => {
    if (service.title.toLowerCase().includes('formation') || service.title.toLowerCase().includes('coaching')) {
      return 'from-blue-500 via-purple-500 to-pink-500';
    } else if (service.title.toLowerCase().includes('photo') || service.title.toLowerCase().includes('shooting')) {
      return 'from-orange-500 via-red-500 to-pink-500';
    } else if (service.title.toLowerCase().includes('styling') || service.title.toLowerCase().includes('mode')) {
      return 'from-pink-500 via-rose-500 to-purple-500';
    } else if (service.title.toLowerCase().includes('maquillage') || service.title.toLowerCase().includes('beauté')) {
      return 'from-rose-500 via-pink-500 to-red-500';
    } else if (service.title.toLowerCase().includes('défilé') || service.title.toLowerCase().includes('événement')) {
      return 'from-yellow-500 via-orange-500 to-red-500';
    }
    return 'from-purple-500 via-pink-500 to-blue-500';
  };

  return (
    <div 
      className="group relative bg-black/40 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-pm-gold/20 hover:border-pm-gold/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getServiceGradient(service)} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      
      {/* Header avec icône et actions */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pm-gold to-yellow-400 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
              {getServiceIcon(service)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-pm-off-white group-hover:text-pm-gold transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-sm text-pm-off-white/70 font-medium">
                {service.category || 'Service Premium'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="p-2 rounded-full hover:bg-pm-gold/20 transition-colors duration-200"
            >
              {isFavorited ? (
                <HeartIconSolid className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-pm-off-white/60 hover:text-red-500" />
              )}
            </button>
            
            <div className="flex items-center gap-1">
              <StarIconSolid className="w-4 h-4 text-pm-gold" />
              <span className="text-sm font-semibold text-pm-off-white">4.9</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-pm-off-white/80 leading-relaxed mb-4 line-clamp-3">
          {service.description}
        </p>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-pm-off-white/60 mb-4">
          <div className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            <span>2-4h</span>
          </div>
          <div className="flex items-center gap-1">
            <UserGroupIcon className="w-4 h-4" />
            <span>1-10 pers.</span>
          </div>
          <div className="flex items-center gap-1">
            <SparklesIcon className="w-4 h-4" />
            <span>Premium</span>
          </div>
        </div>
      </div>

      {/* Prix et Actions */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-3xl font-bold text-pm-gold">{formattedPrice}</span>
            <span className="text-sm text-pm-off-white/60 ml-2">/session</span>
          </div>
          
          {inCart && (
            <div className="flex items-center gap-2 bg-pm-gold/10 px-3 py-1 rounded-full">
              <CheckIcon className="w-4 h-4 text-pm-gold" />
              <span className="text-sm font-medium text-pm-gold">Dans le panier</span>
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3">
          {showQuantitySelector || inCart ? (
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-2 bg-pm-gold/10 rounded-full px-3 py-2">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="p-1 rounded-full hover:bg-pm-gold/20 transition-colors"
                >
                  <MinusIcon className="w-4 h-4 text-pm-off-white" />
                </button>
                <span className="font-semibold text-pm-off-white min-w-[20px] text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="p-1 rounded-full hover:bg-pm-gold/20 transition-colors"
                >
                  <PlusIcon className="w-4 h-4 text-pm-off-white" />
                </button>
              </div>
              
              <button
                onClick={() => setShowQuantitySelector(false)}
                className="flex-1 bg-gradient-to-r from-pm-gold to-yellow-400 text-white font-semibold py-3 px-4 rounded-xl hover:from-yellow-400 hover:to-pm-gold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <ShoppingCartIcon className="w-5 h-5 inline mr-2" />
                Modifier
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-pm-gold to-yellow-400 text-white font-semibold py-3 px-4 rounded-xl hover:from-yellow-400 hover:to-pm-gold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                Ajouter au panier
              </button>
              
              {onQuickView && (
                <button
                  onClick={() => onQuickView(service)}
                  className="px-4 py-3 border-2 border-pm-gold text-pm-gold font-semibold rounded-xl hover:bg-pm-gold hover:text-pm-dark transition-all duration-300"
                >
                  Voir
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Badge Premium */}
      <div className="absolute top-4 right-4">
        <div className="bg-gradient-to-r from-pm-gold to-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          PREMIUM
        </div>
      </div>

      {/* Effet de brillance au survol */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      )}
    </div>
  );
};

export default ServiceCardModern;
