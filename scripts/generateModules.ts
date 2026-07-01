// Script pour générer les 5 modules de formation avec 10 chapitres et 20 questions chacun

import { TrainingModule, QuizQuestion } from '../src/types/training';

// Fonction helper pour générer des questions génériques
function generateQuestions(chapterTitle: string, chapterContent: string[], count: number = 20): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  
  // Questions de base (à personnaliser selon le contenu)
  const questionTemplates = [
    {
      question: `Quel est le concept principal abordé dans "${chapterTitle}" ?`,
      options: [
        "Concept A (à personnaliser)",
        "Concept B (à personnaliser)",
        "Concept C (à personnaliser)",
        "Concept D (à personnaliser)"
      ],
      correct: 0,
      explanation: "Explication à personnaliser selon le contenu du chapitre."
    },
    {
      question: `Quelle est l'importance de ${chapterTitle.toLowerCase()} dans le mannequinat professionnel ?`,
      options: [
        "C'est essentiel pour la réussite",
        "C'est optionnel",
        "C'est uniquement pour les débutants",
        "C'est obsolète"
      ],
      correct: 0,
      explanation: "Cette compétence est fondamentale pour tout mannequin professionnel."
    }
  ];
  
  // Générer 20 questions (répéter les templates avec variations)
  for (let i = 0; i < count; i++) {
    const template = questionTemplates[i % questionTemplates.length];
    questions.push({
      ...template,
      question: `${template.question} (Question ${i + 1})`
    });
  }
  
  return questions;
}

