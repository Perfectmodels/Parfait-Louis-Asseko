// Déclarations de types pour les modules personnalisés
declare module '../components/QuizComponent' {
    import { FC } from 'react';
    
    export interface QuizQuestion {
        id: number;
        question: string;
        options: string[];
        correctAnswer: number;
        explanation: string;
    }

    interface QuizComponentProps {
        questions: QuizQuestion[];
        onComplete?: (score: number, total: number) => void;
    }

    const QuizComponent: FC<QuizComponentProps>;
    export default QuizComponent;
}

declare module '../components/SEO' {
    import { FC } from 'react';
    
    interface SEOProps {
        title?: string;
        description?: string;
        keywords?: string;
        image?: string;
        url?: string;
    }

    const SEO: FC<SEOProps>;
    export default SEO;
}

declare module '../components/NotFound' {
    import { FC } from 'react';
    
    const NotFound: FC;
    export default NotFound;
}
