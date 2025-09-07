import { useState, useEffect, useCallback } from 'react';
// We still need the types
import { Model, FashionDayEvent, Service, AchievementCategory, ModelDistinction, Testimonial, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication, NewsItem, ForumThread, ForumReply, Article, Module, ArticleComment, RecoveryRequest, JuryMember, RegistrationStaff, BookingRequest, ContactMessage, BeginnerStudent } from '../types';

// We still import the local data for fallback and for data not stored in the DB (like nav links)
import {
    siteConfig as initialSiteConfig,
    contactInfo as initialContactInfo,
    siteImages as initialSiteImages,
    apiKeys as initialApiKeys,
    navLinks as initialNavLinks,
    socialLinks as initialSocialLinks,
    agencyTimeline as initialAgencyTimeline,
    agencyInfo as initialAgencyInfo,
    modelDistinctions as initialModelDistinctions,
    agencyAchievements as initialAgencyAchievements,
    agencyPartners as initialAgencyPartners,
    courseData as initialCourseData,
    juryMembers as initialJuryMembers,
    registrationStaff as initialRegistrationStaff,
    beginnerCourseData as initialBeginnerCourseData,
} from '../constants/data';

// Define the structure of the data returned by our /api/data endpoint
interface ApiData {
    models: Model[];
    articles: Article[];
    testimonials: Testimonial[];
    news: NewsItem[];
    fashionDayEvents: FashionDayEvent[];
    services: Service[];
    beginnerStudents: BeginnerStudent[];
    settings: Partial<ContactInfo & SiteImages & ApiKeys>;
}

export interface NavLink {
    path: string;
    label: string;
    inFooter: boolean;
    footerLabel?: string;
}

// This is the final, merged data structure for the app
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
    // These are now managed via other, more specific API calls, so we initialize them as empty.
    castingApplications: CastingApplication[];
    fashionDayApplications: FashionDayApplication[];
    newsItems: NewsItem[];
    forumThreads: ForumThread[];
    forumReplies: ForumReply[];
    articleComments: ArticleComment[];
    recoveryRequests: RecoveryRequest[];
    bookingRequests: BookingRequest[];
    contactMessages: ContactMessage[];
    juryMembers: JuryMember[];
    registrationStaff: RegistrationStaff[];
    beginnerCourseData: Module[];
    beginnerStudents: BeginnerStudent[];
}

export const useDataStore = () => {
    const [data, setData] = useState<AppData | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // This function now assembles the static, local part of the data
    const getLocalData = useCallback((): Omit<AppData, keyof ApiData> => ({
        siteConfig: initialSiteConfig,
        navLinks: initialNavLinks,
        socialLinks: initialSocialLinks,
        agencyTimeline: initialAgencyTimeline,
        agencyInfo: initialAgencyInfo,
        modelDistinctions: initialModelDistinctions,
        agencyAchievements: initialAgencyAchievements,
        agencyPartners: initialAgencyPartners,
        courseData: initialCourseData,
        // The following are now fetched from the API, but we provide a default empty state
        contactInfo: initialContactInfo, 
        siteImages: initialSiteImages,
        apiKeys: initialApiKeys, 
        // The following are dynamic and will be fetched. Initialize as empty arrays.
        castingApplications: [],
        fashionDayApplications: [],
        forumThreads: [],
        forumReplies: [],
        articleComments: [],
        recoveryRequests: [],
        bookingRequests: [],
        contactMessages: [],
        juryMembers: initialJuryMembers, // Can be local if they don't change often
        registrationStaff: initialRegistrationStaff, // same as jury
        beginnerCourseData: initialBeginnerCourseData,    
    }), []);
    
    useEffect(() => {
        const fetchData = async () => {
            const localData = getLocalData();
            
            try {
                console.log("Fetching data from /api/data...");
                const response = await fetch('/api/data');
                if (!response.ok) {
                    throw new Error(`API call failed with status: ${response.status}`);
                }
                const apiData: ApiData = await response.json();
                console.log("Successfully fetched data:", apiData);

                // Merge API data with local static data
                const mergedData: AppData = {
                    ...localData,
                    models: apiData.models || [],
                    articles: apiData.articles || [],
                    testimonials: apiData.testimonials || [],
                    newsItems: apiData.news || [],
                    fashionDayEvents: apiData.fashionDayEvents || [],
                    agencyServices: apiData.services || [],
                    beginnerStudents: apiData.beginnerStudents || [],
                    // Merge settings carefully
                    contactInfo: { ...localData.contactInfo, ...apiData.settings },
                    siteImages: { ...localData.siteImages, ...apiData.settings },
                    apiKeys: { ...localData.apiKeys, ...apiData.settings },
                };

                setData(mergedData);

            } catch (error) {
                console.error("Failed to fetch from API, falling back to local data.", error);
                // If API fails, create a state with only local data
                const fallbackData: AppData = {
                    ...localData,
                    models: [],
                    articles: [],
                    testimonials: [],
                    newsItems: [],
                    fashionDayEvents: [],
                    agencyServices: [],
                    beginnerStudents: [],
                };
                setData(fallbackData);
            } finally {
                setIsInitialized(true);
            }
        };

        fetchData();

        // The empty dependency array ensures this effect runs only once on mount.
    }, [getLocalData]);

    const saveData = useCallback(async (newData: Partial<AppData>) => {
        // This function is now a placeholder. 
        // Saving data needs to be reimplemented with specific API calls (e.g., POST /api/articles).
        console.warn("saveData is deprecated and does not persist to the database anymore.");
        // We can still optimistically update the local state for UI feedback.
        setData(prevData => prevData ? { ...prevData, ...newData } : null);
        return Promise.resolve();
    }, []);

    return { data, saveData, isInitialized };
};