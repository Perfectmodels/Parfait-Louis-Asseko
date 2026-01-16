import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDaysIcon, MapPinIcon, SparklesIcon, UserGroupIcon, MicrophoneIcon, XMarkIcon, ChevronDownIcon, ClockIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { FashionDayEvent } from '../types';

interface AccordionItemProps {
  title: string;
  description: string;
  images: string[];
  onImageClick: (img: string) => void;
  defaultOpen?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, description, images, onImageClick, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-pm-dark/50 border border-pm-gold/20 rounded-lg overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left hover:bg-pm-gold/10"
        aria-expanded={isOpen ? "true" : "false"}
      >
        <div>
          <h4 className="text-2xl font-playfair text-pm-gold">{title}</h4>
          {description && <p className="text-sm text-pm-off-white/70 mt-1">{description}</p>}
        </div>
        <ChevronDownIcon className={`w-6 h-6 text-pm-gold flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className="grid transition-all duration-500 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="p-4 border-t border-pm-gold/20">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {(images || []).map((img, idx) => (
                <button key={idx} onClick={() => onImageClick(img)} aria-label={`Agrandir l'image de la création ${idx + 1} de ${title}`} className="aspect-square block bg-black group overflow-hidden border-2 border-transparent hover:border-pm-gold focus-style-self focus-visible:ring-2 focus-visible:ring-pm-gold transition-colors duration-300 rounded-md">
                  <img src={img} alt={`${title} - création ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface InfoPillProps {
  icon: React.ElementType;
  title: string;
  content: string;
}
const InfoPill: React.FC<InfoPillProps> = ({ icon: Icon, title, content }) => (
  <div className="flex items-center gap-3">
    <Icon className="w-10 h-10 text-pm-gold" aria-hidden="true" />
    <div>
      <span className="font-bold block text-left">{title}</span>
      <span className="block text-left">{content}</span>
    </div>
  </div>
);

const FashionDay: React.FC = () => {
  const { data, addDocument, isInitialized } = useData();
  const [selectedEditionId, setSelectedEditionId] = useState<number>(2);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [reservationData, setReservationData] = useState({
    name: '', email: '', phone: '', tableType: 'Table 1 (4 pers) - Bières Locales', guestCount: 4, notes: ''
  });

  // Derive selected event
  const selectedEdition = data?.fashionDayEvents?.find(e => e.edition === selectedEditionId) || data?.fashionDayEvents?.[0];

  useEffect(() => {
    // Default to Edition 2 if available
    if (data?.fashionDayEvents) {
      const edition2 = data.fashionDayEvents.find(e => e.edition === 2);
      if (edition2) setSelectedEditionId(2);
    }
  }, [data]);

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !selectedEdition) return;

    const newReservation: any = {
      id: `res-${Date.now()}`,
      edition: selectedEdition.edition,
      ...reservationData,
      status: 'Nouveau',
      submissionDate: new Date().toISOString()
    };

    try {
      await addDocument('fashionDayReservations', newReservation);
      alert("Votre demande de réservation a été enregistrée avec succès !");
      setShowReservationForm(false);
      setReservationData({ name: '', email: '', phone: '', tableType: 'Table 1 (4 pers) - Bières Locales', guestCount: 4, notes: '' });
    } catch (error) {
      console.error("Erreur réservation:", error);
      alert("Une erreur est survenue.");
    }
  };

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark flex items-center justify-center text-white">Chargement...</div>;
  }

  if (!selectedEdition) {
    return <div className="min-h-screen bg-pm-dark text-white p-10 text-center">Événement non trouvé.</div>;
  }

  return (
    <>
      <div className="bg-pm-dark text-pm-off-white min-h-screen">
        <SEO title="Perfect Fashion Day 2026 - Défilé Mode Libreville | Billetterie Officielle" description="L'événement mode incontournable." />

        {/* HERO GENERIC OR SPECIFIC */}
        <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Background Image could go here */}
          <div className="absolute inset-0 bg-black/60 z-0"></div>
        </div>

        <div className="page-container -mt-[50vh] relative z-10">
          <div className="content-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {selectedEdition.edition === 2 ? (
              <div className="space-y-20 animate-fade-in py-10">
                {/* 1. HERO SPECIALE */}
                <div className="text-center relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pm-gold/5 rounded-full blur-[100px] -z-10"></div>
                  <span className="inline-block py-1 px-3 border border-pm-gold/50 rounded-full text-xs font-bold text-pm-gold uppercase tracking-widest mb-4">L'événement Mode de l'année</span>
                  <h2 className="text-5xl md:text-7xl font-playfair text-white mb-2">Perfect Fashion Day</h2>
                  <h3 className="text-3xl font-light text-pm-off-white uppercase tracking-[0.2em] mb-4">Édition 2</h3>
                  <p className="text-2xl font-serif italic text-pm-gold mb-8">"L'Art de se Révéler"</p>

                  <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-pm-off-white/90 mb-8">
                    <div className="flex items-center gap-2">
                      <CalendarDaysIcon className="w-6 h-6 text-pm-gold" />
                      <span className="font-semibold">Samedi 31 Janvier 2026</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-6 h-6 text-pm-gold" />
                      <span className="font-semibold">Gare du Nord, Libreville</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 border border-pm-gold/50 rounded text-xs text-pm-gold uppercase">Dress Code</span>
                      <span className="font-semibold">Noir & Or</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/fashion-day-application" className="px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                      Participer (Casting)
                    </Link>
                    <button onClick={() => setShowReservationForm(true)} className="px-8 py-3 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest rounded-full hover:bg-pm-gold hover:text-pm-dark transition-all">
                      Réserver une Table
                    </button>
                  </div>
                </div>

                {/* 2. CONCEPT */}
                <div className="grid md:grid-cols-2 gap-10 bg-white/5 p-8 md:p-12 rounded-2xl border border-pm-gold/10 backdrop-blur-sm">
                  <div>
                    <h3 className="text-2xl font-playfair text-pm-gold mb-4 flex items-center gap-3">
                      <SparklesIcon className="w-6 h-6" /> La Vision
                    </h3>
                    <p className="text-pm-off-white/80 leading-relaxed text-lg">
                      Cette édition symbolise le passage de la chrysalide au papillon. Nous vous invitons à laisser tomber les masques sociaux pour révéler votre identité profonde, dans une célébration de l'authenticité.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-playfair text-pm-gold mb-4 flex items-center gap-3">
                      <SparklesIcon className="w-6 h-6" /> L'Ambiance
                    </h3>
                    <p className="text-pm-off-white/80 leading-relaxed text-lg">
                      Préparez-vous à une expérience immersive célébrant l'excellence de la mode et l'audace créative. Un voyage sensoriel passant de l'ombre à la lumière, au cœur de la Gare du Nord.
                    </p>
                  </div>
                </div>

                {/* 3. LINE-UP CRÉATEURS */}
                <div>
                  <div className="text-center mb-10">
                    <h3 className="text-3xl font-playfair text-pm-gold mb-2">Le Programme Créateurs</h3>
                    <p className="text-pm-off-white/60">4 Tableaux Narratifs</p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-black/40 p-6 rounded-xl border-t-2 border-pm-gold hover:bg-black/60 transition-colors relative">
                      <span className="text-4xl font-playfair text-pm-gold/20 font-bold absolute top-4 right-4">01</span>
                      <h4 className="text-xl font-bold text-pm-gold mb-1">L'Éveil</h4>
                      <p className="text-xs text-pm-off-white/50 uppercase tracking-widest mb-4">Le début du voyage</p>
                      <ul className="space-y-2 text-pm-off-white/90">
                        <li>• Rabibi</li>
                        <li>• Najmi</li>
                        <li>• Pretty Little Hook</li>
                      </ul>
                    </div>
                    <div className="bg-black/40 p-6 rounded-xl border-t-2 border-pm-gold hover:bg-black/60 transition-colors relative">
                      <span className="text-4xl font-playfair text-pm-gold/20 font-bold absolute top-4 right-4">02</span>
                      <h4 className="text-xl font-bold text-pm-gold mb-1">L'Éclosion</h4>
                      <p className="text-xs text-pm-off-white/50 uppercase tracking-widest mb-4">L'affirmation des formes</p>
                      <ul className="space-y-2 text-pm-off-white/90">
                        <li>• Ventex</li>
                        <li>• Racines</li>
                        <li>• Maeva Creations</li>
                      </ul>
                    </div>
                    <div className="bg-black/40 p-6 rounded-xl border-t-2 border-pm-gold hover:bg-black/60 transition-colors relative">
                      <span className="text-4xl font-playfair text-pm-gold/20 font-bold absolute top-4 right-4">03</span>
                      <h4 className="text-xl font-bold text-pm-gold mb-1">L'Expression</h4>
                      <p className="text-xs text-pm-off-white/50 uppercase tracking-widest mb-4">L'audace pure</p>
                      <ul className="space-y-2 text-pm-off-white/90">
                        <li>• Miguel Fashion Style</li>
                        <li>• Nan's Ethnik</li>
                        <li>• Cyrlie Fashion</li>
                      </ul>
                    </div>
                    <div className="bg-black/40 p-6 rounded-xl border-t-2 border-pm-gold hover:bg-black/60 transition-colors relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-pm-gold/10 to-transparent"></div>
                      <span className="text-4xl font-playfair text-pm-gold/20 font-bold absolute top-4 right-4">04</span>
                      <h4 className="text-xl font-bold text-pm-gold mb-1">L'Apothéose</h4>
                      <p className="text-xs text-pm-off-white/50 uppercase tracking-widest mb-4">Le summum de l'élégance</p>
                      <ul className="space-y-2 text-pm-off-white/90 relative z-10">
                        <li>• BKD Empire</li>
                        <li>• Tito Style</li>
                        <li className="font-bold text-pm-gold pt-2 border-t border-pm-gold/20 mt-2">Invité d'Honneur : <br />Edele A</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 4. PROGRAMME SOIRÉE & ÉQUIPE */}
                <div className="grid lg:grid-cols-2 gap-12">
                  {/* TimeLine */}
                  <div className="bg-pm-dark-light p-8 rounded-xl border border-pm-gold/10">
                    <h3 className="text-2xl font-playfair text-pm-gold mb-6 flex items-center gap-2"><ClockIcon className="w-6 h-6" /> Programme de la Soirée</h3>
                    <div className="space-y-6 border-l border-pm-gold/30 ml-3 pl-6 relative">
                      {[
                        { time: "19h00", event: "Accueil, Photocall & Cocktail" },
                        { time: "20h00", event: "Ouverture Officielle" },
                        { time: "20h15", event: "Début du Défilé (4 Tableaux)" },
                        { time: "22h00", event: "After-Show VIP" },
                      ].map((item, idx) => (
                        <div key={idx} className="relative">
                          <span className="absolute -left-[29px] top-1 w-3 h-3 bg-pm-gold rounded-full ring-4 ring-black"></span>
                          <span className="text-pm-gold font-bold">{item.time}</span>
                          <p className="text-pm-off-white">{item.event}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Artistic Team */}
                  <div className="bg-pm-dark-light p-8 rounded-xl border border-pm-gold/10">
                    <h3 className="text-2xl font-playfair text-pm-gold mb-6 flex items-center gap-2"><UserGroupIcon className="w-6 h-6" /> L'Équipe Artistique</h3>
                    <ul className="space-y-4">
                      <li className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-pm-off-white/60">Maîtresse de Cérémonie</span>
                        <span className="text-pm-off-white font-medium">Lady Riaba</span>
                      </li>
                      <li className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-pm-off-white/60">Direction Artistique</span>
                        <span className="text-pm-off-white font-medium text-right">Fave Glao<br /><span className="text-xs text-pm-off-white/50">assisté par AJ Caramela & Sephora</span></span>
                      </li>
                      <li className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-pm-off-white/60">Coiffure & Beauté</span>
                        <span className="text-pm-off-white font-medium">Indi Hair & PFOZ Production</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-pm-off-white/60">Régisseur Backstage</span>
                        <span className="text-pm-off-white font-medium">Akile Tabarna</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 5. PARTENAIRES */}
                <div className="text-center">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-pm-off-white/50 mb-6">Nos Partenaires de Confiance</h3>
                  <div className="flex flex-wrap justify-center items-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-lg font-medium border-b border-pm-gold/30 pb-1">Yarden Hotel</span>
                    <span className="text-lg font-medium">Legrand TV</span>
                    <span className="text-lg font-medium">Darain Visuals</span>
                    <span className="text-lg font-medium">Symbiose</span>
                    <span className="text-lg font-medium">Vitri Clean</span>
                    <span className="text-lg font-medium">Indi Hair</span>
                  </div>
                </div>
              </div>
            ) : (
              // FALLBACK OLD EDITION VIEW
              <div className="max-w-4xl mx-auto py-12">
                <h2 className="text-4xl font-playfair text-pm-gold mb-6">{selectedEdition.theme}</h2>
                <p className="text-white/80 whitespace-pre-line mb-8">{selectedEdition.description}</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* This is a simple fallback, assumes images might be present in a real app */}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white/5 rounded-lg h-48 w-full flex items-center justify-center text-white/20">Image {i + 1}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reservation Modal */}
        {showReservationForm && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-pm-dark border border-pm-gold/30 rounded-lg p-6 md:p-8 max-w-2xl w-full relative my-8">
              <button
                onClick={() => setShowReservationForm(false)}
                className="absolute top-4 right-4 text-pm-off-white hover:text-pm-gold transition-colors z-10"
              >
                <XMarkIcon className="w-8 h-8" />
              </button>
              <h3 className="text-3xl font-playfair text-pm-gold mb-2 text-center">Réserver votre Table</h3>
              <p className="text-center text-pm-off-white/60 mb-8">Choisissez le pack qui convient à votre groupe pour une soirée inoubliable.</p>

              <form onSubmit={handleReservationSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-pm-off-white/70 mb-1">Nom Complet</label>
                    <input type="text" required className="w-full bg-black/50 border border-pm-gold/30 rounded p-3 text-pm-off-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none"
                      value={reservationData.name} onChange={e => setReservationData({ ...reservationData, name: e.target.value })} placeholder="Votre nom" />
                  </div>
                  <div>
                    <label className="block text-sm text-pm-off-white/70 mb-1">Email</label>
                    <input type="email" required className="w-full bg-black/50 border border-pm-gold/30 rounded p-3 text-pm-off-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none"
                      value={reservationData.email} onChange={e => setReservationData({ ...reservationData, email: e.target.value })} placeholder="votre@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-pm-off-white/70 mb-1">Téléphone</label>
                  <input type="tel" required className="w-full bg-black/50 border border-pm-gold/30 rounded p-3 text-pm-off-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none"
                    value={reservationData.phone} onChange={e => setReservationData({ ...reservationData, phone: e.target.value })} placeholder="+241..." />
                </div>

                <div>
                  <label className="block text-sm text-pm-off-white/70 mb-3">Choix de la Table (Sélectionnez une option)</label>
                  <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {[
                      { id: 't1', name: 'Table 1 (4 pers) - Bières Locales', price: 50000, capacity: 4, details: '2 Seaux de Bières Locales + 1 Bouteille de Vin Blanc' },
                      { id: 't2', name: 'Table 2 (6 pers) - Bières Locales', price: 70000, capacity: 6, details: '3 Seaux de Bières Locales + 1 Bouteille de Vin Blanc' },
                      { id: 't3', name: 'Table 3 (8 pers) - Bières Locales', price: 100000, capacity: 8, details: '4 Seaux de Bières Locales + 1 Bouteille de Vin Blanc' },
                      { id: 't4', name: 'Table 4 (4 pers) - Bières Étrangères', price: 50000, capacity: 4, details: '2 Seaux de Bières Étrangères + 1 Bouteille de Vin Blanc' },
                      { id: 't5', name: 'Table 5 (6 pers) - Bières Étrangères', price: 80000, capacity: 6, details: '3 Seaux de Bières Étrangères + 1 Bouteille de Vin Blanc' },
                      { id: 't6', name: 'Table 6 (8 pers) - Bières Étrangères', price: 110000, capacity: 8, details: '4 Seaux de Bières Étrangères + 1 Bouteille de Vin Blanc' },
                    ].map((pack) => (
                      <div
                        key={pack.id}
                        onClick={() => setReservationData({ ...reservationData, tableType: pack.name, guestCount: pack.capacity })}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 flex justify-between items-center group ${reservationData.tableType === pack.name ? 'bg-pm-gold/20 border-pm-gold' : 'bg-black/40 border-pm-gold/10 hover:border-pm-gold/50'}`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-playfair font-bold text-lg ${reservationData.tableType === pack.name ? 'text-pm-gold' : 'text-pm-off-white'}`}>{pack.name}</span>
                          </div>
                          <p className="text-xs text-pm-off-white/60 mt-1">{pack.details}</p>
                        </div>
                        <div className="text-right">
                          <span className="block font-bold text-lg text-pm-gold">{pack.price.toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-pm-off-white/70 mb-1">Message / Demandes Spéciales</label>
                  <textarea className="w-full bg-black/50 border border-pm-gold/30 rounded p-3 text-pm-off-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none" rows={2}
                    value={reservationData.notes} onChange={e => setReservationData({ ...reservationData, notes: e.target.value })} placeholder="Allergies, anniversaire, etc."></textarea>
                </div>

                <div className="bg-pm-gold/10 p-3 rounded border border-pm-gold/30 mb-4 text-xs text-pm-off-white">
                  <strong>💡 Conseil VIP :</strong> Pour garantir votre table, nous vous recommandons d'effectuer un dépôt via Airtel Money au 077 50 79 50 après validation de ce formulaire.
                </div>

                <button type="submit" className="w-full py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-all transform hover:scale-[1.02] shadow-lg shadow-pm-gold/20 mt-4">
                  Confirmer la Réservation
                </button>
                <p className="text-xs text-center text-pm-off-white/40 mt-2">Le paiement se fera sur place ou par mobile money avant l'événement.</p>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FashionDay;