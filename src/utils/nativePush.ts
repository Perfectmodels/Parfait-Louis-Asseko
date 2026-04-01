import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export const initNativePush = async () => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    // Request permission
    const result = await PushNotifications.requestPermissions();
    
    if (result.receive === 'granted') {
      await PushNotifications.register();
    }

    // Listen for registration
    PushNotifications.addListener('registration', token => {
      console.log('Push registration success, token:', token.value);
      // TODO: Send token to your backend
    });

    // Listen for registration errors
    PushNotifications.addListener('registrationError', error => {
      console.error('Push registration error:', error);
    });

    // Listen for push notifications
    PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push received:', notification);
    });

    // Listen for notification actions
    PushNotifications.addListener('pushNotificationActionPerformed', action => {
      console.log('Push action performed:', action);
    });
  } catch (error) {
    console.error('Error initializing push notifications:', error);
  }
};
