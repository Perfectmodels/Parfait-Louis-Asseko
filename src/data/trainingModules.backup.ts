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
          }
        ]
      }
    ]
  }
];
