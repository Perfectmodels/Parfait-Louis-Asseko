// ═══════════════════════════════════════════════════════════════════════════
// EXEMPLE D'AJOUT DE CONTENU AUX MODULES DE FORMATION
// ═══════════════════════════════════════════════════════════════════════════

import { TrainingModule } from '../types/training';

/**
 * Ce fichier montre comment ajouter du contenu complet aux modules de formation.
 * Copiez ce template et ajoutez-le dans trainingModules.ts
 */

export const MODULE_EXAMPLE: TrainingModule = {
  num: 2,
  title: "Techniques de Défilé et Présence Scénique",
  subtitle: "Maîtrise du Podium, Poses et Performance Professionnelle",
  objectifs: [
    "Maîtriser la marche professionnelle sur podium",
    "Développer une présence scénique captivante",
    "Gérer le stress et la performance sous pression",
    "Comprendre l'organisation backstage",
    "Adapter sa performance aux différents types de défilés"
  ],
  chapters: [
    {
      title: "La Marche sur Podium : Technique et Style",
      content: [
        "La marche sur podium est l'une des compétences les plus emblématiques et techniques du mannequinat. Elle ne consiste pas simplement à marcher en ligne droite, mais à incarner une attitude, à valoriser un vêtement et à captiver un public en quelques secondes.",
        
        "La posture de base commence par l'alignement du corps : tête haute, regard projeté vers l'horizon (jamais vers le sol), épaules légèrement en arrière mais détendues, colonne vertébrale droite, bassin légèrement basculé vers l'avant pour créer une cambrure naturelle, et poids du corps réparti sur la plante des pieds.",
        
        "La technique du 'cross-walk' ou marche croisée est la signature du défilé professionnel. Chaque pied se pose légèrement devant l'autre sur une ligne imaginaire, créant un léger balancement des hanches naturel et élégant. Les pas doivent être réguliers, ni trop courts (qui donnent une impression de timidité) ni trop longs (qui paraissent forcés).",
        
        "Le rythme de la marche s'adapte à la musique et au type de défilé. Un défilé haute couture demande généralement une marche lente et majestueuse (environ 60-70 pas par minute), tandis qu'un défilé streetwear ou sportswear peut autoriser un rythme plus dynamique et énergique (80-90 pas par minute).",
        
        "Les bras doivent bouger naturellement en opposition avec les jambes, mais de façon subtile et contrôlée. Un mouvement exagéré des bras distrait du vêtement ; un mouvement trop rigide donne une impression de tension. L'objectif est de trouver le juste équilibre qui donne une allure fluide et naturelle."
      ],
      keyPoints: [
        "Posture : tête haute, épaules détendues, colonne droite",
        "Cross-walk : pieds qui se croisent légèrement sur une ligne",
        "Rythme adapté au type de défilé (60-90 pas/minute)",
        "Bras en mouvement naturel et subtil",
        "Regard projeté vers l'horizon, jamais vers le sol"
      ],
      quiz: [
        {
          question: "Qu'est-ce que la technique du 'cross-walk' en défilé de mode ?",
          options: [
            "Marcher en croisant les bras",
            "Poser chaque pied légèrement devant l'autre sur une ligne imaginaire",
            "Marcher en diagonale sur le podium",
            "Croiser les jambes à chaque pas"
          ],
          correct: 1,
          explanation: "Le cross-walk consiste à poser chaque pied légèrement devant l'autre sur une ligne imaginaire, créant un léger balancement naturel des hanches caractéristique du défilé professionnel."
        },
        {
          question: "Quel est le rythme de marche typique pour un défilé haute couture ?",
          options: [
            "100-120 pas par minute (très rapide)",
            "60-70 pas par minute (lent et majestueux)",
            "40-50 pas par minute (très lent)",
            "Le rythme n'a pas d'importance"
          ],
          correct: 1,
          explanation: "Un défilé haute couture demande généralement une marche lente et majestueuse d'environ 60-70 pas par minute, permettant au public d'apprécier les détails des créations."
        },
        {
          question: "Où doit être dirigé le regard d'un mannequin lors d'un défilé ?",
          options: [
            "Vers le sol pour éviter de trébucher",
            "Vers le public en souriant constamment",
            "Vers l'horizon, jamais vers le sol",
            "Vers les autres mannequins"
          ],
          correct: 2,
          explanation: "Le regard doit être projeté vers l'horizon, créant une impression de confiance et de détermination. Regarder le sol donne une impression d'insécurité incompatible avec le podium."
        },
        {
          question: "Comment les bras doivent-ils bouger pendant la marche sur podium ?",
          options: [
            "Complètement immobiles le long du corps",
            "En mouvement naturel et subtil, en opposition avec les jambes",
            "Très agités pour paraître dynamique",
            "Croisés sur la poitrine"
          ],
          correct: 1,
          explanation: "Les bras doivent bouger naturellement et subtilement en opposition avec les jambes, reproduisant le balancement naturel de la marche sans exagération qui distrairait du vêtement."
        },
        {
          question: "Pourquoi la posture est-elle fondamentale en défilé de mode ?",
          options: [
            "Pour paraître plus grand uniquement",
            "Elle valorise le vêtement, projette confiance et crée une silhouette élégante",
            "C'est une simple tradition sans importance réelle",
            "Pour impressionner les autres mannequins"
          ],
          correct: 1,
          explanation: "Une posture correcte (tête haute, épaules détendues, colonne droite) valorise le vêtement porté, projette confiance et assurance, et crée une silhouette élégante qui est l'essence même du défilé professionnel."
        }
      ]
    },
    {
      title: "Marche en Talons Hauts : Maîtrise et Équilibre",
      content: [
        "La marche en talons hauts est une compétence technique qui demande entraînement, équilibre et confiance. Pour de nombreux mannequins débutants, c'est l'un des défis les plus intimidants, mais avec la bonne méthode, elle devient une seconde nature.",
        
        "La préparation physique est essentielle. Les muscles des mollets, des chevilles et du tronc doivent être renforcés pour supporter l'équilibre en talons. Des exercices quotidiens de gainage, d'équilibre sur un pied et de montées sur demi-pointes préparent le corps à cette exigence.",
        
        "La progression graduelle est la clé de l'apprentissage. Commencer par des talons de 2-3 cm, puis progresser vers 5 cm, 8 cm et enfin 10 cm et plus. Chaque étape doit être maîtrisée avant de passer à la suivante. Précipiter cette progression augmente considérablement le risque de chute et de blessure.",
        
        "La technique de marche en talons diffère légèrement de la marche pieds nus. Le poids du corps doit être légèrement plus en avant, le talon se pose en premier suivi immédiatement de la plante du pied (pas de roulement complet du pied comme en marche normale), et les pas sont légèrement plus courts pour maintenir l'équilibre.",
        
        "L'entraînement quotidien est indispensable. Porter des talons chez soi pendant 15-30 minutes par jour, marcher sur différentes surfaces (tapis, parquet, carrelage), pratiquer les pivots et demi-tours, et simuler des conditions de défilé (musique, stress, changements rapides) forge progressivement la confiance et l'aisance."
      ],
      keyPoints: [
        "Renforcement musculaire : mollets, chevilles, tronc",
        "Progression graduelle : 2cm → 5cm → 8cm → 10cm+",
        "Technique : poids en avant, talon puis plante, pas courts",
        "Entraînement quotidien : 15-30 min chez soi",
        "Pratique sur différentes surfaces et conditions"
      ],
      quiz: [
        {
          question: "Quelle est la meilleure approche pour apprendre à marcher en talons hauts ?",
          options: [
            "Commencer directement avec les talons les plus hauts",
            "Progression graduelle de 2cm à 10cm+ avec maîtrise de chaque étape",
            "Regarder des vidéos uniquement",
            "Éviter les talons jusqu'au dernier moment"
          ],
          correct: 1,
          explanation: "La progression graduelle (2cm, 5cm, 8cm puis 10cm+) permet aux muscles et articulations de s'adapter sans risque de blessure, chaque étape devant être maîtrisée avant de passer à la suivante."
        },
        {
          question: "Quels muscles doivent être renforcés pour la marche en talons ?",
          options: [
            "Uniquement les muscles des jambes",
            "Mollets, chevilles et tronc (gainage)",
            "Bras et épaules",
            "Aucun renforcement n'est nécessaire"
          ],
          correct: 1,
          explanation: "Les mollets et chevilles supportent directement le poids en talons, tandis que le tronc (gainage) maintient l'équilibre global. Ces trois zones doivent être renforcées pour une marche stable et assurée."
        },
        {
          question: "Comment le poids du corps doit-il être réparti en marchant en talons ?",
          options: [
            "Complètement sur les talons",
            "Légèrement plus en avant qu'en marche normale",
            "Uniquement sur la pointe des pieds",
            "La répartition n'a pas d'importance"
          ],
          correct: 1,
          explanation: "Le poids du corps doit être légèrement plus en avant qu'en marche normale pour compenser la hauteur du talon et maintenir l'équilibre, tout en posant le talon en premier suivi de la plante."
        },
        {
          question: "Combien de temps d'entraînement quotidien est recommandé pour maîtriser les talons ?",
          options: [
            "5 minutes suffisent",
            "15-30 minutes par jour",
            "2 heures minimum",
            "L'entraînement quotidien n'est pas nécessaire"
          ],
          correct: 1,
          explanation: "Un entraînement quotidien de 15-30 minutes permet de développer progressivement la force musculaire et la confiance nécessaires sans surcharger les pieds et les articulations."
        },
        {
          question: "Pourquoi pratiquer sur différentes surfaces est-il important ?",
          options: [
            "Pour varier l'entraînement et éviter l'ennui",
            "Pour préparer le mannequin aux conditions réelles de défilé (tapis, parquet, podium)",
            "Ce n'est pas important",
            "Uniquement pour les défilés en extérieur"
          ],
          correct: 1,
          explanation: "Les défilés se déroulent sur diverses surfaces (tapis, parquet, podium en bois). S'entraîner sur différentes surfaces prépare le mannequin à s'adapter rapidement aux conditions réelles sans perte d'équilibre."
        }
      ]
    }
  ]
};

/**
 * INSTRUCTIONS POUR AJOUTER CE CONTENU :
 * 
 * 1. Ouvrez src/data/trainingModules.ts
 * 2. Ajoutez ce module dans le tableau TRAINING_MODULES
 * 3. Assurez-vous que le numéro (num) est unique et séquentiel
 * 4. Répétez pour les modules 3 et 4 avec le contenu fourni initialement
 */
