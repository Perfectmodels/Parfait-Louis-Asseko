import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './contexts/DataContext';
import Layout from './components/icons/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import StatsigPageTracker from './components/StatsigPageTracker';
import CacheAlert from './components/CacheAlert';
import ErrorBoundary from './components/ErrorBoundary';
import { useStatsig } from './hooks/useStatsig';


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
const Activity = lazy(() => import('./pages/Activity'));
const ChapterDetail = lazy(() => import('./pages/ChapterDetail'));
const ModelDashboard = lazy(() => import('./pages/ModelDashboard'));
const ClassroomForum = lazy(() => import('./pages/ClassroomForum'));
const ForumThread = lazy(() => import('./pages/ForumThread'));
const BeginnerClassroom = lazy(() => import('./pages/BeginnerClassroom'));
const BeginnerChapterDetail = lazy(() => import('./pages/BeginnerChapterDetail'));
const Chat = lazy(() => import('./pages/Chat'));
const Gallery = lazy(() => import('./pages/Gallery'));

// Admin Pages
const Admin = lazy(() => import('./pages/Admin'));
const AdminModels = lazy(() => import('./pages/AdminModels'));
const AdminContent = lazy(() => import('./pages/AdminContent'));
const AdminCommunication = lazy(() => import('./pages/AdminCommunication'));
const AdminFinance = lazy(() => import('./pages/AdminFinance'));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics'));
const AdminAgency = lazy(() => import('./pages/AdminAgency'));
const AdminCasting = lazy(() => import('./pages/AdminCasting'));
const AdminCastingResults = lazy(() => import('./pages/AdminCastingResults'));
const AdminClassroom = lazy(() => import('./pages/AdminClassroom'));
const AdminClassroomProgress = lazy(() => import('./pages/AdminClassroomProgress'));
const AdminFashionDay = lazy(() => import('./pages/AdminFashionDay'));
const AdminFashionDayEvents = lazy(() => import('./pages/AdminFashionDayEvents'));
const AdminMagazine = lazy(() => import('./pages/AdminMagazine'));
const AdminModelAccess = lazy(() => import('./pages/AdminModelAccess'));
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
const AdminEmails = lazy(() => import('./pages/AdminEmails'));
const AdminMedia = lazy(() => import('./pages/AdminMedia'));
const AdminAccounting = lazy(() => import('./pages/AdminAccounting'));
const AdminMessaging = lazy(() => import('./pages/AdminMessaging'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminTechnical = lazy(() => import('./pages/AdminTechnical'));
const AdminProfile = lazy(() => import('./pages/AdminProfile'));
const AdminCastingLive = lazy(() => import('./pages/AdminCastingLive'));
const ModelMessaging = lazy(() => import('./pages/ModelMessaging'));
const ModelPayments = lazy(() => import('./pages/ModelPayments'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Motivation = lazy(() => import('./pages/Motivation'));
const International = lazy(() => import('./pages/International'));
const Application = lazy(() => import('./pages/Application'));

// Role-specific pages
const JuryCasting = lazy(() => import('./pages/JuryCasting'));
const RegistrationCasting = lazy(() => import('./pages/RegistrationCasting'));

// Static Pages
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const NotFound = lazy(() => import('./pages/NotFound'));

// ScrollToTop smooth
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

// Loading spinner fallback
const LoadingFallback: React.FC = () => (
  <div className="w-full py-40 flex flex-col items-center justify-center gap-4">
    <div className="w-10 h-10 border-4 border-pm-gold border-t-transparent rounded-full animate-spin"></div>
    <p className="text-pm-gold text-2xl font-playfair">Chargement...</p>
  </div>
);

// Hook pour gérer le titre admin
const useAdminTitle = (data: any) => {
  const { pathname } = useLocation();
  useEffect(() => {
    const originalTitle = "Perfect Models Management";
    if (pathname.startsWith('/admin')) {
      const newNotifications = 
        (data?.castingApplications?.filter((a: any) => a.status === 'Nouveau').length || 0) +
        (data?.fashionDayApplications?.filter((a: any) => a.status === 'Nouveau').length || 0) +
        (data?.recoveryRequests?.filter((a: any) => a.status === 'Nouveau').length || 0) +
        (data?.bookingRequests?.filter((a: any) => a.status === 'Nouveau').length || 0) +
        (data?.contactMessages?.filter((a: any) => a.status === 'Nouveau').length || 0);
      document.title = newNotifications > 0 ? `(${newNotifications}) Admin | ${originalTitle}` : `Admin | ${originalTitle}`;
    } else {
      document.title = originalTitle;
    }
    return () => { document.title = originalTitle; };
  }, [pathname, data]);
};

const AppContent: React.FC = () => {
  const { data } = useData();
  const { initialize, isReady } = useStatsig();
  useAdminTitle(data);

  useEffect(() => {
    if (!isReady) {
      initialize({
        userID: 'anonymous',
        customProperties: { timestamp: new Date().toISOString() }
      });
    }
  }, [initialize, isReady]);

  return (
    <StatsigPageTracker>
      <Layout>
        <CacheAlert />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Pages */}
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
            <Route path="/temoignages" element={<Testimonials />} />
            <Route path="/motivation" element={<Motivation />} />
            <Route path="/international" element={<International />} />
            <Route path="/application" element={<Application />} />

            {/* Protected Routes */}
            <Route path="/formations" element={<ProtectedRoute role="student"><Activity /></ProtectedRoute>} />
            <Route path="/formations/forum" element={<ProtectedRoute role="student"><ClassroomForum /></ProtectedRoute>} />
            <Route path="/formations/forum/:threadId" element={<ProtectedRoute role="student"><ForumThread /></ProtectedRoute>} />
            <Route path="/formations/:moduleSlug/:chapterSlug" element={<ProtectedRoute role="student"><ChapterDetail /></ProtectedRoute>} />
            <Route path="/profil" element={<ProtectedRoute role="student"><ModelDashboard /></ProtectedRoute>} />
            <Route path="/messaging" element={<ProtectedRoute role="student"><ModelMessaging /></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute role="student"><ModelPayments /></ProtectedRoute>} />

            <Route path="/classroom-debutant" element={<ProtectedRoute role="beginner"><BeginnerClassroom /></ProtectedRoute>} />
            <Route path="/classroom-debutant/:moduleSlug/:chapterSlug" element={<ProtectedRoute role="beginner"><BeginnerChapterDetail /></ProtectedRoute>} />

            <Route path="/jury/casting" element={<ProtectedRoute role="jury"><JuryCasting /></ProtectedRoute>} />
            <Route path="/enregistrement/casting" element={<ProtectedRoute role="registration"><RegistrationCasting /></ProtectedRoute>} />

            {/* Admin Routes Group */}
            <Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>}>
              {/* Nouvelles routes principales */}
              <Route path="models" element={<AdminModels />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="communication" element={<AdminCommunication />} />
              <Route path="finance" element={<AdminFinance />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              
              {/* Routes existantes */}
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
              <Route path="emails" element={<AdminEmails />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="accounting" element={<AdminAccounting />} />
              <Route path="messaging" element={<AdminMessaging />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="technical" element={<AdminTechnical />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="casting-live" element={<AdminCastingLive />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </StatsigPageTracker>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    // Gérer le Service Worker selon l'environnement
    if ((import.meta as any).env?.DEV) {
      // En développement, désactiver complètement le SW
      import('./config/sw-config').then(({ disableServiceWorker }) => disableServiceWorker());
    } else {
      // En production, activer le SW
      import('./config/sw-config').then(({ enableServiceWorker }) => {
        window.addEventListener('load', enableServiceWorker);
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <DataProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <AppContent />
        </BrowserRouter>
      </DataProvider>
    </ErrorBoundary>
  );
};

export default App;
