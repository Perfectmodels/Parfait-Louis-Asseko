import React, { useMemo, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const { data } = useData();
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query || !data) return [] as { type: string; label: string; href: string }[];
    const r: { type: string; label: string; href: string }[] = [];

    // Models
    (data.models || []).forEach(m => {
      if (m.name.toLowerCase().includes(query)) r.push({ type: 'Mannequin', label: m.name, href: `/mannequins/${m.id}` });
    });
    // Articles
    (data.articles || []).forEach(a => {
      if (a.title.toLowerCase().includes(query)) r.push({ type: 'Article', label: a.title, href: `/magazine/${a.slug}` });
    });
    // Bookings
    (data.bookingRequests || []).forEach(b => {
      if (b.clientName?.toLowerCase().includes(query)) r.push({ type: 'Booking', label: `${b.clientName} (${b.status})`, href: `/admin/bookings` });
    });
    // Messages
    (data.contactMessages || []).forEach(m => {
      if (m.subject?.toLowerCase().includes(query) || m.name?.toLowerCase().includes(query)) r.push({ type: 'Message', label: `${m.subject} – ${m.name}`, href: `/admin/messages` });
    });

    return r.slice(0, 20);
  }, [q, data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur">
      <div className="mx-auto mt-24 max-w-2xl bg-black border border-pm-gold/20 rounded-xl overflow-hidden">
        <div className="flex items-center px-4 py-3 border-b border-pm-gold/10">
          <MagnifyingGlassIcon className="w-5 h-5 text-pm-gold" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher (mannequins, articles, bookings, messages)"
            className="flex-1 bg-transparent outline-none px-3 text-pm-off-white"
          />
          <button onClick={onClose} className="text-pm-off-white/70 hover:text-white">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <p className="p-4 text-sm text-pm-off-white/60">Aucun résultat</p>
          ) : (
            <ul className="divide-y divide-pm-gold/10">
              {results.map((r, idx) => (
                <li key={idx}>
                  <a href={r.href} className="flex items-center gap-2 px-4 py-3 hover:bg-pm-gold/5">
                    <span className="text-xs text-pm-gold/80">{r.type}</span>
                    <span className="text-sm text-pm-off-white">{r.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
