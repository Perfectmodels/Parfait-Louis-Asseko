import { useState, useEffect, useCallback } from 'react';
import { db } from '../realtimedbConfig'; // Changed to Realtime DB config
import { ref, onValue, set, update, remove, push } from 'firebase/database'; // Changed for Realtime DB
import { initialData } from '../constants/data';
import logger from '../utils/logger';
import { Model, FashionDayEvent, Service, AchievementCategory, ModelDistinction, Testimonial, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication, NewsItem, ForumThread, ForumReply, Article, Module, ArticleComment, RecoveryRequest, JuryMember, RegistrationStaff, BookingRequest, ContactMessage, FAQCategory, Absence, MonthlyPayment, PhotoshootBrief, NavLink, HeroSlide, FashionDayReservation, AdminProfile, GalleryItem } from '../types';

// Initial data imports remain the same
import {
    models as initialModels,
    siteConfig as initialSiteConfig,
    contactInfo as initialContactInfo,
    siteImages as initialSiteImages,
    heroSlides as initialHeroSlides,
    apiKeys as initialApiKeys,
    castingApplications as initialCastingApplications,
    fashionDayApplications as initialFashionDayApplications,
    forumThreads as initialForumThreads,
    forumReplies as initialForumReplies,
    articleComments as initialArticleComments,
    recoveryRequests as initialRecoveryRequests,
    bookingRequests as initialBookingRequests,
    contactMessages as initialContactMessages,
    absences as initialAbsences,
    monthlyPayments as initialMonthlyPayments,
    photoshootBriefs as initialPhotoshootBriefs,
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
    faqData as initialFaqData,
    fashionDayReservations as initialFashionDayReservations
} from '../constants/data';
import { articles as initialArticles } from '../constants/magazineData';
import { courseData as initialCourseData } from '../constants/courseData';

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
    heroSlides: HeroSlide[];
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
    faqData: FAQCategory[];
    absences: Absence[];
    monthlyPayments: MonthlyPayment[];
    photoshootBriefs: PhotoshootBrief[];
    fashionDayReservations: FashionDayReservation[];
    adminProfile: AdminProfile;
    gallery: GalleryItem[];
}

