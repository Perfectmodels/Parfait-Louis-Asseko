import React, { useMemo, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { BellIcon } from '@heroicons/react/24/outline';

const NotificationsDropdown: React.FC = () => {
  const { data } = useData();
  const [open, setOpen] = useState(false);

  const counts = useMemo(() => ({
    newCastingApps: data?.castingApplications?.filter(a => a.status === 'Nouveau').length || 0,
    newFashionDayApps: data?.fashionDayApplications?.filter(a => a.status === 'Nouveau').length || 0,
    newRecoveryRequests: data?.recoveryRequests?.filter(a => a.status === 'Nouveau').length || 0,
    newBookingRequests: data?.bookingRequests?.filter(a => a.status === 'Nouveau').length || 0,
    newMessages: data?.contactMessages?.filter(a => a.status === 'Nouveau').length || 0,
  }), [data]);

  const total = counts.newCastingApps + counts.newFashionDayApps + counts.newRecoveryRequests + counts.newBookingRequests + counts.newMessages;

  const items = [
    { label: 'Candidatures Casting', count: counts.newCastingApps, href: '/admin/casting-applications' },
    { label: 'Candidatures PFD', count: counts.newFashionDayApps, href: '/admin/fashion-day-applications' },
    { label: 'Demandes Booking', count: counts.newBookingRequests, href: '/admin/bookings' },
    { label: 'Messages Contact', count: counts.newMessages, href: '/admin/messages' },
    { label: 'Récupérations', count: counts.newRecoveryRequests, href: '/admin/recovery-requests' },
  ];

  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="relative text-pm-off-white/80 hover:text-white">
        <BellIcon className="w-6 h-6" />
        {total > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 min-w-[1.1rem] text-center">
            {total}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-black border border-pm-gold/20 rounded-lg shadow-xl z-10">
          <div className="p-3 border-b border-pm-gold/10 text-sm text-pm-off-white/70">Notifications</div>
          <ul className="max-h-80 overflow-y-auto">
            {items.map((it) => (
              <li key={it.label}>
                <a href={it.href} className="flex items-center justify-between px-4 py-2 hover:bg-pm-gold/5 text-sm">
                  <span className="text-pm-off-white/80">{it.label}</span>
                  <span className="ml-3 bg-pm-gold/15 text-pm-gold text-xs font-semibold rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
                    {it.count}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