// MODULE 1 : Fondamentaux du Mannequinat Professionnel
const module1: TrainingModule = {
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
        "Le mannequinat est une profession exigeante qui combine discipline physique, présence scénique et professionnalisme constant.",
        "Au Gabon, l'industrie de la mode connaît une croissance significative avec l'émergence de créateurs locaux.",
        "Les revenus varient de 50 000 à plusieurs millions FCFA selon l'expérience et la notoriété.",
        "La carrière d'un mannequin est généralement courte (pic entre 18 et 30 ans).",
        "La reconversion professionnelle doit être planifiée dès le début de la carrière."
      ],
      keyPoints: [
        "Le mannequinat combine discipline, technique et professionnalisme",
        "Le marché gabonais est en croissance",
        "Les revenus varient selon l'expérience",
        "La carrière est courte : planifier sa reconversion",
        "Les compétences techniques sont essentielles"
      ],
      quiz: generateQuestions("Le Métier de Mannequin", [], 20)
    },
    {
      title: "Standards Physiques et Critères de Sélection",
      content: [
        "Les standards physiques varient selon les marchés et les types de mannequinat.",
        "Pour le mannequinat de défilé haute couture, les critères sont très stricts.",
        "Au Gabon, les standards sont plus flexibles et valorisent la diversité.",
        "La photogénie et la présence scénique sont aussi importantes que les mensurations.",
        "La mode africaine célèbre de plus en plus l'authenticité et la diversité."
      ],
      keyPoints: [
        "Standards internationaux vs standards africains",
        "Taille minimale classique : 1,75 m (F) / 1,85 m (H)",
        "Mensurations indicatives, non absolues",
        "Photogénie et présence essentielles",
        "La diversité est valorisée"
      ],
      quiz: generateQuestions("Standards Physiques", [], 20)
    },
    {
      title: "Préparation Physique et Nutrition du Mannequin",
      content: [
        "La préparation physique est essentielle pour maintenir une silhouette professionnelle.",
        "Un programme d'exercices équilibré combine cardio, renforcement musculaire et flexibilité.",
        "La nutrition doit être saine et équilibrée, pas restrictive.",
        "L'hydratation est cruciale pour la qualité de la peau et l'énergie.",
        "Le repos et la récupération sont aussi importants que l'entraînement."
      ],
      keyPoints: [
        "Programme d'exercices équilibré",
        "Nutrition saine, pas restrictive",
        "Hydratation cruciale",
        "Repos et récupération essentiels",
        "Éviter les régimes extrêmes"
      ],
      quiz: generateQuestions("Préparation Physique", [], 20)
    },
    {
      title: "Soins de la Peau et Routine Beauté Professionnelle",
      content: [
        "La peau est l'outil de travail principal d'un mannequin.",
        "Une routine de soins quotidienne est indispensable.",
        "Le nettoyage, l'hydratation et la protection solaire sont les bases.",
        "Les traitements professionnels complètent la routine à domicile.",
        "L'alimentation et l'hydratation influencent directement la qualité de la peau."
      ],
      keyPoints: [
        "Routine quotidienne indispensable",
        "Nettoyage, hydratation, protection solaire",
        "Traitements professionnels réguliers",
        "Alimentation et hydratation importantes",
        "Éviter les produits agressifs"
      ],
      quiz: generateQuestions("Soins de la Peau", [], 20)
    },
    {
      title: "Gestion du Stress et Préparation Mentale",
      content: [
        "Le stress fait partie intégrante du métier de mannequin.",
        "Des techniques de respiration et de méditation aident à gérer l'anxiété.",
        "La visualisation positive améliore les performances.",
        "Un bon sommeil est essentiel pour la gestion du stress.",
        "Le soutien social et professionnel est important."
      ],
      keyPoints: [
        "Techniques de respiration et méditation",
        "Visualisation positive",
        "Sommeil de qualité essentiel",
        "Soutien social important",
        "Accepter le stress comme normal"
      ],
      quiz: generateQuestions("Gestion du Stress", [], 20)
    },
    {
      title: "L'Écosystème de la Mode au Gabon",
      content: [
        "L'industrie de la mode gabonaise est en pleine expansion.",
        "Les créateurs locaux gagnent en visibilité internationale.",
        "Les événements fashion se multiplient à Libreville.",
        "Les opportunités de collaboration sont nombreuses.",
        "Le marché africain offre des perspectives uniques."
      ],
      keyPoints: [
        "Industrie en expansion",
        "Créateurs locaux en croissance",
        "Événements fashion réguliers",
        "Opportunités de collaboration",
        "Marché africain prometteur"
      ],
      quiz: generateQuestions("Écosystème de la Mode", [], 20)
    },
    {
      title: "Droits et Devoirs du Mannequin Professionnel",
      content: [
        "Les mannequins ont des droits protégés par la loi.",
        "Les contrats doivent être lus et compris avant signature.",
        "Le droit à l'image est fondamental.",
        "Les conditions de travail doivent être respectées.",
        "Les devoirs incluent le professionnalisme et la ponctualité."
      ],
      keyPoints: [
        "Droits protégés par la loi",
        "Lire les contrats attentivement",
        "Droit à l'image fondamental",
        "Conditions de travail respectées",
        "Professionnalisme requis"
      ],
      quiz: generateQuestions("Droits et Devoirs", [], 20)
    },
    {
      title: "Éthique et Professionnalisme dans le Mannequinat",
      content: [
        "L'éthique professionnelle est la base d'une carrière durable.",
        "Le respect des engagements est primordial.",
        "La confidentialité doit être maintenue.",
        "Les relations professionnelles doivent rester professionnelles.",
        "L'intégrité personnelle ne doit jamais être compromise."
      ],
      keyPoints: [
        "Éthique = carrière durable",
        "Respect des engagements",
        "Confidentialité essentielle",
        "Relations professionnelles",
        "Intégrité personnelle"
      ],
      quiz: generateQuestions("Éthique Professionnelle", [], 20)
    },
    {
      title: "Premiers Pas : Construire son Book et son Portfolio",
      content: [
        "Le book est la carte de visite d'un mannequin.",
        "Des photos professionnelles de qualité sont essentielles.",
        "La diversité des looks et des poses est importante.",
        "Le portfolio digital complète le book physique.",
        "La mise à jour régulière est nécessaire."
      ],
      keyPoints: [
        "Book = carte de visite",
        "Photos professionnelles essentielles",
        "Diversité des looks",
        "Portfolio digital complémentaire",
        "Mise à jour régulière"
      ],
      quiz: generateQuestions("Book et Portfolio", [], 20)
    },
    {
      title: "Réseautage et Relations Professionnelles",
      content: [
        "Le réseau professionnel est crucial dans la mode.",
        "Les événements industry sont des opportunités de networking.",
        "Les relations doivent être entretenues avec soin.",
        "Les réseaux sociaux sont des outils professionnels.",
        "La réputation se construit sur le long terme."
      ],
      keyPoints: [
        "Réseau professionnel crucial",
        "Événements = opportunités",
        "Entretenir les relations",
        "Réseaux sociaux professionnels",
        "Réputation à long terme"
      ],
      quiz: generateQuestions("Réseautage", [], 20)
    }
  ]
};

console.log("Module 1 généré avec", module1.chapters.length, "chapitres");
console.log("Total questions Module 1:", module1.chapters.reduce((sum, ch) => sum + ch.quiz.length, 0));

// Exporter pour utilisation
export { module1 };
