export const globalKeywords = [
    // Agence & Localisation
    "Agence de mannequins Gabon", "Agence de mannequins Libreville", "Agence de mode Gabon", "Agence de casting Gabon",
    "Meilleure agence de mannequins Afrique Centrale", "Agence de mannequins Port-Gentil", "Agence de mannequins Franceville",
    "Agence de mannequins Oyem", "Agence de mannequins Moanda", "Agence de mannequins Mouila", "Agence de mannequins Lambaréné",
    "Agence de mannequins Tchibanga", "Agence de mannequins Koulamoutou", "Agence de mannequins Makokou",
    "Mannequinat Gabon", "Devenir mannequin Gabon", "Casting mannequin Gabon", "Recrutement mannequin Gabon",
    "Agence de publicité Gabon", "Agence événementielle Gabon", "Agence hôtesse Gabon", "Agence hôtesse Libreville",

    // Services
    "Formation mannequin", "Cours de marche", "Cours de pose photo", "Book photo mannequin", "Shooting photo mode",
    "Organisation défilé de mode", "Direction artistique défilé", "Casting directeur Gabon", "Scout de mode Gabon",
    "Location de mannequins", "Hôtesses d'accueil événementiel", "Mannequins pour publicité", "Mannequins pour clip vidéo",
    "Mannequins pour catalogue", "Mannequins pour e-commerce", "Mannequins grande taille Gabon", "Mannequins petite taille",
    "Mannequins enfants Gabon", "Mannequins seniors Gabon", "Mannequins fitness Gabon", "Mannequins lingerie",

    // Événements & Concepts
    "Perfect Fashion Day", "Défilé de mode Libreville", "Fashion Week Gabon", "Événement mode Gabon",
    "Concours de beauté Gabon", "Miss Gabon casting", "Mister Gabon casting", "Festival de mode Gabon",
    "Soirée de gala Libreville", "Lancement de produit Gabon", "Showroom mode Gabon", "Pop-up store mode",

    // Termes liés à la mode
    "Haute couture Gabon", "Prêt-à-porter Gabon", "Styliste Gabonais", "Créateur de mode Gabon", "Marque de vêtements Gabon",
    "Photographe de mode Gabon", "Maquilleuse professionnelle Gabon", "Coiffeur studio Gabon", "Stylisme photo",
    "Tendances mode Afrique", "Mode africaine moderne", "Tissu pagne moderne", "Rafia mode", "Accessoires de mode Gabon",

    // International & Visibilité
    "International model agency Africa", "Model scouting Africa", "African models for Paris Fashion Week",
    "African models for Milan Fashion Week", "African models for New York Fashion Week", "African models for London Fashion Week",
    "Top models Gabon", "Mannequins internationaux gabonais", "Carrière internationale mannequin",
    "Agence partenaire Elite", "Agence partenaire IMG", "Agence partenaire Ford Models", "Agence partenaire Next",

    // Mots-clés longue traîne (Questions fréquentes)
    "Comment devenir mannequin au Gabon", "Combien gagne un mannequin au Gabon", "Taille minimum pour être mannequin",
    "Agence de mannequin sérieuse Gabon", "Casting pour débutant Gabon", "École de mannequinat Libreville",
    "Inscription agence de mannequin", "Photos pour casting mannequin", "Conseils pour devenir mannequin",
    "Mannequin homme Gabon", "Mannequin femme Gabon", "Mannequin photo vs podium",

    // Variations orthographiques et synonymes
    "Modeling agency Gabon", "Model management Gabon", "Talent agency Gabon", "Fashion agency Libreville",
    "Mannequinat masculin", "Mannequinat féminin", "Modèle photo", "Modèle vivant", "Casting call Gabon",
    "Audition mannequin", "Booker mannequin", "Agent de mannequin", "Scouteur de mode"
];

// Générateur de mots-clés supplémentaires (pour atteindre +1000)
const cities = ["Libreville", "Port-Gentil", "Franceville", "Oyem", "Moanda", "Mouila", "Lambaréné", "Tchibanga", "Koulamoutou", "Makokou", "Akanda", "Owendo", "Ntoum", "Bitam", "Gamba"];
const services = ["Casting", "Formation", "Booking", "Shooting", "Défilé", "Publicité", "Hôtessariat", "Promotion", "Marketing d'influence"];
const adjectives = ["Professionnel", "International", "Sérieux", "Prestigieux", "Exclusif", "Meilleur", "Top", "Célèbre", "Reconnu", "Luxe", "Haut de gamme"];
const roles = ["Mannequin", "Modèle", "Hôtesse", "Ambassadeur", "Influenceur", "Égérie", "Figurant", "Acteur pub"];

export const generateMassiveKeywords = (): string => {
    let generatedKeywords: string[] = [...globalKeywords];

    // Combinaisons Ville + Service
    cities.forEach(city => {
        services.forEach(service => {
            generatedKeywords.push(`${service} mannequin ${city}`);
            generatedKeywords.push(`Agence ${service} ${city}`);
        });
    });

    // Combinaisons Adjectif + Rôle + Ville
    adjectives.forEach(adj => {
        roles.forEach(role => {
            generatedKeywords.push(`${role} ${adj} Gabon`);
            generatedKeywords.push(`Agence de ${role} ${adj}`);
        });
    });

    // Combinaisons Rôle + Type
    const types = ["Photo", "Podium", "Vidéo", "Commercial", "Editorial", "Fitness", "Lingerie", "Maillot de bain", "Mains", "Visage", "Cheveux"];
    roles.forEach(role => {
        types.forEach(type => {
            generatedKeywords.push(`${role} ${type} Gabon`);
            generatedKeywords.push(`Casting ${role} ${type}`);
        });
    });

    // Nettoyage et déduplication
    const uniqueKeywords = Array.from(new Set(generatedKeywords));

    // Retourne une chaîne séparée par des virgules (limité aux 500 premiers pour éviter le spam excessif dans une seule balise, mais disponible pour rotation)
    return uniqueKeywords.join(", ");
};

export const getPageKeywords = (pageContext: string): string => {
    // Logique pour retourner des mots-clés spécifiques + une sélection de globaux
    const base = generateMassiveKeywords().split(", ").slice(0, 50).join(", "); // Prend les 50 premiers "meilleurs"
    return `${pageContext}, ${base}`;
};
