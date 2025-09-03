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
    socialLinks as initialSocialLinks 
} from '../constants/data';
import { articles as initialArticles } from '../constants/magazineData';
import { courseData as initialCourseData } from '../constants/courseData';

const DATA_STORAGE_KEY = 'pmm_site_data_v1';

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
  socialLinks: initialSocialLinks
});

export const useDataStore = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(DATA_STORAGE_KEY);
      if (storedData) {
        setData(JSON.parse(storedData));
      } else {
        const initialData = getInitialData();
        setData(initialData);
        localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(initialData));
      }
    } catch (error) {
      console.error("Failed to load or parse data from localStorage", error);
      // Fallback to initial data if localStorage fails
      setData(getInitialData());
    } finally {
        setIsInitialized(true);
    }
  }, []);

  const saveData = useCallback((newData: AppData) => {
    try {
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
    }
  }, []);

  return { data, saveData, isInitialized };
};
