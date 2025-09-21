import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { ServiceOrder } from '../../types';
import { EyeIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const AdminServiceOrders: React.FC = () => {
    const { data } = useData();
    const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);

    const orders = data?.serviceOrders || [];

    const getStatusChip = (status: ServiceOrder['status']) => {
        switch (status) {
            case 'Nouveau':
                return <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">{status}</span>;
            case 'En traitement':
                return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">{status}</span>;
            case 'Terminé':
                return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">{status}</span>;
            case 'Annulé':
                return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">{status}</span>;
            default:
                return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">{status}</span>;
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestion des Commandes de Services</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.submissionDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.clientInfo.firstName} {order.clientInfo.lastName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.totalPrice} XOF</td>
                                <td className="px-6 py-4 whitespace-nowrap">{getStatusChip(order.status)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => setSelectedOrder(order)} className="text-indigo-600 hover:text-indigo-900">
                                        <EyeIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold">Détails de la commande #{selectedOrder.id}</h2>
                        </div>
                        <div className="p-6">
                            <p><strong>Client:</strong> {selectedOrder.clientInfo.firstName} {selectedOrder.clientInfo.lastName}</p>
                            <p><strong>Email:</strong> {selectedOrder.clientInfo.email}</p>
                            <p><strong>Téléphone:</strong> {selectedOrder.clientInfo.phone}</p>
                            <p><strong>Date:</strong> {new Date(selectedOrder.submissionDate).toLocaleString()}</p>
                            <h3 className="font-bold mt-4">Services Commandés</h3>
                            <ul>
                                {selectedOrder.items.map(item => (
                                    <li key={item.serviceId}>{item.serviceTitle} (x{item.quantity}) - {item.price} XOF</li>
                                ))}
                            </ul>
                            <p className="font-bold mt-4">Total: {selectedOrder.totalPrice} XOF</p>
                             <div className="mt-6 flex justify-end gap-3">
                                <button className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2"><CheckCircleIcon className="w-5 h-5" /> Confirmer</button>
                                <button className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2"><XCircleIcon className="w-5 h-5" /> Annuler</button>
                                <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg flex items-center gap-2"><ClockIcon className="w-5 h-5" /> En attente</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminServiceOrders;
