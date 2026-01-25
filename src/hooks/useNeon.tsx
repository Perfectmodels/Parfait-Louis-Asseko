import { useState, useEffect, useCallback } from 'react';
import { initialData } from '../constants/data';
import { AppData } from './useFirestore'; // Re-use the interface

// Map frontend collection names to SQL table names
const TABLE_MAP: Record<string, string> = {
    'models': 'models',
    'articles': 'articles',
    'newsItems': 'news_items',
    'navLinks': 'nav_links',
    'heroSlides': 'hero_slides',
    'agencyServices': 'services',
    // ... map others
};

export const useNeon = () => {
    const [data, setData] = useState<AppData | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Mock initial data load - in real implementation, this would fetch from /api/data
    // Since we provided the backend, we can try to fetch.

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch config
                const configRes = await fetch('/api/data?collection=app_config');
                const configData = await configRes.json();

                // Fetch models
                const modelsRes = await fetch('/api/data?collection=models');
                const modelsData = await modelsRes.json();

                // Construct AppData (simplified for proof of concept)
                // In a full migration, we would fetch all tables mapped to AppData fields

                // For now, we mix fetched data with initialData to prevent crashes
                const loadedData: any = { ...initialData };

                if (configData && !configData.error) {
                    if (configData.siteConfig) loadedData.siteConfig = configData.siteConfig;
                    if (configData.contactInfo) loadedData.contactInfo = configData.contactInfo;
                }

                if (modelsData && Array.isArray(modelsData)) {
                    loadedData.models = modelsData;
                }

                setData(loadedData);
                setIsInitialized(true);
            } catch (error) {
                console.error("Neon load failed:", error);
                // Fallback
                setData(initialData as unknown as AppData);
                setIsInitialized(true);
            }
        };

        loadData();
    }, []);

    // Placeholder functions for write operations
    const addDocument = async (collection: string, item: any) => {
        const table = TABLE_MAP[collection];
        if (!table) throw new Error(`Table mapping not found for ${collection}`);

        await fetch(`/api/data?collection=${table}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
        return "new_id";
    };

    const updateDocument = async () => { /* ... */ };
    const deleteDocument = async () => { /* ... */ };
    const saveData = async () => { /* ... */ };

    return { data, saveData, isInitialized, addDocument, updateDocument, deleteDocument };
};
