import { useState, useEffect, useCallback } from 'react';
import { Model, Article, Module, Testimonial, FashionDayEvent, Service, AchievementCategory, ModelDistinction, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication, NewsItem, CastingApplicationStatus, FashionDayApplicationStatus, ForumMessage } from '../types';
import { db } from '../firebaseConfig';
// FIX: Removed Firebase v9 imports (ref, get, set) as they are incompatible with the v8 SDK syntax.
// import { ref, get, set } from 'firebase/database';

// Import initial data from the constants files for seeding purposes
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
    navLinks as initialNavLinks,
    contactInfo as initialContactInfo,
    siteImages as initialSiteImages,
    apiKeys as initialApiKeys,
    castingApplications as initialCastingApplications,
    fashionDayApplications as initialFashionDayApplications,
    newsItems as initialNewsItems,
    classroomForumMessages as initialClassroomForumMessages
} from '../constants/data';
import { articles as initialArticles } from '../constants/magazineData';
import { courseData as initialCourseData } from '../constants/courseData';

export interface AppData {
  models: Model[];
  articles: Article[];
  newsItems: NewsItem[];
  courseData: Module[];
  testimonials: Testimonial[];
  fashionDayEvents: FashionDayEvent[];
  agencyInfo: any; 
  agencyTimeline: { year: string; event: string }[];
  modelDistinctions: ModelDistinction[];
  agencyServices: Service[];
  agencyAchievements: AchievementCategory[];
  agencyPartners: Partner[];
  socialLinks: { facebook: string; instagram: string; youtube: string; };
  siteConfig: { logo: string; };
  navLinks: any[];
  contactInfo: ContactInfo;
  siteImages: SiteImages;
  apiKeys: ApiKeys;
  castingApplications: CastingApplication[];
  fashionDayApplications: FashionDayApplication[];
  classroomForumMessages: ForumMessage[];
}

const getSeedData = (): AppData => ({
  models: initialModels,
  articles: initialArticles,
  newsItems: initialNewsItems,
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
  navLinks: initialNavLinks,
  contactInfo: initialContactInfo,
  siteImages: initialSiteImages,
  apiKeys: initialApiKeys,
  castingApplications: initialCastingApplications,
  fashionDayApplications: initialFashionDayApplications,
  classroomForumMessages: initialClassroomForumMessages,
});

export const useDataStore = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAndFetchData = async () => {
      const dbRef = db.ref('/');
      try {
        // --- FORCE DATABASE RESET ---
        // This will overwrite all data in Firebase with the default seed data.
        console.log("Forcing database reset as requested by the user...");
        const seedData = getSeedData();
        await dbRef.set(seedData);
        setData(seedData);
        console.log("Database has been reset to its initial state.");
        // We add an alert to make sure the user is aware of this one-time action.
        alert("La base de données a été réinitialisée avec les données par défaut, comme demandé. Pour éviter une nouvelle réinitialisation, demandez à l'assistant de 'restaurer le comportement normal de chargement des données'.");
      } catch (error: any) {
        console.error("Firebase reset error:", error);
        alert("Une erreur est survenue lors de la réinitialisation de la base de données.");
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAndFetchData();
  }, []);

  const saveData = useCallback(async (newData: AppData) => {
    const dbRef = db.ref('/');
    try {
        await dbRef.set(newData);
        setData(newData);
    } catch (error) {
        console.error("Firebase save error:", error);
        alert("An error occurred while saving the data.");
    }
  }, [setData]);

  return { data, saveData, isInitialized };
};