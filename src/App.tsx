// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import React, { lazy, Suspense, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { DataProvider, useData } from './contexts/DataContext';
import Layout from './components/icons/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRouteWrapper from './components/ProtectedRouteWrapper';
import PublicRouteWrapper from './components/PublicRouteWrapper';
import DataLoadingWrapper from './components/DataLoadingWrapper';
import RoutePreloader from './components/RoutePreloader';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import PageTransition, { LoadingTransition } from './components/PageTransition';

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
const SocialLogin = lazy(() => import('./pages/SocialLogin'));
const Activity = lazy(() => import('./pages/Activity')); // Renamed Formations
const ChapterDetail = lazy(() => import('./pages/ChapterDetail'));
const ModelDashboard = lazy(() => import('./pages/ModelDashboard')); // Profil
const ProfilePage = lazy(() => import('./pages/Profile'));
const Chat = lazy(() => import('./pages/Chat'));
const Checkout = lazy(() => import('./pages/Checkout'));

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
const AdminPayments = lazy(() => import('./pages/AdminPaymentsNew'));
const AdminAbsences = lazy(() => import('./pages/AdminAbsences'));
const AdminArtisticDirection = lazy(() => import('./pages/AdminArtisticDirection'));

// Test component
const LoadingTest = lazy(() => import('./components/LoadingTest'));

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
    <LoadingTransition>
        <div className="min-h-screen bg-pm-dark flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-pm-gold/20 border-t-pm-gold rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-pm-gold/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <div className="text-center">
                <p className="text-pm-gold text-2xl font-playfair font-bold mb-2">Perfect Models</p>
                <p className="text-pm-off-white/70 text-lg">Chargement de la page...</p>
                <div className="mt-4 flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-pm-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-pm-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-pm-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    </LoadingTransition>
);


