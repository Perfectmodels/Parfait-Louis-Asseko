import { useMemo } from 'react';
import { useData } from '../../contexts/DataContext';

export interface AdminNotifications {
    casting: number;
    fashionDay: number;
    recovery: number;
    bookings: number;
    messages: number;
    total: number;
}

export const useAdminNotifications = (): AdminNotifications => {
    const { data } = useData();

    return useMemo(() => {
        const casting = data?.castingApplications?.filter(app => app.status === 'Nouveau').length || 0;
        const fashionDay = data?.fashionDayApplications?.filter(app => app.status === 'Nouveau').length || 0;
        const recovery = data?.recoveryRequests?.filter(req => req.status === 'Nouveau').length || 0;
        const bookings = data?.bookingRequests?.filter(req => req.status === 'Nouveau').length || 0;
        const messages = data?.contactMessages?.filter(msg => msg.status === 'Nouveau').length || 0;

        return {
            casting,
            fashionDay,
            recovery,
            bookings,
            messages,
            total: casting + fashionDay + recovery + bookings + messages
        };
    }, [data]);
};