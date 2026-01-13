
import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useData } from '../../contexts/DataContext';

const locales = {
  'fr': fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const DashboardCalendar: React.FC = () => {
    const { data } = useData();

    // Map Events to Calendar Format
    const events = React.useMemo(() => {
        if (!data) return [];
        const mappedEvents = [];

        // Fashion Day Events
        if (data.fashionDayEvents) {
            data.fashionDayEvents.forEach((ev, idx) => {
                mappedEvents.push({
                    title: `PFD Édition ${ev.edition}`,
                    start: new Date(ev.date),
                    end: new Date(new Date(ev.date).getTime() + 4 * 60 * 60 * 1000), // Assumed 4 hours
                    allDay: false,
                    resource: 'fashion_day'
                });
            });
        }

        // Briefs (Shooting)
        if (data.photoshootBriefs) {
            data.photoshootBriefs.forEach(brief => {
                mappedEvents.push({
                    title: `Shooting: ${brief.theme}`,
                    start: new Date(brief.dateTime),
                    end: new Date(new Date(brief.dateTime).getTime() + 2 * 60 * 60 * 1000), // Assumed 2 hours
                    allDay: false,
                    resource: 'shooting'
                });
            });
        }

        // Castings (Submission Dates - maybe simpler to just show today's count, but let's show them as all-day events if newly added)
        // Actually, individual casting applications clutter calendar. Let's skip them or group them.
        // Let's stick to Events and Shoots.

        return mappedEvents;
    }, [data]);

    const eventStyleGetter = (event: any) => {
        let backgroundColor = '#3174ad';
        if (event.resource === 'fashion_day') backgroundColor = '#D4AF37';
        if (event.resource === 'shooting') backgroundColor = '#E11D48';

        return {
            style: {
                backgroundColor,
                borderRadius: '5px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    return (
        <div className="h-[400px] bg-pm-dark/50 p-4 rounded-xl border border-pm-gold/10">
            <h3 className="text-xl font-playfair text-pm-gold mb-4">Calendrier</h3>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%', color: '#f0f0f0' }}
                culture='fr'
                eventPropGetter={eventStyleGetter}
                messages={{
                    next: "Suivant",
                    previous: "Précédent",
                    today: "Aujourd'hui",
                    month: "Mois",
                    week: "Semaine",
                    day: "Jour",
                    agenda: "Agenda",
                    date: "Date",
                    time: "Heure",
                    event: "Événement",
                    noEventsInRange: "Aucun événement dans cette période."
                }}
            />
        </div>
    );
};
