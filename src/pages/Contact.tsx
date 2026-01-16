import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { CastingApplication, ContactMessage, FashionDayApplication, FashionDayApplicationRole } from '../types';
import MultiImageUploader from '../components/MultiImageUploader';
import ParallaxHero from '../components/ui/ParallaxHero';
import FadeIn from '../components/ui/FadeIn';

type InquiryType =
    | 'general'
    | 'booking'
    | 'show'
    | 'training'
    | 'model-application'
    | 'pfd-application';

const INQUIRY_TYPES = {
    'general': "Demande d'information générale",
    'booking': "Booking Mannequins",
    'show': "Organisation de défilé",
    'training': "Formation de mannequin",
    'model-application': "Candidature Spontanée (Mannequin)",
    'pfd-application': "Candidature Perfect Fashion Day",
};

const Contact: React.FC = () => {
    const { data, saveData } = useData();
    const location = useLocation();
    const navigate = useNavigate();

    const getInquiryTypeFromQuery = (): InquiryType => {
        const params = new URLSearchParams(location.search);
        const service = params.get('service');
        const subject = params.get('subject');

        if (subject === 'casting') return 'model-application';
        if (subject === 'pfd') return 'pfd-application';
        if (service === 'Booking Mannequins') return 'booking';
        if (service === 'Organisation Défilés de Mode') return 'show';
        if (service === 'Formation Mannequins') return 'training';
        
        return 'general';
    };

    const [inquiryType, setInquiryType] = useState<InquiryType>(getInquiryTypeFromQuery());
    
    // Form States
    const [generalInfo, setGeneralInfo] = useState({ name: '', email: '', phone: '', message: '' });
    const [modelAppData, setModelAppData] = useState({
        firstName: '', lastName: '', birthDate: '', email: '', phone: '', nationality: '', city: '',
        gender: 'Femme' as 'Homme' | 'Femme', height: '', weight: '', chest: '', waist: '', hips: '', shoeSize: '',
        eyeColor: '', hairColor: '', experience: 'none', instagram: '', portfolioLink: ''
    });
    const [portfolioPhotos, setPortfolioPhotos] = useState<string[]>([]);
    const [pfdAppData, setPfdAppData] = useState({ name: '', email: '', phone: '', role: 'Mannequin' as FashionDayApplicationRole, message: '' });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    
    useEffect(() => {
        setInquiryType(getInquiryTypeFromQuery());
    }, [location.search]);

    const handleInquiryTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as InquiryType;
        setInquiryType(newType);
        // Reset status when changing form type
        setStatus('idle');
        setStatusMessage('');
        // Update URL query parameter
        const params = new URLSearchParams(location.search);
        params.set('subject', newType);
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        if (!data) {
            setStatus('error');
            setStatusMessage('Erreur: Impossible de charger les données de l\'application.');
            return;
        }

        try {
            let successMsg = "Votre message a bien été envoyé.";
            switch (inquiryType) {
                case 'model-application':
                    const newModelApplication: CastingApplication = {
                        ...modelAppData,
                        id: `casting-${Date.now()}`,
                        submissionDate: new Date().toISOString(),
                        status: 'Nouveau',
                        portfolioPhotos: portfolioPhotos,
                    };
                    const updatedCastingApplications = [...(data.castingApplications || []), newModelApplication];
                    await saveData({ ...data, castingApplications: updatedCastingApplications });
                    successMsg = 'Votre candidature a été envoyée avec succès ! Nous vous contacterons si votre profil est retenu.';
                    // Reset form
                    setModelAppData({
                        firstName: '', lastName: '', birthDate: '', email: '', phone: '', nationality: '', city: '',
                        gender: 'Femme', height: '', weight: '', chest: '', waist: '', hips: '', shoeSize: '',
                        eyeColor: '', hairColor: '', experience: 'none', instagram: '', portfolioLink: ''
                    });
                    setPortfolioPhotos([]);
                    break;

                case 'pfd-application':
                    const newPfdApplication: FashionDayApplication = {
                        ...pfdAppData,
                        id: `pfd-${Date.now()}`,
                        submissionDate: new Date().toISOString(),
                        status: 'Nouveau',
                    };
                    const updatedPfdApplications = [...(data.fashionDayApplications || []), newPfdApplication];
                    await saveData({ ...data, fashionDayApplications: updatedPfdApplications });
                    successMsg = 'Votre candidature pour le PFD a été envoyée ! L\'équipe vous recontactera prochainement.';
                    setPfdAppData({ name: '', email: '', phone: '', role: 'Mannequin', message: '' });
                    break;
                
                default: // General, booking, show, training
                    const newContactMessage: ContactMessage = {
                        ...generalInfo,
                        id: `msg-${Date.now()}`,
                        date: new Date().toISOString(),
                        subject: INQUIRY_TYPES[inquiryType],
                        status: 'Nouveau',
                    };
                    const updatedMessages = [...(data.contactMessages || []), newContactMessage];
                    await saveData({ ...data, contactMessages: updatedMessages });
                    setGeneralInfo({ name: '', email: '', phone: '', message: '' });
                    break;
            }
            setStatus('success');
            setStatusMessage(successMsg);
        } catch (error) {
            setStatus('error');
            setStatusMessage("Une erreur est survenue lors de l\'envoi de votre formulaire.");
            console.error(error);
        }
    };

    const renderFormFields = () => {
        switch (inquiryType) {
            case 'model-application':
                return <ModelApplicationForm data={modelAppData} setData={setModelAppData} portfolioPhotos={portfolioPhotos} setPortfolioPhotos={setPortfolioPhotos} />;
            case 'pfd-application':
                return <PfdApplicationForm data={pfdAppData} setData={setPfdAppData} />;
            default:
                return <GeneralInquiryForm data={generalInfo} setData={setGeneralInfo} inquiryType={inquiryType} />;
        }
    };
    
    return (
        <div className="bg-pm-dark text-pm-off-white min-h-screen">
            <SEO title="Contact & Candidatures" description="Contactez Perfect Models Management pour toute demande ou postulez directement à nos castings ou événements." />
            
            <ParallaxHero
                image={data?.siteImages?.contact || "https://i.ibb.co/bL36hG3/contact-hero.jpg"}
                title="Contact & Candidatures"
                subtitle="Une question ? Une ambition ? C'est ici que tout commence."
                height="h-[50vh]"
            />

            <div className="page-container -mt-20 relative z-20 max-w-4xl mx-auto">
                <FadeIn>
                     <form onSubmit={handleSubmit} className="bg-black/80 backdrop-blur-md p-8 md:p-12 border border-white/10 rounded-2xl shadow-2xl space-y-10">
                        <Section title="Objet de votre demande">
                            <FormSelect label="Quel est l'objet de votre message ?" name="inquiryType" value={inquiryType} onChange={handleInquiryTypeChange} required>
                                {Object.entries(INQUIRY_TYPES).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </FormSelect>
                        </Section>

                        {renderFormFields()}

                        <div className="pt-6">
                            <button type="submit" disabled={status === 'loading'} className="w-full px-8 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all hover:bg-white hover:scale-[1.01] shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none">
                                {status === 'loading' ? 'Envoi en cours...' : 'Envoyer'}
                            </button>
                        </div>

                        {statusMessage && (
                            <div className={`text-center text-sm p-4 rounded-md border ${status === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                                {statusMessage}
                            </div>
                        )}
                    </form>
                </FadeIn>
            </div>
        </div>
    );
};


// Form Section Components
const GeneralInquiryForm: React.FC<{ data: any, setData: Function, inquiryType: InquiryType }> = ({ data, setData, inquiryType }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    return (
        <Section title="Vos Informations">
             <div className="grid md:grid-cols-2 gap-6">
                <FormInput label="Nom complet" name="name" value={data.name} onChange={handleChange} required />
                <FormInput label="Email" name="email" type="email" value={data.email} onChange={handleChange} required />
            </div>
            <FormInput label="Téléphone" name="phone" type="tel" value={data.phone} onChange={handleChange} />
            <FormTextArea label="Votre message" name="message" value={data.message} onChange={handleChange} rows={6} required 
                placeholder={
                    inquiryType === 'booking' ? "Précisez la nature de l'événement, les dates, le type de profil recherché..." :
                    inquiryType === 'show' ? "Décrivez votre projet de défilé, la date envisagée, le lieu, le nombre de mannequins..." :
                    inquiryType === 'training' ? "Indiquez vos motivations et vos questions concernant nos formations..." :
                    "Comment pouvons-nous vous aider ?"
                }
            />
        </Section>
    );
};

const ModelApplicationForm: React.FC<{ data: any, setData: Function, portfolioPhotos: string[], setPortfolioPhotos: Function }> = ({ data, setData, portfolioPhotos, setPortfolioPhotos }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    return (
        <>
            <Section title="Informations Personnelles">
                <div className="grid md:grid-cols-2 gap-6">
                    <FormInput label="Prénom" name="firstName" value={data.firstName} onChange={handleChange} required />
                    <FormInput label="Nom" name="lastName" value={data.lastName} onChange={handleChange} required />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormInput label="Date de Naissance" name="birthDate" type="date" value={data.birthDate} onChange={handleChange} required />
                    <FormSelect label="Genre" name="gender" value={data.gender} onChange={handleChange} required>
                        <option value="Femme">Femme</option>
                        <option value="Homme">Homme</option>
                    </FormSelect>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormInput label="Nationalité" name="nationality" value={data.nationality} onChange={handleChange} required />
                    <FormInput label="Ville de résidence" name="city" value={data.city} onChange={handleChange} required />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormInput label="Email" name="email" type="email" value={data.email} onChange={handleChange} required />
                    <FormInput label="Téléphone" name="phone" type="tel" value={data.phone} onChange={handleChange} required />
                </div>
            </Section>

            <Section title="Mensurations & Physique">
                <div className="grid md:grid-cols-3 gap-6">
                    <FormInput label="Taille (cm)" name="height" type="number" value={data.height} onChange={handleChange} required />
                    <FormInput label="Poids (kg)" name="weight" type="number" value={data.weight} onChange={handleChange} required />
                    <FormInput label="Pointure (EU)" name="shoeSize" type="number" value={data.shoeSize} onChange={handleChange} required />
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <FormInput label="Poitrine (cm)" name="chest" type="number" value={data.chest} onChange={handleChange} />
                    <FormInput label="Taille (vêtement, cm)" name="waist" type="number" value={data.waist} onChange={handleChange} />
                    <FormInput label="Hanches (cm)" name="hips" type="number" value={data.hips} onChange={handleChange} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormInput label="Couleur des yeux" name="eyeColor" value={data.eyeColor} onChange={handleChange} />
                    <FormInput label="Couleur des cheveux" name="hairColor" value={data.hairColor} onChange={handleChange} />
                </div>
            </Section>

            <Section title="Expérience & Portfolio">
                <FormSelect label="Niveau d'expérience" name="experience" value={data.experience} onChange={handleChange} required>
                    <option value="none">Aucune expérience</option>
                    <option value="beginner">Débutant(e) (shootings amateurs)</option>
                    <option value="intermediate">Intermédiaire (agence locale, défilés)</option>
                    <option value="professional">Professionnel(le)</option>
                </FormSelect>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormInput label="Profil Instagram" name="instagram" value={data.instagram} onChange={handleChange} placeholder="@pseudo" />
                    <FormInput label="Lien vers portfolio (optionnel)" name="portfolioLink" value={data.portfolioLink} onChange={handleChange} placeholder="https://..." />
                </div>
            </Section>

            <Section title="Photos Portfolio">
                <MultiImageUploader label="Vos Photos" description="Ajoutez jusqu'à 10 photos. Incluez au moins un portrait, une photo en pied et une de profil." maxImages={10} values={portfolioPhotos} onChange={setPortfolioPhotos} />
            </Section>
        </>
    );
};

const PfdApplicationForm: React.FC<{ data: any, setData: Function }> = ({ data, setData }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    return (
        <Section title="Votre Candidature PFD">
            <FormInput label="Nom Complet ou Nom de la Marque" name="name" value={data.name} onChange={handleChange} required />
            <div className="grid md:grid-cols-2 gap-6">
                <FormInput label="Email" name="email" type="email" value={data.email} onChange={handleChange} required />
                <FormInput label="Téléphone" name="phone" type="tel" value={data.phone} onChange={handleChange} required />
            </div>
            <FormSelect label="Je postule en tant que" name="role" value={data.role} onChange={handleChange} required>
                <option value="Mannequin">Mannequin</option>
                <option value="Styliste">Styliste / Créateur</option>
                <option value="Partenaire">Partenaire / Sponsor</option>
                <option value="Photographe">Photographe / Vidéaste</option>
                <option value="MUA">Maquilleur(se) / Coiffeur(se) (MUA)</option>
                <option value="Autre">Autre (précisez dans le message)</option>
            </FormSelect>
            <FormTextArea label="Message" name="message" value={data.message} onChange={handleChange} rows={6} required placeholder="Présentez-vous, décrivez votre projet, ou laissez un lien vers votre portfolio..." />
        </Section>
    );
};


// Reusable components
const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-6 pt-8 border-t border-white/5 first:pt-0 first:border-none">
        <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-3">
            <span className="w-8 h-[1px] bg-pm-gold/50 inline-block"></span>
            {title}
        </h2>
        <div className="space-y-6">{children}</div>
    </div>
);
const FormInput: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, required?: boolean, placeholder?: string }> = (props) => (
    <div className='group'>
        <label htmlFor={props.name} className="block text-xs font-bold uppercase tracking-widest text-pm-off-white/50 mb-2 group-focus-within:text-pm-gold transition-colors">{props.label} {props.required && <span className="text-red-500">*</span>}</label>
        <input {...props} id={props.name} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none transition-all placeholder:text-white/20" />
    </div>
);
const FormSelect: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, required?: boolean, children: React.ReactNode }> = (props) => (
    <div className='group'>
        <label htmlFor={props.name} className="block text-xs font-bold uppercase tracking-widest text-pm-off-white/50 mb-2 group-focus-within:text-pm-gold transition-colors">{props.label} {props.required && <span className="text-red-500">*</span>}</label>
        <select {...props} id={props.name} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none transition-all">{props.children}</select>
    </div>
);
const FormTextArea: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, rows: number, required?: boolean, placeholder?: string }> = (props) => (
    <div className='group'>
        <label htmlFor={props.name} className="block text-xs font-bold uppercase tracking-widest text-pm-off-white/50 mb-2 group-focus-within:text-pm-gold transition-colors">{props.label} {props.required && <span className="text-red-500">*</span>}</label>
        <textarea {...props} id={props.name} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none transition-all placeholder:text-white/20" />
    </div>
);

export default Contact;
