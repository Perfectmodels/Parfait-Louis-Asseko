
import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { BookingRequest } from '../types';
import { 
    UserIcon, 
    EnvelopeIcon, 
    BuildingOffice2Icon,
    UsersIcon,
    CalendarIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface BookingFormProps {
    prefilledModelName?: string;
    onSuccess?: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ prefilledModelName, onSuccess }) => {
    const { data, saveData } = useData();
    const [formData, setFormData] = useState({
        clientName: '',
        clientEmail: '',
        clientCompany: '',
        requestedModels: prefilledModelName || '',
        startDate: '',
        endDate: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        if (prefilledModelName) {
            setFormData(prev => ({ ...prev, requestedModels: prefilledModelName }));
        }
    }, [prefilledModelName]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setStatusMessage('');

        if (!data || !saveData) {
            setStatus('error');
            setStatusMessage('Erreur de configuration. Veuillez nous contacter directement.');
            return;
        }

        const newRequest: BookingRequest = {
            id: `booking-${Date.now()}`,
            submissionDate: new Date().toISOString(),
            status: 'Nouveau',
            ...formData
        };

        try {
            const updatedRequests = [...(data.bookingRequests || []), newRequest];
            await saveData({ ...data, bookingRequests: updatedRequests });

            setStatus('success');
            setStatusMessage('Notre équipe vous contactera dans les plus brefs délais.');
            
            if (onSuccess) onSuccess();

        } catch (error) {
            setStatus('error');
            setStatusMessage("Une erreur est survenue. Veuillez réessayer.");
            console.error("Booking form error:", error);
        }
    };
    
    if (status === 'success') {
        return (
            <div className="text-center py-8 animate-fade-in">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-pm-off-white mb-2">Demande envoyée !</h3>
                <p className="text-pm-off-white/70">{statusMessage}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
                <FormInput icon={UserIcon} name="clientName" placeholder="Votre Nom" value={formData.clientName} onChange={handleChange} required />
                <FormInput icon={EnvelopeIcon} name="clientEmail" type="email" placeholder="Votre Email" value={formData.clientEmail} onChange={handleChange} required />
            </div>
            
            <FormInput icon={BuildingOffice2Icon} name="clientCompany" placeholder="Société (Optionnel)" value={formData.clientCompany} onChange={handleChange} />
            
            <FormInput 
                icon={UsersIcon}
                name="requestedModels" 
                placeholder="Mannequin(s) souhaité(s)" 
                value={formData.requestedModels} 
                onChange={handleChange} 
                required
                disabled={!!prefilledModelName}
            />

            <div className="grid md:grid-cols-2 gap-4">
                <FormInput icon={CalendarIcon} name="startDate" type="date" value={formData.startDate} onChange={handleChange} required title="Date de début souhaitée" />
                <FormInput icon={CalendarIcon} name="endDate" type="date" value={formData.endDate} onChange={handleChange} required title="Date de fin souhaitée" />
            </div>

            <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full bg-black/40 border border-pm-gold/30 rounded-xl p-4 text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 transition-all"
                placeholder="Détails du projet (nature, lieu, budget...)"
                required
            />
            
            <div className="pt-2">
                 {status === 'error' && (
                    <div className="mb-4 flex items-center gap-3 p-3 rounded-lg text-sm border bg-red-900/50 text-red-300 border-red-500/30">
                        <ExclamationTriangleIcon className="w-5 h-5" />
                        {statusMessage}
                    </div>
                )}
                <button type="submit" disabled={status === 'loading'} className="w-full flex items-center justify-center gap-3 px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-wider text-sm rounded-full hover:bg-white transition-all disabled:opacity-60">
                    {status === 'loading' ? 'Envoi en cours...' : 'Envoyer la demande'}
                    <ArrowRightIcon className="w-5 h-5" />
                </button>
            </div>
        </form>
    );
};

const FormInput: React.FC<any> = ({ icon: Icon, ...props }) => (
    <div className="relative">
        {Icon && <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"><Icon className="w-5 h-5 text-pm-gold/60" /></div>}
        <input 
            {...props} 
            className={`w-full bg-black/40 border border-pm-gold/30 rounded-full py-3 text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 transition-all ${Icon ? 'pl-12 pr-4' : 'px-5'} ${props.type === 'date' && !props.value ? 'text-pm-off-white/60' : ''} ${props.disabled ? 'bg-black/60 cursor-not-allowed' : ''}`}
        />
    </div>
);

export default BookingForm;
