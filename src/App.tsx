import React, { useEffect, lazy, Suspense } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { DataProvider, useData } from './contexts/DataContext';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { ChatIntegration } from './components/ChatIntegration';
import Layout from './components/icons/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';
import { registerServiceWorker } from './utils/pwa';

// Lazy-loaded Pages
const Home = lazy(() => import('./pages/Home'));
const Agency = lazy(() => import('./pages/Agency'));
const Models = lazy(() => import('./pages/Models'));
const ModelDetail = lazy(() => import('./pages/ModelDetail'));
const FashionDay = lazy(() => import('./pages/FashionDay'));
const Magazine = lazy(() => import('./pages/Magazine'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Casting = lazy(() => import('./pages/Casting'));
const CastingForm = lazy(() => import('./pages/CastingForm'));
const FashionDayApplicationForm = lazy(() => import('./pages/FashionDayApplicationForm'));
const Login = lazy(() => import('./pages/Login'));
const Activity = lazy(() => import('./pages/Activity')); // Renamed Formations
const ChapterDetail = lazy(() => import('./pages/ChapterDetail'));
const ModelDashboard = lazy(() => import('./pages/ModelDashboard')); // Profil
const ClassroomForum = lazy(() => import('./pages/ClassroomForum'));
const AdminRoutes = lazy(() => import('./pages/AdminRoutes'));
const ForumThread = lazy(() => import('./pages/ForumThread'));
const NotificationsSettings = lazy(() => import('./pages/NotificationsSettings'));
const International = lazy(() => import('./pages/International'));
const Motivation = lazy(() => import('./pages/Motivation'));
const Application = lazy(() => import('./pages/Application'));
const Gallery = lazy(() => import('./pages/Gallery'));
// FIX: Removed Beginner Classroom pages as the feature has been deprecated.

// Role-specific pages
const JuryCasting = lazy(() => import('./pages/JuryCasting'));
const RegistrationCasting = lazy(() => import('./pages/RegistrationCasting'));

// Static Pages
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const NotFound = lazy(() => import('./pages/NotFound'));


const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const LoadingFallback: React.FC = () => (
    <div className="w-full h-screen flex items-center justify-center bg-pm-dark">
        <p className="text-pm-gold text-2xl font-playfair animate-pulse">Chargement...</p>
    </div>
);

const pageVariants = {
    initial: {
        opacity: 0,
    },
    in: {
        opacity: 1,
    },
    out: {
        opacity: 0,
    }
};

const pageTransition = {
    type: "tween" as const,
    ease: "easeInOut" as const,
    duration: 0.5
};


const AnimatedRoutes: React.FC = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
            >
                <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/agence" element={<Agency />} />
                    <Route path="/mannequins" element={<Models />} />
                    <Route path="/mannequins/:id" element={<ModelDetail />} />
                    <Route path="/fashion-day" element={<FashionDay />} />
                    <Route path="/magazine" element={<Magazine />} />
                    <Route path="/magazine/:slug" element={<ArticleDetail />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:slug" element={<ServiceDetail />} />
                    <Route path="/casting" element={<Casting />} />
                    <Route path="/casting-formulaire" element={<CastingForm />} />
                    <Route path="/fashion-day-application" element={<FashionDayApplicationForm />} />
                    <Route path="/international" element={<International />} />
                    <Route path="/motivation" element={<Motivation />} />
                    <Route path="/application" element={<Application />} />
                    <Route path="/galerie" element={<Gallery />} />
                    <Route path="/notifications-settings" element={<NotificationsSettings />} />
                                        <Route path="/login" element={<Login />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-use" element={<TermsOfUse />} />

                    {/* Protected Routes */}
                    <Route path="/formations" element={<ProtectedRoute role="student"><Activity /></ProtectedRoute>} />
                    <Route path="/formations/forum" element={<ProtectedRoute role="student"><ClassroomForum /></ProtectedRoute>} />
                    <Route path="/formations/forum/:threadId" element={<ProtectedRoute role="student"><ForumThread /></ProtectedRoute>} />
                    <Route path="/formations/:moduleSlug/:chapterSlug" element={<ProtectedRoute role="student"><ChapterDetail /></ProtectedRoute>} />
                    <Route path="/profil" element={<ProtectedRoute role="student"><ModelDashboard /></ProtectedRoute>} />
                    
                    {/* FIX: Removed Beginner Classroom routes as the feature has been deprecated. */}
                    
                    <Route path="/jury/casting" element={<ProtectedRoute role="jury"><JuryCasting /></ProtectedRoute>} />
                    <Route path="/enregistrement/casting" element={<ProtectedRoute role="registration"><RegistrationCasting /></ProtectedRoute>} />
                    
                    <Route path="/admin/*" element={<AdminRoutes />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
};

const AppContent: React.FC = () => {
    const location = useLocation();
    const { data } = useData();

    // Notification logic for browser tab title
    useEffect(() => {
        const originalTitle = "Perfect Models Management";
        if (data && location.pathname.startsWith('/admin')) {
            const newCastingApps = data.castingApplications?.filter(app => app.status === 'Nouveau').length || 0;
            const newFashionDayApps = data.fashionDayApplications?.filter(app => app.status === 'Nouveau').length || 0;
            const newRecoveryRequests = data.recoveryRequests?.filter(req => req.status === 'Nouveau').length || 0;
            const newBookingRequests = data.bookingRequests?.filter(req => req.status === 'Nouveau').length || 0;

            const totalNotifications = newCastingApps + newFashionDayApps + newRecoveryRequests + newBookingRequests;

            if (totalNotifications > 0) {
                document.title = `(${totalNotifications}) Admin | ${originalTitle}`;
            } else {
                document.title = `Admin | ${originalTitle}`;
            }
        } else {
            // Restore title if not on an admin page (this will be handled by SEO component for other pages)
            if (document.title.startsWith('(') || document.title.startsWith('Admin |')) {
                 document.title = originalTitle;
            }
        }
        
        return () => {
            document.title = originalTitle;
        };
    }, [location.pathname, data]);


    return (
        <Layout>
            <Suspense fallback={<LoadingFallback />}>
                <AnimatedRoutes />
            </Suspense>
            <PWAInstallPrompt />
            <OfflineIndicator />
        </Layout>
    );
}

const App: React.FC = () => {

  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <AuthProvider>
      <DataProvider>
        <ChatProvider>
          <ChatIntegration>
            <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <ScrollToTop />
              <AppContent />
            </HashRouter>
          </ChatIntegration>
        </ChatProvider>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;