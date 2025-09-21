import React from 'react';
import { ServiceOrder } from '../../types';

interface EmailProps {
  order: ServiceOrder;
}

const ServiceOrderNotificationAdmin: React.FC<EmailProps> = ({ order }) => {
  return (
    <div>
      <h1>Nouvelle commande de service reçue</h1>
      <p>Une nouvelle commande a été passée sur le site.</p>
      <h2>Détails de la commande</h2>
      <ul>
        <li><strong>ID de la commande:</strong> {order.id}</li>
        <li><strong>Client:</strong> {order.clientInfo.firstName} {order.clientInfo.lastName}</li>
        <li><strong>Email:</strong> {order.clientInfo.email}</li>
        <li><strong>Téléphone:</strong> {order.clientInfo.phone}</li>
        <li><strong>Montant total:</strong> {order.totalPrice} XOF</li>
      </ul>
      <h2>Services commandés</h2>
      <ul>
        {order.items.map(item => (
          <li key={item.serviceId}>
            {item.serviceTitle} (x{item.quantity})
          </li>
        ))}
      </ul>
      <p>Veuillez vous connecter au panneau d'administration pour voir les détails complets et traiter la commande.</p>
    </div>
  );
};

export default ServiceOrderNotificationAdmin;
