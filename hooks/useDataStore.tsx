

import { useState, useEffect, useCallback } from 'react';
import { Model, Article, Module, Testimonial, FashionDayEvent, Service, AchievementCategory, ModelDistinction, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication } from '../types';
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
      // FIX: Use Firebase v8 syntax to get a database reference.
      const dbRef = db.ref('/');
      try {
        // FIX: Use Firebase v8 'get()' method to fetch data.
        const snapshot = await dbRef.get();
        if (snapshot.exists()) {
          const fetchedData = snapshot.val();
          let dataWasMigrated = false;

          // --- SCRIPT DE MIGRATION DES DONNÉES ---
          // This script checks for and fixes missing credentials and quizScores on models.
          if (fetchedData.models) {
              const currentYear = new Date().getFullYear();
              const sanitizeForPassword = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f\u0027]/g, "").replace(/[^a-z0-9-]/g, "");
              
              const modelsArray: Model[] = Array.isArray(fetchedData.models) ? fetchedData.models : Object.values(fetchedData.models);
              const initialCounts: { [key: string]: number } = {};

              // Pre-calculate existing matricule numbers to avoid duplicates
              modelsArray.forEach(model => {
                  if (model.username && model.username.startsWith('Man-PMM')) {
                      const match = model.username.match(/^Man-PMM([A-Z])(\d+)$/);
                      if (match) {
                          const initial = match[1];
                          const num = parseInt(match[2], 10);
                          initialCounts[initial] = Math.max(initialCounts[initial] || 0, num);
                      }
                  }
              });

              const migratedModels = modelsArray.map(model => {
                  const updatedModel = { ...model };

                  // Migrate username/password if needed
                  if (!updatedModel.username || !updatedModel.password || !updatedModel.username.startsWith('Man-PMM')) {
                      dataWasMigrated = true;
                      const firstName = updatedModel.name.split(' ')[0];
                      const initial = firstName.charAt(0).toUpperCase();
  
                      initialCounts[initial] = (initialCounts[initial] || 0) + 1;
                      updatedModel.username = `Man-PMM${initial}${String(initialCounts[initial]).padStart(2, '0')}`;
                      updatedModel.password = `${sanitizeForPassword(firstName)}${currentYear}`;
                  }

                  // Migrate quizScores if missing
                  if (!updatedModel.quizScores) {
                      dataWasMigrated = true;
                      updatedModel.quizScores = {};
                  }
  
                  return updatedModel;
              });

              if (dataWasMigrated) {
                  fetchedData.models = migratedModels;
              }
          }
          // --- FIN DU SCRIPT DE MIGRATION ---

          const seedData = getSeedData();
          
          const finalData: AppData = {
            ...seedData,
            ...fetchedData,
            castingApplications: fetchedData.castingApplications ? Object.values(fetchedData.castingApplications) : [],
            fashionDayApplications: fetchedData.fashionDayApplications ? Object.values(fetchedData.fashionDayApplications) : [],
            siteConfig: { ...seedData.siteConfig, ...fetchedData.siteConfig },
            socialLinks: { ...seedData.socialLinks, ...fetchedData.socialLinks },
            agencyInfo: { ...seedData.agencyInfo, ...fetchedData.agencyInfo },
            contactInfo: { ...seedData.contactInfo, ...fetchedData.contactInfo },
            siteImages: { ...seedData.siteImages, ...fetchedData.siteImages },
            apiKeys: { ...seedData.apiKeys, ...fetchedData.apiKeys },
          };

          setData(finalData as AppData);
          
          // If a migration took place, save the corrected data back to Firebase
          if (dataWasMigrated) {
              console.log("Migrating model data structure. Saving to Firebase...");
              // FIX: Use Firebase v8 'set()' method to save data.
              await db.ref('/').set(finalData); 
              console.log("Migration complete.");
          }

        } else {
          console.log("No data in Firebase. Initializing with local data...");
          const seedData = getSeedData();
          // FIX: Use Firebase v8 'set()' method to save data.
          await dbRef.set(seedData);
          setData(seedData);
        }
      } catch (error: any) {
        console.error("Firebase fetch error:", error);
        if (error.code === "PERMISSION_DENIED") {
            alert("Firebase Error: Permission Denied.\\n\\nThis is a configuration issue, not a bug. Your Firebase Realtime Database security rules are too restrictive.\\n\\nPlease update your rules in the Firebase Console to allow public access.");
        }
        console.log("Falling back to local data due to Firebase error.");
        setData(getSeedData());
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAndFetchData();
  }, []);

  const saveData = useCallback(async (newData: AppData) => {
    // FIX: Use Firebase v8 syntax to get a database reference.
    const dbRef = db.ref('/');
    try {
        // FIX: Use Firebase v8 'set()' method to save data.
        await dbRef.set(newData);
        setData(newData);
    } catch (error) {
        console.error("Firebase save error:", error);
        alert("An error occurred while saving the data.");
    }
  }, [setData]);

  return { data, saveData, isInitialized };
};
