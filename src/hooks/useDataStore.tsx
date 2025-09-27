import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue, set } from 'firebase/database';

import * as initialDataImports from '../constants/data';
import { articles as initialArticles } from '../constants/magazineData';
import { courseData as initialCourseData } from '../constants/courseData';
import { beginnerCourseData as initialBeginnerCourseData } from '../components/beginnerCourseData';

export interface AppData {
    // Données de base
    models: any[];
    beginnerStudents: any[];
    juryMembers: any[];
    registrationStaff: any[];
    
    // Applications et candidatures
    castingApplications: any[];
    fashionDayApplications: any[];
    recoveryRequests: any[];
    bookingRequests: any[];
    contactMessages: any[];
    
    // Contenu et médias
    articles: any[];
    newsItems: any[];
    testimonials: any[];
    agencyServices: any[];
    fashionDayEvents: any[];
    faqData: any[];
    siteImages: Record<string, string>;
    
    // Configuration du site
    siteConfig: any;
    navLinks: any[];
    socialLinks: any;
    contactInfo: any;
    agencyInfo: any;
    modelDistinctions: any[];
    agencyTimeline: any[];
    agencyAchievements: any[];
    agencyPartners: any[];
    
    // Système de messagerie
    internalMessages: any[];
    conversations: any[];
    
    // Système de paiement
    paymentSubmissions: any[];
    accountingTransactions: any[];
    monthlyPayments: any[];
    
    // Gestion des médias
    albums: any[];
    teamMembers: any[];
    
    // Rapports et notifications
    financialReports: any[];
    notifications: any[];
    
    // Gestion du contenu
    pageContents: any[];
    contentPages: any[];
    
    // Gestion des utilisateurs
    users: any[];
    technicalSettings: any[];
    
    // Système d'emails
    emailTemplates: any[];
    emailCampaigns: any[];
    emailStats: any;
    
    // Gestion des absences et sessions
    absenceRequests: any[];
    photoSessions: any[];
    castingSessions: any[];
    
    // Données de cours
    courseData: any[];
    beginnerCourseData: any[];
    
    // Clés API
    apiKeys: any;
    
    // Forum et commentaires
    forumThreads: any[];
    forumReplies: any[];
    articleComments: any[];
    
    // Autres
    absences: any[];
    photoshootBriefs: any[];
}

export const useDataStore = (initialData: AppData | null = null) => {
    const [data, setData] = useState<AppData | null>(initialData);
    const [isInitialized, setIsInitialized] = useState(!!initialData);

    const handleError = (context: string, error: any) => console.error(`${context} error:`, error);

    // === Fonction pure pour merge des tableaux ===
    const mergeArrayData = <T,>(dbArray: T[] | undefined, initialArray: T[]) =>
        dbArray && dbArray.length > 0 ? dbArray : initialArray;

    // === Fonction pure pour les données initiales ===
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

    const seedDatabase = useCallback(async (data: AppData) => {
        try {
            await set(ref(db, '/'), data);
            setData(data);
            console.log("Firebase database seeded with initial data.");
        } catch (error) {
            handleError("Seeding database", error);
        }
    }, []);

    useEffect(() => {
        if (isInitialized) return;

        // Timeout de sécurité pour éviter que les pages restent bloquées
        const timeoutId = setTimeout(() => {
            if (!isInitialized) {
                console.warn('Firebase timeout - using fallback data');
                setData(getInitialData());
                setIsInitialized(true);
            }
        }, 5000); // 5 secondes de timeout

        const dbRef = ref(db, '/');

        const unsubscribe = onValue(
            dbRef,
            (snapshot) => {
                clearTimeout(timeoutId);
                const dbData: Partial<AppData> | null = snapshot.val();

                if (dbData) {
                    // === Données fusionnées ===
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

                    setData(mergedData);
                } else {
                    seedDatabase(getInitialData());
                }

                setIsInitialized(true);
            },
            (error) => {
                clearTimeout(timeoutId);
                handleError("Firebase read", error);
                console.warn('Firebase error - using fallback data');
                setData(getInitialData());
                setIsInitialized(true);
            }
        );

        return () => {
            clearTimeout(timeoutId);
            unsubscribe();
        };
    }, [seedDatabase, isInitialized]);

    const saveData = useCallback(async (newData: AppData) => {
        try {
            await set(ref(db, '/'), newData);
            setData(newData); // immediate UI feedback
        } catch (error) {
            handleError("Saving data to Firebase", error);
            throw error;
        }
    }, []);

    return { data, saveData, isInitialized };
};