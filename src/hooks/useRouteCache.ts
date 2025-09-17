import { useState, useEffect, useCallback } from 'react';

interface CacheEntry {
    data: any;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

class RouteCache {
    private cache = new Map<string, CacheEntry>();
    private defaultTTL = 5 * 60 * 1000; // 5 minutes

    set(key: string, data: any, ttl?: number): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttl || this.defaultTTL
        });
    }

    get(key: string): any | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        const now = Date.now();
        if (now - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    has(key: string): boolean {
        return this.get(key) !== null;
    }

    clear(): void {
        this.cache.clear();
    }

    size(): number {
        return this.cache.size;
    }
}

const routeCache = new RouteCache();

export const useRouteCache = () => {
    const [cacheSize, setCacheSize] = useState(0);

    const setCache = useCallback((key: string, data: any, ttl?: number) => {
        routeCache.set(key, data, ttl);
        setCacheSize(routeCache.size());
    }, []);

    const getCache = useCallback((key: string) => {
        return routeCache.get(key);
    }, []);

    const hasCache = useCallback((key: string) => {
        return routeCache.has(key);
    }, []);

    const clearCache = useCallback(() => {
        routeCache.clear();
        setCacheSize(0);
    }, []);

    useEffect(() => {
        setCacheSize(routeCache.size());
    }, []);

    return {
        setCache,
        getCache,
        hasCache,
        clearCache,
        cacheSize
    };
};
