

import { useState, useEffect, useCallback } from 'react';
import { Model, Article, Module, Testimonial, FashionDayEvent, Service, AchievementCategory, ModelDistinction, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication } from '../types';
import { db } from '../firebaseConfig';
import { ref, get, set } from 'firebase/database';

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
    fashionDayApplications as initialFashionDayApplications
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
  agencyPartners: Partner[];
  socialLinks: { facebook: string; instagram: string; youtube: string; };
  siteConfig: { logo: string; };
  navLinks: any[];
  contactInfo: ContactInfo;
  siteImages: SiteImages;
  apiKeys: ApiKeys;
  castingApplications: CastingApplication[];
  fashionDayApplications: FashionDayApplication[];
}

const getSeedData = (): AppData => ({
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
  navLinks: initialNavLinks,
  contactInfo: initialContactInfo,
  siteImages: initialSiteImages,
  apiKeys: initialApiKeys,
  castingApplications: initialCastingApplications,
  fashionDayApplications: initialFashionDayApplications,
});

export const useDataStore = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAndFetchData = async () => {
      const dbRef = ref(db, '/');
      try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const fetchedData = snapshot.val();
          const seedData = getSeedData();
          
          // Safely merge fetched data with seed data to ensure all properties exist.
          const finalData: AppData = {
            ...seedData,
            ...fetchedData,
            // Convert Firebase objects to arrays where necessary
            castingApplications: fetchedData.castingApplications ? Object.values(fetchedData.castingApplications) : [],
            fashionDayApplications: fetchedData.fashionDayApplications ? Object.values(fetchedData.fashionDayApplications) : [],
            // Explicitly merge nested objects to prevent them from being completely overwritten
            siteConfig: { ...seedData.siteConfig, ...fetchedData.siteConfig },
            socialLinks: { ...seedData.socialLinks, ...fetchedData.socialLinks },
            agencyInfo: { ...seedData.agencyInfo, ...fetchedData.agencyInfo },
            contactInfo: { ...seedData.contactInfo, ...fetchedData.contactInfo },
            siteImages: { ...seedData.siteImages, ...fetchedData.siteImages },
            apiKeys: { ...seedData.apiKeys, ...fetchedData.apiKeys },
          };

          setData(finalData as AppData);
        } else {
          console.log("No data found in Firebase. Seeding with initial data...");
          const seedData = getSeedData();
          await set(dbRef, seedData);
          setData(seedData);
        }
      } catch (error: any) {
        console.error("Firebase fetch error:", error);
        if (error.code === "PERMISSION_DENIED") {
            alert("Firebase Error: Permission Denied.\n\nThis is a configuration issue, not a code bug. Your Firebase Realtime Database security rules are too restrictive.\n\nPlease update your rules in the Firebase Console to allow public access. See the conversational response for detailed, step-by-step instructions.");
        }
        // Fallback to local data if Firebase fails
        console.log("Falling back to local data due to Firebase error.");
        setData(getSeedData());
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAndFetchData();
  }, []);

  const saveData = useCallback(async (newData: AppData) => {
    const dbRef = ref(db, '/');
    try {
        await set(dbRef, newData);
        setData(newData); // Update local state for immediate UI feedback
    } catch (error) {
        console.error("Firebase save error:", error);
        alert("Une erreur est survenue lors de la sauvegarde des données.");
    }
  }, []);

  return { data, saveData, isInitialized };
};