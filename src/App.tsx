// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import React, { lazy, Suspense, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { DataProvider, useData } from './contexts/DataContext';
import Layout from './components/icons/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded Pages
const Home = lazy(() => import('./pages/Home'));
const Agency = lazy(() => import('./pages/Agency'));
// Temporarily use regular import to debug
import Models from './pages/Models';
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
const Chat = lazy(() => import('./pages/Chat'));

// Admin Pages
const Admin = lazy(() => import('./pages/Admin'));
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
const AdminUserManagement = lazy(() => import('./pages/AdminUserManagement'));
const AdminPaymentSubmissions = lazy(() => import('./pages/AdminPaymentSubmissions'));
const AdminPaymentStatus = lazy(() => import('./pages/AdminPaymentStatus'));
const AdminAccounting = lazy(() => import('./pages/AdminAccounting'));
const AdminRecovery = lazy(() => import('./pages/AdminRecovery'));
const AdminTeam = lazy(() => import('./pages/AdminTeam'));
const AdminModelTracking = lazy(() => import('./pages/AdminModelTracking'));
const TestImageUpload = lazy(() => import('./pages/TestImageUpload'));
const Gallery = lazy(() => import('./pages/Gallery'));
const AdminGallery = lazy(() => import('./pages/AdminGallery'));
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
  const { pathname } = ReactRouterDOM.useLocation();
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
    const location = ReactRouterDOM.useLocation();
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
                    <ReactRouterDOM.Routes>
                        <ReactRouterDOM.Route path="/" element={<Home />} />
                        <ReactRouterDOM.Route path="/agence" element={<Agency />} />
                        <ReactRouterDOM.Route path="/mannequins" element={<Models />} />
                        <ReactRouterDOM.Route path="/mannequins/:id" element={<ModelDetail />} />
                        <ReactRouterDOM.Route path="/fashion-day" element={<FashionDay />} />
                        <ReactRouterDOM.Route path="/magazine" element={<Magazine />} />
                        <ReactRouterDOM.Route path="/magazine/:slug" element={<ArticleDetail />} />
                        <ReactRouterDOM.Route path="/contact" element={<Contact />} />
                        <ReactRouterDOM.Route path="/services" element={<Services />} />
                        <ReactRouterDOM.Route path="/services/:slug" element={<ServiceDetail />} />
                        <ReactRouterDOM.Route path="/casting" element={<Casting />} />
                        <ReactRouterDOM.Route path="/casting-formulaire" element={<CastingForm />} />
                        <ReactRouterDOM.Route path="/fashion-day-application" element={<FashionDayApplicationForm />} />
                        <ReactRouterDOM.Route path="/login" element={<Login />} />
                        <ReactRouterDOM.Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <ReactRouterDOM.Route path="/terms-of-use" element={<TermsOfUse />} />
                        <ReactRouterDOM.Route path="/chat" element={<Chat />} />
                        <ReactRouterDOM.Route path="/test-upload" element={<TestImageUpload />} />
                        <ReactRouterDOM.Route path="/galerie" element={<Gallery />} />

                        {/* Protected Routes - Classroom Unifiée */}
                        <ReactRouterDOM.Route path="/formations" element={<ProtectedRoute role="student"><Activity /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/formations/forum" element={<ProtectedRoute role="student"><ClassroomForum /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/formations/forum/:threadId" element={<ProtectedRoute role="student"><ForumThread /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/formations/:moduleSlug/:chapterSlug" element={<ProtectedRoute role="student"><ChapterDetail /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/profil" element={<ProtectedRoute role="student"><ModelDashboard /></ProtectedRoute>} />
                        
                        {/* Routes pour débutants redirigées vers la classroom unifiée */}
                        <ReactRouterDOM.Route path="/classroom-debutant" element={<ProtectedRoute role="beginner"><Activity /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/classroom-debutant/:moduleSlug/:chapterSlug" element={<ProtectedRoute role="beginner"><ChapterDetail /></ProtectedRoute>} />
                        
                        <ReactRouterDOM.Route path="/jury/casting" element={<ProtectedRoute role="jury"><JuryCasting /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/enregistrement/casting" element={<ProtectedRoute role="registration"><RegistrationCasting /></ProtectedRoute>} />
                        
                        <ReactRouterDOM.Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/user-management" element={<ProtectedRoute role="admin"><AdminUserManagement /></ProtectedRoute>} />
                <ReactRouterDOM.Route path="/admin/payment-submissions" element={<ProtectedRoute role="admin"><AdminPaymentSubmissions /></ProtectedRoute>} />
                <ReactRouterDOM.Route path="/admin/payment-status" element={<ProtectedRoute role="admin"><AdminPaymentStatus /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/accounting" element={<ProtectedRoute role="admin"><AdminAccounting /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/models" element={<ProtectedRoute role="admin"><AdminModels /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/magazine" element={<ProtectedRoute role="admin"><AdminMagazine /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/gallery" element={<ProtectedRoute role="admin"><AdminGallery /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/team" element={<ProtectedRoute role="admin"><AdminTeam /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/model-tracking" element={<ProtectedRoute role="admin"><AdminModelTracking /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/classroom" element={<ProtectedRoute role="admin"><AdminClassroom /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/agency" element={<ProtectedRoute role="admin"><AdminAgency /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/casting-applications" element={<ProtectedRoute role="admin"><AdminCasting /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/casting-results" element={<ProtectedRoute role="admin"><AdminCastingResults /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/fashion-day-applications" element={<ProtectedRoute role="admin"><AdminFashionDay /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/fashion-day-events" element={<ProtectedRoute role="admin"><AdminFashionDayEvents /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/news" element={<ProtectedRoute role="admin"><AdminNews /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/classroom-progress" element={<ProtectedRoute role="admin"><AdminClassroomProgress /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/model-access" element={<ProtectedRoute role="admin"><AdminModelAccess /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/beginner-students-access" element={<ProtectedRoute role="admin"><AdminBeginnerStudents /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/recovery-requests" element={<ProtectedRoute role="admin"><AdminRecovery /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/comments" element={<ProtectedRoute role="admin"><AdminComments /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/messages" element={<ProtectedRoute role="admin"><AdminMessages /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/bookings" element={<ProtectedRoute role="admin"><AdminBookings /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/payments" element={<ProtectedRoute role="admin"><AdminPayments /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/absences" element={<ProtectedRoute role="admin"><AdminAbsences /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/artistic-direction" element={<ProtectedRoute role="admin"><AdminArtisticDirection /></ProtectedRoute>} />

                        <ReactRouterDOM.Route path="*" element={<NotFound />} />
                    </ReactRouterDOM.Routes>
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
      <ReactRouterDOM.HashRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <ScrollToTop />
        <AppContent />
      </ReactRouterDOM.HashRouter>
    </DataProvider>
  );
};

export default App;