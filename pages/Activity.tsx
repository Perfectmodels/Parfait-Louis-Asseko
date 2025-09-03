
import React, { useState } from 'react';
import { PhoneIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const formationModules = [
  {
    title: "Module 1: Les Fondamentaux du Mannequinat",
    chapters: [
      "Histoire et évolution du mannequinat",
      "Les différents types de mannequinat (podium, photo, commercial)",
      "Comprendre les agences et le rôle de l'agent",
      "L'importance de l'image et du personal branding",
      "Les mensurations et standards de l'industrie",
      "Le vocabulaire de la mode",
      "Hygiène de vie et nutrition du mannequin",
      "Éthique et professionnalisme dans le métier"
    ]
  },
  {
    title: "Module 2: Techniques de Podium (Catwalk)",
    chapters: [
      "Maîtrise de la démarche et de la posture",
      "Les différents types de défilés (Haute Couture, Prêt-à-porter)",
      "Gestion du rythme et synchronisation avec la musique",
      "Les demi-tours (turns) et poses en bout de podium",
      "Défiler avec des accessoires (sacs, chapeaux, etc.)",
      "Défiler avec des tenues complexes (robes longues, traînes)",
      "Expression et attitude sur le podium",
      "Préparation en backstage et gestion du stress"
    ]
  },
  {
    title: "Module 3: Photographie & Expression Corporelle",
    chapters: [
      "Les bases de la pose photographique",
      "Maîtriser ses expressions faciales (le 'smize')",
      "L'art du portrait, du gros plan et du plan américain",
      "Poses en pied et gestion de l'espace",
      "Travailler avec la lumière en studio et en extérieur",
      "Le mannequinat éditorial vs commercial",
      "Raconter une histoire à travers la pose",
      "Créer et développer son book photo professionnel"
    ]
  },
    {
    title: "Module 4: Industrie de la Mode & Professionnalisme",
    chapters: [
      "Le fonctionnement d'un shooting et d'un défilé",
      "Collaborer avec les stylistes, photographes et maquilleurs",
      "Comprendre un contrat de mannequin",
      "La gestion financière et la facturation",
      "Les castings : préparation, attitude et suivi",
      "L'importance des réseaux sociaux pour un mannequin",
      "Les capitales de la mode et les marchés internationaux",
      "S'adapter aux tendances et évolutions de l'industrie"
    ]
  },
  {
    title: "Module 5: Carrière & Développement Personnel",
    chapters: [
      "Définir ses objectifs et son plan de carrière",
      "Développer sa confiance en soi et son charisme",
      "Techniques de communication et d'interview",
      "Gestion de l'image publique et e-réputation",
      "Le networking et la construction de son réseau professionnel",
      "Santé mentale et bien-être dans un milieu exigeant",
      "Se diversifier : comédie, influence, entrepreneuriat",
      "Planifier sa carrière sur le long terme et sa reconversion"
    ]
  },
];

const Formations: React.FC = () => {
    const [openModule, setOpenModule] = useState<number | null>(0);

    const toggleModule = (index: number) => {
        setOpenModule(openModule === index ? null : index);
    };

    return (
        <div className="bg-pm-dark text-pm-off-white">
            {/* Hero Section */}
            <section 
                className="relative min-h-[50vh] flex items-center justify-center text-center bg-cover bg-center"
                style={{ backgroundImage: "url('https://i.ibb.co/b5LgVZgr/DSC-0090.jpg')" }}
                aria-labelledby="formations-title"
            >
                <div className="absolute inset-0 bg-pm-dark/80"></div>
                <div className="relative z-10 p-6">
                    <h1 id="formations-title" className="text-4xl md:text-6xl font-playfair text-pm-gold font-extrabold" style={{ textShadow: '0 0 15px rgba(212, 175, 55, 0.7)' }}>
                        Programme de Formation
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-pm-off-white/90 max-w-3xl mx-auto">
                        40 chapitres théoriques pour maîtriser l'art du mannequinat et lancer une carrière à succès.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto">
                    {/* Introduction */}
                    <section className="text-center mb-16">
                         <h2 className="text-3xl font-playfair text-pm-gold mb-4">De l'Aspiration à la Professionnalisation</h2>
                         <p className="text-pm-off-white/80 leading-relaxed">
                            Notre programme complet est conçu pour vous doter de toutes les connaissances théoriques indispensables pour exceller. Chaque module explore en profondeur un aspect crucial du métier, vous préparant à naviguer avec confiance dans l'industrie de la mode.
                         </p>
                    </section>
                
                    {/* Accordion Modules */}
                    <section aria-label="Modules de formation">
                        <div className="space-y-4">
                            {formationModules.map((module, index) => (
                                <div key={index} className="bg-black border border-pm-gold/20 overflow-hidden">
                                    <button
                                        onClick={() => toggleModule(index)}
                                        className="w-full flex justify-between items-center p-5 text-left text-xl font-bold text-pm-gold hover:bg-pm-gold/5"
                                        aria-expanded={openModule === index}
                                        aria-controls={`module-content-${index}`}
                                    >
                                        <span>{module.title}</span>
                                        <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${openModule === index ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div
                                        id={`module-content-${index}`}
                                        className={`transition-all duration-500 ease-in-out ${openModule === index ? 'max-h-[500px] visible' : 'max-h-0 invisible'}`}
                                    >
                                        <div className="p-5 border-t border-pm-gold/20">
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-pm-off-white/80">
                                                {module.chapters.map((chapter, chapIndex) => (
                                                    <li key={chapIndex} className="py-1">{chapter}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    
                    {/* CTA Section */}
                    <section aria-labelledby="registration-title" className="mt-20">
                      <div className="max-w-3xl mx-auto bg-pm-gold text-pm-dark p-8 text-center shadow-lg shadow-pm-gold/30">
                        <h2 id="registration-title" className="text-4xl font-playfair font-bold mb-4">Prêt à commencer ?</h2>
                        <p className="text-lg mb-6">Contactez-nous pour en savoir plus sur nos sessions de formation, les modalités d'inscription et les prochaines dates.</p>
                        <a href="tel:+241074066461" className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-pm-dark text-pm-gold font-bold uppercase tracking-widest transition-transform duration-300 hover:scale-105">
                            <PhoneIcon className="w-6 h-6" aria-hidden="true" />
                            Inscriptions : 074 06 64 61
                        </a>
                      </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Formations;
