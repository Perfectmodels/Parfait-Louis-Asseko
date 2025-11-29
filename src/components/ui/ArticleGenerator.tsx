import React, { useState, useCallback } from 'react';
import { Article } from '../types';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { GoogleGenAI } from "@google/genai";

enum SchemaType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  INTEGER = "INTEGER",
  BOOLEAN = "BOOLEAN",
  ARRAY = "ARRAY",
  OBJECT = "OBJECT"
}

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING },
        author: { type: SchemaType.STRING, description: "Doit être 'Perfect Models Management' ou 'Focus Model 241'" },
        date: { type: SchemaType.STRING, description: "Date au format AAAA-MM-JJ" },
        category: { type: SchemaType.STRING, description: "Ex: Interview, Événement, Tendance, Conseils" },
        excerpt: { type: SchemaType.STRING, description: "Résumé court de 2-3 phrases." },
        imageUrl: { type: SchemaType.STRING, description: "Laisse ce champ vide. Il sera rempli par l'utilisateur." },
        content: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              type: { type: SchemaType.STRING, description: "heading, paragraph, quote, ou image" },
              level: { type: SchemaType.INTEGER, description: "Pour le type 'heading', 2 ou 3" },
              text: { type: SchemaType.STRING },
              author: { type: SchemaType.STRING, description: "Pour le type 'quote'" },
              src: { type: SchemaType.STRING, description: "Pour le type 'image'" },
              alt: { type: SchemaType.STRING, description: "Pour le type 'image'" },
              caption: { type: SchemaType.STRING, description: "Pour le type 'image'" }
            },
            required: ["type"]
          }
        },
        tags: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING }
        }
      },
      required: ["title", "author", "date", "category", "excerpt", "content", "tags"]
    };

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("La clé API Gemini n'est pas configurée.");
      }

      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp', // Updated model name if needed, or stick to 'gemini-1.5-flash'
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      });

      const jsonResult = response.response.text();
      const parsedArticle: Partial<Article> = JSON.parse(jsonResult);
      onArticleGenerated(parsedArticle);
      onClose();

    } catch (err: any) {
      console.error("Erreur de l'API Gemini:", err);
      setError(err.message || "Une erreur est survenue lors de la génération de l'article.");
    } finally {
      setIsLoading(false);
    }

  }, [formData, onArticleGenerated, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-playfair text-pm-gold flex items-center gap-2">
            <SparklesIcon className="w-6 h-6" />
            Générateur d'Article IA
          </h2>
          <button onClick={onClose} className="text-pm-off-white/70 hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-pm-off-white/80 mb-1">
              Sujet / Nom
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full bg-pm-dark-light border border-pm-gold/20 rounded p-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
              placeholder="Ex: Noemi Kim, Fashion Day..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pm-off-white/80 mb-1">
              Rôle / Titre
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-pm-dark-light border border-pm-gold/20 rounded p-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
              placeholder="Ex: Mannequin, Styliste..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pm-off-white/80 mb-1">
              Biographie / Description
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full bg-pm-dark-light border border-pm-gold/20 rounded p-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
              placeholder="Détails clés à inclure..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pm-off-white/80 mb-1">
              Événement associé (Optionnel)
            </label>
            <input
              type="text"
              name="event"
              value={formData.event}
              onChange={handleChange}
              className="w-full bg-pm-dark-light border border-pm-gold/20 rounded p-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
              placeholder="Ex: Libreville Fashion Week 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pm-off-white/80 mb-1">
              Citations (une par ligne)
            </label>
            <textarea
              name="quotes"
              value={formData.quotes}
              onChange={handleChange}
              rows={2}
              className="w-full bg-pm-dark-light border border-pm-gold/20 rounded p-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
              placeholder="Citations à inclure..."
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!formData.subject || isLoading}
            className="w-full py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Génération en cours...' : 'Générer l\'article'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleGenerator;
