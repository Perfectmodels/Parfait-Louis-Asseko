import { db } from '../firebaseConfig';
import { ref, get } from 'firebase/database';
import { AppData } from '../hooks/useDataStore';

import * as initialDataImports from '../constants/data';
import { articles as initialArticles } from '../constants/magazineData';
import { courseData as initialCourseData } from '../constants/courseData';
import { beginnerCourseData as initialBeginnerCourseData } from '../components/beginnerCourseData';

// Fonction pour merger des tableaux
const mergeArrayData = <T,>(dbArray: T[] | undefined, initialArray: T[]): T[] =>
    dbArray && Array.isArray(dbArray) && dbArray.length > 0 ? dbArray : initialArray;

// Fonction pour obtenir les données initiales
const getInitialData = (): AppData => ({
    models: initialDataImports.models,
    siteConfig: initialDataImports.siteConfig,
    contactInfo: initialDataImports.contactInfo,
    siteImages: initialDataImports.siteImages as any,
    apiKeys: initialDataImports.apiKeys,
    castingApplications: initialDataImports.castingApplications,
    fashionDayApplications: initialDataImports.fashionDayApplications,
    forumThreads: initialDataImports.forumThreads,
    forumReplies: initialDataImports.forumReplies,
    articleComments: initialDataImports.articleComments,
    recoveryRequests: initialDataImports.recoveryRequests,
    bookingRequests: initialDataImports.bookingRequests,
    contactMessages: initialDataImports.contactMessages,
    absences: initialDataImports.absences,
    monthlyPayments: initialDataImports.monthlyPayments,
    photoshootBriefs: initialDataImports.photoshootBriefs,
    newsItems: initialDataImports.newsItems,
    navLinks: initialDataImports.navLinks,
    fashionDayEvents: initialDataImports.fashionDayEvents,
    socialLinks: initialDataImports.socialLinks,
    agencyTimeline: initialDataImports.agencyTimeline,
    agencyInfo: initialDataImports.agencyInfo,
    modelDistinctions: initialDataImports.modelDistinctions,
    agencyServices: initialDataImports.agencyServices,
    agencyAchievements: initialDataImports.agencyAchievements,
    agencyPartners: initialDataImports.agencyPartners,
    testimonials: initialDataImports.testimonials,
    articles: initialArticles,
    courseData: initialCourseData,
    juryMembers: initialDataImports.juryMembers,
    registrationStaff: initialDataImports.registrationStaff,
    beginnerCourseData: initialBeginnerCourseData,
    beginnerStudents: initialDataImports.beginnerStudents,
    faqData: initialDataImports.faqData,
    emailTemplates: [],
    emailCampaigns: [],
    emailStats: {
        totalSent: 0, totalDelivered: 0, totalOpened: 0, totalClicked: 0,
        totalBounced: 0, totalBlocked: 0, openRate: 0, clickRate: 0, bounceRate: 0
    },
    absenceRequests: [],
    photoSessions: [],
    paymentSubmissions: [],
    pageContents: [],
    internalMessages: initialDataImports.internalMessages,
    castingSessions: [],
    conversations: [],
    accountingTransactions: [],
    albums: [],
    teamMembers: [],
    financialReports: [],
    notifications: [],
    contentPages: [],
    users: [],
    technicalSettings: []
});


export const getFirebaseData = async (): Promise<AppData> => {
    try {
        const dbRef = ref(db, '/');
        const snapshot = await get(dbRef);
        const dbData: Partial<AppData> | null = snapshot.val();

        if (dbData) {
            const initialData = getInitialData();
            const mergedData: AppData = {
                ...initialData,
                ...dbData,
                models: mergeArrayData((dbData as any).models, initialData.models),
                articles: mergeArrayData((dbData as any).articles, initialData.articles),
                courseData: mergeArrayData((dbData as any).courseData, initialData.courseData),
                beginnerCourseData: mergeArrayData((dbData as any).beginnerCourseData, initialData.beginnerCourseData),
                newsItems: mergeArrayData((dbData as any).newsItems, initialData.newsItems),
                testimonials: mergeArrayData((dbData as any).testimonials, initialData.testimonials),
                agencyServices: mergeArrayData((dbData as any).agencyServices, initialData.agencyServices),
                fashionDayEvents: mergeArrayData((dbData as any).fashionDayEvents, initialData.fashionDayEvents),
                faqData: mergeArrayData((dbData as any).faqData, initialData.faqData),
                navLinks: initialData.navLinks
            };
            return mergedData;
        }
        
        // Si aucune donnée n'est dans la base de données, retournez les données initiales
        return getInitialData();

    } catch (error) {
        console.error("Firebase server-side read error:", error);
        console.warn('Firebase error - using fallback data on server');
        return getInitialData(); // Retourner les données initiales en cas d'erreur
    }
};