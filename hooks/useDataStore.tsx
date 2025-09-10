
import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue, set } from 'firebase/database';
// FIX: Add BeginnerStudent to the type imports.
import { Model, FashionDayEvent, Service, AchievementCategory, ModelDistinction, Testimonial, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication, NewsItem, ForumThread, ForumReply, Article, Module, ArticleComment, RecoveryRequest, JuryMember, RegistrationStaff, BookingRequest, ContactMessage, BeginnerStudent } from '../types';

// Import initial data to seed the database if it's empty
import { 
    models as initialModels, 
    siteConfig as initialSiteConfig, 
    contactInfo as initialContactInfo, 
    siteImages as initialSiteImages, 
    apiKeys as initialApiKeys, 
    castingApplications as initialCastingApplications, 
    fashionDayApplications as initialFashionDayApplications, 
    forumThreads as initialForumThreads,
    forumReplies as initialForumReplies,
    articleComments as initialArticleComments,
    recoveryRequests as initialRecoveryRequests,
    bookingRequests as initialBookingRequests,
    contactMessages as initialContactMessages,
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
    testimonials as initialTestimonials,
    juryMembers as initialJuryMembers,
    registrationStaff as initialRegistrationStaff,
    beginnerStudents as initialBeginnerStudents,
    beginnerCourseData as initialBeginnerCourseData
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
    forumThreads: ForumThread[];
    forumReplies: ForumReply[];
    articleComments: ArticleComment[];
    recoveryRequests: RecoveryRequest[];
    bookingRequests: BookingRequest[];
    contactMessages: ContactMessage[];
    juryMembers: JuryMember[];
    registrationStaff: RegistrationStaff[];
    // FIX: Add missing properties for beginner classroom functionality.
    beginnerCourseData: Module[];
    beginnerStudents: BeginnerStudent[];
}

export const useDataStore = () => {
    const [data, setData] = useState<AppData | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    
    console.log('useDataStore - Initialisation du hook');

    const getInitialData = useCallback((): AppData => ({
        models: initialModels,
        siteConfig: initialSiteConfig,
        contactInfo: initialContactInfo,
        siteImages: initialSiteImages,
        apiKeys: initialApiKeys,
        castingApplications: initialCastingApplications,
        fashionDayApplications: initialFashionDayApplications,
        forumThreads: initialForumThreads,
        forumReplies: initialForumReplies,
        articleComments: initialArticleComments,
        recoveryRequests: initialRecoveryRequests,
        bookingRequests: initialBookingRequests,
        contactMessages: initialContactMessages,
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
        juryMembers: initialJuryMembers,
        registrationStaff: initialRegistrationStaff,
        beginnerCourseData: initialBeginnerCourseData,
        beginnerStudents: initialBeginnerStudents,
    }), []);
    
    useEffect(() => {
        console.log('useDataStore - Début de l\'effet de chargement des données');
        console.log('Données initiales:', {
            hasAgencyServices: !!getInitialData().agencyServices,
            initialAgencyServicesCount: getInitialData().agencyServices?.length || 0
        });
        
        const dbRef = ref(db, '/');
        
        const unsubscribe = onValue(dbRef, (snapshot) => {
            console.log('useDataStore - Données reçues de Firebase:', snapshot.exists() ? 'Oui' : 'Non');
            console.log('Snapshot complet:', snapshot.val());
            
            if (!snapshot.exists()) {
                console.log('useDataStore - Aucune donnée dans Firebase, utilisation des données initiales');
            }
            const dbData = snapshot.val();
            const initialData = getInitialData();
            if (dbData) {
                console.log('useDataStore - Données brutes de Firebase:', dbData);
                // Defensive merge: prevent critical data arrays from being overwritten by empty/null values from DB
                console.log('Données brutes de Firebase (dbData):', dbData);
                console.log('Données initiales (initialData):', {
                    agencyServices: initialData.agencyServices?.length || 0,
                    keys: Object.keys(initialData)
                });
                
                const mergedData = {
                    ...initialData,
                    ...dbData,
                    models: (dbData.models && dbData.models.length > 0) ? dbData.models : initialData.models,
                    articles: (dbData.articles && dbData.articles.length > 0) ? dbData.articles : initialData.articles,
                    courseData: (dbData.courseData && dbData.courseData.length > 0) ? dbData.courseData : initialData.courseData,
                    beginnerCourseData: (dbData.beginnerCourseData && dbData.beginnerCourseData.length > 0) ? dbData.beginnerCourseData : initialData.beginnerCourseData,
                    newsItems: (dbData.newsItems && dbData.newsItems.length > 0) ? dbData.newsItems : initialData.newsItems,
                    testimonials: (dbData.testimonials && dbData.testimonials.length > 0) ? dbData.testimonials : initialData.testimonials,
                    agencyServices: (dbData.agencyServices && dbData.agencyServices.length > 0) ? dbData.agencyServices : (initialData.agencyServices || []),
                    fashionDayEvents: (dbData.fashionDayEvents && dbData.fashionDayEvents.length > 0) ? dbData.fashionDayEvents : initialData.fashionDayEvents,
                };
                
                console.log('Données fusionnées (mergedData):', {
                    agencyServices: mergedData.agencyServices?.length || 0,
                    hasAgencyServices: !!mergedData.agencyServices,
                    keys: Object.keys(mergedData)
                });
                
                // Always use navLinks from code to ensure route integrity
                mergedData.navLinks = initialData.navLinks;
                console.log('useDataStore - Données fusionnées avant envoi au state:', {
                    agencyServicesLength: mergedData.agencyServices?.length || 0,
                    modelsLength: mergedData.models?.length || 0
                });
                setData(mergedData);
            } else {
                console.log('useDataStore - Base de données vide, initialisation avec les données par défaut');
                // If DB is empty, seed it with initial data
                set(dbRef, initialData).then(() => {
                    setData(initialData);
                    console.log("Firebase database seeded with initial data.");
                }).catch(error => {
                    console.error("Error seeding database:", error);
                });
            }
            setIsInitialized(true);
        }, (error) => {
            console.error("Firebase read failed: ", error);
            console.log('useDataStore - Erreur de lecture Firebase, utilisation des données locales');
            // Fallback to local data if Firebase fails
            const localData = getInitialData();
            console.log('useDataStore - Données locales chargées:', {
                agencyServicesLength: localData.agencyServices?.length || 0,
                modelsLength: localData.models?.length || 0
            });
            setData(localData);
            setIsInitialized(true);
        });

        // Detach the listener when the component unmounts
        return () => unsubscribe();
    }, [getInitialData]);

    const saveData = useCallback(async (newData: AppData) => {
        try {
            await set(ref(db, '/'), newData);
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
