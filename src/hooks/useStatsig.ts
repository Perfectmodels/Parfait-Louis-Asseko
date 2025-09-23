import { useState, useEffect, useCallback } from 'react';
import statsigService, { StatsigUser } from '../services/statsigService';

export interface UseStatsigReturn {
    isReady: boolean;
    isInitialized: boolean;
    initialize: (user?: StatsigUser) => Promise<boolean>;
    updateUser: (user: StatsigUser) => Promise<void>;
    getFeatureFlag: (flagName: string, defaultValue?: boolean) => Promise<boolean>;
    getConfig: (configName: string, defaultValue?: any) => Promise<any>;
    getExperiment: (experimentName: string, defaultValue?: any) => Promise<any>;
    logEvent: (eventName: string, value?: number, metadata?: Record<string, any>) => Promise<void>;
    logPageView: (pageName: string, metadata?: Record<string, any>) => Promise<void>;
    logUserAction: (action: string, metadata?: Record<string, any>) => Promise<void>;
    logConversion: (conversionName: string, value?: number, metadata?: Record<string, any>) => Promise<void>;
    logError: (error: Error, context?: Record<string, any>) => Promise<void>;
    usageStats: ReturnType<typeof statsigService.getUsageStats>;
}

export const useStatsig = (): UseStatsigReturn => {
    const [isReady, setIsReady] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Vérifier l'état d'initialisation
    useEffect(() => {
        const checkInitialization = () => {
            const ready = statsigService.isReady();
            const initialized = statsigService.getUsageStats().isInitialized;
            
            setIsReady(ready);
            setIsInitialized(initialized);
        };

        checkInitialization();
        
        // Vérifier périodiquement l'état
        const interval = setInterval(checkInitialization, 1000);
        
        return () => clearInterval(interval);
    }, []);

    // Initialiser Statsig
    const initialize = useCallback(async (user?: StatsigUser): Promise<boolean> => {
        const success = await statsigService.initialize(user);
        setIsInitialized(success);
        setIsReady(success);
        return success;
    }, []);

    // Mettre à jour l'utilisateur
    const updateUser = useCallback(async (user: StatsigUser): Promise<void> => {
        await statsigService.updateUser(user);
    }, []);

    // Obtenir une feature flag
    const getFeatureFlag = useCallback(async (flagName: string, defaultValue: boolean = false): Promise<boolean> => {
        return await statsigService.getFeatureFlag(flagName, defaultValue);
    }, []);

    // Obtenir une configuration
    const getConfig = useCallback(async (configName: string, defaultValue: any = null): Promise<any> => {
        return await statsigService.getConfig(configName, defaultValue);
    }, []);

    // Obtenir une expérience
    const getExperiment = useCallback(async (experimentName: string, defaultValue: any = null): Promise<any> => {
        return await statsigService.getExperiment(experimentName, defaultValue);
    }, []);

    // Logger un événement
    const logEvent = useCallback(async (eventName: string, value?: number, metadata?: Record<string, any>): Promise<void> => {
        await statsigService.logEvent(eventName, value, metadata);
    }, []);

    // Logger une page view
    const logPageView = useCallback(async (pageName: string, metadata?: Record<string, any>): Promise<void> => {
        await statsigService.logPageView(pageName, metadata);
    }, []);

    // Logger une action utilisateur
    const logUserAction = useCallback(async (action: string, metadata?: Record<string, any>): Promise<void> => {
        await statsigService.logUserAction(action, metadata);
    }, []);

    // Logger une conversion
    const logConversion = useCallback(async (conversionName: string, value?: number, metadata?: Record<string, any>): Promise<void> => {
        await statsigService.logConversion(conversionName, value, metadata);
    }, []);

    // Logger une erreur
    const logError = useCallback(async (error: Error, context?: Record<string, any>): Promise<void> => {
        await statsigService.logError(error, context);
    }, []);

    // Obtenir les statistiques d'utilisation
    const usageStats = statsigService.getUsageStats();

    return {
        isReady,
        isInitialized,
        initialize,
        updateUser,
        getFeatureFlag,
        getConfig,
        getExperiment,
        logEvent,
        logPageView,
        logUserAction,
        logConversion,
        logError,
        usageStats
    };
};

export default useStatsig;
