import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { BookingRequest } from '../types';

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

        if (!data) {
            setStatus('error');
            setStatusMessage('Erreur: Impossible de charger les données.');
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
            setStatusMessage('Demande de booking envoyée ! Notre équipe vous contactera prochainement.');
            setFormData({
                clientName: '', clientEmail: '', clientCompany: '',
                requestedModels: prefilledModelName || '', startDate: '', endDate: '', message: ''
            });
            if (onSuccess) onSuccess();
        } catch (error) {
            setStatus('error');
            setStatusMessage("Une erreur est survenue lors de l'envoi de votre demande.");
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Votre Nom Complet" name="clientName" value={formData.clientName} onChange={handleChange} required />
                <FormInput label="Votre Email" name="clientEmail" type="email" value={formData.clientEmail} onChange={handleChange} required />
            </div>
            <FormInput label="Société (optionnel)" name="clientCompany" value={formData.clientCompany} onChange={handleChange} />
            <FormInput 
                label="Mannequin(s) souhaité(s)" 
                name="requestedModels" 
                value={formData.requestedModels} 
                onChange={handleChange} 
                required 
                disabled={!!prefilledModelName}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Date de début (souhaitée)" name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
                <FormInput label="Date de fin (souhaitée)" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
            </div>
            <FormTextArea label="Message / Détails du projet" name="message" value={formData.message} onChange={handleChange} required />

            <div>
                <button type="submit" disabled={status === 'loading'} className="w-full px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all hover:bg-white disabled:opacity-50">
                    {status === 'loading' ? 'Envoi...' : 'Envoyer la demande'}
                </button>
            </div>
            {statusMessage && (
                <p className={`text-center text-sm p-3 rounded-md ${status === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {statusMessage}
                </p>
            )}
        </form>
    );
};

const FormInput: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, required?: boolean, disabled?: boolean}> = (props) => (
    <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <input {...props} id={props.name} className="admin-input" />
    </div>
);

const FormTextArea: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, required?: boolean}> = (props) => (
    <div>
        <label htmlFor={props.name} className="admin-label">{props.label}</label>
        <textarea {...props} id={props.name} rows={5} className="admin-input admin-textarea" />
    </div>
);

export default BookingForm;
