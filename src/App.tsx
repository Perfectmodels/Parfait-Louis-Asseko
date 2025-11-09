
import React, { useEffect, lazy, Suspense } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { DataProvider, useData } from './contexts/DataContext';
import Layout from './components/icons/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AIAssistantIcon from './components/AIAssistantIcon';

// Lazy-loaded Pages
const Home = lazy(() => import('./pages/Home'));
const Agency = lazy(() => import('./pages/Agency'));
const Models = lazy(() => import('./pages/Models'));
const ModelDetail = lazy(() => import('./pages/ModelDetail'));
const FashionDay = lazy(() => import('./pages/FashionDay'));
const Magazine = lazy(() => import('./pages/Magazine'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Casting = lazy(() => import('./pages/Casting'));
const CastingForm = lazy(() => import('./pages/CastingForm'));
const FashionDayApplicationForm = lazy(() => import('./pages/FashionDayApplicationForm'));
const Login = lazy(() => import('./pages/Login'));
// Admin - Apprentissage
const Activity = lazy(() => import('./pages/admin/Activity'));
const ChapterDetail = lazy(() => import('./pages/admin/ChapterDetail'));
const ModelDashboard = lazy(() => import('./pages/admin/ModelDashboard'));
const ClassroomForum = lazy(() => import('./pages/admin/ClassroomForum'));
const ForumThread = lazy(() => import('./pages/admin/ForumThread'));
const BeginnerClassroom = lazy(() => import('./pages/admin/BeginnerClassroom'));
const BeginnerChapterDetail = lazy(() => import('./pages/admin/BeginnerChapterDetail'));

// Admin - IA
const ImageGeneration = lazy(() => import('./pages/admin/ai/ImageGeneration'));
const ImageAnalysis = lazy(() => import('./pages/admin/ai/ImageAnalysis'));

// Chat
const Chat = lazy(() => import('./pages/Chat'));
const LiveChat = lazy(() => import('./pages/LiveChat'));


// Admin Pages
const Admin = lazy(() => import('./pages/admin/Admin'));
const AdminAgency = lazy(() => import('./pages/admin/AdminAgency'));
const AdminCasting = lazy(() => import('./pages/admin/AdminCasting'));
const AdminCastingResults = lazy(() => import('./pages/admin/AdminCastingResults'));
const AdminClassroom = lazy(() => import('./pages/admin/AdminClassroom'));
const AdminClassroomProgress = lazy(() => import('./pages/admin/AdminClassroomProgress'));
const AdminFashionDay = lazy(() => import('./pages/admin/AdminFashionDay'));
const AdminFashionDayEvents = lazy(() => import('./pages/admin/AdminFashionDayEvents'));
const AdminMagazine = lazy(() => import('./pages/admin/AdminMagazine'));
const AdminModelAccess = lazy(() => import('./pages/admin/AdminModelAccess'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminModels = lazy(() => import('./pages/admin/AdminModels'));
const AdminNews = lazy(() => import('./pages/admin/AdminNews'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'));
const AdminRecovery = lazy(() => import('./pages/admin/AdminRecovery'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminAbsences = lazy(() => import('./pages/admin/AdminAbsences'));
const AdminArtisticDirection = lazy(() => import('./pages/admin/AdminArtisticDirection'));
const AdminBeginnerStudents = lazy(() => import('./pages/admin/AdminBeginnerStudents'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));
const AdminCastingLive = lazy(() => import('./pages/admin/AdminCastingLive'));
const AdminComments = lazy(() => import('./pages/admin/AdminComments'));
const AdminMailing = lazy(() => import('./pages/admin/AdminMailing'));
const Gallery = lazy(() => import('./pages/Gallery'));


// Role-specific pages
const JuryCasting = lazy(() => import('./pages/admin/JuryCasting'));
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

import { Transition } from 'framer-motion';

const pageTransition: Transition = {
    type: "tween",
    ease: "anticipate",
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
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/galerie" element={<Gallery />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:slug" element={<ServiceDetail />} />
                    <Route path="/casting" element={<Casting />} />
                    <Route path="/casting-formulaire" element={<CastingForm />} />
                    <Route path="/fashion-day-application" element={<FashionDayApplicationForm />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-use" element={<TermsOfUse />} />
                    <Route path="/chat" element={<Chat />} />

                    {/* Protected Routes */}
                    <Route path="/formations" element={<ProtectedRoute role="student"><Activity /></ProtectedRoute>} />
                    <Route path="/formations/forum" element={<ProtectedRoute role="student"><ClassroomForum /></ProtectedRoute>} />
                    <Route path="/formations/forum/:threadId" element={<ProtectedRoute role="student"><ForumThread /></ProtectedRoute>} />
                    <Route path="/formations/:moduleSlug/:chapterSlug" element={<ProtectedRoute role="student"><ChapterDetail /></ProtectedRoute>} />
                    <Route path="/profil" element={<ProtectedRoute role="student"><ModelDashboard /></ProtectedRoute>} />
                    
                    {/* FIX: Removed Beginner Classroom routes as the feature has been deprecated. */}
                    
                    <Route path="/jury/casting" element={<ProtectedRoute role="jury"><JuryCasting /></ProtectedRoute>} />
                    <Route path="/enregistrement/casting" element={<ProtectedRoute role="registration"><RegistrationCasting /></ProtectedRoute>} />
                    
                    <Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
                    <Route path="/admin/models" element={<ProtectedRoute role="admin"><AdminModels /></ProtectedRoute>} />
                    <Route path="/admin/magazine" element={<ProtectedRoute role="admin"><AdminMagazine /></ProtectedRoute>} />
                    <Route path="/admin/classroom" element={<ProtectedRoute role="admin"><AdminClassroom /></ProtectedRoute>} />
                    <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />
                    <Route path="/admin/agency" element={<ProtectedRoute role="admin"><AdminAgency /></ProtectedRoute>} />
                    <Route path="/admin/casting-applications" element={<ProtectedRoute role="admin"><AdminCasting /></ProtectedRoute>} />
                    <Route path="/admin/casting-results" element={<ProtectedRoute role="admin"><AdminCastingResults /></ProtectedRoute>} />
                    <Route path="/admin/fashion-day-applications" element={<ProtectedRoute role="admin"><AdminFashionDay /></ProtectedRoute>} />
                    <Route path="/admin/fashion-day-events" element={<ProtectedRoute role="admin"><AdminFashionDayEvents /></ProtectedRoute>} />
                    <Route path="/admin/news" element={<ProtectedRoute role="admin"><AdminNews /></ProtectedRoute>} />
                    <Route path="/admin/classroom-progress" element={<ProtectedRoute role="admin"><AdminClassroomProgress /></ProtectedRoute>} />
                    <Route path="/admin/model-access" element={<ProtectedRoute role="admin"><AdminModelAccess /></ProtectedRoute>} />
                    {/* FIX: Removed AdminBeginnerStudents route as the feature has been deprecated. */}
                    <Route path="/admin/recovery-requests" element={<ProtectedRoute role="admin"><AdminRecovery /></ProtectedRoute>} />
                    <Route path="/admin/comments" element={<ProtectedRoute role="admin"><AdminComments /></ProtectedRoute>} />
                    <Route path="/admin/messages" element={<ProtectedRoute role="admin"><AdminMessages /></ProtectedRoute>} />
                    <Route path="/admin/bookings" element={<ProtectedRoute role="admin"><AdminBookings /></ProtectedRoute>} />
                    <Route path="/admin/payments" element={<ProtectedRoute role="admin"><AdminPayments /></ProtectedRoute>} />
                    <Route path="/admin/absences" element={<ProtectedRoute role="admin"><AdminAbsences /></ProtectedRoute>} />
                    <Route path="/admin/artistic-direction" element={<ProtectedRoute role="admin"><AdminArtisticDirection /></ProtectedRoute>} />
                    <Route path="/admin/generer-image" element={<ProtectedRoute role="admin"><ImageGeneration /></ProtectedRoute>} />
                    <Route path="/admin/analyser-image" element={<ProtectedRoute role="admin"><ImageAnalysis /></ProtectedRoute>} />
                    <Route path="/admin/live-chat" element={<ProtectedRoute role="admin"><LiveChat /></ProtectedRoute>} />
                    <Route path="/admin/mailing" element={<ProtectedRoute role="admin"><AdminMailing /></ProtectedRoute>} />

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
            const newMessages = data.contactMessages?.filter(msg => msg.status === 'Nouveau').length || 0;

            const totalNotifications = newCastingApps + newFashionDayApps + newRecoveryRequests + newBookingRequests + newMessages;

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
            <AIAssistantIcon />
        </Layout>
    );
}

const App: React.FC = () => {

  return (
    <DataProvider>
      <HashRouter>
        <ScrollToTop />
        <AppContent />
      </HashRouter>
    </DataProvider>
  );
};

export default App;
