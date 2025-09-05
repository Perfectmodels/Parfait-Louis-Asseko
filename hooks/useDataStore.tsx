
import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebaseConfig';
import { Model, FashionDayEvent, Service, AchievementCategory, ModelDistinction, Testimonial, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication, NewsItem, ForumMessage, Article, Module } from '../types';

// Import initial data to seed the database if it's empty
import { 
    models as initialModels, 
    siteConfig as initialSiteConfig, 
    contactInfo as initialContactInfo, 
    siteImages as initialSiteImages, 
    apiKeys as initialApiKeys, 
    castingApplications as initialCastingApplications, 
    fashionDayApplications as initialFashionDayApplications, 
    classroomForumMessages as initialClassroomForumMessages, 
    newsItems as initialNewsItems, 
    navLinks as initialNavLinks, 
    fashionDayEvents as initialFashionDayEvents, 
    socialLinks as initialSocialLinks, 
    agencyTimeline as initialAgencyTimeline, 
    agencyInfo as initialAgencyInfo, 
    modelDistinctions as initialModelDistinctions, 
    agencyServices as initialAgencyServices, 
    agencyAchievements as initialAgencyAchievements, 
    agencyPartners as initialAgencyPartners, 
    testimonials as initialTestimonials 
} from '../constants/data';
import { articles as initialArticles } from '../constants/magazineData';
import { courseData as initialCourseData } from '../constants/courseData';

export interface NavLink {
    path: string;
    label: string;
    inFooter: boolean;
    footerLabel?: string;
}

export interface AppData {
    siteConfig: { logo: string };
    navLinks: NavLink[];
    socialLinks: { facebook: string; instagram: string; youtube: string; };
    agencyTimeline: { year: string; event: string; }[];
    agencyInfo: {
        about: { p1: string; p2: string; };
        values: { name: string; description: string; }[];
    };
    modelDistinctions: ModelDistinction[];
    agencyServices: Service[];
    agencyAchievements: AchievementCategory[];
    agencyPartners: Partner[];
    models: Model[];
    fashionDayEvents: FashionDayEvent[];
    testimonials: Testimonial[];
    articles: Article[];
    courseData: Module[];
    contactInfo: ContactInfo;
    siteImages: SiteImages;
    apiKeys: ApiKeys;
    castingApplications: CastingApplication[];
    fashionDayApplications: FashionDayApplication[];
    newsItems: NewsItem[];
    classroomForumMessages: ForumMessage[];
}

export const useDataStore = () => {
    const [data, setData] = useState<AppData | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const getInitialData = useCallback((): AppData => ({
        models: initialModels,
        siteConfig: initialSiteConfig,
        contactInfo: initialContactInfo,
        siteImages: initialSiteImages,
        apiKeys: initialApiKeys,
        castingApplications: initialCastingApplications,
        fashionDayApplications: initialFashionDayApplications,
        classroomForumMessages: initialClassroomForumMessages,
        newsItems: initialNewsItems,
        navLinks: initialNavLinks,
        fashionDayEvents: initialFashionDayEvents,
        socialLinks: initialSocialLinks,
        agencyTimeline: initialAgencyTimeline,
        agencyInfo: initialAgencyInfo,
        modelDistinctions: initialModelDistinctions,
        agencyServices: initialAgencyServices,
        agencyAchievements: initialAgencyAchievements,
        agencyPartners: initialAgencyPartners,
        testimonials: initialTestimonials,
        articles: initialArticles,
        courseData: initialCourseData,
    }), []);
    
    useEffect(() => {
        const dbRef = db.ref('/');
        
        const listener = dbRef.on('value', (snapshot) => {
            const dbData = snapshot.val();
            if (dbData) {
                // Ensure all fields from initialData are present, useful for schema updates
                const initialData = getInitialData();
                const mergedData = { ...initialData, ...dbData };
                setData(mergedData);
            } else {
                // If DB is empty, seed it with initial data
                const initialData = getInitialData();
                dbRef.set(initialData).then(() => {
                    setData(initialData);
                    console.log("Firebase database seeded with initial data.");
                }).catch(error => {
                    console.error("Error seeding database:", error);
                });
            }
            setIsInitialized(true);
        }, (error) => {
            console.error("Firebase read failed: " + error.name);
            // Fallback to local data if Firebase fails
            setData(getInitialData());
            setIsInitialized(true);
        });

        // Detach the listener when the component unmounts
        return () => dbRef.off('value', listener);
    }, [getInitialData]);

    const saveData = useCallback(async (newData: AppData) => {
        try {
            await db.ref('/').set(newData);
            // The local state will be updated by the 'on' listener,
            // but we can set it here for immediate UI feedback if desired.
            setData(newData);
        } catch (error) {
            console.error("Error saving data to Firebase:", error);
            throw error; // Re-throw to be caught by the caller
        }
    }, []);

    return { data, saveData, isInitialized };
};
