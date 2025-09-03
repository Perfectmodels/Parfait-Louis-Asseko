
import { useState, useEffect, useCallback } from 'react';
import { Model, Article, Module, Testimonial, FashionDayEvent, Service, AchievementCategory, ModelDistinction } from '../types';

// Import initial data from the constants files
import { 
    models as initialModels, 
    fashionDayEvents as initialFashionDayEvents, 
    agencyTimeline as initialAgencyTimeline, 
    agencyInfo as initialAgencyInfo, 
    modelDistinctions as initialModelDistinctions, 
    agencyServices as initialAgencyServices, 
    agencyAchievements as initialAgencyAchievements, 
    agencyPartners as initialAgencyPartners, 
    testimonials as initialTestimonials, 
    socialLinks as initialSocialLinks,
    siteConfig as initialSiteConfig,
    navLinks as initialNavLinks
} from '../constants/data';
import { articles as initialArticles } from '../constants/magazineData';
import { courseData as initialCourseData } from '../constants/courseData';

export interface AppData {
  models: Model[];
  articles: Article[];
  courseData: Module[];
  testimonials: Testimonial[];
  fashionDayEvents: FashionDayEvent[];
  agencyInfo: any; 
  agencyTimeline: { year: string; event: string }[];
  modelDistinctions: ModelDistinction[];
  agencyServices: Service[];
  agencyAchievements: AchievementCategory[];
  agencyPartners: string[];
  socialLinks: { facebook: string; instagram: string; youtube: string; };
  siteConfig: { logo: string; };
  navLinks: any[];
}

const getInitialData = (): AppData => ({
  models: initialModels,
  articles: initialArticles,
  courseData: initialCourseData,
  testimonials: initialTestimonials,
  fashionDayEvents: initialFashionDayEvents,
  agencyInfo: initialAgencyInfo,
  agencyTimeline: initialAgencyTimeline,
  modelDistinctions: initialModelDistinctions,
  agencyServices: initialAgencyServices,
  agencyAchievements: initialAgencyAchievements,
  agencyPartners: initialAgencyPartners,
  socialLinks: initialSocialLinks,
  siteConfig: initialSiteConfig,
  navLinks: initialNavLinks
});

export const useDataStore = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize data from constants on every app load.
    // This makes the data store session-based.
    setData(getInitialData());
    setIsInitialized(true);
  }, []);

  const saveData = useCallback((newData: AppData) => {
    // This now only updates the state for the current session.
    // It does not persist to localStorage anymore.
    setData(newData);
  }, []);

  return { data, saveData, isInitialized };
};
