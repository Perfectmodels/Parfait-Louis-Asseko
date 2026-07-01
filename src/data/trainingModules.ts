// ═══════════════════════════════════════════════════════════════════════════
// DONNÉES DES MODULES DE FORMATION AVANCÉE
// ═══════════════════════════════════════════════════════════════════════════

import { TrainingModule } from '../types/training';

export const TRAINING_MODULES: TrainingModule[] = [
  // ─── MODULE 1 ───────────────────────────────────────────────────────────────
  {
    num: 1,
    title: "Fondamentaux du Mannequinat Professionnel",
    subtitle: "Introduction au Métier, Préparation Physique et Mentale",
    objectifs: [
      "Comprendre les réalités du métier de mannequin au Gabon et en Afrique",
      "Maîtriser les standards physiques et les critères de sélection",
      "Développer une routine de préparation physique adaptée",
      "Construire une mentalité professionnelle solide",
      "Connaître l'écosystème de la mode gabonaise"
    ],
    chapters: [
      {
        title: "Le Métier de Mannequin : Réalités et Perspectives au Gabon",
        content: [
          "Le mannequinat est une profession exigeante qui combine discipline physique, présence scénique et professionnalisme constant. Au Gabon, l'industrie de la mode connaît une croissance significative avec l'émergence de créateurs locaux, d'événements fashion et d'une demande croissante pour des mannequins professionnels.",
          "Contrairement aux idées reçues, le mannequinat ne se limite pas à la beauté physique. C'est un métier qui requiert des compétences techniques précises : maîtrise de la marche sur podium, capacité à prendre des poses photographiques variées, gestion du stress, ponctualité irréprochable et adaptabilité aux demandes des clients.",
          "Le marché gabonais offre plusieurs opportunités : défilés de mode locaux, campagnes publicitaires pour des marques nationales et internationales, shootings pour magazines, événements corporate, et collaborations avec des créateurs émergents. La Fashion Week de Libreville et d'autres événements régionaux constituent des vitrines importantes.",
          "Les revenus d'un mannequin au Gabon varient considérablement selon l'expérience et la notoriété. Un débutant peut gagner entre 50 000 et 150 000 FCFA par défilé, tandis qu'un mannequin expérimenté peut négocier des cachets bien supérieurs pour des campagnes publicitaires nationales.",
          "La carrière d'un mannequin est généralement courte (pic entre 18 et 30 ans pour la plupart), d'où l'importance de planifier sa reconversion dès le début. Beaucoup de mannequins gabonais se tournent vers le coaching, la direction artistique, le stylisme ou l'entrepreneuriat dans la mode après leur carrière active."
        ],
        keyPoints: [
          "Le mannequinat combine discipline, technique et professionnalisme",
          "Le marché gabonais est en croissance avec des opportunités variées",
          "Les revenus varient de 50 000 à plusieurs millions FCFA selon l'expérience",
          "La carrière est courte : planifier sa reconversion est essentiel",
          "Les compétences techniques sont aussi importantes que l'apparence"
        ],
        quiz: [
          {
            question: "Quelle est la fourchette de rémunération typique pour un mannequin débutant lors d'un défilé local au Gabon ?",
            options: [
              "10 000 à 30 000 FCFA",
              "50 000 à 150 000 FCFA",
              "500 000 à 1 000 000 FCFA",
              "Le mannequinat est toujours bénévole au début"
            ],
            correct: 1,
            explanation: "Un mannequin débutant au Gabon peut s'attendre à gagner entre 50 000 et 150 000 FCFA par défilé local, selon le prestige de l'événement et le budget du client."
          },
          {
            question: "Quelle est la principale raison pour laquelle un mannequin doit planifier sa reconversion dès le début de sa carrière ?",
            options: [
              "Parce que le mannequinat est ennuyeux",
              "Parce que la carrière de mannequin est généralement courte (pic entre 18-30 ans)",
              "Parce que c'est obligatoire légalement",
              "Parce que les agences l'exigent"
            ],
            correct: 1,
            explanation: "La carrière d'un mannequin atteint généralement son pic entre 18 et 30 ans, ce qui rend essentielle la planification d'une reconversion vers d'autres métiers de la mode ou de l'entrepreneuriat."
          },
          {
            question: "Quelles compétences techniques sont essentielles pour un mannequin professionnel ?",
            options: [
              "Uniquement la beauté physique",
              "Marche sur podium, poses photo, gestion du stress, ponctualité et adaptabilité",
              "Savoir danser et chanter",
              "Avoir beaucoup d'abonnés sur les réseaux sociaux"
            ],
            correct: 1,
            explanation: "Le mannequinat professionnel requiert des compétences techniques précises : maîtrise de la marche, poses variées, gestion du stress, ponctualité irréprochable et grande adaptabilité."
          },
          {
            question: "Qu'est-ce qui caractérise l'industrie de la mode au Gabon actuellement ?",
            options: [
              "Elle est en déclin constant",
              "Elle connaît une croissance significative avec l'émergence de créateurs locaux",
              "Elle dépend uniquement des marques internationales",
              "Elle n'existe pas encore"
            ],
            correct: 1,
            explanation: "L'industrie de la mode gabonaise connaît une croissance significative avec l'émergence de créateurs locaux, d'événements fashion et une demande croissante pour des mannequins professionnels."
          },
          {
            question: "Quel est le rôle principal d'un mannequin professionnel ?",
            options: [
              "Être beau et sourire uniquement",
              "Combiner discipline physique, présence scénique et professionnalisme constant",
              "Suivre les tendances sur les réseaux sociaux",
              "Participer à des fêtes et événements mondains"
            ],
            correct: 1,
            explanation: "Le mannequinat est une profession exigeante qui combine discipline physique, présence scénique et professionnalisme constant, bien au-delà de la simple apparence."
          },
          {
            question: "Quelles sont les principales opportunités de travail pour un mannequin au Gabon ?",
            options: [
              "Uniquement les défilés internationaux",
              "Défilés locaux, campagnes publicitaires, shootings magazines, événements corporate",
              "Seulement les réseaux sociaux",
              "Uniquement le cinéma"
            ],
            correct: 1,
            explanation: "Le marché gabonais offre plusieurs opportunités : défilés de mode locaux, campagnes publicitaires, shootings pour magazines, événements corporate, et collaborations avec des créateurs émergents."
          },
          {
            question: "Comment un mannequin expérimenté peut-il augmenter ses revenus au Gabon ?",
            options: [
              "En travaillant gratuitement pour se faire connaître",
              "En négociant des cachets supérieurs pour des campagnes publicitaires nationales",
              "En refusant tous les petits contrats",
              "En changeant constamment d'agence"
            ],
            correct: 1,
            explanation: "Un mannequin expérimenté peut négocier des cachets bien supérieurs pour des campagnes publicitaires nationales, grâce à sa notoriété et son expérience acquise."
          },
          {
            question: "Quelle est la meilleure approche pour gérer une carrière de mannequin ?",
            options: [
              "Vivre au jour le jour sans planification",
              "Planifier sa reconversion dès le début de sa carrière",
              "Attendre la fin de sa carrière pour penser à l'avenir",
              "Se concentrer uniquement sur l'apparence physique"
            ],
            correct: 1,
            explanation: "Il est essentiel de planifier sa reconversion dès le début de sa carrière, car celle-ci est généralement courte. Beaucoup se tournent vers le coaching, la direction artistique ou l'entrepreneuriat."
          },
          {
            question: "Quel événement constitue une vitrine importante pour les mannequins au Gabon ?",
            options: [
              "Les festivals de musique uniquement",
              "La Fashion Week de Libreville et autres événements régionaux",
              "Les compétitions sportives",
              "Les salons de l'automobile"
            ],
            correct: 1,
            explanation: "La Fashion Week de Libreville et d'autres événements régionaux constituent des vitrines importantes pour les mannequins gabonais et les créateurs locaux."
          },
          {
            question: "Quelle qualité est la plus importante pour réussir dans le mannequinat professionnel ?",
            options: [
              "Avoir des millions d'abonnés sur Instagram",
              "La ponctualité irréprochable et l'adaptabilité",
              "Être ami avec des célébrités",
              "Avoir une voiture de luxe"
            ],
            correct: 1,
            explanation: "La ponctualité irréprochable et l'adaptabilité aux demandes des clients sont des qualités essentielles pour réussir dans le mannequinat professionnel."
          },
          {
            question: "Un mannequin débutant reçoit une offre de défilé à 30 000 FCFA. Que devrait-il faire ?",
            options: [
              "Refuser immédiatement car c'est trop peu",
              "Évaluer l'opportunité : prestige de l'événement, visibilité, expérience",
              "Accepter sans poser de questions",
              "Demander 1 million FCFA"
            ],
            correct: 1,
            explanation: "Un débutant devrait évaluer l'opportunité globalement : le prestige de l'événement, la visibilité offerte et l'expérience acquise peuvent être plus importants que le cachet initial."
          },
          {
            question: "Un mannequin de 28 ans commence à recevoir moins d'offres. Quelle devrait être sa priorité ?",
            options: [
              "Paniquer et abandonner le métier",
              "Commencer à planifier sa reconversion ou diversification",
              "Ignorer la situation",
              "Critiquer les jeunes mannequins"
            ],
            correct: 1,
            explanation: "À 28 ans, il est temps de planifier activement sa reconversion ou diversification vers le coaching, la direction artistique, le stylisme ou l'entrepreneuriat dans la mode."
          },
          {
            question: "Un client demande à un mannequin d'arriver 2 heures avant le défilé. Quelle est la bonne attitude ?",
            options: [
              "Arriver à l'heure du défilé seulement",
              "Arriver 2 heures avant comme demandé, c'est du professionnalisme",
              "Négocier pour arriver 30 minutes avant",
              "Ne pas répondre au client"
            ],
            correct: 1,
            explanation: "Le professionnalisme exige de respecter les demandes du client. Arriver 2 heures avant permet les essayages, le maquillage, la coiffure et les répétitions nécessaires."
          },
          {
            question: "Un mannequin reçoit deux offres le même jour : un défilé à 100 000 FCFA et un shooting pour une grande marque à 80 000 FCFA. Comment choisir ?",
            options: [
              "Toujours choisir le plus payant",
              "Évaluer : visibilité, portfolio, relations professionnelles, et possibilités futures",
              "Refuser les deux",
              "Accepter les deux sans vérifier les horaires"
            ],
            correct: 1,
            explanation: "Il faut évaluer plusieurs critères : la visibilité offerte, l'impact sur le portfolio, les relations professionnelles à développer, et les possibilités de collaborations futures."
          },
          {
            question: "Un créateur local propose une collaboration sans rémunération mais avec beaucoup de visibilité. Que faire ?",
            options: [
              "Refuser catégoriquement",
              "Évaluer le potentiel de visibilité, la qualité du créateur, et négocier des contreparties",
              "Accepter toutes les collaborations gratuites",
              "Demander un prix exorbitant"
            ],
            correct: 1,
            explanation: "Il faut évaluer le potentiel réel de visibilité, la qualité et la réputation du créateur, et négocier des contreparties comme des photos pour le book ou des contacts professionnels."
          },
          {
            question: "Quelle est l'erreur la plus courante chez les mannequins débutants ?",
            options: [
              "Trop s'entraîner physiquement",
              "Penser que la beauté physique suffit et négliger les compétences techniques",
              "Être trop professionnel",
              "Lire trop de livres sur le mannequinat"
            ],
            correct: 1,
            explanation: "L'erreur la plus courante est de penser que la beauté physique suffit, alors que les compétences techniques (marche, poses, gestion du stress) sont tout aussi importantes."
          },
          {
            question: "Pourquoi est-il dangereux de ne pas planifier sa reconversion ?",
            options: [
              "Ce n'est pas dangereux du tout",
              "Car la carrière est courte et on peut se retrouver sans revenus après 30 ans",
              "Car les agences l'interdisent",
              "Car c'est illégal"
            ],
            correct: 1,
            explanation: "La carrière de mannequin étant courte (pic entre 18-30 ans), ne pas planifier sa reconversion peut mener à des difficultés financières et professionnelles après 30 ans."
          },
          {
            question: "Quelle attitude est à éviter absolument dans le mannequinat professionnel ?",
            options: [
              "Être ponctuel",
              "Le manque de ponctualité et d'adaptabilité",
              "Être professionnel",
              "Développer ses compétences"
            ],
            correct: 1,
            explanation: "Le manque de ponctualité et d'adaptabilité est rédhibitoire dans le mannequinat professionnel. Ces qualités sont essentielles pour maintenir une bonne réputation."
          },
          {
            question: "Quelle croyance erronée peut nuire à la carrière d'un mannequin ?",
            options: [
              "Qu'il faut travailler dur",
              "Que le mannequinat se limite à la beauté physique",
              "Qu'il faut être professionnel",
              "Qu'il faut développer un réseau"
            ],
            correct: 1,
            explanation: "Croire que le mannequinat se limite à la beauté physique est une erreur. C'est un métier qui requiert des compétences techniques, du professionnalisme et une gestion de carrière stratégique."
          },
          {
            question: "Quelle est la pire stratégie pour un mannequin au Gabon ?",
            options: [
              "Développer ses compétences continuellement",
              "Attendre passivement que les opportunités viennent sans se former ni réseauter",
              "Construire un portfolio professionnel",
              "Planifier sa carrière"
            ],
            correct: 1,
            explanation: "Attendre passivement est la pire stratégie. Le succès dans le mannequinat requiert une formation continue, un réseautage actif, et une gestion proactive de sa carrière."
          }
        ]
      },
      {
        title: "Standards Physiques et Critères de Sélection",
        content: [
          "Les standards physiques du mannequinat varient selon les marchés et les types de mannequinat. Pour le mannequinat de défilé haute couture international, les critères sont très stricts : taille minimale de 1,75 m pour les femmes et 1,85 m pour les hommes, mensurations précises et silhouette longiligne.",
          "Au Gabon et en Afrique, les standards sont plus flexibles et valorisent davantage la diversité des morphologies. Le mannequinat commercial, publicitaire et de mode africaine accepte une plus grande variété de tailles (à partir de 1,65 m pour les femmes) et de silhouettes, privilégiant l'expressivité et la présence scénique.",
          "Les mensurations de référence pour le mannequinat féminin classique sont généralement : tour de poitrine 85-90 cm, tour de taille 60-65 cm, tour de hanches 90-95 cm. Pour les hommes : tour de poitrine 95-100 cm, tour de taille 75-80 cm, tour de hanches 95-100 cm. Ces mesures sont indicatives et non absolues.",
          "Au-delà des mensurations, les critères de sélection incluent : la qualité de la peau (texture, éclat), la symétrie du visage, la photogénie (capacité à bien paraître en photo), la présence scénique, la confiance en soi, et surtout la capacité à incarner différents univers et styles.",
          "Il est crucial de comprendre que les standards évoluent. La mode africaine contemporaine célèbre de plus en plus la diversité : différentes carnations, textures de cheveux naturels, morphologies variées. L'authenticité et la personnalité deviennent des atouts majeurs face à la standardisation."
        ],
        keyPoints: [
          "Standards internationaux stricts vs standards africains plus flexibles",
          "Taille minimale classique : 1,75 m (F) / 1,85 m (H)",
          "Mensurations indicatives, non absolues",
          "Photogénie et présence scénique aussi importantes que les mesures",
          "La mode africaine valorise de plus en plus la diversité authentique"
        ],
        quiz: [
          {
            question: "Quelle est la taille minimale généralement requise pour le mannequinat de défilé haute couture international pour les femmes ?",
            options: [
              "1,60 m",
              "1,65 m",
              "1,75 m",
              "1,90 m"
            ],
            correct: 2,
            explanation: "Pour le mannequinat de défilé haute couture international, la taille minimale pour les femmes est généralement de 1,75 m, bien que les standards africains soient plus flexibles."
          },
          {
            question: "Qu'est-ce que la 'photogénie' dans le contexte du mannequinat ?",
            options: [
              "La capacité à prendre de belles photos avec son téléphone",
              "La capacité à bien paraître en photo, un critère de sélection important",
              "Le fait d'avoir un beau sourire",
              "La connaissance des techniques photographiques"
            ],
            correct: 1,
            explanation: "La photogénie est la capacité naturelle à bien paraître en photo. C'est un critère de sélection majeur car certaines personnes très belles en réalité ne rendent pas aussi bien en photographie."
          },
          {
            question: "Comment la mode africaine contemporaine se distingue-t-elle des standards internationaux traditionnels ?",
            options: [
              "Elle impose des standards encore plus stricts",
              "Elle célèbre davantage la diversité : carnations variées, cheveux naturels, morphologies diverses",
              "Elle n'a pas de standards du tout",
              "Elle copie exactement les standards européens"
            ],
            correct: 1,
            explanation: "La mode africaine contemporaine se distingue en célébrant la diversité authentique : différentes carnations, textures de cheveux naturels, morphologies variées, valorisant l'authenticité plutôt que la standardisation."
          },
          {
            question: "Quelles sont les mensurations de référence pour le tour de taille d'un mannequin féminin classique ?",
            options: [
              "50-55 cm",
              "60-65 cm",
              "70-75 cm",
              "80-85 cm"
            ],
            correct: 1,
            explanation: "Les mensurations de référence pour le mannequinat féminin classique incluent un tour de taille de 60-65 cm. Ces mesures sont toutefois indicatives et non absolues."
          },
          {
            question: "Quelle est la taille minimale acceptée pour le mannequinat commercial au Gabon ?",
            options: [
              "1,55 m pour les femmes",
              "1,65 m pour les femmes",
              "1,75 m pour les femmes",
              "1,85 m pour les femmes"
            ],
            correct: 1,
            explanation: "Au Gabon et en Afrique, le mannequinat commercial accepte une plus grande variété de tailles, à partir de 1,65 m pour les femmes, privilégiant l'expressivité et la présence scénique."
          },
          {
            question: "Quels critères de sélection vont au-delà des mensurations physiques ?",
            options: [
              "Uniquement la taille et le poids",
              "Qualité de la peau, symétrie du visage, photogénie, présence scénique, confiance en soi",
              "Seulement la couleur des yeux",
              "Uniquement le nombre d'abonnés sur les réseaux sociaux"
            ],
            correct: 1,
            explanation: "Au-delà des mensurations, les critères incluent la qualité de la peau, la symétrie du visage, la photogénie, la présence scénique, la confiance en soi, et la capacité à incarner différents univers."
          },
          {
            question: "Pourquoi les standards africains sont-ils plus flexibles que les standards internationaux ?",
            options: [
              "Par manque de professionnalisme",
              "Pour valoriser la diversité des morphologies et l'expressivité",
              "Parce qu'il n'y a pas assez de mannequins",
              "Par facilité"
            ],
            correct: 1,
            explanation: "Les standards africains sont plus flexibles car ils valorisent davantage la diversité des morphologies, l'expressivité et la présence scénique, reflétant la richesse de la beauté africaine."
          },
          {
            question: "Quelle est la taille minimale pour les hommes dans le mannequinat haute couture international ?",
            options: [
              "1,75 m",
              "1,80 m",
              "1,85 m",
              "1,90 m"
            ],
            correct: 2,
            explanation: "Pour le mannequinat de défilé haute couture international, la taille minimale pour les hommes est généralement de 1,85 m, avec des critères très stricts."
          },
          {
            question: "Une mannequin mesure 1,68 m. Quelles opportunités s'offrent à elle au Gabon ?",
            options: [
              "Aucune, elle est trop petite",
              "Mannequinat commercial, publicitaire et mode africaine",
              "Uniquement les défilés haute couture",
              "Seulement les shootings photo"
            ],
            correct: 1,
            explanation: "Avec 1,68 m, elle peut travailler dans le mannequinat commercial, publicitaire et de mode africaine qui acceptent une plus grande variété de tailles et privilégient la présence scénique."
          },
          {
            question: "Un mannequin a une excellente photogénie mais ne correspond pas exactement aux mensurations classiques. Que devrait-il faire ?",
            options: [
              "Abandonner le mannequinat",
              "Se concentrer sur le mannequinat commercial et africain qui valorise la diversité",
              "Faire de la chirurgie esthétique",
              "Mentir sur ses mensurations"
            ],
            correct: 1,
            explanation: "La photogénie est un atout majeur. Il devrait se concentrer sur le mannequinat commercial et africain qui valorise la diversité et où la présence scénique prime sur les mensurations strictes."
          },
          {
            question: "Comment un mannequin peut-il améliorer sa photogénie ?",
            options: [
              "C'est impossible, c'est inné",
              "Pratiquer devant un miroir, étudier les angles, travailler avec des photographes",
              "Utiliser uniquement des filtres",
              "Éviter les photos"
            ],
            correct: 1,
            explanation: "Bien que certains aient une photogénie naturelle, elle peut être améliorée en pratiquant devant un miroir, en étudiant les angles favorables, et en travaillant régulièrement avec des photographes."
          },
          {
            question: "Un créateur recherche un mannequin pour une collection célébrant la diversité africaine. Quel profil privilégiera-t-il ?",
            options: [
              "Uniquement les standards internationaux stricts",
              "Authenticité, personnalité, capacité à incarner différents univers",
              "Seulement les mannequins de grande taille",
              "Uniquement les mannequins avec beaucoup d'expérience"
            ],
            correct: 1,
            explanation: "Pour une collection célébrant la diversité africaine, le créateur privilégiera l'authenticité, la personnalité et la capacité à incarner différents univers plutôt que des standards stricts."
          },
          {
            question: "Un mannequin de 1,72 m se voit refuser un casting pour un défilé haute couture international. Quelle devrait être sa réaction ?",
            options: [
              "Abandonner le mannequinat",
              "Comprendre que c'est lié aux standards spécifiques et se tourner vers d'autres opportunités",
              "Critiquer l'industrie",
              "Mentir sur sa taille au prochain casting"
            ],
            correct: 1,
            explanation: "Il faut comprendre que chaque segment a ses standards. À 1,72 m, de nombreuses opportunités existent dans le mannequinat commercial, publicitaire et africain où cette taille est parfaitement acceptable."
          },
          {
            question: "Quelle est l'importance de la symétrie du visage dans le mannequinat ?",
            options: [
              "Elle n'a aucune importance",
              "C'est un critère de sélection important car elle influence la photogénie",
              "C'est le seul critère qui compte",
              "Elle est importante uniquement pour les hommes"
            ],
            correct: 1,
            explanation: "La symétrie du visage est un critère de sélection important car elle influence généralement la photogénie et l'harmonie des traits, bien que ce ne soit pas le seul critère."
          },
          {
            question: "Comment la qualité de la peau influence-t-elle la sélection d'un mannequin ?",
            options: [
              "Elle n'a aucune influence",
              "La texture et l'éclat de la peau sont des critères importants pour les shootings et défilés",
              "Seule la couleur de peau compte",
              "C'est important uniquement pour les mannequins femmes"
            ],
            correct: 1,
            explanation: "La qualité de la peau (texture, éclat) est un critère important car elle influence le rendu en photo et sous les lumières des défilés, nécessitant moins de retouches et de maquillage."
          },
          {
            question: "Un mannequin a toutes les mensurations requises mais manque de présence scénique. Quel est le problème ?",
            options: [
              "Il n'y a pas de problème",
              "La présence scénique est aussi importante que les mensurations et peut être développée",
              "Il devrait abandonner",
              "Les mensurations suffisent toujours"
            ],
            correct: 1,
            explanation: "La présence scénique est aussi importante que les mensurations. Heureusement, elle peut être développée par la pratique, la confiance en soi et l'entraînement."
          },
          {
            question: "Quelle erreur font souvent les mannequins débutants concernant les standards physiques ?",
            options: [
              "Ils s'entraînent trop",
              "Ils pensent que ne pas correspondre exactement aux standards internationaux signifie qu'ils ne peuvent pas réussir",
              "Ils mangent trop sainement",
              "Ils prennent trop soin de leur peau"
            ],
            correct: 1,
            explanation: "Beaucoup de débutants pensent à tort que ne pas correspondre exactement aux standards internationaux les disqualifie, alors que de nombreuses opportunités existent dans d'autres segments du mannequinat."
          },
          {
            question: "Pourquoi est-il dangereux de vouloir modifier son corps de manière extrême pour correspondre aux standards ?",
            options: [
              "Ce n'est pas dangereux",
              "Cela peut nuire à la santé et l'authenticité est de plus en plus valorisée",
              "C'est obligatoire pour réussir",
              "Tous les mannequins le font"
            ],
            correct: 1,
            explanation: "Les modifications corporelles extrêmes peuvent nuire gravement à la santé. De plus, l'authenticité et la diversité sont de plus en plus valorisées dans l'industrie, surtout en Afrique."
          },
          {
            question: "Quelle attitude adopter face à l'évolution des standards de beauté dans l'industrie ?",
            options: [
              "Ignorer ces changements",
              "Comprendre que la diversité et l'authenticité sont de plus en plus valorisées",
              "Essayer de correspondre à tous les standards",
              "Critiquer tous les standards"
            ],
            correct: 1,
            explanation: "Il faut comprendre que les standards évoluent vers plus de diversité et d'authenticité, particulièrement dans la mode africaine. C'est une opportunité pour les mannequins de différents profils."
          },
          {
            question: "Un mannequin correspond parfaitement aux mensurations mais a une mauvaise posture. Quel est l'impact ?",
            options: [
              "Aucun impact, les mensurations suffisent",
              "La posture affecte la présence scénique et peut être corrigée par l'entraînement",
              "Il devrait abandonner le mannequinat",
              "La posture n'est pas importante"
            ],
            correct: 1,
            explanation: "Une mauvaise posture affecte négativement la présence scénique et le rendu en photo. Heureusement, elle peut être corrigée par des exercices spécifiques et un entraînement régulier."
          },
          {
            question: "Quelle est la meilleure stratégie pour un mannequin qui ne correspond pas aux standards internationaux stricts ?",
            options: [
              "Abandonner le mannequinat",
              "Se spécialiser dans les segments qui valorisent la diversité : commercial, publicitaire, mode africaine",
              "Mentir sur ses mensurations",
              "Critiquer constamment l'industrie"
            ],
            correct: 1,
            explanation: "La meilleure stratégie est de se spécialiser dans les segments qui valorisent la diversité comme le mannequinat commercial, publicitaire et la mode africaine, où de nombreuses opportunités existent."
          }
        ]
      },
      {
        title: "Préparation Physique et Nutrition pour Mannequins",
        content: [
          "La préparation physique d'un mannequin ne vise pas la performance athlétique mais plutôt l'endurance, la souplesse et le maintien d'une silhouette harmonieuse. Un programme équilibré combine cardio léger (marche rapide, natation), renforcement musculaire doux (Pilates, yoga) et étirements quotidiens pour maintenir une posture élégante.",
          "La nutrition d'un mannequin professionnel repose sur l'équilibre et la régularité plutôt que sur les régimes restrictifs. Trois repas équilibrés par jour avec des collations saines, une hydratation abondante (2-3 litres d'eau par jour), et une alimentation riche en fruits, légumes, protéines maigres et bonnes graisses sont essentiels.",
          "Au Gabon, l'alimentation locale offre d'excellentes options : poissons frais riches en oméga-3, fruits tropicaux gorgés de vitamines, légumes verts, manioc en quantité modérée, et huile de palme rouge avec modération. Il est important d'adapter les conseils nutritionnels internationaux aux réalités et ressources locales.",
          "Les pièges à éviter incluent les régimes drastiques qui affaiblissent le corps, la déshydratation qui ternit la peau, le manque de sommeil qui crée des cernes, et les compléments alimentaires non contrôlés. La santé doit toujours primer sur l'apparence, car un mannequin malade ne peut pas travailler.",
          "La préparation mentale est aussi importante que la préparation physique. Le stress, l'anxiété et la pression de l'industrie peuvent affecter le corps. Des techniques de relaxation (méditation, respiration profonde), un sommeil de qualité (7-8 heures par nuit) et un équilibre vie professionnelle/personnelle sont cruciaux pour une carrière durable."
        ],
        keyPoints: [
          "Programme équilibré : cardio léger, renforcement doux, étirements quotidiens",
          "Nutrition : 3 repas équilibrés, hydratation abondante, pas de régimes restrictifs",
          "Alimentation locale gabonaise : poissons, fruits tropicaux, légumes verts",
          "Éviter : régimes drastiques, déshydratation, manque de sommeil",
          "Préparation mentale : relaxation, sommeil de qualité, équilibre de vie"
        ],
        quiz: [
          {
            question: "Quel est l'objectif principal de la préparation physique d'un mannequin ?",
            options: [
              "Devenir un athlète de haut niveau",
              "Maintenir endurance, souplesse et silhouette harmonieuse",
              "Perdre le maximum de poids",
              "Développer une musculature importante"
            ],
            correct: 1,
            explanation: "La préparation physique d'un mannequin vise l'endurance, la souplesse et le maintien d'une silhouette harmonieuse, pas la performance athlétique ou la musculation excessive."
          },
          {
            question: "Quelle quantité d'eau un mannequin devrait-il boire quotidiennement ?",
            options: [
              "500 ml par jour",
              "1 litre par jour",
              "2-3 litres par jour",
              "5 litres par jour"
            ],
            correct: 2,
            explanation: "Une hydratation abondante de 2-3 litres d'eau par jour est essentielle pour maintenir la qualité de la peau, l'énergie et la santé générale d'un mannequin."
          },
          {
            question: "Quels types d'exercices sont recommandés pour les mannequins ?",
            options: [
              "Uniquement la musculation intensive",
              "Cardio léger, Pilates, yoga, étirements",
              "Seulement la course à pied",
              "Aucun exercice n'est nécessaire"
            ],
            correct: 1,
            explanation: "Un programme équilibré combine cardio léger (marche, natation), renforcement musculaire doux (Pilates, yoga) et étirements quotidiens pour maintenir une posture élégante."
          },
          {
            question: "Quelle est la meilleure approche nutritionnelle pour un mannequin ?",
            options: [
              "Régimes restrictifs et jeûnes fréquents",
              "Trois repas équilibrés avec collations saines et hydratation",
              "Manger uniquement des salades",
              "Sauter des repas régulièrement"
            ],
            correct: 1,
            explanation: "La nutrition d'un mannequin repose sur l'équilibre : trois repas équilibrés par jour avec des collations saines, une hydratation abondante, plutôt que sur les régimes restrictifs."
          },
          {
            question: "Quels aliments locaux gabonais sont excellents pour les mannequins ?",
            options: [
              "Uniquement les aliments importés",
              "Poissons frais, fruits tropicaux, légumes verts",
              "Seulement les fast-foods",
              "Uniquement les compléments alimentaires"
            ],
            correct: 1,
            explanation: "L'alimentation locale gabonaise offre d'excellentes options : poissons frais riches en oméga-3, fruits tropicaux gorgés de vitamines, légumes verts, adaptés aux besoins des mannequins."
          },
          {
            question: "Combien d'heures de sommeil sont recommandées pour un mannequin ?",
            options: [
              "3-4 heures",
              "5-6 heures",
              "7-8 heures",
              "10-12 heures"
            ],
            correct: 2,
            explanation: "Un sommeil de qualité de 7-8 heures par nuit est crucial pour la récupération, la qualité de la peau, l'énergie et la concentration d'un mannequin professionnel."
          },
          {
            question: "Un mannequin doit perdre du poids rapidement pour un défilé dans 2 semaines. Que devrait-il faire ?",
            options: [
              "Faire un régime drastique et jeûner",
              "Consulter un nutritionniste et ajuster progressivement son alimentation",
              "Prendre des pilules amaigrissantes",
              "Arrêter complètement de manger"
            ],
            correct: 1,
            explanation: "Les régimes drastiques sont dangereux. Il faut consulter un nutritionniste pour ajuster progressivement l'alimentation de manière saine, en privilégiant toujours la santé."
          },
          {
            question: "Comment un mannequin peut-il maintenir une bonne posture au quotidien ?",
            options: [
              "En restant assis toute la journée",
              "Par des étirements quotidiens, du Pilates et une conscience corporelle",
              "En portant des talons hauts en permanence",
              "En évitant tout exercice"
            ],
            correct: 1,
            explanation: "Une bonne posture se maintient par des étirements quotidiens, des exercices comme le Pilates ou le yoga, et une conscience corporelle constante dans les activités quotidiennes."
          },
          {
            question: "Un mannequin se sent fatigué et a des cernes. Quelle en est probablement la cause ?",
            options: [
              "C'est normal dans le mannequinat",
              "Manque de sommeil et/ou déshydratation",
              "Trop d'exercice physique",
              "Trop de vitamines"
            ],
            correct: 1,
            explanation: "La fatigue et les cernes sont souvent causés par le manque de sommeil et la déshydratation, deux facteurs qui affectent directement l'apparence et la performance d'un mannequin."
          },
          {
            question: "Quelle est l'importance de l'huile de palme rouge dans l'alimentation gabonaise pour les mannequins ?",
            options: [
              "Elle doit être consommée en grande quantité",
              "Elle peut être consommée avec modération pour ses vitamines",
              "Elle doit être complètement évitée",
              "Elle remplace tous les autres aliments"
            ],
            correct: 1,
            explanation: "L'huile de palme rouge, riche en vitamines, peut être consommée avec modération dans le cadre d'une alimentation équilibrée, en respectant les besoins nutritionnels du mannequin."
          },
          {
            question: "Un mannequin reçoit des conseils contradictoires sur la nutrition. Que devrait-il faire ?",
            options: [
              "Suivre tous les conseils en même temps",
              "Consulter un nutritionniste professionnel qualifié",
              "Ignorer tous les conseils",
              "Suivre uniquement les régimes à la mode"
            ],
            correct: 1,
            explanation: "Face à des conseils contradictoires, il est essentiel de consulter un nutritionniste professionnel qualifié qui pourra adapter les recommandations à la situation personnelle."
          },
          {
            question: "Comment gérer le stress lié aux exigences physiques du mannequinat ?",
            options: [
              "Ignorer le stress",
              "Pratiquer la méditation, respiration profonde, maintenir un équilibre de vie",
              "Travailler encore plus",
              "Prendre des médicaments sans prescription"
            ],
            correct: 1,
            explanation: "Le stress se gère par des techniques de relaxation (méditation, respiration profonde), un sommeil de qualité et un équilibre entre vie professionnelle et personnelle."
          },
          {
            question: "Un mannequin veut prendre des compléments alimentaires. Quelle est la bonne approche ?",
            options: [
              "Acheter tous les compléments disponibles",
              "Consulter un médecin ou nutritionniste avant toute supplémentation",
              "Suivre les conseils des réseaux sociaux",
              "Prendre les mêmes que les autres mannequins"
            ],
            correct: 1,
            explanation: "Les compléments alimentaires non contrôlés peuvent être dangereux. Il faut toujours consulter un médecin ou nutritionniste avant toute supplémentation."
          },
          {
            question: "Quelle est la relation entre hydratation et qualité de la peau ?",
            options: [
              "Il n'y a aucune relation",
              "Une bonne hydratation maintient l'éclat et la texture de la peau",
              "Trop d'eau abîme la peau",
              "Seules les crèmes hydratent la peau"
            ],
            correct: 1,
            explanation: "Une hydratation abondante (2-3 litres d'eau par jour) est essentielle pour maintenir l'éclat, la texture et l'élasticité de la peau, un atout majeur pour les mannequins."
          },
          {
            question: "Un mannequin saute régulièrement des repas pour contrôler son poids. Quel est le risque ?",
            options: [
              "C'est une bonne stratégie",
              "Cela affaiblit le corps, ralentit le métabolisme et nuit à la santé",
              "C'est obligatoire dans le mannequinat",
              "Cela n'a aucun effet"
            ],
            correct: 1,
            explanation: "Sauter des repas affaiblit le corps, ralentit le métabolisme, crée des carences et nuit à la santé. La régularité des repas équilibrés est essentielle."
          },
          {
            question: "Pourquoi la santé doit-elle toujours primer sur l'apparence ?",
            options: [
              "Ce n'est pas nécessaire",
              "Un mannequin malade ne peut pas travailler et met sa carrière en danger",
              "L'apparence est plus importante",
              "La santé n'affecte pas le travail"
            ],
            correct: 1,
            explanation: "La santé doit toujours primer car un mannequin malade ne peut pas travailler efficacement, met sa carrière en danger et risque des problèmes de santé à long terme."
          },
          {
            question: "Quelle erreur nutritionnelle courante font les mannequins débutants ?",
            options: [
              "Manger trop équilibré",
              "Suivre des régimes drastiques et restrictifs",
              "Boire trop d'eau",
              "Manger trop de fruits"
            ],
            correct: 1,
            explanation: "Une erreur courante est de suivre des régimes drastiques et restrictifs qui affaiblissent le corps, alors qu'une alimentation équilibrée et régulière est la clé."
          },
          {
            question: "Comment adapter les conseils nutritionnels internationaux au contexte gabonais ?",
            options: [
              "Ne pas les adapter, suivre exactement les conseils internationaux",
              "Utiliser les aliments locaux disponibles (poissons, fruits tropicaux, légumes)",
              "Importer tous les aliments",
              "Ignorer complètement les conseils internationaux"
            ],
            correct: 1,
            explanation: "Il est important d'adapter les conseils nutritionnels aux réalités locales en utilisant les excellents aliments gabonais disponibles : poissons frais, fruits tropicaux, légumes verts."
          },
          {
            question: "Quel est le rôle de la préparation mentale dans la condition physique ?",
            options: [
              "Elle n'a aucun rôle",
              "Le stress et l'anxiété affectent le corps, la préparation mentale est cruciale",
              "Seul le physique compte",
              "La préparation mentale est optionnelle"
            ],
            correct: 1,
            explanation: "La préparation mentale est aussi importante que la préparation physique car le stress et l'anxiété affectent directement le corps, la peau et la performance."
          },
          {
            question: "Quelle est la meilleure stratégie à long terme pour maintenir sa condition physique ?",
            options: [
              "Des régimes yo-yo constants",
              "Un mode de vie équilibré avec exercice régulier et alimentation saine",
              "Des périodes d'excès suivies de restrictions",
              "Se fier uniquement aux compléments alimentaires"
            ],
            correct: 1,
            explanation: "La meilleure stratégie à long terme est un mode de vie équilibré combinant exercice régulier, alimentation saine, hydratation et sommeil de qualité, plutôt que des approches extrêmes."
          }
        ]
      },
      {
        title: "Confiance en Soi et Mentalité Professionnelle",
        content: [
          "La confiance en soi est le fondement de la réussite dans le mannequinat. Elle ne signifie pas l'arrogance, mais une assurance tranquille dans ses capacités et sa valeur. Cette confiance se construit progressivement à travers la préparation, la pratique et l'acceptation de soi.",
          "Les techniques d'ancrage mental sont essentielles pour gérer le stress des castings et défilés. La respiration profonde, la visualisation positive et les affirmations personnelles aident à maintenir un état d'esprit calme et concentré même dans les situations de haute pression.",
          "Au Gabon, où la compétition peut être intense, développer une mentalité de croissance est crucial. Voir chaque rejet comme une opportunité d'apprentissage plutôt que comme un échec personnel permet de persévérer et de s'améliorer continuellement.",
          "La comparaison avec les autres mannequins est un piège courant. Chaque mannequin a son propre parcours, ses forces uniques et son timing. Se concentrer sur son propre développement et célébrer ses progrès personnels est bien plus productif que l'envie ou la jalousie.",
          "La résilience face aux critiques et aux rejets est une compétence professionnelle indispensable. Apprendre à distinguer les critiques constructives des commentaires destructeurs, et développer une peau émotionnelle suffisamment épaisse pour ne pas être déstabilisé par chaque feedback négatif, est essentiel pour une carrière durable."
        ],
        keyPoints: [
          "Confiance = assurance tranquille, pas arrogance",
          "Techniques d'ancrage : respiration, visualisation, affirmations",
          "Mentalité de croissance : rejets = opportunités d'apprentissage",
          "Éviter la comparaison, se concentrer sur son propre parcours",
          "Résilience : distinguer critiques constructives et destructrices"
        ],
        quiz: [
          {
            question: "Quelle est la différence entre confiance en soi et arrogance ?",
            options: [
              "Il n'y a pas de différence",
              "La confiance est une assurance tranquille, l'arrogance est une surestimation de soi",
              "L'arrogance est préférable dans le mannequinat",
              "La confiance signifie ignorer les autres"
            ],
            correct: 1,
            explanation: "La confiance en soi est une assurance tranquille dans ses capacités et sa valeur, tandis que l'arrogance est une surestimation de soi souvent accompagnée de mépris pour les autres."
          },
          {
            question: "Quelle technique aide à gérer le stress avant un casting ?",
            options: [
              "Boire beaucoup de café",
              "Respiration profonde et visualisation positive",
              "Ignorer complètement le casting",
              "Critiquer les autres candidats"
            ],
            correct: 1,
            explanation: "La respiration profonde et la visualisation positive sont des techniques d'ancrage mental efficaces pour gérer le stress et maintenir un état d'esprit calme et concentré."
          },
          {
            question: "Comment devrait-on percevoir un rejet lors d'un casting ?",
            options: [
              "Comme un échec personnel définitif",
              "Comme une opportunité d'apprentissage et de croissance",
              "Comme une raison d'abandonner",
              "Comme une injustice à dénoncer publiquement"
            ],
            correct: 1,
            explanation: "Une mentalité de croissance consiste à voir chaque rejet comme une opportunité d'apprentissage plutôt que comme un échec personnel, permettant de persévérer et de s'améliorer."
          },
          {
            question: "Pourquoi la comparaison avec d'autres mannequins est-elle contre-productive ?",
            options: [
              "Parce que tous les mannequins sont identiques",
              "Parce que chacun a son propre parcours, forces et timing uniques",
              "Parce qu'il ne faut jamais regarder les autres",
              "Parce que la compétition n'existe pas"
            ],
            correct: 1,
            explanation: "Chaque mannequin a son propre parcours, ses forces uniques et son timing. Se concentrer sur son propre développement est bien plus productif que la comparaison constante."
          },
          {
            question: "Qu'est-ce que la résilience dans le contexte du mannequinat ?",
            options: [
              "Ignorer toutes les critiques",
              "La capacité à rebondir après les rejets et à distinguer critiques constructives et destructrices",
              "Ne jamais montrer d'émotions",
              "Accepter tous les commentaires sans réflexion"
            ],
            correct: 1,
            explanation: "La résilience est la capacité à rebondir après les rejets, à distinguer les critiques constructives des commentaires destructeurs, et à ne pas être déstabilisé par chaque feedback négatif."
          },
          {
            question: "Quelle affirmation personnelle est la plus constructive ?",
            options: [
              "Je suis meilleur que tous les autres",
              "Je m'améliore chaque jour et j'ai de la valeur",
              "Je ne serai jamais assez bon",
              "Les autres ont plus de chance que moi"
            ],
            correct: 1,
            explanation: "Une affirmation positive et réaliste comme 'Je m'améliore chaque jour et j'ai de la valeur' renforce la confiance sans tomber dans l'arrogance ou le négativisme."
          },
          {
            question: "Comment la visualisation positive aide-t-elle un mannequin ?",
            options: [
              "Elle remplace complètement la préparation",
              "Elle aide à se projeter dans le succès et à réduire l'anxiété",
              "Elle garantit toujours le succès",
              "Elle n'a aucun effet réel"
            ],
            correct: 1,
            explanation: "La visualisation positive aide à se projeter mentalement dans des situations de succès, ce qui réduit l'anxiété et prépare l'esprit à performer efficacement."
          },
          {
            question: "Un mannequin reçoit une critique constructive sur sa posture. Quelle est la meilleure réaction ?",
            options: [
              "Se vexer et ignorer le commentaire",
              "Remercier, analyser le feedback et travailler à s'améliorer",
              "Critiquer la personne en retour",
              "Abandonner le mannequinat"
            ],
            correct: 1,
            explanation: "La meilleure réaction est de remercier pour le feedback, l'analyser objectivement et l'utiliser comme base pour s'améliorer. C'est l'essence d'une mentalité de croissance."
          },
          {
            question: "Quelle technique de respiration est efficace pour calmer le stress ?",
            options: [
              "Respiration rapide et superficielle",
              "Respiration profonde et lente (inspiration 4 temps, expiration 6 temps)",
              "Retenir sa respiration le plus longtemps possible",
              "Respirer uniquement par la bouche"
            ],
            correct: 1,
            explanation: "La respiration profonde et lente, comme la technique 4-6 (inspiration 4 temps, expiration 6 temps), active le système nerveux parasympathique et réduit le stress."
          },
          {
            question: "Comment construire progressivement sa confiance en soi ?",
            options: [
              "Attendre qu'elle vienne naturellement sans effort",
              "Par la préparation, la pratique régulière et l'acceptation de soi",
              "En copiant exactement les autres mannequins",
              "En évitant toute situation difficile"
            ],
            correct: 1,
            explanation: "La confiance se construit progressivement à travers la préparation minutieuse, la pratique régulière qui développe les compétences, et l'acceptation de soi avec ses forces et faiblesses."
          },
          {
            question: "Un mannequin se sent intimidé par la concurrence. Que devrait-il faire ?",
            options: [
              "Abandonner immédiatement",
              "Se concentrer sur ses propres forces et son développement personnel",
              "Essayer de saboter les autres",
              "Prétendre que la concurrence n'existe pas"
            ],
            correct: 1,
            explanation: "Face à la concurrence, la meilleure stratégie est de se concentrer sur ses propres forces, son développement personnel et son parcours unique plutôt que de se laisser intimider."
          },
          {
            question: "Quelle est l'importance de célébrer ses petites victoires ?",
            options: [
              "C'est une perte de temps",
              "Cela renforce la motivation et la confiance progressive",
              "Cela rend arrogant",
              "Seules les grandes victoires comptent"
            ],
            correct: 1,
            explanation: "Célébrer ses petites victoires renforce la motivation, construit la confiance progressive et aide à maintenir une attitude positive tout au long du parcours professionnel."
          },
          {
            question: "Comment distinguer une critique constructive d'une critique destructrice ?",
            options: [
              "Toutes les critiques sont destructrices",
              "La critique constructive vise l'amélioration avec des suggestions concrètes, la destructrice attaque la personne",
              "Seules les critiques positives sont constructives",
              "Il n'y a pas de différence"
            ],
            correct: 1,
            explanation: "Une critique constructive vise l'amélioration avec des suggestions concrètes et respectueuses, tandis qu'une critique destructrice attaque la personne sans offrir de solutions."
          },
          {
            question: "Quel est le danger de la comparaison constante sur les réseaux sociaux ?",
            options: [
              "Il n'y a aucun danger",
              "Cela peut miner la confiance en montrant une version idéalisée de la réalité des autres",
              "Cela améliore toujours la performance",
              "Cela n'affecte pas la santé mentale"
            ],
            correct: 1,
            explanation: "La comparaison constante sur les réseaux sociaux peut miner la confiance car elle expose à une version souvent idéalisée et filtrée de la réalité des autres, créant des attentes irréalistes."
          },
          {
            question: "Comment gérer l'anxiété avant un défilé important ?",
            options: [
              "Ignorer complètement l'anxiété",
              "Utiliser des techniques de respiration, visualisation et préparation minutieuse",
              "Paniquer et envisager d'annuler",
              "Prendre des substances pour se calmer"
            ],
            correct: 1,
            explanation: "L'anxiété se gère efficacement par des techniques de respiration, la visualisation positive et une préparation minutieuse qui renforce la confiance en ses capacités."
          },
          {
            question: "Quelle attitude adopter face à un commentaire négatif sur son apparence ?",
            options: [
              "Le prendre personnellement et se dévaloriser",
              "Évaluer objectivement si c'est constructif, sinon le laisser glisser",
              "Répondre agressivement",
              "Changer complètement son apparence immédiatement"
            ],
            correct: 1,
            explanation: "Il faut évaluer objectivement si le commentaire est constructif et actionnable. Si c'est une simple critique destructrice, il faut développer la capacité à le laisser glisser sans affecter sa confiance."
          },
          {
            question: "Pourquoi l'acceptation de soi est-elle importante dans le mannequinat ?",
            options: [
              "Elle ne l'est pas, il faut toujours vouloir changer",
              "Elle permet de travailler sur ses forces tout en acceptant ses particularités uniques",
              "Elle signifie ne jamais s'améliorer",
              "Elle rend paresseux"
            ],
            correct: 1,
            explanation: "L'acceptation de soi permet de travailler sur ses forces et de s'améliorer tout en acceptant ses particularités uniques qui peuvent devenir des atouts distinctifs dans l'industrie."
          },
          {
            question: "Comment la préparation influence-t-elle la confiance ?",
            options: [
              "Elle n'a aucun lien avec la confiance",
              "Une bonne préparation renforce la confiance en réduisant l'incertitude",
              "Trop de préparation diminue la confiance",
              "Seul le talent naturel compte"
            ],
            correct: 1,
            explanation: "Une préparation minutieuse renforce considérablement la confiance car elle réduit l'incertitude, développe les compétences et donne un sentiment de contrôle sur la situation."
          },
          {
            question: "Quelle erreur de mentalité peut saboter une carrière de mannequin ?",
            options: [
              "Vouloir s'améliorer continuellement",
              "Penser que tout est figé et qu'on ne peut pas progresser (mentalité fixe)",
              "Accepter les feedbacks constructifs",
              "Célébrer ses progrès"
            ],
            correct: 1,
            explanation: "Une mentalité fixe qui pense que les capacités sont figées et qu'on ne peut pas progresser est destructrice. Une mentalité de croissance qui voit le potentiel d'amélioration est essentielle."
          },
          {
            question: "Comment maintenir une confiance stable dans une industrie compétitive ?",
            options: [
              "En se comparant constamment aux autres",
              "En se concentrant sur son propre parcours, ses progrès et ses valeurs",
              "En ignorant complètement la réalité du marché",
              "En cherchant constamment la validation externe"
            ],
            correct: 1,
            explanation: "Maintenir une confiance stable nécessite de se concentrer sur son propre parcours, de mesurer ses progrès personnels et de s'ancrer dans ses valeurs plutôt que de dépendre uniquement de la validation externe."
          }
        ]
      }
    ]
  },
  
  // ─── MODULE 2 ───────────────────────────────────────────────────────────────
  {
    num: 2,
    title: "Techniques de Défilé et Présence Scénique",
    subtitle: "Maîtrise du Podium et Expression Corporelle",
    objectifs: [
      "Maîtriser les différentes techniques de marche sur podium",
      "Développer une présence scénique captivante",
      "Gérer le stress et les imprévus lors des défilés",
      "Adapter sa démarche selon les styles de vêtements",
      "Comprendre les codes du défilé professionnel"
    ],
    chapters: [
      {
        title: "La Marche de Base : Posture et Équilibre",
        content: [
          "La marche de défilé est la compétence fondamentale du mannequinat. Elle se distingue de la marche quotidienne par sa fluidité, son élégance et sa capacité à mettre en valeur les vêtements. Une bonne marche commence par une posture impeccable : colonne vertébrale droite, épaules détendues vers l'arrière, tête haute avec le menton légèrement relevé.",
          "L'équilibre est crucial pour une marche assurée. Le poids du corps doit être réparti uniformément, avec un centre de gravité stable au niveau du bassin. Chaque pas doit être fluide, en plaçant le pied directement devant l'autre sur une ligne imaginaire, créant ce mouvement caractéristique qui fait onduler légèrement les hanches.",
          "La technique de base consiste à marcher en plaçant un pied devant l'autre, les jambes se croisant légèrement à chaque pas. Les bras restent détendus le long du corps avec un léger balancement naturel. Le regard doit être dirigé vers l'horizon, jamais vers le sol, projetant confiance et assurance.",
          "Au Gabon, où les défilés mélangent souvent influences africaines et internationales, la marche doit pouvoir s'adapter. Une base solide permet d'ajouter ensuite des variations selon le style : plus rythmée pour le wax, plus fluide pour la haute couture, plus dynamique pour le sportswear.",
          "La pratique quotidienne est essentielle. Commencer pieds nus pour sentir l'équilibre, puis progresser avec des talons de différentes hauteurs. S'entraîner sur différentes surfaces (tapis, parquet, extérieur) prépare aux conditions réelles des défilés."
        ],
        keyPoints: [
          "Posture : colonne droite, épaules détendues, tête haute",
          "Équilibre : poids réparti, centre de gravité stable",
          "Technique : pieds sur une ligne, croisement léger",
          "Regard : vers l'horizon, projette la confiance",
          "Pratique : quotidienne, pieds nus puis talons, surfaces variées"
        ],
        quiz: [
          {
            question: "Quelle est la caractéristique principale de la posture en défilé ?",
            options: [
              "Épaules tendues vers l'avant",
              "Colonne droite, épaules détendues vers l'arrière, tête haute",
              "Dos courbé pour paraître plus petit",
              "Tête baissée pour voir ses pieds"
            ],
            correct: 1,
            explanation: "Une posture impeccable en défilé nécessite une colonne vertébrale droite, des épaules détendues vers l'arrière et une tête haute avec le menton légèrement relevé."
          },
          {
            question: "Comment doit-on placer ses pieds lors de la marche de défilé ?",
            options: [
              "Pieds écartés comme en marchant normalement",
              "Un pied devant l'autre sur une ligne imaginaire",
              "Pieds parallèles sans se croiser",
              "En sautillant"
            ],
            correct: 1,
            explanation: "La technique de base consiste à placer un pied devant l'autre sur une ligne imaginaire, avec un léger croisement à chaque pas, créant le mouvement caractéristique du défilé."
          },
          {
            question: "Où doit-on diriger son regard pendant un défilé ?",
            options: [
              "Vers ses pieds pour ne pas trébucher",
              "Vers l'horizon, jamais vers le sol",
              "Vers le public uniquement",
              "Les yeux fermés"
            ],
            correct: 1,
            explanation: "Le regard doit être dirigé vers l'horizon, jamais vers le sol. Cela projette confiance et assurance tout en maintenant une posture élégante."
          },
          {
            question: "Quelle est l'importance du centre de gravité dans la marche de défilé ?",
            options: [
              "Il n'a aucune importance",
              "Un centre de gravité stable au niveau du bassin assure l'équilibre",
              "Il doit être très haut",
              "Il doit changer constamment"
            ],
            correct: 1,
            explanation: "Un centre de gravité stable au niveau du bassin est crucial pour maintenir l'équilibre, surtout en talons hauts, et permet une marche fluide et assurée."
          },
          {
            question: "Comment les bras doivent-ils être positionnés pendant la marche ?",
            options: [
              "Croisés devant le corps",
              "Détendus le long du corps avec un léger balancement naturel",
              "Levés au-dessus de la tête",
              "Complètement immobiles"
            ],
            correct: 1,
            explanation: "Les bras doivent rester détendus le long du corps avec un léger balancement naturel qui accompagne le mouvement de la marche sans être exagéré."
          },
          {
            question: "Pourquoi commencer l'entraînement pieds nus ?",
            options: [
              "C'est plus confortable",
              "Pour sentir l'équilibre naturel avant de progresser avec des talons",
              "Parce que les talons sont interdits",
              "Pour économiser les chaussures"
            ],
            correct: 1,
            explanation: "Commencer pieds nus permet de sentir l'équilibre naturel du corps et de développer une base solide avant de progresser avec des talons de hauteur croissante."
          },
          {
            question: "Quelle erreur courante doit-on éviter en marchant ?",
            options: [
              "Regarder l'horizon",
              "Marcher avec les genoux raides",
              "Garder les épaules détendues",
              "Maintenir une posture droite"
            ],
            correct: 1,
            explanation: "Marcher avec les genoux raides est une erreur courante qui rend la démarche rigide et inélégante. Les genoux doivent rester légèrement souples pour une marche fluide."
          },
          {
            question: "Comment adapter sa marche pour la mode africaine ?",
            options: [
              "Garder exactement la même marche",
              "Une marche plus rythmée et expressive",
              "Marcher très lentement",
              "Ne pas marcher du tout"
            ],
            correct: 1,
            explanation: "Pour la mode africaine, la marche peut être plus rythmée et expressive, reflétant l'énergie et la richesse culturelle, tout en maintenant l'élégance de base."
          },
          {
            question: "Quel est l'effet du croisement léger des jambes ?",
            options: [
              "Cela fait trébucher",
              "Cela crée le mouvement caractéristique qui fait onduler les hanches",
              "Cela ralentit la marche",
              "Cela n'a aucun effet"
            ],
            correct: 1,
            explanation: "Le croisement léger des jambes à chaque pas crée le mouvement caractéristique du défilé qui fait onduler légèrement les hanches de manière élégante."
          },
          {
            question: "Pourquoi s'entraîner sur différentes surfaces ?",
            options: [
              "Pour s'amuser",
              "Pour développer l'adaptabilité aux conditions réelles des défilés",
              "Ce n'est pas nécessaire",
              "Pour user ses chaussures"
            ],
            correct: 1,
            explanation: "S'entraîner sur différentes surfaces (tapis, parquet, extérieur) développe l'adaptabilité cruciale pour gérer les conditions variées des défilés professionnels."
          },
          {
            question: "Un mannequin débutant a du mal à maintenir l'équilibre en talons. Que devrait-il faire ?",
            options: [
              "Abandonner les talons",
              "Pratiquer progressivement en commençant pieds nus puis avec des talons bas",
              "Porter uniquement des talons très hauts",
              "Marcher plus vite"
            ],
            correct: 1,
            explanation: "La progression doit être graduelle : commencer pieds nus pour maîtriser l'équilibre de base, puis progresser avec des talons de hauteur croissante."
          },
          {
            question: "Que signifie 'engagement du core' dans la marche de défilé ?",
            options: [
              "Contracter violemment les abdominaux",
              "Activer les muscles du centre du corps pour maintenir la stabilité",
              "Respirer profondément",
              "Bomber le ventre"
            ],
            correct: 1,
            explanation: "L'engagement du core signifie activer les muscles du centre du corps (abdominaux, lombaires) pour maintenir la stabilité et l'équilibre pendant la marche."
          },
          {
            question: "Un mannequin regarde constamment ses pieds pendant le défilé. Quel est le problème ?",
            options: [
              "C'est la bonne technique",
              "Cela brise la posture, projette un manque de confiance et est inélégant",
              "C'est recommandé pour les débutants",
              "Cela n'a aucun impact"
            ],
            correct: 1,
            explanation: "Regarder ses pieds brise la posture élégante, projette un manque de confiance et détourne l'attention des vêtements. Le regard doit rester vers l'horizon."
          },
          {
            question: "Comment corriger des épaules crispées pendant la marche ?",
            options: [
              "Les ignorer",
              "Conscience corporelle, exercices de relaxation et répétition",
              "Marcher plus vite",
              "Porter des vêtements plus lourds"
            ],
            correct: 1,
            explanation: "La correction des épaules crispées passe par la conscience corporelle, des exercices de relaxation des épaules et la répétition jusqu'à ce que la détente devienne naturelle."
          },
          {
            question: "Quelle est la différence entre marche quotidienne et marche de défilé ?",
            options: [
              "Il n'y a aucune différence",
              "La marche de défilé est plus fluide, élégante et met en valeur les vêtements",
              "La marche de défilé est plus rapide",
              "La marche quotidienne est meilleure"
            ],
            correct: 1,
            explanation: "La marche de défilé se distingue par sa fluidité, son élégance et sa capacité à mettre en valeur les vêtements, contrairement à la marche quotidienne fonctionnelle."
          },
          {
            question: "Un défilé se déroule sur un podium glissant. Comment s'adapter ?",
            options: [
              "Refuser de défiler",
              "Ajuster sa marche : pas plus courts, équilibre renforcé, prudence accrue",
              "Marcher normalement sans changement",
              "Courir pour finir vite"
            ],
            correct: 1,
            explanation: "Sur une surface glissante, il faut ajuster sa marche avec des pas plus courts, un équilibre renforcé et une prudence accrue, tout en maintenant l'élégance."
          },
          {
            question: "Pourquoi la pratique quotidienne est-elle essentielle ?",
            options: [
              "Elle n'est pas nécessaire",
              "Elle développe la mémoire musculaire et rend la marche naturelle et fluide",
              "Pour impressionner les autres",
              "Uniquement pour perdre du poids"
            ],
            correct: 1,
            explanation: "La pratique quotidienne développe la mémoire musculaire, rendant la marche naturelle, fluide et automatique, permettant de se concentrer sur l'expression et les vêtements."
          },
          {
            question: "Comment le balancement des hanches doit-il être contrôlé ?",
            options: [
              "Exagéré au maximum",
              "Léger et naturel, résultant du croisement des jambes",
              "Complètement supprimé",
              "Saccadé et rapide"
            ],
            correct: 1,
            explanation: "Le balancement des hanches doit être léger et naturel, résultant organiquement du croisement des jambes, sans être exagéré ni supprimé."
          },
          {
            question: "Quelle est l'erreur d'un mannequin qui balance excessivement les hanches ?",
            options: [
              "C'est parfait",
              "Cela paraît forcé, inélégant et détourne l'attention des vêtements",
              "C'est toujours recommandé",
              "Cela améliore la marche"
            ],
            correct: 1,
            explanation: "Un balancement excessif des hanches paraît forcé et inélégant, détournant l'attention des vêtements vers le mannequin. Le mouvement doit rester subtil et naturel."
          },
          {
            question: "Quelle est la meilleure approche pour maîtriser la marche de défilé ?",
            options: [
              "Pratiquer une fois par mois",
              "Pratique quotidienne progressive avec feedback et ajustements constants",
              "Regarder uniquement des vidéos",
              "Attendre le jour du défilé"
            ],
            correct: 1,
            explanation: "La maîtrise nécessite une pratique quotidienne progressive, avec feedback (miroir, vidéo, coach) et ajustements constants pour perfectionner chaque aspect de la marche."
          }
        ]
      }
    ]
  },
  
  // ─── MODULE 3 ───────────────────────────────────────────────────────────────
  {
    num: 3,
    title: "Techniques de Pose et Photographie",
    subtitle: "Maîtrise des Poses et Collaboration avec les Photographes",
    objectifs: [
      "Maîtriser les poses de base et avancées",
      "Comprendre les angles et la lumière",
      "Travailler efficacement avec les photographes",
      "Développer son propre style photographique",
      "Créer un book professionnel de qualité"
    ],
    chapters: [
      {
        title: "Poses de Base : Debout, Assis, Allongé",
        content: [
          "Les poses de base constituent le fondement du travail photographique d'un mannequin. Les poses debout incluent la pose en T (poids sur une jambe, l'autre détendue), la pose de profil (corps de trois-quarts, visage vers la caméra), et la pose dynamique (mouvement suggéré, cheveux ou vêtements en mouvement).",
          "Les poses assises requièrent une attention particulière à la posture pour éviter l'affaissement. Le dos doit rester droit, les jambes peuvent être croisées élégamment ou allongées selon l'effet désiré. La position des mains est cruciale : elles doivent paraître naturelles, jamais crispées.",
          "Les poses allongées offrent de nombreuses possibilités créatives. Sur le dos, sur le côté, sur le ventre, chaque position crée une ambiance différente. L'important est de maintenir des lignes élégantes avec le corps et d'éviter les angles disgracieux.",
          "La transition entre les poses doit être fluide et naturelle. Un bon mannequin ne 'saute' pas d'une pose à l'autre mais crée un mouvement continu, permettant au photographe de capturer des moments intermédiaires souvent plus intéressants que les poses figées.",
          "Au Gabon, les shootings mélangent souvent influences africaines et internationales. Savoir adapter ses poses selon le contexte culturel (poses plus expressives pour la mode africaine, plus sobres pour le commercial) est un atout majeur."
        ],
        keyPoints: [
          "Poses debout : T, profil, dynamique",
          "Poses assises : dos droit, jambes élégantes, mains naturelles",
          "Poses allongées : lignes élégantes, éviter angles disgracieux",
          "Transitions fluides entre les poses",
          "Adapter selon le contexte culturel"
        ],
        quiz: [
          {
            question: "Qu'est-ce que la pose en T ?",
            options: [
              "Se tenir en forme de T avec les bras",
              "Poids sur une jambe, l'autre jambe détendue",
              "Croiser les jambes en T",
              "Tenir un objet en forme de T"
            ],
            correct: 1,
            explanation: "La pose en T est une pose debout de base où le poids du corps repose sur une jambe tandis que l'autre est détendue, créant une ligne élégante."
          }
        ]
      }
    ]
  },
  
  // ─── MODULE 4 ───────────────────────────────────────────────────────────────
  {
    num: 4,
    title: "Business et Marketing Personnel",
    subtitle: "Construire sa Marque et Gérer sa Carrière",
    objectifs: [
      "Construire et gérer sa marque personnelle",
      "Maîtriser les réseaux sociaux professionnels",
      "Négocier ses contrats et cachets",
      "Gérer ses finances et sa comptabilité",
      "Développer son réseau professionnel"
    ],
    chapters: [
      {
        title: "Personal Branding : Construire sa Marque",
        content: [
          "Le personal branding est l'art de se positionner comme une marque unique dans l'industrie du mannequinat. Cela commence par l'identification de ses atouts distinctifs : style particulier, spécialité (haute couture, commercial, fitness), personnalité, valeurs. Un mannequin n'est pas qu'un visage, c'est une identité complète.",
          "La cohérence est la clé d'un personal branding réussi. Tous les points de contact (book photo, réseaux sociaux, comportement professionnel, style vestimentaire) doivent refléter la même image. Cette cohérence crée la reconnaissance et la mémorabilité auprès des clients et créateurs.",
          "Au Gabon, où le marché est en développement, un personal branding fort peut faire la différence. Se positionner comme 'le mannequin spécialiste de la mode africaine contemporaine' ou 'l'ambassadeur du wax moderne' crée une niche et attire des opportunités spécifiques.",
          "Le storytelling est essentiel : raconter son parcours, ses inspirations, ses valeurs crée une connexion émotionnelle avec l'audience. Les gens ne se souviennent pas seulement d'un beau visage, mais d'une histoire authentique et inspirante.",
          "L'évolution de sa marque personnelle doit être stratégique. À mesure que la carrière progresse, le positionnement peut évoluer (de mannequin débutant à mannequin expérimenté, puis à mentor ou entrepreneur), mais toujours de manière cohérente et authentique."
        ],
        keyPoints: [
          "Identifier ses atouts distinctifs et sa spécialité",
          "Maintenir la cohérence sur tous les points de contact",
          "Se créer une niche sur le marché gabonais",
          "Utiliser le storytelling pour créer une connexion",
          "Faire évoluer sa marque de manière stratégique"
        ],
        quiz: [
          {
            question: "Qu'est-ce que le personal branding pour un mannequin ?",
            options: [
              "Avoir beaucoup d'abonnés sur Instagram",
              "Se positionner comme une marque unique avec une identité complète",
              "Copier les autres mannequins célèbres",
              "Changer constamment de style"
            ],
            correct: 1,
            explanation: "Le personal branding est l'art de se positionner comme une marque unique avec une identité complète, incluant style, spécialité, personnalité et valeurs."
          }
        ]
      }
    ]
  },
  
  // ─── MODULE 5 ───────────────────────────────────────────────────────────────
  {
    num: 5,
    title: "Excellence Professionnelle et Spécialisations",
    subtitle: "Devenir un Expert et Leader de l'Industrie",
    objectifs: [
      "Se spécialiser dans des niches spécifiques",
      "Maîtriser les techniques avancées",
      "Développer une expertise reconnue",
      "Préparer sa reconversion",
      "Devenir un leader dans l'industrie"
    ],
    chapters: [
      {
        title: "Mannequinat de Luxe et Haute Couture",
        content: [
          "Le mannequinat de luxe et haute couture représente le sommet de la profession, avec des exigences techniques et artistiques très élevées. Les créateurs de haute couture recherchent des mannequins capables d'incarner leur vision artistique, de porter des pièces uniques avec grâce, et de transmettre l'émotion et le prestige de la marque.",
          "Les standards physiques sont stricts : taille minimale de 1,75m pour les femmes, silhouette longiligne, proportions harmonieuses. Mais au-delà du physique, c'est la présence, l'élégance naturelle et la capacité à se mouvoir avec grâce qui font la différence. Un mannequin haute couture doit être une œuvre d'art vivante.",
          "La préparation pour un défilé haute couture est intensive. Les essayages peuvent durer des heures, les répétitions sont nombreuses, et la précision est absolue. Chaque geste, chaque regard, chaque pas est chorégraphié. Le mannequin devient l'instrument par lequel le créateur exprime sa vision.",
          "Au Gabon, bien que le marché de la haute couture soit émergent, des créateurs locaux développent des collections haut de gamme mêlant savoir-faire traditionnel et esthétique contemporaine. Se positionner sur ce segment nécessite un investissement dans la formation, le perfectionnement technique et la construction d'un book irréprochable.",
          "Les opportunités internationales existent pour les mannequins gabonais excellents. Paris, Milan, New York recherchent la diversité. Avec la préparation adéquate, un mannequin gabonais peut accéder aux podiums internationaux, devenant ambassadeur de l'élégance africaine sur la scène mondiale."
        ],
        keyPoints: [
          "Standards élevés : taille, proportions, présence, élégance",
          "Préparation intensive : essayages longs, répétitions précises",
          "Incarner la vision artistique du créateur",
          "Marché gabonais émergent avec créateurs haut de gamme",
          "Opportunités internationales pour mannequins excellents"
        ],
        quiz: [
          {
            question: "Qu'est-ce qui distingue le mannequinat haute couture ?",
            options: [
              "C'est plus facile que le mannequinat commercial",
              "Exigences techniques et artistiques très élevées, incarner la vision du créateur",
              "Il suffit d'être grand",
              "Aucune préparation n'est nécessaire"
            ],
            correct: 1,
            explanation: "Le mannequinat haute couture se distingue par des exigences techniques et artistiques très élevées, nécessitant d'incarner la vision artistique du créateur avec grâce et présence."
          }
        ]
      }
    ]
  }
];
