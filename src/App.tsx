
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import React, { lazy, Suspense, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { DataProvider, useData } from './contexts/DataContext';
import Layout from './components/icons/Layout';
import ProtectedRouteWrapper from './components/ProtectedRouteWrapper';
import PublicRouteWrapper from './components/PublicRouteWrapper';
import RoutePreloader from './components/RoutePreloader';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import PageTransition, { LoadingTransition } from './components/PageTransition';
import ScriptPreloader from './components/ScriptPreloader';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy-loaded Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const Agency = lazy(() => import('./pages/Agency'));
const Models = lazy(() => import('./pages/Models'));
const ModelDetail = lazy(() => import('./pages/ModelDetail'));
const FashionDay = lazy(() => import('./pages/FashionDay'));
const Magazine = lazy(() => import('./pages/Magazine'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Trainings = lazy(() => import('./pages/Trainings'));
const Casting = lazy(() => import('./pages/Casting'));
const CastingForm = lazy(() => import('./pages/CastingForm'));
const FashionDayApplicationForm = lazy(() => import('./pages/FashionDayApplicationForm'));
const Login = lazy(() => import('./pages/Login'));
const SocialLogin = lazy(() => import('./pages/SocialLogin'));
const ChapterDetail = lazy(() => import('./pages/ChapterDetail'));
const ModelDashboard = lazy(() => import('./pages/ModelDashboard')); // Profil
const ProfilePage = lazy(() => import('./pages/Profile'));
const Chat = lazy(() => import('./pages/Chat'));
const Checkout = lazy(() => import('./pages/Checkout'));

// Admin Pages
const AdminLayout = lazy(() => import('./pages/admin/Admin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminAgency = lazy(() => import('./pages/admin/AdminAgency'));
const AdminCasting = lazy(() => import('./pages/admin/AdminCasting'));
const AdminCastingResults = lazy(() => import('./pages/admin/AdminCastingResults'));
const AdminClassroom = lazy(() => import('./pages/admin/AdminClassroom'));
const AdminClassroomProgress = lazy(() => import('./pages/admin/AdminClassroomProgress'));
const AdminFashionDay = lazy(() => import('./pages/admin/AdminFashionDay'));
const AdminFashionDayEvents = lazy(() => import('./pages/admin/AdminFashionDayEvents'));
const AdminMagazine = lazy(() => import('./pages/admin/AdminMagazine'));
const AdminModelAccess = lazy(() => import('./pages/admin/AdminModelAccess'));
const ModelManagement = lazy(() => import('./pages/admin/models/ModelManagement'));
const AdminServiceOrders = lazy(() => import('./pages/admin/AdminServiceOrders'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
// const AdminImageManagement = lazy(() => import('./pages/admin/AdminImageManagement'));
const AdminNews = lazy(() => import('./pages/admin/AdminNews'));
const AdminUserManagement = lazy(() => import('./pages/admin/AdminUserManagement'));
const AdminPaymentSubmissions = lazy(() => import('./pages/admin/AdminPaymentSubmissions'));
const AdminPaymentStatus = lazy(() => import('./pages/admin/AdminPaymentStatus'));
const AdminAccounting = lazy(() => import('./pages/admin/AdminAccounting'));
const AdminRecovery = lazy(() => import('./pages/admin/AdminRecovery'));
const AdminTeam = lazy(() => import('./pages/admin/AdminTeam'));
const AdminModelTracking = lazy(() => import('./pages/admin/AdminModelTracking'));
const Gallery = lazy(() => import('./pages/Gallery'));
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminComments = lazy(() => import('./pages/admin/AdminComments'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminMessaging = lazy(() => import('./pages/admin/AdminMessaging'));
const ModelMessaging = lazy(() => import('./pages/ModelMessaging'));
const AdminBeginnerStudents = lazy(() => import('./pages/admin/AdminBeginnerStudents'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPaymentsNew'));
const AdminAbsences = lazy(() => import('./pages/admin/AdminAbsences'));
const AdminArtisticDirection = lazy(() => import('./pages/admin/AdminArtisticDirection'));
const AdminServer = lazy(() => import('./pages/admin/AdminServer'));
const AdminDatabase = lazy(() => import('./pages/admin/AdminDatabase'));
const AdminApiKeys = lazy(() => import('./pages/admin/AdminApiKeys'));
const AdminSecurity = lazy(() => import('./pages/admin/AdminSecurity'));
const AdminBrevoTest = lazy(() => import('./pages/admin/AdminBrevoTest'));
const AdminEmailDiagnostic = lazy(() => import('./pages/admin/AdminEmailDiagnostic'));
const AdminLinkTest = lazy(() => import('./pages/admin/AdminLinkTest'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminNotifications = lazy(() => import('./pages/admin/AdminNotifications'));
const AdminPhotoUpload = lazy(() => import('./pages/admin/AdminPhotoUpload'));
const ModelPhotoUpload = lazy(() => import('./pages/ModelPhotoUpload'));
const ArtisticDirectionAccess = lazy(() => import('./pages/ArtisticDirectionAccess'));
const AdminNewEmail = lazy(() => import('./pages/admin/AdminNewEmail'));
const AdminMarketingCampaigns = lazy(() => import('./pages/admin/AdminMarketingCampaigns'));
const CreateCampaign = lazy(() => import('./pages/admin/CreateCampaign'));
const AdminImportContacts = lazy(() => import('./pages/admin/AdminImportContacts'));
const AdminContactManagement = lazy(() => import('./pages/admin/AdminContactManagement'));
const AdminMessagingDashboard = lazy(() => import('./pages/admin/AdminMessagingDashboard'));
const AdminSMS = lazy(() => import('./pages/admin/AdminSMS'));
const AdminCastingLive = lazy(() => import('./pages/admin/AdminCastingLive'));


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
        return (
            <div className="min-h-screen bg-pm-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-pm-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-pm-gold text-lg">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <RoutePreloader />
            <Layout>
                <RouteErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                    <PageTransition>
                        <ReactRouterDOM.Routes>
                        <ReactRouterDOM.Route path="/" element={<HomePage />} />
                        <ReactRouterDOM.Route path="/agence" element={<PublicRouteWrapper><Agency /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/mannequins" element={<PublicRouteWrapper><Models /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/mannequins/:id" element={<PublicRouteWrapper><ModelDetail /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/fashion-day" element={<PublicRouteWrapper><FashionDay /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/magazine" element={<PublicRouteWrapper><Magazine /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/magazine/:slug" element={<PublicRouteWrapper><ArticleDetail /></PublicRouteWrapper>} />
            <ReactRouterDOM.Route path="/contact" element={<PublicRouteWrapper><Contact /></PublicRouteWrapper>} />
            <ReactRouterDOM.Route path="/services" element={<PublicRouteWrapper><Services /></PublicRouteWrapper>} />
            <ReactRouterDOM.Route path="/services/:slug" element={<PublicRouteWrapper><ServiceDetail /></PublicRouteWrapper>} />
            <ReactRouterDOM.Route path="/formations" element={<PublicRouteWrapper><Trainings /></PublicRouteWrapper>} />
            <ReactRouterDOM.Route path="/checkout" element={<PublicRouteWrapper><Checkout /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/casting" element={<PublicRouteWrapper><Casting /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/casting-formulaire" element={<PublicRouteWrapper><CastingForm /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/fashion-day-application" element={<PublicRouteWrapper><FashionDayApplicationForm /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/login" element={<PublicRouteWrapper><Login /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/social-login" element={<PublicRouteWrapper><SocialLogin /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <ReactRouterDOM.Route path="/terms-of-use" element={<TermsOfUse />} />
                        <ReactRouterDOM.Route path="/chat" element={<PublicRouteWrapper><Chat /></PublicRouteWrapper>} />
                        <ReactRouterDOM.Route path="/galerie" element={<PublicRouteWrapper><Gallery /></PublicRouteWrapper>} />

                        {/* Protected Routes - Classroom Unifiée (Débutants + Pros) */}
                        <ReactRouterDOM.Route path="/formations/:moduleSlug/:chapterSlug" element={<ProtectedRouteWrapper role="classroom"><ChapterDetail /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/profil" element={<ProtectedRouteWrapper role="student"><ModelDashboard /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/profil/:userId" element={<ProtectedRouteWrapper role="classroom"><ProfilePage /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/messaging" element={<ProtectedRouteWrapper role="student"><ModelMessaging /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/model-photo-upload" element={<ProtectedRouteWrapper role="student"><ModelPhotoUpload /></ProtectedRouteWrapper>} />
                        
                        <ReactRouterDOM.Route path="/jury/casting" element={<ProtectedRouteWrapper role="jury"><JuryCasting /></ProtectedRouteWrapper>} />
                        <ReactRouterDOM.Route path="/enregistrement/casting" element={<ProtectedRouteWrapper role="registration"><RegistrationCasting /></ProtectedRouteWrapper>} />
                        
                        <ReactRouterDOM.Route path="/admin" element={<ProtectedRouteWrapper role="admin"><AdminLayout /></ProtectedRouteWrapper>}>
                           <ReactRouterDOM.Route index element={<AdminDashboard />} />
                           <ReactRouterDOM.Route path="agency" element={<AdminAgency />} />
                           <ReactRouterDOM.Route path="team" element={<AdminTeam />} />
                           <ReactRouterDOM.Route path="models" element={<ModelManagement />} />
                           <ReactRouterDOM.Route path="beginner-students-access" element={<AdminBeginnerStudents />} />
                           <ReactRouterDOM.Route path="model-access" element={<AdminModelAccess />} />
                           <ReactRouterDOM.Route path="model-tracking" element={<AdminModelTracking />} />
                           <ReactRouterDOM.Route path="services" element={<AdminServices />} />
                           <ReactRouterDOM.Route path="service-orders" element={<AdminServiceOrders />} />
                           <ReactRouterDOM.Route path="accounting" element={<AdminAccounting />} />
                           <ReactRouterDOM.Route path="payments" element={<AdminPayments />} />
                           <ReactRouterDOM.Route path="payment-submissions" element={<AdminPaymentSubmissions />} />
                           <ReactRouterDOM.Route path="casting-applications" element={<AdminCasting />} />
                           <ReactRouterDOM.Route path="casting-results" element={<AdminCastingResults />} />
                           <ReactRouterDOM.Route path="fashion-day-applications" element={<AdminFashionDay />} />
                           <ReactRouterDOM.Route path="fashion-day-events" element={<AdminFashionDayEvents />} />
                           <ReactRouterDOM.Route path="magazine" element={<AdminMagazine />} />
                           <ReactRouterDOM.Route path="gallery" element={<AdminGallery />} />
                           <ReactRouterDOM.Route path="classroom" element={<AdminClassroom />} />
                           <ReactRouterDOM.Route path="classroom-progress" element={<AdminClassroomProgress />} />
                           <ReactRouterDOM.Route path="artistic-direction" element={<AdminArtisticDirection />} />
                           <ReactRouterDOM.Route path="messages" element={<AdminMessages />} />
                           <ReactRouterDOM.Route path="comments" element={<AdminComments />} />
                           <ReactRouterDOM.Route path="contact-management" element={<AdminContactManagement />} />
                           <ReactRouterDOM.Route path="marketing-campaigns" element={<AdminMarketingCampaigns />} />
                           <ReactRouterDOM.Route path="settings" element={<AdminSettings />} />
                           <ReactRouterDOM.Route path="user-management" element={<AdminUserManagement />} />
                           <ReactRouterDOM.Route path="security" element={<AdminSecurity />} />
                           <ReactRouterDOM.Route path="api-keys" element={<AdminApiKeys />} />
                           <ReactRouterDOM.Route path="server" element={<AdminServer />} />
                           <ReactRouterDOM.Route path="database" element={<AdminDatabase />} />
                           <ReactRouterDOM.Route path="email-diagnostic" element={<AdminEmailDiagnostic />} />
                           <ReactRouterDOM.Route path="link-test" element={<AdminLinkTest />} />
                        </ReactRouterDOM.Route>
                        
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

  // Enregistrer le service worker pour améliorer le cache
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <ErrorBoundary>
      <ScriptPreloader>
        <DataProvider>
          <ReactRouterDOM.HashRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <ScrollToTop />
            <AppContent />
            {import.meta.env.PROD && <Analytics />}
            {import.meta.env.PROD && <SpeedInsights />}
          </ReactRouterDOM.HashRouter>
        </DataProvider>
      </ScriptPreloader>
    </ErrorBoundary>
  );
};

export default App;
