import React, { useEffect, lazy, Suspense } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './contexts/DataContext';
import Layout from './components/icons/Layout';
import ProtectedRoute from './components/ProtectedRoute';

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
const Activity = lazy(() => import('./pages/Activity')); // Renamed Formations
const ChapterDetail = lazy(() => import('./pages/ChapterDetail'));
const ModelDashboard = lazy(() => import('./pages/ModelDashboard')); // Profil
const ClassroomForum = lazy(() => import('./pages/ClassroomForum'));
const ForumThread = lazy(() => import('./pages/ForumThread'));
const BeginnerClassroom = lazy(() => import('./pages/BeginnerClassroom'));
const BeginnerChapterDetail = lazy(() => import('./pages/BeginnerChapterDetail'));
const Chat = lazy(() => import('./pages/Chat'));

// Admin Components and Pages
const AdminLayout = lazy(() => import('./admin/layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));

// Legacy Admin Pages (to be migrated)
const AdminAgency = lazy(() => import('./pages/AdminAgency'));
const AdminCasting = lazy(() => import('./pages/AdminCasting'));
const AdminCastingResults = lazy(() => import('./pages/AdminCastingResults'));
const AdminClassroom = lazy(() => import('./pages/AdminClassroom'));
const AdminClassroomProgress = lazy(() => import('./pages/AdminClassroomProgress'));
const AdminFashionDay = lazy(() => import('./pages/AdminFashionDay'));
const AdminFashionDayEvents = lazy(() => import('./pages/AdminFashionDayEvents'));
const AdminMagazine = lazy(() => import('./pages/AdminMagazine'));
const AdminModelAccess = lazy(() => import('./pages/AdminModelAccess'));
const AdminModels = lazy(() => import('./pages/AdminModels'));
const AdminNews = lazy(() => import('./pages/AdminNews'));
const AdminRecovery = lazy(() => import('./pages/AdminRecovery'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));
const AdminComments = lazy(() => import('./pages/AdminComments'));
const AdminBookings = lazy(() => import('./pages/AdminBookings'));
const AdminMessages = lazy(() => import('./pages/AdminMessages'));
const AdminBeginnerStudents = lazy(() => import('./pages/AdminBeginnerStudents'));
const AdminPayments = lazy(() => import('./pages/AdminPayments'));
const AdminAbsences = lazy(() => import('./pages/AdminAbsences'));
const AdminArtisticDirection = lazy(() => import('./pages/AdminArtisticDirection'));


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
    <div className="w-full py-40 flex items-center justify-center">
        <p className="text-pm-gold text-2xl font-playfair animate-pulse">Chargement...</p>
    </div>
);


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
        
        // Cleanup function to restore original title on component unmount
        return () => {
            document.title = originalTitle;
        };
    }, [location.pathname, data]);


    return (
        <>
            <Layout>
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/agence" element={<Agency />} />
                        <Route path="/mannequins" element={<Models />} />
                        <Route path="/mannequins/:id" element={<ModelDetail />} />
                        <Route path="/fashion-day" element={<FashionDay />} />
                        <Route path="/magazine" element={<Magazine />} />
                        <Route path="/magazine/:slug" element={<ArticleDetail />} />
                        <Route path="/contact" element={<Contact />} />
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
                        
                        <Route path="/classroom-debutant" element={<ProtectedRoute role="beginner"><BeginnerClassroom /></ProtectedRoute>} />
                        <Route path="/classroom-debutant/:moduleSlug/:chapterSlug" element={<ProtectedRoute role="beginner"><BeginnerChapterDetail /></ProtectedRoute>} />
                        
                        <Route path="/jury/casting" element={<ProtectedRoute role="jury"><JuryCasting /></ProtectedRoute>} />
                        <Route path="/enregistrement/casting" element={<ProtectedRoute role="registration"><RegistrationCasting /></ProtectedRoute>} />
                        
                        {/* Admin Routes with new layout */}
                        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="models" element={<AdminModels />} />
                            <Route path="magazine" element={<AdminMagazine />} />
                            <Route path="classroom" element={<AdminClassroom />} />
                            <Route path="settings" element={<AdminSettings />} />
                            <Route path="agency" element={<AdminAgency />} />
                            <Route path="casting-applications" element={<AdminCasting />} />
                            <Route path="casting-results" element={<AdminCastingResults />} />
                            <Route path="fashion-day-applications" element={<AdminFashionDay />} />
                            <Route path="fashion-day-events" element={<AdminFashionDayEvents />} />
                            <Route path="news" element={<AdminNews />} />
                            <Route path="classroom-progress" element={<AdminClassroomProgress />} />
                            <Route path="model-access" element={<AdminModelAccess />} />
                            <Route path="beginner-students-access" element={<AdminBeginnerStudents />} />
                            <Route path="recovery-requests" element={<AdminRecovery />} />
                            <Route path="comments" element={<AdminComments />} />
                            <Route path="messages" element={<AdminMessages />} />
                            <Route path="bookings" element={<AdminBookings />} />
                            <Route path="payments" element={<AdminPayments />} />
                            <Route path="absences" element={<AdminAbsences />} />
                            <Route path="artistic-direction" element={<AdminArtisticDirection />} />
                        </Route>

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </Layout>
        </>
    );
}

const App: React.FC = () => {

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }
  }, []);

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