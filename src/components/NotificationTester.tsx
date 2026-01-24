import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

const NotificationTester = () => {
    const { permission, requestPermission, fcmToken } = useNotifications();

    return (
        <div className="p-4 border rounded shadow-md bg-white max-w-sm mx-auto my-4 text-center">
            <h3 className="text-lg font-bold mb-2">Notifications Push</h3>
            <p className="mb-4">Statut: <span className={`font-semibold ${permission === 'granted' ? 'text-green-600' : 'text-yellow-600'}`}>{permission}</span></p>

            {permission !== 'granted' && (
                <button
                    onClick={requestPermission}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Activer les notifications
                </button>
            )}

            {fcmToken && (
                <div className="mt-4 text-xs text-left bg-gray-100 p-2 rounded break-all">
                    <strong>Token FCM:</strong>
                    <p>{fcmToken}</p>
                    <p className="mt-2 text-gray-500 italic">Copiez ce token pour envoyer une notif test depuis la console Firebase.</p>
                </div>
            )}
        </div>
    );
};

export default NotificationTester;
