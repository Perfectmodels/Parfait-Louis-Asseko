import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDaysIcon, MapPinIcon, SparklesIcon, UserGroupIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import ParallaxHero from '../components/ui/ParallaxHero';
import FadeIn from '../components/ui/FadeIn';
import Reveal from '../components/ui/Reveal';
import { edition2ModelPosters } from '../constants/fashionDayImages';
import { partnerLogos } from '../constants/partnerLogos';

const FashionDay: React.FC = () => {
  const { data, addDocument, isInitialized } = useData();
  const [selectedEditionId, setSelectedEditionId] = useState<number>(2);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [reservationData, setReservationData] = useState({
    name: '', email: '', phone: '', tableType: 'Table 1 (4 pers) - Bières Locales', guestCount: 4, notes: ''
  });

  const selectedEdition = data?.fashionDayEvents?.find(e => e.edition === selectedEditionId) || data?.fashionDayEvents?.[0];

  useEffect(() => {
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

  // Use a fallback image if fashionDayBg is not set
  const heroImage = data.siteImages.fashionDayBg || data.siteImages.hero || "https://i.ibb.co/C5rcPJHz/titostyle-53.jpg";

  return (
    <div className="bg-pm-dark text-pm-off-white min-h-screen">
      <SEO title="Perfect Fashion Day 2026 - Défilé Mode Libreville | Billetterie Officielle" description="L'événement mode incontournable." />

      <ParallaxHero
        image={heroImage}
        title="Perfect Fashion Day"
        subtitle="L'Événement Mode de l'Année"
        height="h-[70vh]"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
          <button onClick={() => setShowReservationForm(true)} className="cta-btn-gold animate-glow">
            Réserver une Table
          </button>
          <Link to="/fashion-day-application" className="cta-btn-outline hover:bg-white hover:text-black hover:border-white">
            Casting Mannequins
          </Link>
        </div>
      </ParallaxHero>

      <div className="page-container -mt-20 relative z-20 space-y-16 lg:space-y-24">

        {/* Info Bar */}
        <FadeIn>
          <div className="bg-black/80 backdrop-blur-md border border-pm-gold/30 rounded-2xl p-8 shadow-2xl flex flex-wrap justify-between items-center gap-6 md:gap-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pm-gold/20 rounded-full flex items-center justify-center">
                <CalendarDaysIcon className="w-6 h-6 text-pm-gold" />
              </div>
              <div>
                <span className="block text-xs uppercase tracking-widest text-pm-off-white/50">Date</span>
                <span className="font-playfair text-xl font-bold text-white">31 Janvier 2026</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pm-gold/20 rounded-full flex items-center justify-center">
                <MapPinIcon className="w-6 h-6 text-pm-gold" />
              </div>
              <div>
                <span className="block text-xs uppercase tracking-widest text-pm-off-white/50">Lieu</span>
                <span className="font-playfair text-xl font-bold text-white">Gare du Nord</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pm-gold/20 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-pm-gold" />
              </div>
              <div>
                <span className="block text-xs uppercase tracking-widest text-pm-off-white/50">Thème</span>
                <span className="font-playfair text-xl font-bold text-white">"L'Art de se Révéler"</span>
              </div>
            </div>
          </div>
        </FadeIn>

        {selectedEdition.edition === 2 ? (
          <>
            {/* 2. CONCEPT */}
            <section className="grid md:grid-cols-2 gap-10">
              <FadeIn direction="right" className="bg-white/5 p-8 md:p-12 rounded-2xl border border-white/5 hover:border-pm-gold/20 transition-colors">
                <h3 className="text-3xl font-playfair text-pm-gold mb-6 flex items-center gap-3">
                  <SparklesIcon className="w-8 h-8" /> La Vision
                </h3>
                <p className="text-pm-off-white/80 leading-relaxed text-lg font-light">
                  {selectedEdition.description}
                </p>
              </FadeIn>
              <FadeIn direction="left" className="bg-white/5 p-8 md:p-12 rounded-2xl border border-white/5 hover:border-pm-gold/20 transition-colors">
                <h3 className="text-3xl font-playfair text-pm-gold mb-6 flex items-center gap-3">
                  <UserGroupIcon className="w-8 h-8" /> L'Ambiance
                </h3>
                <p className="text-pm-off-white/80 leading-relaxed text-lg font-light">
                  Préparez-vous à une expérience immersive célébrant l'excellence de la mode gabonaise et l'audace créative. Un voyage sensoriel passant de l'ombre à la lumière, dans un cadre architectural unique.
                </p>
              </FadeIn>
            </section>

            {/* 3. LINE-UP CRÉATEURS */}
            <section>
              <FadeIn>
                <div className="text-center mb-12">
                  <Reveal width='100%' className='flex justify-center'><h2 className="section-title !mb-2">Le Programme Créateurs</h2></Reveal>
                  <p className="text-pm-off-white/60 text-lg">4 Tableaux Narratifs pour une odyssée stylistique.</p>
                </div>
              </FadeIn>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { num: "01", title: "L'Éveil", desc: "Le début du voyage", creators: ["Rabibi", "Najmi", "Pretty Little Hook"] },
                  { num: "02", title: "L'Éclosion", desc: "L'affirmation des formes", creators: ["Ventex", "Racines", "Maeva Creations"] },
                  { num: "03", title: "L'Expression", desc: "L'audace pure", creators: ["Miguel Fashion Style", "Nan's Ethnik", "Cyrlie Fashion"] },
                  { num: "04", title: "L'Apothéose", desc: "Le summum de l'élégance", creators: ["BKD Empire", "Tito Style", "Invité d'Honneur : Edele A"] }
                ].map((block, idx) => (
                  <FadeIn key={idx} delay={idx * 0.1} className="h-full">
                    <div className="bg-black/40 p-8 rounded-xl border-t-2 border-pm-gold hover:bg-white/5 transition-all duration-300 relative h-full group">
                      <span className="text-6xl font-playfair text-white/5 font-bold absolute top-2 right-4 group-hover:text-pm-gold/10 transition-colors">{block.num}</span>
                      <h4 className="text-2xl font-bold text-pm-gold mb-1">{block.title}</h4>
                      <p className="text-xs text-pm-off-white/50 uppercase tracking-widest mb-6">{block.desc}</p>
                      <ul className="space-y-3 relative z-10">
                        {block.creators.map((c, i) => (
                          <li key={i} className={`flex items-center gap-2 text-pm-off-white/90 ${c.includes("Invité") ? "font-bold text-pm-gold pt-2 border-t border-pm-gold/20" : ""}`}>
                            {!c.includes("Invité") && <span className="w-1.5 h-1.5 rounded-full bg-pm-gold"></span>}
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </section>

            {/* 4. PROGRAMME & ÉQUIPE */}
            <section className="grid lg:grid-cols-2 gap-12">
              <FadeIn direction="right">
                <div className="bg-pm-dark-light p-8 md:p-10 rounded-2xl border border-white/5 h-full">
                  <h3 className="text-3xl font-playfair text-white mb-8 flex items-center gap-3">
                    <ClockIcon className="w-8 h-8 text-pm-gold" /> Programme
                  </h3>
                  <div className="space-y-8 border-l border-pm-gold/30 ml-3 pl-8 relative">
                    {[
                      { time: "19h00", event: "Accueil, Photocall & Cocktail" },
                      { time: "20h00", event: "Ouverture Officielle" },
                      { time: "20h15", event: "Début du Défilé (4 Tableaux)" },
                      { time: "22h00", event: "After-Show VIP" },
                    ].map((item, idx) => (
                      <div key={idx} className="relative group/time">
                        <span className="absolute -left-[39px] top-1.5 w-4 h-4 bg-pm-dark border-2 border-pm-gold rounded-full group-hover/time:bg-pm-gold transition-colors"></span>
                        <span className="block text-xl font-bold text-pm-gold mb-1">{item.time}</span>
                        <p className="text-pm-off-white/80">{item.event}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              <FadeIn direction="left">
                <div className="bg-pm-dark-light p-8 md:p-10 rounded-2xl border border-white/5 h-full">
                  <h3 className="text-3xl font-playfair text-white mb-8 flex items-center gap-3">
                    <UserGroupIcon className="w-8 h-8 text-pm-gold" /> L'Équipe Artistique
                  </h3>
                  <ul className="space-y-6">
                    {[
                      { role: "Maîtresse de Cérémonie", name: "Lady Riaba" },
                      { role: "Direction Artistique", name: "Fave Glao", sub: "assisté par AJ Caramela & Sephora" },
                      { role: "Coiffure & Beauté", name: "Indi Hair & PFOZ Production" },
                      { role: "Régisseur Backstage", name: "Equipe PMM" }
                    ].map((member, i) => (
                      <li key={i} className="flex justify-between items-start border-b border-white/5 pb-4 last:border-0 last:pb-0">
                        <span className="text-pm-off-white/50 uppercase tracking-wider text-xs font-bold pt-1">{member.role}</span>
                        <span className="text-right">
                          <span className="block font-playfair text-xl text-white">{member.name}</span>
                          {member.sub && <span className="block text-xs text-pm-off-white/40 mt-1">{member.sub}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </section>

            {/* 5. MANNEQUINS VEDETTES - Edition 2 */}
            <FadeIn>
              <section className="bg-gradient-to-br from-pm-dark-light to-black/40 p-8 md:p-12 rounded-2xl border border-pm-gold/20 scroll-mt-24" id="mannequins">
                <div className="text-center mb-16">
                  <Reveal>
                    <h3 className="text-5xl md:text-7xl font-playfair text-white mb-6 italic">
                      The Icons
                    </h3>
                  </Reveal>
                  <div className="w-24 h-1 bg-pm-gold mx-auto mb-8"></div>
                  <p className="text-pm-off-white/60 max-w-2xl mx-auto text-lg">
                    L'excellence du mannequinat gabonais. Découvrez les visages qui illumineront le podium du Perfect Fashion Day.
                  </p>
                </div>

                {/* Grid des affiches - Masonry style look */}
                <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-6 space-y-6">
                  {edition2ModelPosters.map((posterUrl, index) => (
                    <FadeIn key={index} delay={index * 0.03} className="break-inside-avoid">
                      <div
                        className="group relative rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02] shadow-xl hover:shadow-pm-gold/20 border border-white/5 hover:border-pm-gold/40"
                        onClick={() => setLightboxImage(posterUrl)}
                      >
                        <img
                          src={posterUrl}
                          alt={`Mannequin ${index + 1}`}
                          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Overlay au hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                          <Reveal>
                            <span className="text-pm-gold font-bold text-lg mb-1 block">MANNEQUIN #{index + 1}</span>
                          </Reveal>
                          <span className="text-white/60 text-xs uppercase tracking-[0.2em]">Perfect Fashion Day • Edition 2</span>
                          <div className="mt-4 w-10 h-10 rounded-full bg-pm-gold/20 border border-pm-gold/50 flex items-center justify-center backdrop-blur-md">
                            <SparklesIcon className="w-5 h-5 text-pm-gold" />
                          </div>
                        </div>

                        {/* Glassmorphism Badge */}
                        <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-xl border border-white/10 text-white font-playfair font-bold text-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          #{index + 1}
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>

                <div className="text-center mt-20 p-12 bg-pm-gold/5 rounded-3xl border border-pm-gold/10 backdrop-blur-sm">
                  <Reveal>
                    <h4 className="text-3xl font-playfair text-white mb-4 italic">Rejoignez l'Elite</h4>
                  </Reveal>
                  <p className="text-pm-off-white/70 mb-8 max-w-xl mx-auto">
                    Vous souhaitez défiler pour les plus grands créateurs ? Les inscriptions pour la prochaine édition sont déjà ouvertes.
                  </p>
                  <Link to="/fashion-day-application" className="inline-flex items-center gap-2 text-pm-gold hover:text-white transition-colors uppercase tracking-[0.3em] font-bold text-sm group">
                    Postuler maintenant <span className="group-hover:translate-x-2 transition-transform">→</span>
                  </Link>
                </div>
              </section>
            </FadeIn>

            {/* 6. PARTENAIRES */}
            <FadeIn>
              <section className="bg-pm-dark-light/50 p-12 rounded-2xl border border-white/5 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 px-4">
                  <div className="max-w-xl">
                    <h3 className="text-4xl md:text-5xl font-playfair text-white mb-4">
                      Prestige <span className="text-pm-gold">&</span> Network
                    </h3>
                    <p className="text-pm-off-white/50 text-sm uppercase tracking-widest font-bold">
                      Ils soutiennent l'émergence de la mode africaine
                    </p>
                  </div>
                  <div className="hidden md:block w-32 h-px bg-pm-gold/30 mb-4"></div>
                </div>

                {/* Grid des logos partenaires - Moving Banner Effect or High-End Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center">
                  {partnerLogos.map((logoUrl, index) => (
                    <FadeIn key={index} delay={index * 0.05}>
                      <div
                        className="group relative flex items-center justify-center p-8 bg-black/20 rounded-2xl border border-white/5 hover:border-pm-gold/30 hover:bg-black/40 transition-all duration-500 cursor-pointer h-32 shadow-xl hover:shadow-pm-gold/5"
                        onClick={() => setLightboxImage(logoUrl)}
                      >
                        <img
                          src={logoUrl}
                          alt={`Partenaire ${index + 1}`}
                          className="max-w-full max-h-full object-contain opacity-30 group-hover:opacity-100 filter grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 border-2 border-pm-gold/0 group-hover:border-pm-gold/20 rounded-2xl transition-all duration-500 scale-110 group-hover:scale-100"></div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </section>
            </FadeIn>
          </>
        ) : (
          <div className="max-w-4xl mx-auto py-12 text-center">
            <h2 className="text-4xl font-playfair text-pm-gold mb-6">{selectedEdition.theme}</h2>
            <p className="text-white/80 whitespace-pre-line mb-8">{selectedEdition.description}</p>
            <p className="text-white/40 italic">Contenu archivé de l'édition précédente.</p>
          </div>
        )}
      </div>

      {/* Reservation Modal */}
      {showReservationForm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <FadeIn className="w-full max-w-2xl">
            <div className="bg-pm-dark border border-pm-gold/30 rounded-2xl p-6 md:p-10 w-full relative my-8 shadow-2xl">
              <button
                onClick={() => setShowReservationForm(false)}
                className="absolute top-4 right-4 text-pm-off-white hover:text-pm-gold transition-colors z-10 p-2"
              >
                <XMarkIcon className="w-8 h-8" />
              </button>

              <div className="text-center mb-8">
                <h3 className="text-3xl font-playfair text-pm-gold mb-2">Réserver votre Table</h3>
                <p className="text-pm-off-white/60">Choisissez le pack qui convient à votre groupe pour une soirée inoubliable.</p>
              </div>

              <form onSubmit={handleReservationSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-pm-off-white/50 mb-2">Nom Complet</label>
                    <input type="text" required className="w-full bg-black/50 border border-pm-gold/30 rounded-lg p-3 text-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none transition-all"
                      value={reservationData.name} onChange={e => setReservationData({ ...reservationData, name: e.target.value })} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-pm-off-white/50 mb-2">Email</label>
                    <input type="email" required className="w-full bg-black/50 border border-pm-gold/30 rounded-lg p-3 text-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none transition-all"
                      value={reservationData.email} onChange={e => setReservationData({ ...reservationData, email: e.target.value })} placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-pm-off-white/50 mb-2">Téléphone</label>
                  <input type="tel" required className="w-full bg-black/50 border border-pm-gold/30 rounded-lg p-3 text-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none transition-all"
                    value={reservationData.phone} onChange={e => setReservationData({ ...reservationData, phone: e.target.value })} placeholder="+241 77..." />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-pm-off-white/50 mb-3">Choix de la Table</label>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
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
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex justify-between items-center group ${reservationData.tableType === pack.name ? 'bg-pm-gold/20 border-pm-gold' : 'bg-black/40 border-pm-gold/10 hover:border-pm-gold/50 hover:bg-white/5'}`}
                      >
                        <div>
                          <span className={`font-bold block ${reservationData.tableType === pack.name ? 'text-pm-gold' : 'text-white'}`}>{pack.name}</span>
                          <span className="text-xs text-pm-off-white/50 mt-1 block">{pack.details}</span>
                        </div>
                        <span className="font-playfair font-bold text-pm-gold whitespace-nowrap ml-4">{pack.price.toLocaleString()} FCFA</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-pm-off-white/50 mb-2">Message (Facultatif)</label>
                  <textarea className="w-full bg-black/50 border border-pm-gold/30 rounded-lg p-3 text-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none transition-all resize-none" rows={3}
                    value={reservationData.notes} onChange={e => setReservationData({ ...reservationData, notes: e.target.value })} placeholder="Allergies, anniversaire..."></textarea>
                </div>

                <div className="bg-pm-gold/10 p-4 rounded-lg border border-pm-gold/20 flex gap-3 items-start">
                  <div className="text-xl">💡</div>
                  <p className="text-xs text-pm-off-white/80 leading-relaxed">
                    <strong>Conseil VIP :</strong> Pour garantir votre table, nous vous recommandons d'effectuer un dépôt via <strong>Airtel Money au 077 50 79 50</strong> après validation de ce formulaire.
                  </p>
                </div>

                <button type="submit" className="w-full py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-all transform hover:scale-[1.01] shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                  Confirmer la Réservation
                </button>
              </form>
            </div>
          </FadeIn>
        </div>
      )}

      {/* Lightbox pour les affiches */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
            aria-label="Fermer"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>
          <img
            src={lightboxImage}
            alt="Affiche mannequin"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default FashionDay;