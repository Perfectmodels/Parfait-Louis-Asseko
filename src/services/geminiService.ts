import { GoogleGenAI } from '@google/genai';

class GeminiService {
  private genAI: GoogleGenAI | null = null;
  private apiKey: string | null = null;

  initialize(apiKey: string) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenAI(apiKey);
  }

  private getModel() {
    if (!this.genAI) {
      throw new Error('Gemini service not initialized. Call initialize() first.');
    }
    return this.genAI.models.generateContent;
  }

  async generateContent(prompt: string, options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    responseMimeType?: string;
    responseSchema?: any;
  }) {
    try {
      const model = this.getModel();
      const response = await model({
        model: options?.model || 'gemini-2.0-flash-exp',
        contents: prompt,
        config: {
          maxOutputTokens: options?.maxTokens || 2048,
          temperature: options?.temperature || 0.7,
          responseMimeType: options?.responseMimeType || "text/plain",
          responseSchema: options?.responseSchema
        }
      });

      return response.text;
    } catch (error) {
      console.error('Erreur Gemini:', error);
      throw new Error(`Erreur lors de la génération de contenu: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  // Méthodes spécialisées pour différents types de contenu
  async generateArticleContent(subject: string, bio: string, role: string, event?: string, photos?: string[], quotes?: string[]) {
    const prompt = `
      Tu es un assistant IA pour un site web de mode et d'événementiel (Perfect Models Management) basé au Gabon. 
      Ton rôle est de générer un article complet et formaté en JSON.
      
      Consignes de style :
      - Le ton doit être inspirant, professionnel et culturellement ancré dans le Gabon et l'Afrique.
      - Le contenu doit mettre en valeur le talent ou l'événement.
      - Les paragraphes doivent être fluides et bien structurés.
      - Laisse le champ "imageUrl" principal vide. Utilise les URLs des photos fournies UNIQUEMENT pour les blocs de type "image" dans le tableau "content".
      - Incorpore les citations fournies dans des blocs de type "quote".
      - Choisis une catégorie pertinente parmi : "Interview", "Événement", "Tendance", "Conseils".
      
      Informations fournies :
      - Sujet/Nom : ${subject}
      - Biographie/Description : ${bio}
      - Rôle/Fonction : ${role}
      ${event ? `- Événement associé : ${event}` : ''}
      ${photos && photos.length > 0 ? `- Photos disponibles : ${photos.join(', ')}` : ''}
      ${quotes && quotes.length > 0 ? `- Citations : ${quotes.join(', ')}` : ''}
      
      Génère un article complet au format JSON avec cette structure :
      {
        "title": "Titre accrocheur",
        "category": "Catégorie choisie",
        "excerpt": "Extrait court et percutant",
        "imageUrl": "",
        "content": [
          {"type": "paragraph", "text": "Contenu du paragraphe"},
          {"type": "heading", "level": 2, "text": "Titre de section"},
          {"type": "quote", "text": "Citation", "author": "Auteur"},
          {"type": "image", "src": "URL_photo", "alt": "Description", "caption": "Légende"}
        ],
        "tags": ["tag1", "tag2", "tag3"]
      }
    `;

    const responseSchema = {
      type: "OBJECT",
      properties: {
        title: { type: "STRING" },
        category: { type: "STRING" },
        excerpt: { type: "STRING" },
        imageUrl: { type: "STRING" },
        content: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              type: { type: "STRING" },
              level: { type: "INTEGER" },
              text: { type: "STRING" },
              author: { type: "STRING" },
              src: { type: "STRING" },
              alt: { type: "STRING" },
              caption: { type: "STRING" }
            }
          }
        },
        tags: {
          type: "ARRAY",
          items: { type: "STRING" }
        }
      }
    };

    return this.generateContent(prompt, {
      responseMimeType: "application/json",
      responseSchema
    });
  }

  async generateAlbumDescription(title: string, theme: string, context?: string) {
    const prompt = `
      Tu es un assistant IA pour un site web de mode et d'événementiel (Perfect Models Management) basé au Gabon.
      Génère une description captivante pour un album photo.
      
      Informations :
      - Titre de l'album : ${title}
      - Thème : ${theme}
      ${context ? `- Contexte : ${context}` : ''}
      
      La description doit :
      - Être inspirante et professionnelle
      - Mettre en valeur l'art et la créativité
      - Être ancrée dans la culture gabonaise et africaine
      - Faire entre 2-3 phrases maximum
      - Être engageante pour les visiteurs
    `;

    return this.generateContent(prompt, {
      maxTokens: 150,
      temperature: 0.8
    });
  }

  async generateModelBio(name: string, experience: string, achievements?: string[]) {
    const prompt = `
      Tu es un assistant IA pour un site web de mode et d'événementiel (Perfect Models Management) basé au Gabon.
      Génère une biographie professionnelle et inspirante pour un mannequin.
      
      Informations :
      - Nom : ${name}
      - Expérience : ${experience}
      ${achievements && achievements.length > 0 ? `- Réalisations : ${achievements.join(', ')}` : ''}
      
      La biographie doit :
      - Être professionnelle et inspirante
      - Mettre en valeur le parcours et les talents
      - Être ancrée dans la culture gabonaise
      - Faire entre 3-4 phrases
      - Encourager l'engagement des clients
    `;

    return this.generateContent(prompt, {
      maxTokens: 200,
      temperature: 0.7
    });
  }

  async generateEventDescription(eventName: string, date: string, location: string, theme?: string) {
    const prompt = `
      Tu es un assistant IA pour un site web de mode et d'événementiel (Perfect Models Management) basé au Gabon.
      Génère une description captivante pour un événement de mode.
      
      Informations :
      - Nom de l'événement : ${eventName}
      - Date : ${date}
      - Lieu : ${location}
      ${theme ? `- Thème : ${theme}` : ''}
      
      La description doit :
      - Créer de l'anticipation et de l'excitation
      - Mettre en valeur l'événement
      - Être ancrée dans la culture gabonaise
      - Faire entre 2-3 phrases
      - Encourager la participation
    `;

    return this.generateContent(prompt, {
      maxTokens: 150,
      temperature: 0.8
    });
  }

  async generateSocialMediaPost(content: string, platform: 'facebook' | 'instagram' | 'youtube') {
    const prompt = `
      Tu es un assistant IA pour un site web de mode et d'événementiel (Perfect Models Management) basé au Gabon.
      Génère un post captivant pour ${platform}.
      
      Contenu de base : ${content}
      
      Le post doit :
      - Être adapté à la plateforme ${platform}
      - Être engageant et professionnel
      - Inclure des hashtags pertinents
      - Être ancré dans la culture gabonaise
      - Encourager l'interaction
      - Respecter les limites de caractères de ${platform}
    `;

    return this.generateContent(prompt, {
      maxTokens: 300,
      temperature: 0.8
    });
  }

  async generateQuizQuestions(topic: string, difficulty: 'débutant' | 'intermédiaire' | 'avancé', count: number = 5) {
    const prompt = `
      Tu es un assistant IA pour un site web de mode et d'événementiel (Perfect Models Management) basé au Gabon.
      Génère ${count} questions de quiz sur le thème "${topic}" pour un niveau ${difficulty}.
      
      Chaque question doit :
      - Être pertinente pour le mannequinat et la mode
      - Avoir 4 options de réponse (A, B, C, D)
      - Avoir une seule bonne réponse
      - Être adaptée au niveau ${difficulty}
      - Inclure des éléments culturels gabonais quand c'est pertinent
      
      Format de réponse en JSON :
      {
        "questions": [
          {
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Explication de la bonne réponse"
          }
        ]
      }
    `;

    const responseSchema = {
      type: "OBJECT",
      properties: {
        questions: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              question: { type: "STRING" },
              options: {
                type: "ARRAY",
                items: { type: "STRING" }
              },
              correctAnswer: { type: "INTEGER" },
              explanation: { type: "STRING" }
            }
          }
        }
      }
    };

    return this.generateContent(prompt, {
      responseMimeType: "application/json",
      responseSchema,
      maxTokens: 1000
    });
  }

  async generateSEOContent(title: string, content: string, keywords?: string[]) {
    const prompt = `
      Tu es un assistant IA pour un site web de mode et d'événementiel (Perfect Models Management) basé au Gabon.
      Génère du contenu SEO optimisé.
      
      Informations :
      - Titre : ${title}
      - Contenu : ${content}
      ${keywords && keywords.length > 0 ? `- Mots-clés : ${keywords.join(', ')}` : ''}
      
      Génère :
      - Une meta description (150-160 caractères)
      - Des mots-clés SEO pertinents
      - Un titre SEO optimisé
      - Des suggestions d'amélioration du contenu
      
      Format JSON :
      {
        "metaDescription": "Description optimisée",
        "seoTitle": "Titre SEO optimisé",
        "keywords": ["mot1", "mot2", "mot3"],
        "suggestions": ["suggestion1", "suggestion2"]
      }
    `;

    const responseSchema = {
      type: "OBJECT",
      properties: {
        metaDescription: { type: "STRING" },
        seoTitle: { type: "STRING" },
        keywords: {
          type: "ARRAY",
          items: { type: "STRING" }
        },
        suggestions: {
          type: "ARRAY",
          items: { type: "STRING" }
        }
      }
    };

    return this.generateContent(prompt, {
      responseMimeType: "application/json",
      responseSchema,
      maxTokens: 500
    });
  }
}

export const geminiService = new GeminiService();
