import { useState, useEffect, useCallback } from 'react';
import { requestNotificationPermission, onForegroundMessage } from '../utils/fcmService';

interface PushState {
    permission: NotificationPermission | 'unsupported';
    token: string | null;
    isLoading: boolean;
}

interface ForegroundNotif {
    title: string;
    body: string;
    icon?: string;
    id: number;
}

export function usePushNotifications(
    onNotification?: (n: ForegroundNotif) => void
) {
    const [state, setState] = useState<PushState>({
        permission: 'Notification' in window ? Notification.permission : 'unsupported',
        token: null,
        isLoading: false,
    });

    const subscribe = useCallback(async () => {
        setState(s => ({ ...s, isLoading: true }));
        const token = await requestNotificationPermission();
        setState({
            permission: 'Notification' in window ? Notification.permission : 'unsupported',
            token,
            isLoading: false,
        });
        return token;
    }, []);

    // Écoute les messages au premier plan
    useEffect(() => {
        if (state.permission !== 'granted') return;
        const unsub = onForegroundMessage((payload) => {
            const notif: ForegroundNotif = { ...payload, id: Date.now() };
            onNotification?.(notif);
        });
        return unsub;
    }, [state.permission, onNotification]);

    return { ...state, subscribe };
}
