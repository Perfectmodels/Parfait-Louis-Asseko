import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { ServiceOrder, ServiceOrderItem } from '../types';
import { 
  ArrowLeftIcon,
  CheckIcon,
  CreditCardIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Checkout: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { data, saveData } = useData();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'mobile_money' as 'mobile_money' | 'bank_transfer' | 'cash'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = getTotalPrice();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    if (!data || !data.services) {
        setError("Les données de l'application n'ont pas pu être chargées.");
        setIsProcessing(false);
        return;
    }

    const orderItems: ServiceOrderItem[] = items.map(item => {
        const serviceData = data.services.find(s => s.id === item.service.id);
        return {
            serviceId: item.service.id,
            serviceTitle: item.service.title,
            quantity: item.quantity,
            price: serviceData?.price || 0
        }
    });

    const newOrder: ServiceOrder = {
        id: `order-${Date.now()}`,
        submissionDate: new Date().toISOString(),
        status: 'Nouveau',
        clientInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
        },
        items: orderItems,
        totalPrice: totalPrice,
        notes: formData.notes,
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'En attente'
    };

    try {
        const updatedOrders = [...(data.serviceOrders || []), newOrder];
        await saveData({ ...data, serviceOrders: updatedOrders });
        
        // Envoyer les emails
        await fetch('/api/send-service-order-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order: newOrder,
                agencyName: "Perfect Models Management",
                adminEmail: data.contact.notificationEmail
            }),
        });

        setIsProcessing(false);
        setOrderComplete(true);
        clearCart();

    } catch (err) {
        console.error("Erreur lors de la sauvegarde de la commande:", err);
        setError("Une erreur est survenue lors de la soumission de votre commande. Veuillez réessayer.");
        setIsProcessing(false);
    }
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Votre panier est vide</h1>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 bg-pm-gold text-white px-6 py-3 rounded-xl font-semibold hover:bg-pm-gold/90 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Retour aux services
          </Link>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckIcon className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Commande confirmée !</h1>
          <p className="text-gray-600 mb-6">
            Votre commande a été enregistrée avec succès. Un e-mail de confirmation vous a été envoyé. Notre équipe vous contactera dans les plus brefs délais.
          </p>
          <div className="space-y-3">
            <Link
              to="/services"
              className="block w-full bg-pm-gold text-white py-3 rounded-xl font-semibold hover:bg-pm-gold/90 transition-colors"
            >
              Continuer mes achats
            </Link>
            <Link
              to="/"
              className="block w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Commande - Services PMM" 
        description="Finalisez votre commande de services PMM"
        noIndex 
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-pm-gold hover:text-pm-gold/80 transition-colors mb-4"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Retour aux services
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Finaliser votre commande</h1>
            <p className="text-gray-600 mt-2">Remplissez vos informations pour confirmer votre commande</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulaire de commande */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <UserIcon className="w-6 h-6 text-pm-gold" />
                  Informations personnelles
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pm-gold focus:border-transparent transition-colors"
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pm-gold focus:border-transparent transition-colors"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pm-gold focus:border-transparent transition-colors"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pm-gold focus:border-transparent transition-colors"
                          placeholder="+241 XX XX XX XX"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse</label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pm-gold focus:border-transparent transition-colors"
                        placeholder="Votre adresse complète"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ville</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pm-gold focus:border-transparent transition-colors"
                      placeholder="Libreville, Port-Gentil, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Méthode de paiement</label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pm-gold focus:border-transparent transition-colors"
                    >
                      <option value="mobile_money">Mobile Money</option>
                      <option value="bank_transfer">Virement bancaire</option>
                      <option value="cash">Paiement en espèces</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Notes supplémentaires (optionnel)</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pm-gold focus:border-transparent transition-colors resize-none"
                      placeholder="Informations supplémentaires pour votre commande..."
                    />
                  </div>

                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 rounded-xl">
                            {error}
                        </div>
                    )}

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-pm-gold to-yellow-400 text-white font-semibold py-4 px-6 rounded-xl hover:from-yellow-400 hover:to-pm-gold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Traitement en cours...
                      </>
                    ) : (
                      <>
                        <CreditCardIcon className="w-5 h-5" />
                        Confirmer la commande
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Résumé de la commande */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Résumé de la commande</h3>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.service.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-pm-gold to-yellow-400 rounded-lg flex items-center justify-center text-white font-bold">
                        {item.service.title.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{item.service.title}</h4>
                        <p className="text-xs text-gray-500">Quantité: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-pm-gold text-sm">
                        {formatPrice((data?.services.find(s => s.id === item.service.id)?.price || 0) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-semibold">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Frais de service</span>
                    <span className="font-semibold">Gratuit</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-pm-gold">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <CalendarIcon className="w-5 h-5" />
                    <span className="font-semibold text-sm">Prochaines étapes</span>
                  </div>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Confirmation par email</li>
                    <li>• Contact sous 24h</li>
                    <li>• Planification des services</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
