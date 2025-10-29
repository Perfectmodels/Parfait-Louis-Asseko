import React, { useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { FashionDayApplication, FashionDayApplicationRole } from '../types';
import { Link } from 'react-router-dom';

const FashionDayApplicationForm: React.FC = () => {
    const { data, saveData } = useData();
    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        phone: string;
        role: FashionDayApplicationRole;
        message: string;
    }>({
        name: '',
        email: '',
        phone: '',
        role: 'Mannequin',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        if (!data) {
            setStatus('error');
            setStatusMessage('Erreur: Impossible de charger les données de l\'application.');
            return;
        }

        const newApplication: FashionDayApplication = {
            ...formData,
            id: `pfd-${Date.now()}`,
            submissionDate: new Date().toISOString(),
            status: 'Nouveau',
        };

        try {
            const updatedApplications = [...(data.fashionDayApplications || []), newApplication];
            await saveData({ ...data, fashionDayApplications: updatedApplications });

            setStatus('success');
            setStatusMessage('Votre candidature a été envoyée ! L\'équipe du Perfect Fashion Day vous recontactera prochainement.');
            setFormData({ name: '', email: '', phone: '', role: 'Mannequin', message: '' });

        } catch (error) {
            setStatus('error');
            setStatusMessage("Une erreur est survenue lors de l'envoi de votre candidature.");
            console.error(error);
        }
    };
    
    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Candidature Perfect Fashion Day" description="Postulez pour participer à la prochaine édition du Perfect Fashion Day. Mannequins, stylistes, photographes, partenaires, rejoignez l'aventure." noIndex />
            <div className="container mx-auto px-6 max-w-2xl">
                <h1 className="text-5xl font-playfair text-pm-gold text-center mb-4">Candidature Perfect Fashion Day</h1>
                <p className="text-center max-w-2xl mx-auto text-pm-off-white/80 mb-12">
                    Vous souhaitez participer à la prochaine édition ? Remplissez le formulaire ci-dessous.
                </p>
                <form onSubmit={handleSubmit} className="bg-black p-8 border border-pm-gold