// Renamed hook to useRealtimeDB
export const useRealtimeDB = () => {
    const [data, setData] = useState<AppData | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // getInitialData remains the same
    const getInitialData = useCallback((): AppData => ({
        models: initialModels,
        siteConfig: initialSiteConfig,
        contactInfo: initialContactInfo,
        siteImages: initialSiteImages,
        heroSlides: initialHeroSlides,
        apiKeys: initialApiKeys,
        castingApplications: initialCastingApplications,
        fashionDayApplications: initialFashionDayApplications,
        forumThreads: initialForumThreads,
        forumReplies: initialForumReplies,
        articleComments: initialArticleComments,
        recoveryRequests: initialRecoveryRequests,
        bookingRequests: initialBookingRequests,
        contactMessages: initialContactMessages,
        absences: initialAbsences,
        monthlyPayments: initialMonthlyPayments,
        photoshootBriefs: initialPhotoshootBriefs,
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
        faqData: initialFaqData,
        fashionDayReservations: initialFashionDayReservations,
        adminProfile: { id: 'admin', name: 'Admin Principal', username: 'admin', password: 'admin2025', email: 'contact@perfectmodels.ga' },
        gallery: []
    }), []);

    // Helper function to convert Firebase objects to arrays
    const convertToArray = (obj: any): any[] => {
        if (!obj) return [];
        if (Array.isArray(obj)) return obj;
        // Convert object with numeric keys to array
        return Object.values(obj);
    };

    // Helper function to deduplicate array based on ID
    const deduplicateById = (arr: any[]): any[] => {
        const seen = new Set();
        return arr.filter(item => {
            if (!item || !item.id) return true;
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
        });
    };

    // Helper function to deduplicate navLinks by path
    const deduplicateNavLinks = (arr: any[]): any[] => {
        const seen = new Set();
        return arr.filter(item => {
            if (!item || !item.path) return false;
            if (seen.has(item.path)) return false;
            seen.add(item.path);
            return true;
        });
    };

    // Helper function to normalize data structure from Firebase
    const normalizeData = (dbData: any): AppData => {
        // Convert fashionDayEvents and normalize nested arrays
        const fashionDayEvents = deduplicateById(convertToArray(dbData.fashionDayEvents).map((event: any) => ({
            ...event,
            stylists: deduplicateById(convertToArray(event.stylists)),
            partners: deduplicateById(convertToArray(event.partners)),
            artists: deduplicateById(convertToArray(event.artists)),
        })));

        // Convert agencyAchievements and normalize nested items array
        const agencyAchievements = deduplicateById(convertToArray(dbData.agencyAchievements).map((achievement: any) => ({
            ...achievement,
            items: convertToArray(achievement.items),
        })));

        return {
            ...dbData,
            models: deduplicateById(convertToArray(dbData.models)),
            navLinks: deduplicateNavLinks(convertToArray(dbData.navLinks)),
            fashionDayEvents,
            agencyPartners: deduplicateById(convertToArray(dbData.agencyPartners)),
            agencyServices: deduplicateById(convertToArray(dbData.agencyServices)),
            agencyAchievements,
            modelDistinctions: deduplicateById(convertToArray(dbData.modelDistinctions)),
            testimonials: deduplicateById(convertToArray(dbData.testimonials)),
            articles: deduplicateById(convertToArray(dbData.articles)),
            courseData: deduplicateById(convertToArray(dbData.courseData)),
            heroSlides: deduplicateById(convertToArray(dbData.heroSlides)),
            castingApplications: deduplicateById(convertToArray(dbData.castingApplications)),
            fashionDayApplications: deduplicateById(convertToArray(dbData.fashionDayApplications)),
            newsItems: deduplicateById(convertToArray(dbData.newsItems)),
            forumThreads: deduplicateById(convertToArray(dbData.forumThreads)),
            forumReplies: deduplicateById(convertToArray(dbData.forumReplies)),
            articleComments: deduplicateById(convertToArray(dbData.articleComments)),
            recoveryRequests: deduplicateById(convertToArray(dbData.recoveryRequests)),
            bookingRequests: deduplicateById(convertToArray(dbData.bookingRequests)),
            contactMessages: deduplicateById(convertToArray(dbData.contactMessages)),
            juryMembers: deduplicateById(convertToArray(dbData.juryMembers)),
            registrationStaff: deduplicateById(convertToArray(dbData.registrationStaff)),
            faqData: deduplicateById(convertToArray(dbData.faqData)),
            absences: deduplicateById(convertToArray(dbData.absences)),
            monthlyPayments: deduplicateById(convertToArray(dbData.monthlyPayments)),
            photoshootBriefs: deduplicateById(convertToArray(dbData.photoshootBriefs)),
            fashionDayReservations: deduplicateById(convertToArray(dbData.fashionDayReservations)),
            gallery: deduplicateById(convertToArray(dbData.gallery)),
            agencyTimeline: deduplicateById(convertToArray(dbData.agencyTimeline)),
            // Handle nested objects within agencyInfo
            agencyInfo: dbData.agencyInfo ? {
                ...dbData.agencyInfo,
                values: deduplicateById(convertToArray(dbData.agencyInfo.values))
            } : { about: { p1: '', p2: '' }, values: [] },
        };
    };

    useEffect(() => {
        const dbRef = ref(db); // Ref to the root of the database

        const unsubscribe = onValue(dbRef, (snapshot) => {
            const dbData = snapshot.val();
            if (dbData) {
                // If data exists in DB, normalize it (convert objects to arrays)
                const normalizedData = normalizeData(dbData);
                setData(normalizedData);
                logger.log("✅ Realtime DB data loaded successfully");
            } else {
                // If DB is empty, seed it with initial data
                const initial = getInitialData();
                set(dbRef, initial).then(() => {
                    setData(initial);
                    logger.log("✅ Realtime DB seeded with initial data.");
                }).catch(error => {
                    logger.error("Realtime DB seeding failed:", error);
                    // Fallback to local data if seeding fails
                    setData(initial);
                });
            }
            setIsInitialized(true);
        }, (error) => {
            logger.error("Realtime DB read failed:", error);
            // Fallback to local data if read fails
            setData(getInitialData());
            setIsInitialized(true);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [getInitialData]);

    const saveData = useCallback(async (newData: AppData) => {
        try {
            const dbRef = ref(db);
            await set(dbRef, newData);
            setData(newData); // Optimistic update
            logger.log("✅ Data saved to Realtime DB successfully");
        } catch (error) {
            logger.error("Error saving data to Realtime DB:", error);
            throw error;
        }
    }, []);

    // --- CRUD functions for Realtime Database ---

    const addDocument = useCallback(async (path: string, item: any) => {
        try {
            const pathRef = ref(db, path);
            const newDocRef = push(pathRef); // Generate a unique key
            await set(newDocRef, { ...item, id: newDocRef.key });
            return newDocRef.key;
        } catch (error) {
            logger.error(`Error adding document to ${path}: `, error);
            throw error;
        }
    }, []);

    const updateDocument = useCallback(async (path: string, id: string, updates: any) => {
        try {
            const docRef = ref(db, `${path}/${id}`);
            await update(docRef, updates);
        } catch (error) {
            logger.error(`Error updating document ${id} in ${path}: `, error);
            throw error;
        }
    }, []);

    const deleteDocument = useCallback(async (path: string, id: string) => {
        try {
            const docRef = ref(db, `${path}/${id}`);
            await remove(docRef);
        } catch (error) {
            logger.error(`Error deleting document ${id} from ${path}: `, error);
            throw error;
        }
    }, []);

    return { data, saveData, isInitialized, addDocument, updateDocument, deleteDocument };
};

