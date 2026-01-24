import { useState, useEffect } from 'react';
import { messaging } from '../firebaseConfig';
import { getToken, onMessage } from 'firebase/messaging';

export const useNotifications = () => {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [fcmToken, setFcmToken] = useState<string | null>(null);

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!messaging) return;

        try {
            const permission = await Notification.requestPermission();
            setPermission(permission);

            if (permission === 'granted') {
                const token = await getToken(messaging, {
                    vapidKey: "BMw2Fw2Fw2Fw2Fw2Fw2Fw2Fw2Fw2Fw2Fw2Fw" // Placeholder VAPID key. User needs to replace this.
                });
                if (token) {
                    console.log("FCM Token:", token);
                    setFcmToken(token);
                    // Ideally, send this token to your server or save it in Firestore for the user
                }
            }
        } catch (error) {
            console.error("An error occurred while retrieving token. ", error);
        }
    };

    useEffect(() => {
        if (!messaging) return;

        // Listen for foreground messages
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Message received. ', payload);
            // Customize notification handling here (e.g. show a toast)
            new Notification(payload.notification?.title || 'New Message', {
                body: payload.notification?.body,
                icon: '/logo.jpg'
            });
        });

        return () => unsubscribe();
    }, []);

    return { permission, requestPermission, fcmToken };
};
