import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

interface GlobalSearchProps {
  onClose?: () => void;
  className?: string;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onClose, className = "" }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const { data } = useData();
  const navigate = useNavigate();

  const search = useMemo(() => {
    if (!query || !data) return [];

    const searchResults = [];

    // Search Models
    const models = data.models.filter(m =>
      m.isPublic && m.name.toLowerCase().includes(query.toLowerCase())
    ).map(m => ({ type: 'Mannequin', name: m.name, link: `/mannequins/${m.id}` }));
    searchResults.push(...models);

    // Search Articles
    const articles = data.articles.filter(a =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    ).map(a => ({ type: 'Article', name: a.title, link: `/magazine/${a.slug}` }));
    searchResults.push(...articles);

    // Search Services
    const services = data.agencyServices.filter(s =>
      s.title.toLowerCase().includes(query.toLowerCase())
    ).map(s => ({ type: 'Service', name: s.title, link: `/services/${s.slug}` }));
    searchResults.push(...services);

    return searchResults.slice(0, 8); // Limit results
  }, [query, data]);

  useEffect(() => {
    setResults(search);
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && results.length > 0) {
      navigate(results[0].link);
      onClose?.();
      setQuery('');
    }
  };

  // Keyboard shortcut cmd+k
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('global-search-input');
        input?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          id="global-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher... (⌘K)"
          className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-full text-sm text-white placeholder-white/50 focus:outline-none focus:border-pm-gold focus:bg-black/40 transition-all"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
      </div>

      {query && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full md:w-[300px] right-0 bg-pm-dark border border-pm-gold/20 rounded-lg shadow-2xl overflow-hidden z-50">
          <div className="py-2">
            {results.map((result, index) => (
              <Link
                key={index}
                to={result.link}
                onClick={() => { setQuery(''); onClose?.(); }}
                className="block px-4 py-3 hover:bg-white/5 transition-colors group"
              >
                <div className="flex justify-between items-center">
                    <span className="text-white text-sm font-medium group-hover:text-pm-gold transition-colors truncate max-w-[70%]">{result.name}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider border border-white/10 px-2 py-0.5 rounded-full">{result.type}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="px-4 py-2 bg-black/40 text-xs text-gray-500 text-center border-t border-white/5">
            Appuyez sur Entrée pour le premier résultat
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
