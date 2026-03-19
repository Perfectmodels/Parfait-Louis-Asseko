import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue, set } from 'firebase/database';
import { Model, FashionDayEvent, Service, AchievementCategory, ModelDistinction, Testimonial, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication, NewsItem, ForumThread, ForumReply, Article, Module, ArticleComment, RecoveryRequest, JuryMember, RegistrationStaff, BookingRequest, ContactMessage, FAQCategory, Absence, MonthlyPayment, PhotoshootBrief, NavLink } from '../types';

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
    faqData as initialFaqData
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
}

// Utility to ensure data from Firebase (which might be an object) is always an array
const ensureArray = <T,>(data: any, fallback: T[] = []): T[] => {
    if (!data) return fallback;
    if (Array.isArray(data)) return data;
    if (typeof data === 'object') return Object.values(data);
    return fallback;
};

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
    }), []);
    
    useEffect(() => {
        const dbRef = ref(db, '/');
        
        const unsubscribe = onValue(dbRef, (snapshot) => {
            const dbData = snapshot.val();
            const initialData = getInitialData();
            if (dbData) {
                const mergedData: AppData = {
                    ...initialData,
                    ...dbData,
                    models: ensureArray(dbData.models, initialData.models),
                    articles: ensureArray(dbData.articles, initialData.articles),
                    courseData: ensureArray(dbData.courseData, initialData.courseData),
                    newsItems: ensureArray(dbData.newsItems, initialData.newsItems),
                    testimonials: ensureArray(dbData.testimonials, initialData.testimonials),
                    agencyServices: ensureArray(dbData.agencyServices, initialData.agencyServices),
                    fashionDayEvents: ensureArray(dbData.fashionDayEvents, initialData.fashionDayEvents),
                    faqData: ensureArray(dbData.faqData, initialData.faqData),
                    juryMembers: ensureArray(dbData.juryMembers, initialData.juryMembers),
                    registrationStaff: ensureArray(dbData.registrationStaff, initialData.registrationStaff),
                    castingApplications: ensureArray(dbData.castingApplications, initialData.castingApplications),
                    fashionDayApplications: ensureArray(dbData.fashionDayApplications, initialData.fashionDayApplications),
                    forumThreads: ensureArray(dbData.forumThreads, initialData.forumThreads),
                    forumReplies: ensureArray(dbData.forumReplies, initialData.forumReplies),
                    articleComments: ensureArray(dbData.articleComments, initialData.articleComments),
                    recoveryRequests: ensureArray(dbData.recoveryRequests, initialData.recoveryRequests),
                    bookingRequests: ensureArray(dbData.bookingRequests, initialData.bookingRequests),
                    contactMessages: ensureArray(dbData.contactMessages, initialData.contactMessages),
                    absences: ensureArray(dbData.absences, initialData.absences),
                    monthlyPayments: ensureArray(dbData.monthlyPayments, initialData.monthlyPayments),
                    photoshootBriefs: ensureArray(dbData.photoshootBriefs, initialData.photoshootBriefs),
                };
                
                mergedData.navLinks = initialData.navLinks;
                setData(mergedData);
            } else {
                set(dbRef, initialData).then(() => {
                    setData(initialData);
                    console.log("Firebase database seeded with initial data.");
                }).catch(error => {
                    console.error("Error seeding database:", error);
                });
            }
            setIsInitialized(true);
        }, (error) => {
            console.error("Firebase read failed: " + error.message);
            setData(getInitialData());
            setIsInitialized(true);
        });

        return () => unsubscribe();
    }, [getInitialData]);

    const saveData = useCallback(async (newData: AppData) => {
        try {
            await set(ref(db, '/'), newData);
            setData(newData);
        } catch (error) {
            console.error("Error saving data to Firebase:", error);
            throw error;
        }
    }, []);

    return { data, saveData, isInitialized };
};