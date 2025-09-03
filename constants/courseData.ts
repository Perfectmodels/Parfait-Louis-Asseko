import { Module } from '../types';

export const courseData: Module[] = [
  {
    slug: "module-1-les-fondamentaux-du-mannequinat",
    title: "Module 1: Les Fondamentaux du Mannequinat",
    chapters: [
      { 
        slug: "histoire-et-evolution-du-mannequinat",
        title: "Histoire et évolution du mannequinat", 
        content: "Explorez les origines du mannequinat, des premières muses des couturiers aux 'supermodels' des années 90 et à l'ère digitale d'aujourd'hui. Comprenez comment les standards de beauté et les attentes de l'industrie ont évolué, façonnant le métier tel que nous le connaissons." 
      },
      { 
        slug: "les-differents-types-de-mannequinat",
        title: "Les différents types de mannequinat", 
        content: "Découvrez la diversité du métier : mannequin de défilé (Haute Couture, Prêt-à-porter), mannequin photo (éditorial, commercial, catalogue), mannequin de détail (mains, pieds), mannequin cabine (fitting) et mannequin grande taille. Identifiez le domaine qui correspond le mieux à votre profil." 
      },
      { 
        slug: "comprendre-les-agences-et-le-role-de-lagent",
        title: "Comprendre les agences et le rôle de l'agent", 
        content: "Une agence est votre partenaire de carrière. Apprenez comment fonctionnent les agences, la différence entre agence mère et agence de placement, le rôle crucial de l'agent (booker) dans la négociation de contrats, la gestion de votre planning et la direction de votre carrière." 
      },
      { 
        slug: "limportance-de-limage-et-du-personal-branding",
        title: "L'importance de l'image et du personal branding", 
        content: "Votre image est votre marque. Définissez votre 'personal branding' : qui êtes-vous en tant que mannequin ? Quelle est votre singularité ? Apprenez à construire et maintenir une image professionnelle et cohérente, sur les réseaux sociaux comme en personne." 
      },
      { 
        slug: "les-mensurations-et-standards-de-lindustrie",
        title: "Les mensurations et standards de l'industrie", 
        content: "Les mensurations sont un outil de travail pour les créateurs. Comprenez les standards actuels pour les hommes et les femmes, comment prendre vos mensurations correctement (poitrine/buste, taille, hanches) et l'importance de les maintenir de manière saine." 
      },
      { 
        slug: "le-vocabulaire-de-la-mode",
        title: "Le vocabulaire de la mode", 
        content: "Maîtrisez le jargon de l'industrie pour communiquer efficacement. Apprenez les termes clés : 'book', 'composite', 'casting', 'call-back', 'fitting', 'éditorial', 'lookbook', 'runway', etc. Une bonne communication est un signe de professionnalisme." 
      },
      { 
        slug: "hygiene-de-vie-et-nutrition-du-mannequin",
        title: "Hygiène de vie et nutrition du mannequin", 
        content: "Votre corps est votre instrument de travail. Adoptez une alimentation équilibrée, une routine d'exercice physique adaptée et un sommeil de qualité. L'hydratation, le soin de la peau et des cheveux sont essentiels pour être toujours au meilleur de votre forme." 
      },
      { 
        slug: "ethique-et-professionnalisme-dans-le-metier",
        title: "Éthique et professionnalisme dans le métier", 
        content: "La ponctualité, la politesse, une attitude positive et la fiabilité sont des qualités non négociables. Comprenez l'importance du respect envers toute l'équipe (photographes, stylistes, maquilleurs) et les règles de conduite à adopter en casting, en shooting et en backstage." 
      }
    ],
    quiz: [
      {
        question: "Quel est le rôle principal d'un 'booker' dans une agence ?",
        options: ["Maquiller les mannequins", "Prendre les photos du book", "Négocier les contrats et gérer le planning", "Choisir les vêtements pour les défilés"],
        correctAnswer: "Négocier les contrats et gérer le planning"
      },
      {
        question: "Qu'est-ce qu'un 'composite' (ou 'comp card') ?",
        options: ["Un contrat de travail", "Une carte de visite avec les meilleures photos et mensurations du mannequin", "Le planning des castings", "Un magazine de mode"],
        correctAnswer: "Une carte de visite avec les meilleures photos et mensurations du mannequin"
      },
      {
        question: "Lequel de ces types de mannequinat est principalement axé sur le travail avec les designers pendant le processus de création de vêtements ?",
        options: ["Mannequin commercial", "Mannequin éditorial", "Mannequin cabine (fitting)", "Mannequin de détail"],
        correctAnswer: "Mannequin cabine (fitting)"
      }
    ]
  },
  {
    slug: "module-2-techniques-de-podium-catwalk",
    title: "Module 2: Techniques de Podium (Catwalk)",
    chapters: [
        { slug: "maitrise-de-la-demarche-et-de-la-posture", title: "Maîtrise de la démarche et de la posture", content: "La base de tout. Travaillez sur l'alignement du corps : épaules en arrière, tête haute, engagement des abdominaux. Apprenez à marcher en ligne droite, un pied devant l'autre, avec fluidité et puissance." },
        { slug: "les-differents-types-de-defiles", title: "Les différents types de défilés (Haute Couture, Prêt-à-porter)", content: "Adaptez votre démarche au style du défilé. La Haute Couture demande une démarche plus lente, théâtrale et forte, tandis que le Prêt-à-porter est souvent plus rapide, naturel et énergique." },
        { slug: "gestion-du-rythme-et-synchronisation-avec-la-musique", title: "Gestion du rythme et synchronisation avec la musique", content: "Le mannequin doit être en symbiose avec l'ambiance sonore. Apprenez à écouter le rythme de la musique pour caler votre pas et adapter l'énergie de votre démarche à l'atmosphère du show." },
        { slug: "les-demi-tours-et-poses-en-bout-de-podium", title: "Les demi-tours (turns) et poses en bout de podium", content: "Le 'turn' est un moment clé. Maîtrisez différentes techniques de demi-tour (simple, avec pause, chorégraphié) et apprenez à marquer une pose forte et mémorable face aux photographes en bout de podium ('pit')." },
        { slug: "defiler-avec-des-accessoires", title: "Défiler avec des accessoires (sacs, chapeaux, etc.)", content: "Un accessoire doit être intégré à la démarche, pas simplement porté. Apprenez à le mettre en valeur de manière naturelle, qu'il s'agisse d'un sac à main, de lunettes de soleil ou d'un chapeau, sans perturber votre allure." },
        { slug: "defiler-avec-des-tenues-complexes", title: "Défiler avec des tenues complexes (robes longues, traînes)", content: "Les tenues volumineuses ou avec des traînes demandent une technique spécifique. Apprenez à gérer le volume, à utiliser vos jambes pour diriger le tissu et à éviter les accidents tout en restant gracieux." },
        { slug: "expression-et-attitude-sur-le-podium", title: "Expression et attitude sur le podium", content: "Votre visage doit refléter l'esprit de la collection. Travaillez sur une expression neutre mais intense. Le regard est crucial : fixez un point au loin et projetez de la confiance. Évitez de sourire, sauf si c'est une demande du créateur." },
        { slug: "preparation-en-backstage-et-gestion-du-stress", title: "Préparation en backstage et gestion du stress", content: "Le backstage est un environnement chaotique et stressant. Apprenez à rester calme, concentré et professionnel. Soyez patient pendant l'habillage, le maquillage et la coiffure, et écoutez attentivement les instructions du régisseur." }
    ],
    quiz: [
        {
            question: "En bout de podium, où se trouve le 'pit' ?",
            options: ["La zone de repos des mannequins", "L'endroit où se trouvent les photographes", "Les coulisses", "Le vestiaire"],
            correctAnswer: "L'endroit où se trouvent les photographes"
        },
        {
            question: "Quelle est la principale différence de démarche entre un défilé Haute Couture et Prêt-à-porter ?",
            options: ["Il n'y en a aucune", "La Haute Couture est plus rapide et décontractée", "La Haute Couture est souvent plus lente, forte et théâtrale", "On doit sourire en Prêt-à-porter"],
            correctAnswer: "La Haute Couture est souvent plus lente, forte et théâtrale"
        }
    ]
  },
  {
    slug: "module-3-photographie-et-expression-corporelle",
    title: "Module 3: Photographie & Expression Corporelle",
    chapters: [
        { slug: "les-bases-de-la-pose-photographique", title: "Les bases de la pose photographique", content: "Apprenez les fondamentaux : les angles du corps, la création de lignes et de formes (triangles), la répartition du poids et l'importance de ne jamais être 'plat' face à l'objectif. La dissymétrie est votre alliée." },
        { slug: "maitriser-ses-expressions-faciales-le-smize", title: "Maîtriser ses expressions faciales (le 'smize')", content: "Votre visage est un outil puissant. Entraînez-vous à transmettre des émotions variées (joie, mélancolie, force, douceur) sans surjouer. Maîtrisez le 'smize' (sourire avec les yeux) pour un regard intense et captivant." },
        { slug: "lart-du-portrait-gros-plan-et-plan-americain", title: "L'art du portrait, du gros plan et du plan américain", content: "Chaque cadrage demande une approche différente. Pour un portrait, la connexion par le regard est primordiale. En gros plan, chaque micro-expression compte. En plan américain, la posture du haut du corps et le placement des mains sont clés." },
        { slug: "poses-en-pied-et-gestion-de-lespace", title: "Poses en pied et gestion de l'espace", content: "Utilisez tout votre corps pour occuper l'espace et interagir avec l'environnement. Apprenez les poses debout, assises, allongées, et en mouvement. Pensez toujours à allonger votre silhouette." },
        { slug: "travailler-avec-la-lumiere-en-studio-et-en-exterieur", title: "Travailler avec la lumière en studio et en extérieur", content: "Comprenez comment la lumière sculpte votre visage et votre corps. Apprenez à trouver votre 'bon côté' par rapport à la source de lumière (key light) et à utiliser les ombres pour créer du relief et du drame." },
        { slug: "le-mannequinat-editorial-vs-commercial", title: "Le mannequinat éditorial vs commercial", content: "Les attentes sont différentes. L'éditorial (magazines) recherche des poses artistiques, avant-gardistes et narratives. Le commercial (publicité) demande des expressions accessibles, positives et qui mettent en valeur le produit." },
        { slug: "raconter-une-histoire-a-travers-la-pose", title: "Raconter une histoire à travers la pose", content: "Un bon mannequin n'est pas juste un cintre, c'est un acteur. Avant de poser, demandez-vous : 'Quel est le personnage ? Quelle est l'histoire ? Quelle est l'émotion ?' Incarnez ce rôle pour donner de la profondeur à l'image." },
        { slug: "creer-et-developper-son-book-photo-professionnel", title: "Créer et développer son book photo professionnel", content: "Votre book est votre CV. Il doit montrer votre polyvalence : des portraits nets (polas), des photos en pied, des clichés éditoriaux et commerciaux. Sélectionnez uniquement vos meilleures photos avec l'aide de votre agent." }
    ],
    quiz: [
        {
            question: "En photographie, que recherche principalement un shooting 'éditorial' ?",
            options: ["Des poses simples et souriantes", "Mettre en avant un produit de manière évidente", "Des poses artistiques, créatives et narratives", "Des photos d'identité"],
            correctAnswer: "Des poses artistiques, créatives et narratives"
        },
        {
            question: "Que sont les 'polas' (ou polaroïds) dans un book ?",
            options: ["Des photos très retouchées", "Des photos en noir et blanc", "Des photos naturelles, sans maquillage ni retouche, montrant le mannequin tel qu'il est", "Des photos de défilé"],
            correctAnswer: "Des photos naturelles, sans maquillage ni retouche, montrant le mannequin tel qu'il est"
        }
    ]
  },
  {
    slug: "module-4-industrie-de-la-mode-et-professionnalisme",
    title: "Module 4: Industrie de la Mode & Professionnalisme",
    chapters: [
        { slug: "le-fonctionnement-dun-shooting-et-dun-defile", title: "Le fonctionnement d'un shooting et d'un défilé", content: "Comprenez la chronologie et les rôles de chacun : du styliste au photographe, en passant par le directeur artistique, le maquilleur, le coiffeur et le régisseur. Savoir qui fait quoi vous aidera à mieux vous intégrer." },
        { slug: "collaborer-avec-les-professionnels", title: "Collaborer avec les stylistes, photographes et maquilleurs", content: "Le succès d'un projet dépend du travail d'équipe. Soyez respectueux, à l'écoute et proactif. Communiquez clairement vos limites mais soyez ouvert aux propositions de l'équipe créative." },
        { slug: "comprendre-un-contrat-de-mannequin", title: "Comprendre un contrat de mannequin", content: "Ne signez jamais rien sans comprendre. Familiarisez-vous avec les termes importants : rémunération (cachet), droits d'utilisation (durée, territoire), exclusivité, conditions d'annulation. En cas de doute, demandez à votre agent." },
        { slug: "la-gestion-financiere-et-la-facturation", title: "La gestion financière et la facturation", content: "Apprenez à gérer vos revenus. Comprenez la commission de l'agence (généralement 20%), comment établir une facture, et l'importance de mettre de l'argent de côté pour les impôts et les périodes creuses." },
        { slug: "les-castings-preparation-attitude-et-suivi", title: "Les castings : préparation, attitude et suivi", content: "Un casting est un entretien d'embauche. Préparez-vous : renseignez-vous sur le client, ayez vos composites et votre book. Soyez ponctuel, confiant et suivez les instructions. Le suivi via votre agent est également important." },
        { slug: "limportance-des-reseaux-sociaux-pour-un-mannequin", title: "L'importance des réseaux sociaux pour un mannequin", content: "Instagram est devenu un outil de promotion indispensable. Soignez votre profil, publiez du contenu de qualité (professionnel et personnel), interagissez avec votre communauté et utilisez-le comme une vitrine de votre travail." },
        { slug: "les-capitales-de-la-mode-et-les-marches-internationaux", title: "Les capitales de la mode et les marchés internationaux", content: "Découvrez les spécificités des quatre grandes capitales : Paris (Haute Couture), Milan (luxe et savoir-faire), New York (commercial et sportswear) et Londres (créativité et avant-garde). Comprendre ces marchés peut orienter votre carrière." },
        { slug: "sadapter-aux-tendances-et-evolutions-de-lindustrie", title: "S'adapter aux tendances et évolutions de l'industrie", content: "L'industrie de la mode est en constante évolution : l'importance de la diversité et de l'inclusivité, la montée de la mode durable, l'impact du digital... Restez informé pour rester pertinent." }
    ],
    quiz: [
        {
            question: "Quel est le pourcentage de commission standard qu'une agence mère prend sur les revenus d'un mannequin ?",
            options: ["5%", "10%", "20%", "50%"],
            correctAnswer: "20%"
        },
        {
            question: "Laquelle de ces villes est historiquement la capitale de la Haute Couture ?",
            options: ["New York", "Paris", "Milan", "Londres"],
            correctAnswer: "Paris"
        }
    ]
  },
  {
    slug: "module-5-carriere-et-developpement-personnel",
    title: "Module 5: Carrière & Développement Personnel",
    chapters: [
        { slug: "definir-ses-objectifs-et-son-plan-de-carriere", title: "Définir ses objectifs et son plan de carrière", content: "Où vous voyez-vous dans 1, 5, 10 ans ? Définissez des objectifs clairs (SMART : Spécifiques, Mesurables, Atteignables, Réalistes, Temporellement définis) avec votre agent pour construire une carrière durable." },
        { slug: "developper-sa-confiance-en-soi-et-son-charisme", title: "Développer sa confiance en soi et son charisme", content: "La confiance se projette et attire les opportunités. Travaillez sur votre estime personnelle, votre posture, votre regard. Le charisme, c'est l'art d'être présent et de connecter avec les autres." },
        { slug: "techniques-de-communication-et-dinterview", title: "Techniques de communication et d'interview", content: "Savoir parler de soi et de son travail est essentiel. Préparez un 'elevator pitch', apprenez à répondre aux questions des journalistes ou des clients de manière professionnelle et engageante." },
        { slug: "gestion-de-limage-publique-et-e-reputation", title: "Gestion de l'image publique et e-réputation", content: "Ce que vous publiez en ligne est permanent. Faites attention à votre image sur les réseaux sociaux. Séparez, si nécessaire, comptes privés et professionnels. Gérez les commentaires négatifs avec maturité." },
        { slug: "le-networking-et-la-construction-de-son-reseau-professionnel", title: "Le networking et la construction de son réseau professionnel", content: "Chaque personne que vous rencontrez sur un shooting ou un événement est une connexion potentielle. Soyez aimable, professionnel et mémorisez les noms. Un bon réseau peut ouvrir de nombreuses portes." },
        { slug: "sante-mentale-et-bien-etre-dans-un-milieu-exigeant", title: "Santé mentale et bien-être dans un milieu exigeant", content: "Le mannequinat peut être éprouvant (rejet, pression, solitude). Apprenez à gérer le stress, à ne pas prendre le rejet personnellement et à vous entourer d'un système de soutien solide (famille, amis)." },
        { slug: "se-diversifier-comedie-influence-entrepreneuriat", title: "Se diversifier : comédie, influence, entrepreneuriat", content: "Votre carrière de mannequin a une durée de vie. Pensez à l'après. Utilisez votre notoriété et vos compétences pour vous diversifier vers d'autres domaines qui vous passionnent : devenir acteur, lancer une marque, etc." },
        { slug: "planifier-sa-carriere-sur-le-long-terme-et-sa-reconversion", title: "Planifier sa carrière sur le long terme et sa reconversion", content: "N'attendez pas la fin de votre carrière pour y penser. Économisez, formez-vous à d'autres métiers en parallèle, et préparez votre transition en douceur pour assurer votre avenir professionnel et financier." }
    ],
    quiz: [
        {
            question: "Que signifie l'acronyme SMART pour la définition d'objectifs ?",
            options: ["Simple, Mémorable, Ambitieux, Rapide, Testé", "Spécifique, Mesurable, Atteignable, Réaliste, Temporellement défini", "Secret, Malin, Artistique, Rare, Tendance", "Social, Mondial, Authentique, Reconnu, Total"],
            correctAnswer: "Spécifique, Mesurable, Atteignable, Réaliste, Temporellement défini"
        },
        {
            question: "Pourquoi le 'networking' est-il important dans le mannequinat ?",
            options: ["Pour obtenir des vêtements gratuits", "Pour se faire des amis", "Pour construire un réseau de contacts professionnels qui peut ouvrir des portes", "Pour organiser des fêtes"],
            correctAnswer: "Pour construire un réseau de contacts professionnels qui peut ouvrir des portes"
        }
    ]
  }
];