const AppContent: React.FC = () => {
    const location = ReactRouterDOM.useLocation();
    const { data, isInitialized } = useData();

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

    // Attendre que les données soient initialisées avant de rendre le contenu
    if (!isInitialized) {
        return <LoadingTransition />;
    }

    return (
        <>
            <RoutePreloader />
            <Layout>
                <RouteErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                    <PageTransition>
                        <ReactRouterDOM.Routes>
                        <ReactRouterDOM.Route path="/" element={<PublicRouteWrapper><Home /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/agence" element={<PublicRouteWrapper><Agency /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/mannequins" element={<PublicRouteWrapper><Models /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/mannequins/:id" element={<PublicRouteWrapper><ModelDetail /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/fashion-day" element={<PublicRouteWrapper><FashionDay /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/magazine" element={<PublicRouteWrapper><Magazine /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/magazine/:slug" element={<PublicRouteWrapper><ArticleDetail /></PublicRouteWrapper>} />
            <ReactRouterDOM.Route path="/contact" element={<PublicRouteWrapper><Contact /></PublicRouteWrapper>} />
            <ReactRouterDOM.Route path="/services" element={<PublicRouteWrapper><Services /></PublicRouteWrapper>} />
            <ReactRouterDOM.Route path="/services/:slug" element={<PublicRouteWrapper><ServiceDetail /></PublicRouteWrapper>} />
            <ReactRouterDOM.Route path="/checkout" element={<PublicRouteWrapper><Checkout /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/casting" element={<PublicRouteWrapper><Casting /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/casting-formulaire" element={<PublicRouteWrapper><CastingForm /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/fashion-day-application" element={<PublicRouteWrapper><FashionDayApplicationForm /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/login" element={<PublicRouteWrapper><Login /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/social-login" element={<PublicRouteWrapper><SocialLogin /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <ReactRouterDOM.Route path="/terms-of-use" element={<TermsOfUse />} />
                        <ReactRouterDOM.Route path="/chat" element={<PublicRouteWrapper><Chat /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/test-upload" element={<TestImageUpload />} />
                        <ReactRouterDOM.Route path="/loading-test" element={<LoadingTest />} />
                        <ReactRouterDOM.Route path="/galerie" element={<PublicRouteWrapper><Gallery /></PublicRouteWrapper>} />

                        {/* Protected Routes - Classroom Unifiée (Débutants + Pros) */}
                        <ReactRouterDOM.Route path="/formations" element={<ProtectedRouteWrapper role="classroom"><Activity /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/formations/:moduleSlug/:chapterSlug" element={<ProtectedRouteWrapper role="classroom"><ChapterDetail /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/profil/:userId" element={<ProtectedRouteWrapper role="classroom"><ProfilePage /></ProtectedRouteWrapper>} />
                        
                        <ReactRouterDOM.Route path="/jury/casting" element={<ProtectedRouteWrapper role="jury"><JuryCasting /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/enregistrement/casting" element={<ProtectedRouteWrapper role="registration"><RegistrationCasting /></ProtectedRouteWrapper>} />
                        
                        <ReactRouterDOM.Route path="/admin" element={<ProtectedRouteWrapper role="admin"><Admin /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/user-management" element={<ProtectedRouteWrapper role="admin"><AdminUserManagement /></ProtectedRouteWrapper>} />
                <ReactRouterDOM.Route path="/admin/payment-submissions" element={<ProtectedRouteWrapper role="admin"><AdminPaymentSubmissions /></ProtectedRouteWrapper>} />
                <ReactRouterDOM.Route path="/admin/payment-status" element={<ProtectedRouteWrapper role="admin"><AdminPaymentStatus /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/accounting" element={<ProtectedRouteWrapper role="admin"><AdminAccounting /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/models" element={<ProtectedRouteWrapper role="admin"><AdminModels /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/magazine" element={<ProtectedRouteWrapper role="admin"><AdminMagazine /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/gallery" element={<ProtectedRouteWrapper role="admin"><AdminGallery /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/team" element={<ProtectedRouteWrapper role="admin"><AdminTeam /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/model-tracking" element={<ProtectedRouteWrapper role="admin"><AdminModelTracking /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/classroom" element={<ProtectedRouteWrapper role="admin"><AdminClassroom /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/settings" element={<ProtectedRouteWrapper role="admin"><AdminSettings /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/agency" element={<ProtectedRouteWrapper role="admin"><AdminAgency /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/casting-applications" element={<ProtectedRouteWrapper role="admin"><AdminCasting /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/casting-results" element={<ProtectedRouteWrapper role="admin"><AdminCastingResults /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/fashion-day-applications" element={<ProtectedRouteWrapper role="admin"><AdminFashionDay /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/fashion-day-events" element={<ProtectedRouteWrapper role="admin"><AdminFashionDayEvents /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/news" element={<ProtectedRouteWrapper role="admin"><AdminNews /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/classroom-progress" element={<ProtectedRouteWrapper role="admin"><AdminClassroomProgress /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/model-access" element={<ProtectedRouteWrapper role="admin"><AdminModelAccess /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/beginner-students-access" element={<ProtectedRouteWrapper role="admin"><AdminBeginnerStudents /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/recovery-requests" element={<ProtectedRouteWrapper role="admin"><AdminRecovery /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/comments" element={<ProtectedRouteWrapper role="admin"><AdminComments /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/messages" element={<ProtectedRouteWrapper role="admin"><AdminMessages /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/bookings" element={<ProtectedRouteWrapper role="admin"><AdminBookings /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/payments" element={<ProtectedRouteWrapper role="admin"><AdminPayments /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/absences" element={<ProtectedRouteWrapper role="admin"><AdminAbsences /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/admin/artistic-direction" element={<ProtectedRouteWrapper role="admin"><AdminArtisticDirection /></ProtectedRouteWrapper>} />

                        <ReactRouterDOM.Route path="*" element={<NotFound />} />
                        </ReactRouterDOM.Routes>
                    </PageTransition>
                </Suspense>
                </RouteErrorBoundary>
            </Layout>
        </>
    );
}

const App: React.FC = () => {

  // Service worker removed for development

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