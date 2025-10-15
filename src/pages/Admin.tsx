import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
    UsersIcon, BookOpenIcon, NewspaperIcon, CalendarDaysIcon, Cog6ToothIcon, ClipboardDocumentListIcon,
    ArrowRightOnRectangleIcon, KeyIcon, AcademicCapIcon, ExclamationTriangleIcon, PresentationChartLineIcon,
    BuildingStorefrontIcon, SparklesIcon, ChatBubbleLeftRightIcon, BriefcaseIcon, EnvelopeIcon,
    ClipboardDocumentCheckIcon, UserGroupIcon, HomeIcon, CurrencyDollarIcon, CalendarIcon, PaintBrushIcon,
    SignalIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

interface ActiveUser {
    name: string;
    role: string;
    loginTime: number;
}

const getRoleDisplayName = (role: string) => {
    switch (role) {
        case 'admin': return 'Administrateur';
        case 'student': return 'Mannequin Pro';
        case 'beginner': return 'Débutant';
        case 'jury': return 'Jury';
        case 'registration': return 'Enregistrement';
        default: return role;
    }
};

const getRoleColor = (role: string) => {
    switch (role) {
        case 'admin': return 'bg-red-500/20 text-red-300';
        case 'student': return 'bg-pm-gold/20 text-pm-gold';
        case 'beginner': return 'bg-blue-500/20 text-blue-300';
        case 'jury': return 'bg-purple-500/20 text-purple-300';
        case 'registration': return 'bg-teal-500/20 text-teal-300';
        default: return 'bg-gray-500/20 text-gray-300';
    }
}

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const { data } = useData();
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

    useEffect(() => {
        const checkActivity = () => {
            const now = Date.now();
            const fifteenMinutes = 15 * 60 * 1000;
            const currentActivityJSON = localStorage.getItem('pmm_active_users');
            const allUsers: ActiveUser[] = currentActivityJSON ? JSON.parse(currentActivityJSON) : [];
            const recentUsers = allUsers.filter(user => (now - user.loginTime) < fifteenMinutes);
            setActiveUsers(recentUsers);
        };

        checkActivity();
        const interval = setInterval(checkActivity, 5000); // Refresh every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };
    
    const newCastingApps = data?.castingApplications?.filter(app => app.status === 'Nouveau').length || 0;
    const newFashionDayApps = data?.fashionDayApplications?.filter(app => app.status === 'Nouveau').length || 0;
    const newRecoveryRequests = data?.recoveryRequests?.filter(req => req.status === 'Nouveau').length || 0;
    const newBookingRequests = data?.bookingRequests?.filter(req => req.status === 'Nouveau').length || 0;
    const newMessages = data?.contactMessages?.filter(msg => msg.status === 'Nouveau').length || 0;

    // Derived stats
    const modelsCount = data?.models?.length || 0;
    const publicModelsCount = data?.models?.filter(m => m.isPublic)?.length || 0;
    const beginnersCount = data?.beginnerStudents?.length || 0;
    const castingPreselected = data?.castingApplications?.filter(app => app.status === 'Présélectionné')?.length || 0;
    const castingAccepted = data?.castingApplications?.filter(app => app.status === 'Accepté')?.length || 0;

    const articlesCount = (data as any)?.articles?.length || 0;
    const newsCount = data?.newsItems?.length || 0;
    const commentsCount = (data as any)?.articleComments?.length || 0;
    const classroomModules = data?.courseData?.length || 0;

    const bookingsAll = data?.bookingRequests?.length || 0;
    const pfdAppsAll = data?.fashionDayApplications?.length || 0;
    const messagesAll = data?.contactMessages?.length || 0;
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    const paymentsMonth = (data?.monthlyPayments || []).filter(p => p.month === ym).length;
    const absencesMonth = (data?.absences || []).filter(a => (a.date || '').startsWith(ym)).length;

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin Dashboard" noIndex />
            <div className="container mx-auto px-6 lg:px-8">
                <header className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title">Tableau de Bord Administratif</h1>
                        <p className="admin-page-subtitle">Gestion complète de la plateforme Perfect Models Management.</p>
                    </div>
                    <button onClick={handleLogout} className="inline-flex items-center gap-2 text-sm text-pm-gold/80 hover:text-pm-gold">
                        <ArrowRightOnRectangleIcon className="w-5 h-5" /> Déconnexion
                    </button>
                </header>

                <div className="admin-section-wrapper mb-8">
                    <h2 className="admin-section-title flex items-center gap-2"><SignalIcon className="w-6 h-6"/>Activité en Direct</h2>
                    {activeUsers.length > 0 ? (
                        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {activeUsers.map(user => (
                                <li key={user.name} className="bg-pm-dark/50 p-3 rounded-md flex items-center gap-3">
                                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0 animate-pulse"></span>
                                    <div>
                                        <p className="font-semibold text-sm truncate">{user.name}</p>
                                        <p className={`text-xs px-1.5 py-0.5 rounded-full inline-block ${getRoleColor(user.role)}`}>{getRoleDisplayName(user.role)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-pm-off-white/60">Aucun utilisateur actif dans les 15 dernières minutes.</p>
                    )}
                </div>

                {/* Overview stats only; navigation happens via sidebar */}
                <div className="animate-fade-in space-y-10">
                  <StatsSection title="Talents">
                    <Stat icon={UsersIcon} label="Mannequins" value={modelsCount} sub={`${publicModelsCount} publics`} />
                    <Stat icon={UserGroupIcon} label="Débutants" value={beginnersCount} />
                    <Stat icon={ClipboardDocumentListIcon} label="Candidatures (Nouv.)" value={newCastingApps} sub={`Préselection: ${castingPreselected} • Acceptés: ${castingAccepted}`} />
                  </StatsSection>
                  <StatsSection title="Contenu & Formation">
                    <Stat icon={NewspaperIcon} label="Articles" value={articlesCount} />
                    <Stat icon={PresentationChartLineIcon} label="Actualités" value={newsCount} />
                    <Stat icon={ChatBubbleLeftRightIcon} label="Commentaires" value={commentsCount} />
                    <Stat icon={BookOpenIcon} label="Modules Classroom" value={classroomModules} />
                  </StatsSection>
                  <StatsSection title="Opérations">
                    <Stat icon={BriefcaseIcon} label="Bookings (Nouv.)" value={newBookingRequests} sub={`Total: ${bookingsAll}`} />
                    <Stat icon={SparklesIcon} label="PFD (Nouv.)" value={newFashionDayApps} sub={`Total: ${pfdAppsAll}`} />
                    <Stat icon={EnvelopeIcon} label="Messages (Nouv.)" value={newMessages} sub={`Total: ${messagesAll}`} />
                    <Stat icon={CurrencyDollarIcon} label={`Paiements ${ym}`} value={paymentsMonth} />
                    <Stat icon={CalendarIcon} label={`Absences ${ym}`} value={absencesMonth} />
                    <Stat icon={ExclamationTriangleIcon} label="Récupérations (Nouv.)" value={newRecoveryRequests} />
                  </StatsSection>
                </div>
            </div>
        </div>
    );
};

const StatsSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
  <section>
    <h2 className="text-xl font-bold text-pm-off-white/80 mb-4">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {children}
    </div>
  </section>
);

const Stat: React.FC<{ icon: React.ElementType; label: string; value: number | string; sub?: string }>=({ icon:Icon, label, value, sub }) => (
  <div className="bg-black border border-pm-gold/20 rounded-lg p-5 flex items-start gap-4">
    <div className="p-2 rounded-md bg-pm-gold/10 border border-pm-gold/30 text-pm-gold"><Icon className="w-6 h-6"/></div>
    <div>
      <p className="text-sm text-pm-off-white/70">{label}</p>
      <p className="text-2xl font-playfair text-pm-gold leading-tight">{value}</p>
      {sub && <p className="text-xs text-pm-off-white/50 mt-1">{sub}</p>}
    </div>
  </div>
);

export default Admin;