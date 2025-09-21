
import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue, set } from 'firebase/database';
import { Model, FashionDayEvent, Service, AchievementCategory, ModelDistinction, Testimonial, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication, NewsItem, ForumThread, ForumReply, Article, Module, ArticleComment, RecoveryRequest, JuryMember, RegistrationStaff, BookingRequest, ContactMessage, BeginnerStudent, FAQCategory, Absence, MonthlyPayment, PhotoshootBrief, NavLink, AdminUser, AdminPermission, PaymentSubmission, Album, AccountingCategory, AccountingTransaction, PaymentList, TeamMember, ModelActivity, ModelPerformance, ModelTrackingData, SocialPost, SocialComment, SocialNotification, SocialUser, Campaign, Contact, SecurityCheck, SecurityThreat, SecurityActivityLog } from '../types';
import { syncModelAccessWithData } from '../data/modelAccess';

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
    beginnerStudents as initialBeginnerStudents,
    faqData as initialFaqData,
    accountingCategories as initialAccountingCategories,
    accountingTransactions as initialAccountingTransactions,
    defaultAdminUsers as initialAdminUsers,
    defaultAdminPermissions as initialAdminPermissions,
    defaultAlbums as initialAlbums,
    defaultTeamMembers as initialTeamMembers,
    defaultSocialUsers as initialSocialUsers,
    defaultSocialPosts as initialSocialPosts,
    defaultSocialNotifications as initialSocialNotifications,
    defaultForumThreads as initialDefaultForumThreads
} from '../constants/data';
import { articles as initialArticles } from '../constants/magazineData';
import { courseData as initialCourseData } from '../constants/courseData';
import { beginnerCourseData as initialBeginnerCourseData } from '../constants/beginnerCourseData';

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
    photoshootBriefs: PhotoshootBriefs[];
    accountingCategories: AccountingCategory[];
    accountingTransactions: AccountingTransaction[];
    paymentLists: PaymentList[];
    adminUsers: AdminUser[];
    adminPermissions: AdminPermission[];
    paymentSubmissions: PaymentSubmission[];
    albums: Album[];
    teamMembers: TeamMember[];
    modelActivities: ModelActivity[];
    modelPerformances: ModelPerformance[];
    modelTrackingData: ModelTrackingData[];
    socialPosts: SocialPost[];
    socialNotifications: SocialNotification[];
    socialUsers: SocialUser[];
    campaigns: Campaign[];
    contacts: Contact[];
    securityChecks: SecurityCheck[];
    securityThreats: SecurityThreat[];
    securityActivityLogs: SecurityActivityLog[];
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
        forumThreads: initialDefaultForumThreads,
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
        beginnerCourseData: initialBeginnerCourseData,
        beginnerStudents: initialBeginnerStudents,
        faqData: initialFaqData,
        accountingCategories: initialAccountingCategories,
        accountingTransactions: initialAccountingTransactions,
        paymentLists: [],
        adminUsers: initialAdminUsers,
        adminPermissions: initialAdminPermissions,
        paymentSubmissions: [],
        albums: initialAlbums,
        teamMembers: initialTeamMembers,
        modelActivities: [],
        modelPerformances: [],
        modelTrackingData: [],
        socialPosts: initialSocialPosts,
        socialNotifications: initialSocialNotifications,
        socialUsers: initialSocialUsers,
        campaigns: [],
        contacts: [],
        securityChecks: [],
        securityThreats: [],
        securityActivityLogs: [],
    }), []);
    
    useEffect(() => {
        const dbRef = ref(db, '/');
        
        const unsubscribe = onValue(dbRef, (snapshot) => {
            const dbData = snapshot.val();
            const initialData = getInitialData();
            if (dbData) {
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
                    campaigns: (dbData.campaigns && dbData.campaigns.length > 0) ? dbData.campaigns : initialData.campaigns,
                    contacts: (dbData.contacts && dbData.contacts.length > 0) ? dbData.contacts : initialData.contacts,
                    securityChecks: (dbData.securityChecks && dbData.securityChecks.length > 0) ? dbData.securityChecks : initialData.securityChecks,
                    securityThreats: (dbData.securityThreats && dbData.securityThreats.length > 0) ? dbData.securityThreats : initialData.securityThreats,
                    securityActivityLogs: (dbData.securityActivityLogs && dbData.securityActivityLogs.length > 0) ? dbData.securityActivityLogs : initialData.securityActivityLogs,
                };
                
                mergedData.navLinks = initialData.navLinks;
                
                const syncedData = syncModelAccessWithData(mergedData);
                
                setData(syncedData);
            } else {
                const syncedInitialData = syncModelAccessWithData(initialData);
                set(dbRef, syncedInitialData).then(() => {
                    setData(syncedInitialData);
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

    const incrementModelViewCount = useCallback((modelId: string) => {
        if (!data) return;

        const updatedModels = data.models.map(model => {
            if (model.id === modelId) {
                return {
                    ...model,
                    viewCount: (model.viewCount || 0) + 1
                };
            }
            return model;
        });
        
        const newData = { ...data, models: updatedModels };
        saveData(newData);
    }, [data, saveData]);

    return { data, saveData, isInitialized, incrementModelViewCount };
};
