import React, { useState } from 'react';
import { Article } from '../types';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface ArticleGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleGenerated: (article: Partial<Article>) => void;
}

const ArticleGenerator: React.FC<ArticleGeneratorProps> = ({ isOpen, onClose, onArticleGenerated }) => {
  const [formData, setFormData] = useState({
    subject: '',
    bio: '',
    role: '',
    event: '',
    photos: '',
    quotes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const prompt = `
            Tu es un assistant IA pour un site web de mode et d'événementiel (Perfect Models Management) basé au Gabon. 
            Ton rôle est de générer un article complet et formaté en JSON.
            
            Consignes de style :
            - Le ton doit être inspirant, professionnel et culturellement ancré dans le Gabon et l’Afrique.
            - Le contenu doit mettre en valeur le talent ou l'événement.
            - Les paragraphes doivent être fluides et bien structurés.
            - Laisse le champ "imageUrl" principal vide. Utilise les URLs des photos fournies UNIQUEMENT pour les blocs de type "image" dans le tableau "content".
            - Incorpore les citations fournies dans des blocs de type "quote".
            - Choisis une catégorie pertinente parmi : "Interview", "Événement", "Tendance", "Conseils".
            - Génère des tags pertinents pour le SEO.

            Informations fournies :
            - Sujet / Nom : ${formData.subject}
            - Biographie / Description : ${formData.bio}
            - Rôle : ${formData.role}
            - Événement associé : ${formData.event}
            - URLs des photos (une par ligne) : ${formData.photos}
            - Citations (une par ligne) : ${formData.quotes}

            Génère l'article en respectant scrupuleusement le schéma JSON.
        `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        author: { type: Type.STRING, description: "Doit être 'Perfect Models Management' ou 'Focus Model 241'" },
        date: { type: Type.STRING, description: "Date au format AAAA-MM-JJ" },
        category: { type: Type.STRING, description: "Ex: Interview, Événement, Tendance, Conseils" },
        excerpt: { type: Type.STRING, description: "Résumé court de 2-3 phrases." },
        imageUrl: { type: Type.STRING, description: "Laisse ce champ vide. Il sera rempli par l'utilisateur." },
        content: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, description: "heading, paragraph, quote, ou image" },
              level: { type: Type.INTEGER, description: "Pour le type 'heading', 2 ou 3" },
              text: { type: Type.STRING },
              author: { type: Type.STRING, description: "Pour le type 'quote'" },
              src: { type: Type.STRING, description: "Pour le type 'image'" },
              alt: { type: Type.STRING, description: "Pour le type 'image'" },
              caption: { type: Type.STRING, description: "Pour le type 'image'" }
            },
            required: ["type"]
          }
        },
        tags: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
      required: ["title", "author", "date", "category", "excerpt", "content", "tags"]
    };

    try {
      if (!process.env.API_KEY) {
        throw new Error("La clé API Gemini n'est pas configurée.");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      });

      const jsonResult = response.text;
      const parsedArticle: Partial<Article> = JSON.parse(jsonResult);
      onArticleGenerated(parsedArticle);

    } catch (err: any) {
      console.error("Erreur de l'API Gemini:", err);
      setError(err.message || "Une erreur est survenue lors de la génération de l'article.");
    } finally {
      setIsLoading(false);
    }

  }, [formData, onArticleGenerated]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-playfair text-pm-gold flex items-center gap-2">
            <SparklesIcon className="w-6 h-6" />
            Générateur d'Article IA
          </h2>
          <button onClick={onClose} className="text-pm-off-white/70 hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-pm-off-white/80 mb-1">
              Sujet de l'article
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-pm-dark-light border border-pm-gold/20 rounded p-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
              placeholder="Ex: Les tendances été 2024..."
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!topic || isGenerating}
            className="w-full py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? 'Génération en cours...' : 'Générer l\'article'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleGenerator;
