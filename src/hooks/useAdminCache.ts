import { useState, useEffect, useCallback, useRef } from 'react';
import { useData } from '../contexts/DataContext';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface AdminCache {
  models: CacheEntry<any[]>;
  beginnerStudents: CacheEntry<any[]>;
  castingApplications: CacheEntry<any[]>;
  fashionDayApplications: CacheEntry<any[]>;
  contactMessages: CacheEntry<any[]>;
  accountingTransactions: CacheEntry<any[]>;
  fashionDayEvents: CacheEntry<any[]>;
  articles: CacheEntry<any[]>;
  newsItems: CacheEntry<any[]>;
  albums: CacheEntry<any[]>;
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export const useAdminCache = () => {
  const { data } = useData();
  const cacheRef = useRef<Partial<AdminCache>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Fonction pour vérifier si une entrée de cache est valide
  const isCacheValid = useCallback((entry: CacheEntry<any> | undefined): boolean => {
    if (!entry) return false;
    const now = Date.now();
    return (now - entry.timestamp) < entry.ttl;
  }, []);

  // Fonction pour mettre en cache des données
  const setCache = useCallback(<T>(key: keyof AdminCache, data: T, ttl: number = DEFAULT_TTL) => {
    cacheRef.current[key] = {
      data,
      timestamp: Date.now(),
      ttl
    };
  }, []);

  // Fonction pour récupérer des données du cache
  const getCache = useCallback(<T>(key: keyof AdminCache): T | null => {
    const entry = cacheRef.current[key];
    if (isCacheValid(entry)) {
      return entry.data as T;
    }
    return null;
  }, [isCacheValid]);

  // Fonction pour mettre à jour le cache avec les données Firebase
  const updateCache = useCallback(() => {
    if (!data) return;

    const now = Date.now();
    
    // Mettre en cache les données principales
    if (data.models) {
      setCache('models', data.models);
    }
    if (data.beginnerStudents) {
      setCache('beginnerStudents', data.beginnerStudents);
    }
    if (data.castingApplications) {
      setCache('castingApplications', data.castingApplications);
    }
    if (data.fashionDayApplications) {
      setCache('fashionDayApplications', data.fashionDayApplications);
    }
    if (data.contactMessages) {
      setCache('contactMessages', data.contactMessages);
    }
    if (data.accountingTransactions) {
      setCache('accountingTransactions', data.accountingTransactions);
    }
    if (data.fashionDayEvents) {
      setCache('fashionDayEvents', data.fashionDayEvents);
    }
    if (data.articles) {
      setCache('articles', data.articles);
    }
    if (data.newsItems) {
      setCache('newsItems', data.newsItems);
    }
    if (data.albums) {
      setCache('albums', data.albums);
    }

    setIsInitialized(true);
  }, [data, setCache]);

  // Mettre à jour le cache uniquement lors du premier chargement
  useEffect(() => {
    if (data && !isInitialized) {
      updateCache();
    }
  }, [data, isInitialized, updateCache]);

  // Fonction pour forcer la mise à jour du cache
  const forceUpdateCache = useCallback(() => {
    updateCache();
  }, [updateCache]);

  // Fonction pour vider le cache
  const clearCache = useCallback(() => {
    cacheRef.current = {};
    setIsInitialized(false);
  }, []);

  // Fonction pour obtenir des données avec cache
  const getCachedData = useCallback(<T>(key: keyof AdminCache, fallback: T): T => {
    const cached = getCache<T>(key);
    return cached !== null ? cached : fallback;
  }, [getCache]);

  return {
    isInitialized,
    getCachedData,
    forceUpdateCache,
    clearCache,
    isCacheValid: (key: keyof AdminCache) => {
      const entry = cacheRef.current[key];
      return isCacheValid(entry);
    }
  };
};
