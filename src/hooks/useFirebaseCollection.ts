/**
 * useFirebaseCollection
 * ---------------------
 * Charge une collection Firebase Realtime DB avec pagination côté client.
 * Évite de re-lire toute la DB à chaque render.
 *
 * Stratégie :
 *  - Lecture unique (get) au lieu de listener temps-réel (onValue)
 *  - Cache en mémoire par chemin pour éviter les re-lectures inutiles
 *  - Pagination locale sur les données déjà chargées
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ref, get, query, orderByChild, limitToLast } from 'firebase/database';
import { db } from '../realtimedbConfig';
import logger from '../utils/logger';

// Cache en mémoire — survit aux re-renders, pas aux rechargements de page
const memoryCache = new Map<string, { data: any[]; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface UseFirebaseCollectionOptions {
  pageSize?: number;
  orderBy?: string;
  /** Si true, utilise onValue (temps réel) au lieu de get (lecture unique) */
  realtime?: boolean;
}

interface UseFirebaseCollectionResult<T> {
  items: T[];
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  goToPage: (p: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  refresh: () => void;
}

export function useFirebaseCollection<T = any>(
  path: string,
  options: UseFirebaseCollectionOptions = {}
): UseFirebaseCollectionResult<T> {
  const { pageSize = 20, orderBy: orderByField } = options;

  const [allItems, setAllItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    abortRef.current = false;

    // Vérifier le cache
    const cached = memoryCache.get(path);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      logger.log(`📦 Cache hit: ${path}`);
      setAllItems(cached.data as T[]);
      setIsLoading(false);
      return;
    }

    try {
      const dbRef = orderByField
        ? query(ref(db, path), orderByChild(orderByField))
        : ref(db, path);

      const snapshot = await get(dbRef);

      if (abortRef.current) return;

      if (!snapshot.exists()) {
        setAllItems([]);
        memoryCache.set(path, { data: [], timestamp: Date.now() });
        return;
      }

      const raw = snapshot.val();
      const arr: T[] = Array.isArray(raw)
        ? raw.filter(Boolean)
        : Object.values(raw as Record<string, T>).filter(Boolean);

      // Tri décroissant par date si le champ existe
      if (orderByField) {
        arr.sort((a: any, b: any) => {
          const va = a[orderByField] ?? '';
          const vb = b[orderByField] ?? '';
          return vb > va ? 1 : vb < va ? -1 : 0;
        });
      }

      memoryCache.set(path, { data: arr, timestamp: Date.now() });
      setAllItems(arr);
      logger.log(`✅ Loaded ${arr.length} items from ${path}`);
    } catch (err: any) {
      if (!abortRef.current) {
        logger.error(`Error loading ${path}:`, err);
        setError(err.message ?? 'Erreur de chargement');
      }
    } finally {
      if (!abortRef.current) setIsLoading(false);
    }
  }, [path, orderByField]);

  useEffect(() => {
    fetchData();
    return () => { abortRef.current = true; };
  }, [fetchData]);

  const totalPages = Math.max(1, Math.ceil(allItems.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const items = allItems.slice((safePage - 1) * pageSize, safePage * pageSize);

  const refresh = useCallback(() => {
    memoryCache.delete(path);
    setPage(1);
    fetchData();
  }, [path, fetchData]);

  return {
    items,
    page: safePage,
    totalPages,
    isLoading,
    error,
    goToPage: (p) => setPage(Math.max(1, Math.min(p, totalPages))),
    nextPage: () => setPage(p => Math.min(p + 1, totalPages)),
    prevPage: () => setPage(p => Math.max(p - 1, 1)),
    refresh,
  };
}

/** Invalide le cache d'un chemin (après écriture) */
export function invalidateCache(path: string) {
  memoryCache.delete(path);
}

/** Invalide tout le cache */
export function clearAllCache() {
  memoryCache.clear();
}
