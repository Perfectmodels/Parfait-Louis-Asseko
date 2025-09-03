import React from 'react';

export interface Model {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  age?: number;
  height: string;
  gender: 'Homme' | 'Femme';
  location?: string;
  imageUrl: string;
  distinctions?: string[];
}

export interface Stylist {
  name: string;
  description: string;
  images: string[];
}

export interface FashionDayEvent {
  edition: number;
  date: string;
  theme: string;
  location?: string;
  mc?: string;
  promoter?: string;
  stylists?: Stylist[];
  featuredModels?: string[];
  artists?: string[];
  partners?: { type: string; name: string }[];
  description: string;
}

export interface Service {
  icon: React.ElementType;
  title: string;
  description: string;
}

export interface AchievementCategory {
  name: string;
  items: string[];
}

export interface ModelDistinction {
    name: string;
    titles: string[];
}

// Types for Magazine Feature
export type ArticleContent = 
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string; author?: string };

export interface Article {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  date: string;
  content: ArticleContent[];
}


// Types for Classroom feature
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Chapter {
  slug: string;
  title: string;
  content: string;
}

export interface Module {
  slug: string;
  title: string;
  chapters: Chapter[];
  quiz: QuizQuestion[];
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  imageUrl: string;
}

// FIX: Added the missing AIAssistantProps interface to define the props for the AI Assistant modal, resolving import errors in admin pages.
export interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertContent: (content: string) => void;
  fieldName: string;
  initialPrompt: string;
  jsonSchema?: any;
}
