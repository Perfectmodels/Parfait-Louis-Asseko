import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Link } from 'react-router-dom';
import {
    UsersIcon,
    ClipboardDocumentListIcon,
    EnvelopeIcon,
    ShoppingCartIcon,
    ArrowUpRightIcon
} from '@heroicons/react/24/outline';

const StatCard: React.FC<{ title: string; value: number; icon: React.ElementType; link: string }> = ({ title, value, icon: Icon, link }) => (
    <Link to={link} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="bg-pm-gold/10 p-3 rounded-full">
            <Icon className="h-6 w-6 text-pm-gold" />
        </div>
    </Link>
);

const AdminDashboard: React.FC = () => {
    const { data } = useData();

    const newCastingCount = data?.castingApplications?.filter(c => c.status === 'Nouveau').length || 0;
    const newFashionDayCount = data?.fashionDayApplications?.filter(f => f.status === 'Nouveau').length || 0;
    const newContactMessagesCount = data?.contactMessages?.filter(m => m.status === 'Nouveau').length || 0;
    const newServiceOrdersCount = data?.serviceOrders?.filter(o => o.status === 'Nouveau').length || 0;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Tableau de Bord</h1>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Nouveaux Castings" value={newCastingCount} icon={UsersIcon} link="/admin/casting-applications" />
                <StatCard title="Inscriptions Fashion Day" value={newFashionDayCount} icon={ClipboardDocumentListIcon} link="/admin/fashion-day-applications" />
                <StatCard title="Nouvelles Commandes" value={newServiceOrdersCount} icon={ShoppingCartIcon} link="/admin/service-orders" />
                <StatCard title="Messages de Contact" value={newContactMessagesCount} icon={EnvelopeIcon} link="/admin/messages" />
            </div>

            {/* Recent Activity Feed (Simulation) */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Activité Récente</h2>
                <ul className="divide-y divide-gray-200">
                    {data?.serviceOrders?.slice(0, 3).map(order => (
                        <li key={order.id} className="py-3 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Nouvelle commande de {order.clientInfo.firstName}</p>
                                <p className="text-xs text-gray-500">Montant: {order.totalPrice} XOF</p>
                            </div>
                             <Link to={`/admin/service-orders`} className="text-sm text-pm-gold hover:underline">Voir</Link>
                        </li>
                    ))}
                     {data?.castingApplications?.slice(0, 2).map(app => (
                        <li key={app.id} className="py-3 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Nouvelle candidature de {app.firstName}</p>
                                <p className="text-xs text-gray-500">Casting</p>
                            </div>
                             <Link to={`/admin/casting-applications`} className="text-sm text-pm-gold hover:underline">Voir</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
