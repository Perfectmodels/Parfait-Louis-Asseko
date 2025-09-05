import { useState, useEffect, useCallback } from 'react';
import { Model, Article, Module, Testimonial, FashionDayEvent, Service, AchievementCategory, ModelDistinction, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication, NewsItem, CastingApplicationStatus, FashionDayApplicationStatus, ForumMessage } from '../types';
import { db } from '../firebaseConfig';

// Import initial data from the constants files for seeding purposes
import { 
    models as initialModels, 
    fashionDayEvents as initialFashionDayEvents, 
    agencyTimeline as initialAgencyTimeline, 
    agencyInfo as initialAgencyInfo, 
    // FIX: Corrected typo in import name from 'modelDistinction' to 'modelDistinctions'.
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
    const loadData = async () => {
      console.log("Attempting to load data from Firebase...");
      const dbRef = db.ref('/');
      try {
        const snapshot = await dbRef.get();
        const seedData = getSeedData();

        if (snapshot.exists() && snapshot.val() !== null) {
          const firebaseData = snapshot.val();
          // Check if models (users) data is missing or invalid in Firebase
          if (!firebaseData.models || !Array.isArray(firebaseData.models) || firebaseData.models.length === 0) {
              console.warn("INFO: Firebase data exists but is missing the 'models' (users) array. Restoring default models to the database...");
              const mergedData = { ...firebaseData, models: seedData.models };
              await dbRef.set(mergedData); // Save the merged data back to Firebase
              setData(mergedData);
              console.log("SUCCESS: Default models have been restored and merged with existing data.");
          } else {
              console.log("SUCCESS: Data found and loaded from Firebase, including existing models.");
              setData(firebaseData);
          }
        } else {
          console.warn("INFO: Firebase database is empty or contains null. Seeding with initial site data.");
          await dbRef.set(seedData);
          setData(seedData);
          console.log("SUCCESS: Database has been seeded with initial data.");
        }
      } catch (error: any) {
        console.error("FATAL: Firebase connection error. Could not read from or write to the database.", error);
        console.log("FALLBACK: Using local data as a temporary fallback.");
        setData(getSeedData());
      } finally {
        setIsInitialized(true);
        console.log("Data initialization complete.");
      }
    };

    loadData();
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
  }, []);

  return { data, saveData, isInitialized };
};
