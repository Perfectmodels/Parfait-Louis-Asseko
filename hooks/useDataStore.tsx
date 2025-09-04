

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
          let dataWasMigrated = false;

          // --- SCRIPT DE MIGRATION DES DONNÉES ---
          // Vérifie si les mannequins dans Firebase ont des identifiants/mots de passe et les génère si nécessaire.
          if (fetchedData.models) {
              const currentYear = new Date().getFullYear();
              const sanitizeForPassword = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f\u0027]/g, "").replace(/[^a-z0-9-]/g, "");
              
              const modelsArray: Model[] = Array.isArray(fetchedData.models) ? fetchedData.models : Object.values(fetchedData.models);
              const initialCounts: { [key: string]: number } = {};

              // Pré-calculer les comptes des matricules existants pour éviter les doublons
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
                  // Si les identifiants sont déjà valides, on ne touche à rien
                  if (model.username && model.password && model.username.startsWith('Man-PMM')) {
                      return model;
                  }

                  dataWasMigrated = true; // On marque qu'une migration a lieu

                  const firstName = model.name.split(' ')[0];
                  const initial = firstName.charAt(0).toUpperCase();

                  initialCounts[initial] = (initialCounts[initial] || 0) + 1;
                  const username = `Man-PMM${initial}${String(initialCounts[initial]).padStart(2, '0')}`;
                  const password = `${sanitizeForPassword(firstName)}${currentYear}`;

                  return { ...model, username, password };
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
          
          // Si une migration a eu lieu, on sauvegarde les données corrigées dans Firebase
          if (dataWasMigrated) {
              console.log("Migration des données des mannequins en ajoutant les accès manquants. Sauvegarde vers Firebase...");
              await set(dbRef, finalData); 
              console.log("Migration terminée.");
          }

        } else {
          console.log("Aucune donnée dans Firebase. Initialisation avec les données locales...");
          const seedData = getSeedData();
          await set(dbRef, seedData);
          setData(seedData);
        }
      } catch (error: any) {
        console.error("Erreur de fetch Firebase:", error);
        if (error.code === "PERMISSION_DENIED") {
            alert("Erreur Firebase: Permission Refusée.\n\nCeci est un problème de configuration, pas un bug. Vos règles de sécurité de la base de données Firebase sont trop restrictives.\n\nVeuillez mettre à jour vos règles dans la console Firebase pour autoriser l'accès public.");
        }
        console.log("Retour aux données locales suite à une erreur Firebase.");
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
        setData(newData);
    } catch (error) {
        console.error("Erreur de sauvegarde Firebase:", error);
        alert("Une erreur est survenue lors de la sauvegarde des données.");
    }
  }, []);

  return { data, saveData, isInitialized };
};
