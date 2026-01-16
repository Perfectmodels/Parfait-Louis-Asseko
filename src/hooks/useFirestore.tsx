import { useState, useEffect, useCallback } from 'react';
import { db } from '../firestoreConfig';
import { collection, getDocs, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { Model, FashionDayEvent, Service, AchievementCategory, ModelDistinction, Testimonial, ContactInfo, SiteImages, Partner, ApiKeys, CastingApplication, FashionDayApplication, NewsItem, ForumThread, ForumReply, Article, Module, ArticleComment, RecoveryRequest, JuryMember, RegistrationStaff, BookingRequest, ContactMessage, FAQCategory, Absence, MonthlyPayment, PhotoshootBrief, NavLink, HeroSlide, FashionDayReservation, AdminProfile } from '../types';

// Import initial data to seed the database if it's empty
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
}

export const useFirestore = () => {
    const [data, setData] = useState<AppData | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

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
    }), []);

    // Fonction pour charger une collection
    const loadCollection = async <T,>(collectionName: string, fallback: T[]): Promise<T[]> => {
        try {
            const querySnapshot = await getDocs(collection(db, collectionName));
            if (querySnapshot.empty) return fallback;
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        } catch (error) {
            console.error(`Error loading ${collectionName}:`, error);
            return fallback;
        }
    };

    // Fonction pour charger un document de configuration
    const loadConfig = async <T,>(configName: string, fallback: T): Promise<T> => {
        try {
            const docRef = doc(db, 'config', configName);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() as T : fallback;
        } catch (error) {
            console.error(`Error loading config ${configName}:`, error);
            return fallback;
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const initialData = getInitialData();

                // Charger toutes les collections en parallèle
                const [
                    models,
                    articles,
                    courseData,
                    fashionDayEvents,
                    testimonials,
                    newsItems,
                    agencyServices,
                    castingApplications,
                    fashionDayApplications,
                    forumThreads,
                    forumReplies,
                    articleComments,
                    recoveryRequests,
                    bookingRequests,
                    contactMessages,
                    absences,
                    monthlyPayments,
                    photoshootBriefs,
                    juryMembers,
                    registrationStaff,
                    faqData,
                    modelDistinctions,
                    agencyAchievements,
                    agencyPartners,
                    agencyTimeline,
                    navLinks,
                    heroSlides,
                    siteConfig,
                    contactInfo,
                    siteImages,
                    socialLinks,
                    agencyInfo,
                    apiKeys,
                    fashionDayReservations,
                    adminProfile
                ] = await Promise.all([
                    loadCollection<Model>('models', initialData.models),
                    loadCollection<Article>('articles', initialData.articles),
                    loadCollection<Module>('courseData', initialData.courseData),
                    loadCollection<FashionDayEvent>('fashionDayEvents', initialData.fashionDayEvents),
                    loadCollection<Testimonial>('testimonials', initialData.testimonials),
                    loadCollection<NewsItem>('newsItems', initialData.newsItems),
                    loadCollection<Service>('agencyServices', initialData.agencyServices),
                    loadCollection<CastingApplication>('castingApplications', initialData.castingApplications),
                    loadCollection<FashionDayApplication>('fashionDayApplications', initialData.fashionDayApplications),
                    loadCollection<ForumThread>('forumThreads', initialData.forumThreads),
                    loadCollection<ForumReply>('forumReplies', initialData.forumReplies),
                    loadCollection<ArticleComment>('articleComments', initialData.articleComments),
                    loadCollection<RecoveryRequest>('recoveryRequests', initialData.recoveryRequests),
                    loadCollection<BookingRequest>('bookingRequests', initialData.bookingRequests),
                    loadCollection<ContactMessage>('contactMessages', initialData.contactMessages),
                    loadCollection<Absence>('absences', initialData.absences),
                    loadCollection<MonthlyPayment>('monthlyPayments', initialData.monthlyPayments),
                    loadCollection<PhotoshootBrief>('photoshootBriefs', initialData.photoshootBriefs),
                    loadCollection<JuryMember>('juryMembers', initialData.juryMembers),
                    loadCollection<RegistrationStaff>('registrationStaff', initialData.registrationStaff),
                    loadCollection<FAQCategory>('faqData', initialData.faqData),
                    loadCollection<ModelDistinction>('modelDistinctions', initialData.modelDistinctions),
                    loadCollection<AchievementCategory>('agencyAchievements', initialData.agencyAchievements),
                    loadCollection<Partner>('agencyPartners', initialData.agencyPartners),
                    loadCollection('agencyTimeline', initialData.agencyTimeline),
                    loadCollection<NavLink>('navLinks', initialData.navLinks),
                    loadCollection<HeroSlide>('heroSlides', initialData.heroSlides),
                    loadConfig('siteConfig', initialData.siteConfig),
                    loadConfig('contactInfo', initialData.contactInfo),
                    loadConfig('siteImages', initialData.siteImages),
                    loadConfig('socialLinks', initialData.socialLinks),
                    loadConfig('agencyInfo', initialData.agencyInfo),

                    loadConfig('apiKeys', initialData.apiKeys),
                    loadCollection<FashionDayReservation>('fashionDayReservations', initialData.fashionDayReservations),
                    loadConfig('adminProfile', initialData.adminProfile)
                ]);

                const loadedData: AppData = {
                    models: models.length > 0 ? models : initialData.models,
                    articles: articles.length > 0 ? articles : initialData.articles,
                    courseData: courseData.length > 0 ? courseData : initialData.courseData,
                    fashionDayEvents: fashionDayEvents.length > 0 ? fashionDayEvents : initialData.fashionDayEvents,
                    testimonials: testimonials.length > 0 ? testimonials : initialData.testimonials,
                    newsItems: newsItems.length > 0 ? newsItems : initialData.newsItems,
                    agencyServices: agencyServices.length > 0 ? agencyServices : initialData.agencyServices,
                    castingApplications,
                    fashionDayApplications,
                    forumThreads,
                    forumReplies,
                    articleComments,
                    recoveryRequests,
                    bookingRequests,
                    contactMessages,
                    absences,
                    monthlyPayments,
                    photoshootBriefs,
                    juryMembers,
                    registrationStaff,
                    faqData: faqData.length > 0 ? faqData : initialData.faqData,
                    modelDistinctions,
                    agencyAchievements,
                    agencyPartners,
                    agencyTimeline,
                    navLinks: initialData.navLinks, // Always use code navLinks
                    heroSlides: heroSlides.length > 0 ? heroSlides : initialData.heroSlides,
                    siteConfig,
                    contactInfo,
                    siteImages,
                    socialLinks,
                    agencyInfo,

                    apiKeys,
                    fashionDayReservations,
                    adminProfile
                };

                setData(loadedData);
                setIsInitialized(true);
                console.log("✅ Firestore data loaded successfully");
            } catch (error) {
                console.error("Firestore read failed:", error);
                // Fallback to local data if Firestore fails
                setData(getInitialData());
                setIsInitialized(true);
            }
        };

        loadData();
    }, [getInitialData]);

    const saveData = useCallback(async (newData: AppData) => {
        try {
            // Sauvegarder les collections
            const savePromises = [];

            // Pour chaque collection de type array
            const arrayCollections = [
                'models', 'articles', 'courseData', 'fashionDayEvents', 'testimonials',
                'newsItems', 'agencyServices', 'castingApplications', 'fashionDayApplications',
                'forumThreads', 'forumReplies', 'articleComments', 'recoveryRequests',
                'bookingRequests', 'contactMessages', 'absences', 'monthlyPayments',
                'photoshootBriefs', 'juryMembers', 'registrationStaff', 'faqData',
                'modelDistinctions', 'agencyAchievements', 'agencyPartners', 'agencyTimeline',
                'navLinks', 'heroSlides', 'fashionDayReservations'
            ];

            for (const collName of arrayCollections) {
                const collData = newData[collName as keyof AppData];
                if (Array.isArray(collData)) {
                    for (const item of collData) {
                        const docId = (item as any).id || (item as any).slug || `doc_${Date.now()}`;
                        savePromises.push(setDoc(doc(db, collName, docId), item));
                    }
                }
            }

            // Pour les configurations
            const configFields = ['siteConfig', 'contactInfo', 'siteImages', 'socialLinks', 'agencyInfo', 'apiKeys', 'adminProfile'];
            for (const configName of configFields) {
                savePromises.push(setDoc(doc(db, 'config', configName), newData[configName as keyof AppData]));
            }

            await Promise.all(savePromises);
            setData(newData);
            console.log("✅ Data saved to Firestore successfully");
        } catch (error) {
            console.error("Error saving data to Firestore:", error);
            throw error;
        }
    }, []);

    // --- NOUVELLES FONCTIONS CRUD ATOMIQUES (Renforcement Backend) ---

    // Ajouter un document à une collection
    const addDocument = useCallback(async (collectionName: string, item: any) => {
        try {
            // Générer un ID si non présent
            const docId = item.id || item.slug || doc(collection(db, collectionName)).id;
            const itemWithId = { ...item, id: docId };

            await setDoc(doc(db, collectionName, docId), itemWithId);

            // Mise à jour optimiste de l'état local
            setData(prevData => {
                if (!prevData) return null;
                const prevCollection = prevData[collectionName as keyof AppData] as any[];
                if (Array.isArray(prevCollection)) {
                    return {
                        ...prevData,
                        [collectionName]: [...prevCollection, itemWithId]
                    };
                }
                return prevData;
            });

            return docId;
        } catch (error) {
            console.error(`Error adding document to ${collectionName}:`, error);
            throw error;
        }
    }, []);

    // Mettre à jour un document existant
    const updateDocument = useCallback(async (collectionName: string, id: string, updates: any) => {
        try {
            await setDoc(doc(db, collectionName, id), updates, { merge: true });

            // Mise à jour optimiste
            setData(prevData => {
                if (!prevData) return null;
                const prevCollection = prevData[collectionName as keyof AppData] as any[];
                if (Array.isArray(prevCollection)) {
                    return {
                        ...prevData,
                        [collectionName]: prevCollection.map(item => item.id === id || item.slug === id ? { ...item, ...updates } : item)
                    };
                }
                // Cas spécial pour les configs (single docs)
                if (collectionName === 'config') {
                    // Difficile de gérer le "config" générique ici sans connaître la clé exacte dans AppData
                    // On suppose que l'utilisateur recharge ou utilise saveData pour les configs pour l'instant
                    return prevData;
                }
                return prevData;
            });
        } catch (error) {
            console.error(`Error updating document ${id} in ${collectionName}:`, error);
            throw error;
        }
    }, []);

    // Supprimer un document
    const deleteDocument = useCallback(async (collectionName: string, id: string) => {
        try {
            await deleteDoc(doc(db, collectionName, id));

            // Mise à jour optimiste
            setData(prevData => {
                if (!prevData) return null;
                const prevCollection = prevData[collectionName as keyof AppData] as any[];
                if (Array.isArray(prevCollection)) {
                    return {
                        ...prevData,
                        [collectionName]: prevCollection.filter(item => item.id !== id && item.slug !== id)
                    };
                }
                return prevData;
            });
        } catch (error) {
            console.error(`Error deleting document ${id} from ${collectionName}:`, error);
            throw error;
        }
    }, []);

    return { data, saveData, isInitialized, addDocument, updateDocument, deleteDocument };
};
