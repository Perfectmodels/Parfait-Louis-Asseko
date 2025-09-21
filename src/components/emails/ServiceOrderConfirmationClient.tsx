import React from 'react';
import { ServiceOrder } from '../../types';

interface EmailProps {
  order: ServiceOrder;
  agencyName: string;
}

const ServiceOrderConfirmationClient: React.FC<EmailProps> = ({ order, agencyName }) => {
  return (
    <div>
      <h1>Confirmation de votre commande chez {agencyName}</h1>
      <p>Merci pour votre commande, {order.clientInfo.firstName}.</p>
      <p>Nous avons bien reçu votre demande et notre équipe vous contactera sous peu pour finaliser les détails.</p>
      <h2>Récapitulatif de la commande</h2>
      <ul>
        {order.items.map(item => (
          <li key={item.serviceId}>
            {item.serviceTitle} (x{item.quantity}) - {item.price} XOF
          </li>
        ))}
      </ul>
      <h3>Total: {order.totalPrice} XOF</h3>
      <p>L'équipe {agencyName}</p>
    </div>
  );
};

export default ServiceOrderConfirmationClient;
