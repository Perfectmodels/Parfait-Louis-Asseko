import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue, set } from 'firebase/database';
import {
    Model, FashionDayEvent, Service, AchievementCategory, ModelDistinction,
    Testimonial, ContactInfo, SiteImages, Partner, ApiKeys,
    CastingApplication, FashionDayApplication, NewsItem, ForumThread,
    ForumReply, Article, Module, ArticleComment, RecoveryRequest,
    JuryMember, RegistrationStaff, BookingRequest, ContactMessage,
    BeginnerStudent, FAQCategory, Absence, MonthlyPayment, PhotoshootBrief,
    NavLink, EmailTemplate, EmailCampaign, EmailStats
} from '../types';

import * as initialDataImports from '../constants/data';
import { articles as initialArticles } from '../constants/magazineData';
import { courseData as initialCourseData } from '../constants/courseData';
import { beginnerCourseData as initialBeginnerCourseData } from '../components/beginnerCourseData';

export interface AppData { /* identique à ta version précédente */ }

export const useDataStore = () => {
    const [data, setData] = useState<AppData | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const handleError = (context: string, error: any) => console.error(`${context} error:`, error);

    // === Fonction pure pour merge des tableaux ===
    const mergeArrayData = <T,>(dbArray: T[] | undefined, initialArray: T[]) =>
        dbArray && dbArray.length > 0 ? dbArray : initialArray;

    // === Memoized initial data ===
    const initialData: AppData = useMemo(() => ({
        models: initialDataImports.models,
        siteConfig: initialDataImports.siteConfig,
        contactInfo: initialDataImports.contactInfo,
        siteImages: initialDataImports.siteImages,
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
        }
    }), []);

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
        const dbRef = ref(db, '/');

        const unsubscribe = onValue(
            dbRef,
            (snapshot) => {
                const dbData: Partial<AppData> | null = snapshot.val();

                if (dbData) {
                    // === Memoized merged data ===
                    const mergedData: AppData = useMemo(() => ({
                        ...initialData,
                        ...dbData,
                        models: mergeArrayData(dbData.models, initialData.models),
                        articles: mergeArrayData(dbData.articles, initialData.articles),
                        courseData: mergeArrayData(dbData.courseData, initialData.courseData),
                        beginnerCourseData: mergeArrayData(dbData.beginnerCourseData, initialData.beginnerCourseData),
                        newsItems: mergeArrayData(dbData.newsItems, initialData.newsItems),
                        testimonials: mergeArrayData(dbData.testimonials, initialData.testimonials),
                        agencyServices: mergeArrayData(dbData.agencyServices, initialData.agencyServices),
                        fashionDayEvents: mergeArrayData(dbData.fashionDayEvents, initialData.fashionDayEvents),
                        faqData: mergeArrayData(dbData.faqData, initialData.faqData),
                        navLinks: initialData.navLinks
                    }), [dbData, initialData]);

                    setData(mergedData);
                } else {
                    seedDatabase(initialData);
                }

                setIsInitialized(true);
            },
            (error) => {
                handleError("Firebase read", error);
                setData(initialData);
                setIsInitialized(true);
            }
        );

        return () => unsubscribe();
    }, [initialData, seedDatabase]);

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
