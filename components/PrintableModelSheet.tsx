import React, { useEffect } from 'react';
import { Model } from '../types';
import { useData } from '../contexts/DataContext';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid';

interface PrintableModelSheetProps {
    model: Model;
    onDonePrinting: () => void;
}

const PrintableModelSheet: React.FC<PrintableModelSheetProps> = ({ model, onDonePrinting }) => {
    const { data } = useData();

    useEffect(() => {
        const handleAfterPrint = () => {
            onDonePrinting();
            window.removeEventListener('afterprint', handleAfterPrint);
        };
        window.addEventListener('afterprint', handleAfterPrint);
        
        const timer = setTimeout(() => {
            document.title = `Fiche Mannequin - ${model.name}`;
            window.print();
        }, 500);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('afterprint', handleAfterPrint);
        };
    }, [onDonePrinting, model.name]);

    return (
        <div className="printable-content printable-sheet p-10 bg-white text-gray-900 font-sans" style={{ width: '210mm', minHeight: '297mm', margin: 'auto' }}>
            {/* Header */}
            <header className="flex justify-between items-center border-b-2 border-gray-300 pb-4">
                <div>
                    <h1 className="text-5xl" style={{ fontFamily: '"Playfair Display", serif', color: '#111' }}>{model.name}</h1>
                    <p className="text-gray-600 text-lg">Mannequin Professionnel</p>
                </div>
                {data?.siteConfig?.logo && <img src={data.siteConfig.logo} alt="Logo" className="h-24 w-auto" />}
            </header>

            {/* Main Content */}
            <main className="mt-8 grid grid-cols-3 gap-8">
                <div className="col-span-1">
                    <img src={model.imageUrl} alt={model.name} className="w-full aspect-[3/4] object-cover border-4 border-gray-200" />
                </div>
                <div className="col-span-2 space-y-6">
                    <Section title="Détails Personnels">
                        <InfoGrid>
                            <InfoItem label="Âge" value={`${model.age || 'N/A'} ans`} />
                            <InfoItem label="Genre" value={model.gender} />
                            <InfoItem label="Lieu" value={model.location || 'N/A'} />
                        </InfoGrid>
                    </Section>
                     <Section title="Mensurations">
                        <InfoGrid>
                            <InfoItem label="Taille" value={model.height} />
                            <InfoItem label="Poitrine" value={model.measurements.chest} />
                            <InfoItem label="Taille (vêt.)" value={model.measurements.waist} />
                            <InfoItem label="Hanches" value={model.measurements.hips} />
                            <InfoItem label="Pointure" value={`${model.measurements.shoeSize} (EU)`} />
                        </InfoGrid>
                    </Section>
                    <Section title="Contact Agence">
                         <InfoGrid>
                            <InfoItem label="Email" value={data?.contactInfo.email || 'N/A'} />
                            <InfoItem label="Téléphone" value={data?.contactInfo.phone || 'N/A'} />
                        </InfoGrid>
                    </Section>
                </div>
            </main>

            {/* Portfolio */}
            {model.portfolioImages && model.portfolioImages.length > 0 && (
                <section className="mt-8">
                    <h2 className="text-2xl font-bold border-b border-gray-300 pb-2 mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>Portfolio</h2>
                    <div className="grid grid-cols-4 gap-4">
                        {model.portfolioImages.slice(0, 4).map((img, i) => (
                             <img key={i} src={img} alt={`Portfolio ${i+1}`} className="w-full aspect-[3/4] object-cover" />
                        ))}
                    </div>
                </section>
            )}

            {/* Experience */}
            <section className="mt-8">
                 <h2 className="text-2xl font-bold border-b border-gray-300 pb-2 mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>Expérience & Parcours</h2>
                 <p className="text-sm text-gray-700 leading-relaxed">{model.experience} {model.journey}</p>
            </section>
            
            {/* Footer */}
            <footer className="mt-12 pt-6 border-t-2 border-gray-300 text-center text-xs text-gray-500">
                <p className="font-bold text-lg text-gray-800">Perfect Models Management</p>
                <div className="flex justify-center items-center gap-4 mt-2">
                    <span className="flex items-center gap-1"><EnvelopeIcon className="w-3 h-3"/> {data?.contactInfo.email}</span>
                    <span className="flex items-center gap-1"><PhoneIcon className="w-3 h-3"/> {data?.contactInfo.phone}</span>
                    <span className="flex items-center gap-1"><MapPinIcon className="w-3 h-3"/> {data?.contactInfo.address}</span>
                </div>
            </footer>
        </div>
    );
};

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h2 className="text-2xl font-bold border-b border-gray-300 pb-2 mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>{title}</h2>
        {children}
    </div>
);
const InfoGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">{children}</div>
);
const InfoItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
    <div className="text-sm">
        <strong className="block text-gray-500">{label}</strong>
        <span className="text-gray-800">{value}</span>
    </div>
);


export default PrintableModelSheet;