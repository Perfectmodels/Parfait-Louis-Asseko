import { Module } from '../types';

export const courseData: Module[] = [
    {
        id: 'module-1-les-fondamentaux-du-mannequinat',
        title: "Les Fondamentaux du Mannequinat",
        description: "Introduction au monde de la mode, vocabulaire et posture de base.",
        lessons: [
            { id: 'l1', title: "Histoire de la mode", content: "Contenu de la leçon..." },
            { id: 'l2', title: "Vocabulaire essentiel", content: "Contenu de la leçon..." }
        ],
        quiz: {
            id: 'q1',
            title: 'Quiz Fondamentaux',
            questions: [
                { id: 'q1-1', text: 'Qu\'est-ce qu\'un book ?', options: ['Un livre', 'Un portfolio', 'Un contrat'], correctAnswer: 1 }
            ]
        }
    },
    {
        id: 'module-2-techniques-de-podium-catwalk',
        title: "Techniques de Podium (Catwalk)",
        description: "Apprenez à marcher avec assurance et élégance.",
        lessons: [
            { id: 'l3', title: "La posture", content: "Contenu de la leçon..." },
            { id: 'l4', title: "Le pas", content: "Contenu de la leçon..." }
        ],
        quiz: {
            id: 'q2',
            title: 'Quiz Catwalk',
            questions: [
                { id: 'q2-1', text: 'Quelle partie du corps doit guider la marche ?', options: ['Les épaules', 'Les hanches', 'Les pieds'], correctAnswer: 1 }
            ]
        }
    },
    {
        id: 'module-3-photographie-et-expression-corporelle',
        title: "Photographie et Expression Corporelle",
        description: "Maîtrisez l'art de la pose et de l'expression faciale.",
        lessons: [
            { id: 'l5', title: "Le regard", content: "Contenu de la leçon..." },
            { id: 'l6', title: "Les angles", content: "Contenu de la leçon..." }
        ],
        quiz: {
            id: 'q3',
            title: 'Quiz Photo',
            questions: [
                { id: 'q3-1', text: 'Qu\'est-ce que la "lumière naturelle" ?', options: ['Le soleil', 'Un flash', 'Une lampe'], correctAnswer: 0 }
            ]
        }
    }
];
