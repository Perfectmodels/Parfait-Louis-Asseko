import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Service } from '../types';

interface CartItem {
  service: Service;
  quantity: number;
  customizations?: Record<string, any>;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (service: Service, quantity?: number, customizations?: Record<string, any>) => void;
  removeFromCart: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isInCart: (serviceId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Sauvegarder le panier dans localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('pmm-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pmm-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (service: Service, quantity: number = 1, customizations?: Record<string, any>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.service.id === service.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.service.id === service.id
            ? { ...item, quantity: item.quantity + quantity, customizations: { ...item.customizations, ...customizations } }
            : item
        );
      } else {
        return [...prevItems, { service, quantity, customizations }];
      }
    });
  };

  const removeFromCart = (serviceId: string) => {
    setItems(prevItems => prevItems.filter(item => item.service.id !== serviceId));
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(serviceId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.service.id === serviceId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      // Pour l'instant, on utilise un prix fictif basé sur le type de service
      const basePrice = getServicePrice(item.service);
      return total + (basePrice * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (serviceId: string) => {
    return items.some(item => item.service.id === serviceId);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Fonction utilitaire pour obtenir le prix d'un service
const getServicePrice = (service: Service): number => {
  // Prix fictifs basés sur le type de service
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

  // Chercher par titre ou catégorie
  for (const [key, price] of Object.entries(priceMap)) {
    if (service.title.toLowerCase().includes(key.toLowerCase()) || 
        service.category?.toLowerCase().includes(key.toLowerCase())) {
      return price;
    }
  }

  // Prix par défaut
  return 100000;
};

export default CartContext;
