import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue, set } from 'firebase/database';
// FIX: Added NavLink to the import from types.ts to use the centralized definition.
import { Model, FashionDayEvent, Service, AchievementCategory, ModelDistinction, Testimonial, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication, NewsItem, ForumThread, ForumReply, Article, Module, ArticleComment, RecoveryRequest, JuryMember, RegistrationStaff, BookingRequest, ContactMessage, BeginnerStudent, FAQCategory, Absence, MonthlyPayment, PhotoshootBrief, NavLink, AdminUser, InternalMessage, GalleryItem } from '../types';

// Import initial data to seed the database if it's empty
import { 
    models as initialModels, 
    siteConfig as initialSiteConfig, 
    contactInfo as initialContactInfo, 
    siteImages as initialSiteImages, 
    apiKeys as initialApiKeys, 
    adminUsers as initialAdminUsers,
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
    beginnerStudents as initialBeginnerStudents,
    faqData as initialFaqData
} from '../constants/data';
import { articles as initialArticles } from '../constants/magazineData';
import { courseData as initialCourseData } from '../constants/courseData';
// FIX: Import beginnerCourseData directly to resolve module path error.
import { beginnerCourseData as initialBeginnerCourseData } from '../components/beginnerCourseData';

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
    beginnerCourseData: Module[];
    beginnerStudents: BeginnerStudent[];
    faqData: FAQCategory[];
    absences: Absence[];
    monthlyPayments: MonthlyPayment[];
    photoshootBriefs: PhotoshootBrief[];
    adminUsers: AdminUser[];
    internalMessages?: InternalMessage[];
    gallery?: GalleryItem[];
}

const deepCleanUndefined = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map((v) => deepCleanUndefined(v));
  }
  if (value && typeof value === 'object') {
    const result: any = {};
    Object.keys(value).forEach((k) => {
      const cleaned = deepCleanUndefined((value as any)[k]);
      if (cleaned !== undefined) {
        result[k] = cleaned;
      }
    });
    return result;
  }
  return value === undefined ? null : value;
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
        adminUsers: initialAdminUsers,
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
        faqData: initialFaqData,
    }), []);
    
    useEffect(() => {
        const dbRef = ref(db, '/');
        
        const unsubscribe = onValue(dbRef, (snapshot) => {
            const dbData = snapshot.val();
            const initialData = getInitialData();
            if (dbData) {
                // Defensive merge: prevent critical data arrays from being overwritten by empty/null values from DB
                const mergedData = {
                    ...initialData,
                    ...dbData,
                    models: (dbData.models && dbData.models.length > 0) ? dbData.models : initialData.models,
                    articles: (dbData.articles && dbData.articles.length > 0) ? dbData.articles : initialData.articles,
                    courseData: (dbData.courseData && dbData.courseData.length > 0) ? dbData.courseData : initialData.courseData,
                    beginnerCourseData: (dbData.beginnerCourseData && dbData.beginnerCourseData.length > 0) ? dbData.beginnerCourseData : initialData.beginnerCourseData,
                    newsItems: (dbData.newsItems && dbData.newsItems.length > 0) ? dbData.newsItems : initialData.newsItems,
                    testimonials: (dbData.testimonials && dbData.testimonials.length > 0) ? dbData.testimonials : initialData.testimonials,
                    agencyServices: (dbData.agencyServices && dbData.agencyServices.length > 0) ? dbData.agencyServices : initialData.agencyServices,
                    fashionDayEvents: (dbData.fashionDayEvents && dbData.fashionDayEvents.length > 0) ? dbData.fashionDayEvents : initialData.fashionDayEvents,
                    faqData: (dbData.faqData && dbData.faqData.length > 0) ? dbData.faqData : initialData.faqData,
                    adminUsers: (dbData.adminUsers && dbData.adminUsers.length > 0) ? dbData.adminUsers : (initialData.adminUsers || []),
                    internalMessages: Array.isArray(dbData.internalMessages) ? dbData.internalMessages : (initialData.internalMessages || []),
                    gallery: Array.isArray(dbData.gallery) ? dbData.gallery : (initialData.gallery || []),
                };
                
                // Always use navLinks from code to ensure route integrity
                mergedData.navLinks = initialData.navLinks;
                setData(mergedData);
            } else {
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
            console.error("Firebase read failed: " + error.message);
            // Fallback to local data if Firebase fails
            setData(getInitialData());
            setIsInitialized(true);
        });

        // Detach the listener when the component unmounts
        return () => unsubscribe();
    }, [getInitialData]);

    const saveData = useCallback(async (newData: AppData) => {
        try {
            const sanitized = deepCleanUndefined(newData);
            await set(ref(db, '/'), sanitized);
            // The local state will be updated by the 'on' listener,
            // but we can set it here for immediate UI feedback if desired.
            setData(sanitized);
        } catch (error) {
            console.error("Error saving data to Firebase:", error);
            throw error; // Re-throw to be caught by the caller
        }
    }, []);

    return { data, saveData, isInitialized };
};