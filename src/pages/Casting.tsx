import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarDaysIcon, MapPinIcon, CheckCircleIcon,
  ArrowRightIcon, SparklesIcon, CameraIcon, UserGroupIcon,
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import CountdownTimer from '../components/CountdownTimer';
import Loading from '../components/Loading';
import { useData } from '../contexts/DataContext';

const CASTING_DATE = '2025-09-06T14:00:00';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: 'circOut' },
});

const Casting: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return <Loading />;
  }

  const isUpcoming = new Date(CASTING_DATE) > new Date();

  return (
    <div className="bg-pm-dark text-pm-off-white overflow-x-hidden">
      <SEO
        title="Casting | Rejoindre PMM"
        description="Casting de mannequins à Libreville, Gabon. Postulez pour rejoindre Perfect Models Management."
        image={data.siteImages.castingBg}
      />

      {/* ── HERO ── */}
      <section className="relative h-screen flex items-end overflow-hidden">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${data.siteImages.castingBg}')`,
            filter: 'grayscale(0.6) brightness(0.35)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pm-dark via-pm-dark/50 to-transparent" />

        {/* Texte centré */};l
        k
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 gap-5 sm:gap-8">
          <motion.span {...fadeUp(0.2)} className="section-label">
            Tournée Nationale de Scouting 2025
          </motion.span>
          <motion.h1
            {...fadeUp(0.5)}
            className="text-5xl sm:text-6xl md:text-[9rem] font-playfair font-black italic leading-none tracking-tighter"
          >
            Trouve ton<br />
            <span className="gold-gradient-text">Moment.</span>
          </motion.h1>
          <motion.p {...fadeUp(0.9)} className="max-w-xl text-base sm:text-lg font-light text-white/40 italic px-4">
            "Nous ne cherchons pas la beauté, nous cherchons la présence."
          </motion.p>
          {isUpcoming && (
            <motion.div {...fadeUp(1.1)}>
              <Link to="/casting-formulaire" className="btn-premium mt-2 sm:mt-4">
                Postuler maintenant <ArrowRightIcon className="w-4 h-4 inline ml-2" />
              </Link>
            </motion.div>
          )}
        </div>

        {/* Infos bas de page */}
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-20 pb-8 sm:pb-12 flex flex-col sm:flex-row justify-between items-end gap-4 sm:gap-8">
          <div className="flex gap-6 sm:gap-10 border-l border-pm-gold/30 pl-5 sm:pl-10">
            <InfoItem icon={CalendarDaysIcon} label="Date" value="6 Sept 2025" />
            <InfoItem icon={MapPinIcon} label="Lieu" value="Libreville, Gabon" />
          </div>
          {isUpcoming && (
            <div className="scale-90 sm:scale-100 origin-right">
              <CountdownTimer targetDate={CASTING_DATE} />
            </div>
          )}
        </div>
      </section>

      {/* ── BANNIÈRE RECRUTEMENT ── */}
      <section className="page-container border-b border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        >
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-pm-gold/10 border border-pm-gold/20">
            <img
              src="https://i.ibb.co/G3Mr5766/afe4a7b5a628.png"
              alt="Grande Campagne de Recrutement PMM 2026"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pm-dark/40 to-transparent pointer-events-none" />
          </div>

          {/* Texte */}
          <div className="space-y-6">
            <div>
              <span className="section-label">Recrutement National 2026</span>
              <h2 className="text-4xl sm:text-5xl font-playfair font-black italic mt-3 leading-tight">
                ✨ Révélez l'élite<br />
                <span className="gold-gradient-text">qui est en vous</span>
              </h2>
            </div>

            <p className="text-white/60 leading-relaxed text-base">
              L'agence Perfect Models Management ouvre officiellement ses portes et lance sa grande campagne de recrutement national pour dénicher les nouveaux visages qui feront rayonner la mode de demain.
            </p>

            <p className="text-white/60 leading-relaxed text-base">
              Vous avez l'ambition, la prestance et le désir de rejoindre une structure professionnelle ? Saisissez votre chance dès maintenant.
            </p>

            {/* Dates */}
            <div className="flex items-center gap-3 bg-pm-gold/10 border border-pm-gold/30 rounded-xl px-5 py-4">
              <CalendarDaysIcon className="w-6 h-6 text-pm-gold shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-pm-gold/60 mb-0.5">Période de recrutement</p>
                <p className="text-white font-bold">Du 13 avril au 13 juin 2026</p>
              </div>
            </div>

            {/* Comment postuler */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-white/40">Comment postuler ?</p>
              <a
                href="https://wa.me/24177507950"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#25D366]/10 border border-[#25D366]/30 rounded-xl px-5 py-3 hover:bg-[#25D366]/20 transition-colors group"
              >
                <svg className="w-5 h-5 text-[#25D366] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <div>
                  <p className="text-[#25D366] font-bold text-sm">Par WhatsApp</p>
                  <p className="text-white/50 text-xs">+241 77 50 79 50</p>
                </div>
              </a>
              <Link
                to="/casting-formulaire"
                className="flex items-center gap-3 bg-pm-gold/10 border border-pm-gold/30 rounded-xl px-5 py-3 hover:bg-pm-gold/20 transition-colors group"
              >
                <ArrowRightIcon className="w-5 h-5 text-pm-gold shrink-0 group-hover:translate-x-1 transition-transform" />
                <div>
                  <p className="text-pm-gold font-bold text-sm">En ligne</p>
                  <p className="text-white/50 text-xs">Remplissez le formulaire sur perfectmodels.ga</p>
                </div>
              </Link>
            </div>

            <p className="text-white/30 text-xs italic">
              #PerfectModelsManagement #Casting2026 #Mannequinat #ModeGabon #Libreville #EliteModels
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── PROCESSUS ── */}
      <section className="page-container border-b border-white/5">
        <div className="mb-10 sm:mb-16">
          <span className="section-label">Comment ça marche</span>
          <h2 className="text-4xl sm:text-5xl font-playfair font-black mt-2">Le Processus</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-pm-dark p-6 sm:p-10 space-y-4 sm:space-y-6 group hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-pm-gold/40 uppercase tracking-[0.4em]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <step.icon className="w-5 h-5 text-pm-gold/60 group-hover:text-pm-gold transition-colors" />
              </div>
              <h3 className="text-lg sm:text-xl font-playfair font-black">{step.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CRITÈRES ── */}
      <section className="page-container grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 border-b border-white/5">
        <div className="space-y-8 sm:space-y-12">
          <div>
            <span className="section-label">Profils recherchés</span>
            <h2 className="text-4xl sm:text-5xl font-playfair font-black italic mt-2 leading-tight">
              Qui recherchons-nous ?
            </h2>
            <p className="text-white/40 mt-4 sm:mt-6 leading-relaxed">
              La diversité est notre force. Nous recrutons des talents pour le défilé, l'éditorial et la publicité.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-12">
            <CriteriaBlock
              title="Femme"
              items={['16 – 28 ans', 'Min. 170 cm', 'Tour de taille 60–66 cm', 'Tour de hanches 90–96 cm']}
            />
            <CriteriaBlock
              title="Homme"
              items={['18 – 30 ans', 'Min. 180 cm', 'Silhouette athlétique', 'Présence naturelle']}
            />
          </div>
        </div>

        {/* Code vestimentaire */}
        <div className="glass-card p-8 sm:p-12 space-y-8 sm:space-y-10 self-start lg:mt-20">
          <div>
            <span className="section-label">Dress code</span>
            <h3 className="text-2xl sm:text-3xl font-playfair font-black italic mt-2">Le Code Vestimentaire</h3>
            <p className="text-sm text-white/40 mt-3 leading-relaxed">
              Venez prêt(e) à travailler. Sans maquillage, coiffure simple.
            </p>
          </div>
          <div className="space-y-4 sm:space-y-5">
            {DRESSCODE.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full border border-pm-gold/30 flex items-center justify-center shrink-0">
                  <CheckCircleIcon className="w-4 h-4 text-pm-gold" />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest text-white/70">{item}</span>
              </div>
            ))}
          </div>
          <Link to="/casting-formulaire" className="btn-premium w-full !py-4 sm:!py-5 block text-center">
            Commencer la Pré-sélection
          </Link>
        </div>
      </section>

      {/* ── FAQ RAPIDE ── */}
      <section className="page-container border-b border-white/5">
        <div className="mb-10 sm:mb-14">
          <span className="section-label">Questions fréquentes</span>
          <h2 className="text-4xl sm:text-5xl font-playfair font-black mt-2">FAQ</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
          {FAQ.map((item, i) => (
            <div key={i} className="bg-pm-dark p-6 sm:p-10 hover:bg-white/[0.02] transition-colors">
              <p className="text-pm-gold font-bold mb-3 text-sm uppercase tracking-widest">{item.q}</p>
              <p className="text-white/50 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative py-24 sm:py-40 bg-pm-gold text-pm-dark overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 space-y-8 sm:space-y-10">
          <h2 className="text-4xl sm:text-5xl md:text-8xl font-playfair font-black italic leading-tight">
            C'est ton moment de briller.
          </h2>
          <p className="text-base sm:text-xl font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] opacity-40">
            Postule aujourd'hui et rejoins l'élite.
          </p>
          <Link
            to="/casting-formulaire"
            className="inline-block px-10 sm:px-16 py-5 sm:py-6 bg-pm-dark text-pm-gold font-black uppercase tracking-widest text-sm hover:bg-white hover:text-pm-dark transition-all"
          >
            Postuler Maintenant
          </Link>
        </div>
        <div className="absolute -bottom-16 -right-8 text-[12rem] sm:text-[22rem] font-playfair font-black opacity-[0.04] select-none pointer-events-none leading-none">
          2025
        </div>
      </section>
    </div>
  );
};

// ── Data ─────────────────────────────────────────────────────────────────────

const STEPS = [
  { icon: SparklesIcon, title: 'Candidature en ligne', desc: 'Remplissez le formulaire avec vos mensurations et photos polas.' },
  { icon: CameraIcon, title: 'Présélection', desc: 'Notre équipe étudie chaque profil et sélectionne les candidats retenus.' },
  { icon: UserGroupIcon, title: 'Audition physique', desc: 'Vous êtes convoqué(e) pour un passage devant notre jury le jour J.' },
  { icon: CheckCircleIcon, title: 'Intégration', desc: 'Les talents retenus rejoignent le roster PMM et débutent leur formation.' },
];

const DRESSCODE = [
  'Haut noir simple',
  'Jean slim noir',
  'Talons (Femme) / Chaussures habillées (Homme)',
  'Peau nette & cheveux naturels',
];

const FAQ = [
  { q: 'Le casting est-il payant ?', a: 'Non. La participation au casting est entièrement gratuite.' },
  { q: 'Faut-il de l\'expérience ?', a: 'Non, nous accueillons les débutants. Ce qui compte c\'est votre potentiel et votre présence.' },
  { q: 'Quand serai-je contacté(e) ?', a: 'Les candidats présélectionnés sont contactés dans les 2 semaines suivant la clôture des candidatures.' },
  { q: 'Puis-je postuler depuis l\'étranger ?', a: 'Oui, mais vous devrez être disponible pour l\'audition physique à Libreville.' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const InfoItem: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({
  icon: Icon, label, value,
}) => (
  <div className="space-y-1">
    <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/30">{label}</span>
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-pm-gold" />
      <span className="text-lg font-playfair font-bold text-white">{value}</span>
    </div>
  </div>
);

const CriteriaBlock: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div className="space-y-5">
    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pm-gold pb-3 border-b border-white/10">
      {title}
    </h3>
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="text-sm font-bold text-white/60 flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-pm-gold/40 flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default Casting;
