





import React, { useEffect, lazy, Suspense } from 'react';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
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
const BeginnerProfile = lazy(() => import('./pages/BeginnerProfile'));
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


const Root: React.FC = () => {
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
        <Layout>
            <ScrollToTop />
            <Suspense fallback={<LoadingFallback />}>
                <ReactRouterDOM.Outlet />
            </Suspense>
        </Layout>
    );
}

const App: React.FC = () => {

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        if (import.meta.env.PROD) {
          navigator.serviceWorker.register('/sw.js').catch(() => {
            /* silent */
          });
        }
      });
    }
  }, []);

  const router = ReactRouterDOM.createHashRouter([
    {
      element: <Root />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/agence', element: <Agency /> },
        { path: '/mannequins', element: <Models /> },
        { path: '/mannequins/:id', element: <ModelDetail /> },
        { path: '/fashion-day', element: <FashionDay /> },
        { path: '/magazine', element: <Magazine /> },
        { path: '/magazine/:slug', element: <ArticleDetail /> },
        { path: '/contact', element: <Contact /> },
        { path: '/services', element: <Services /> },
        { path: '/services/:slug', element: <ServiceDetail /> },
        { path: '/casting', element: <Casting /> },
        { path: '/casting-formulaire', element: <CastingForm /> },
        { path: '/fashion-day-application', element: <FashionDayApplicationForm /> },
        { path: '/login', element: <Login /> },
        { path: '/privacy-policy', element: <PrivacyPolicy /> },
        { path: '/terms-of-use', element: <TermsOfUse /> },
        { path: '/chat', element: <Chat /> },
        // Protected
        { path: '/formations', element: <ProtectedRoute role="student"><Activity /></ProtectedRoute> },
        { path: '/formations/forum', element: <ProtectedRoute role="student"><ClassroomForum /></ProtectedRoute> },
        { path: '/formations/forum/:threadId', element: <ProtectedRoute role="student"><ForumThread /></ProtectedRoute> },
        { path: '/formations/:moduleSlug/:chapterSlug', element: <ProtectedRoute role="student"><ChapterDetail /></ProtectedRoute> },
        { path: '/profil', element: <ProtectedRoute role="student"><ModelDashboard /></ProtectedRoute> },
        { path: '/classroom-debutant', element: <ProtectedRoute role="beginner"><BeginnerClassroom /></ProtectedRoute> },
        { path: '/classroom-debutant/:moduleSlug/:chapterSlug', element: <ProtectedRoute role="beginner"><BeginnerChapterDetail /></ProtectedRoute> },
        { path: '/profil-debutant', element: <ProtectedRoute role="beginner"><BeginnerProfile /></ProtectedRoute> },
        { path: '/jury/casting', element: <ProtectedRoute role="jury"><JuryCasting /></ProtectedRoute> },
        { path: '/enregistrement/casting', element: <ProtectedRoute role="registration"><RegistrationCasting /></ProtectedRoute> },
        { path: '/admin', element: <ProtectedRoute role="admin"><Admin /></ProtectedRoute> },
        { path: '/admin/models', element: <ProtectedRoute role="admin"><AdminModels /></ProtectedRoute> },
        { path: '/admin/magazine', element: <ProtectedRoute role="admin"><AdminMagazine /></ProtectedRoute> },
        { path: '/admin/classroom', element: <ProtectedRoute role="admin"><AdminClassroom /></ProtectedRoute> },
        { path: '/admin/settings', element: <ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute> },
        { path: '/admin/agency', element: <ProtectedRoute role="admin"><AdminAgency /></ProtectedRoute> },
        { path: '/admin/casting-applications', element: <ProtectedRoute role="admin"><AdminCasting /></ProtectedRoute> },
        { path: '/admin/casting-results', element: <ProtectedRoute role="admin"><AdminCastingResults /></ProtectedRoute> },
        { path: '/admin/fashion-day-applications', element: <ProtectedRoute role="admin"><AdminFashionDay /></ProtectedRoute> },
        { path: '/admin/fashion-day-events', element: <ProtectedRoute role="admin"><AdminFashionDayEvents /></ProtectedRoute> },
        { path: '/admin/news', element: <ProtectedRoute role="admin"><AdminNews /></ProtectedRoute> },
        { path: '/admin/classroom-progress', element: <ProtectedRoute role="admin"><AdminClassroomProgress /></ProtectedRoute> },
        { path: '/admin/model-access', element: <ProtectedRoute role="admin"><AdminModelAccess /></ProtectedRoute> },
        { path: '/admin/beginner-students-access', element: <ProtectedRoute role="admin"><AdminBeginnerStudents /></ProtectedRoute> },
        { path: '/admin/recovery-requests', element: <ProtectedRoute role="admin"><AdminRecovery /></ProtectedRoute> },
        { path: '/admin/comments', element: <ProtectedRoute role="admin"><AdminComments /></ProtectedRoute> },
        { path: '/admin/messages', element: <ProtectedRoute role="admin"><AdminMessages /></ProtectedRoute> },
        { path: '/admin/bookings', element: <ProtectedRoute role="admin"><AdminBookings /></ProtectedRoute> },
        { path: '/admin/payments', element: <ProtectedRoute role="admin"><AdminPayments /></ProtectedRoute> },
        { path: '/admin/absences', element: <ProtectedRoute role="admin"><AdminAbsences /></ProtectedRoute> },
        { path: '/admin/artistic-direction', element: <ProtectedRoute role="admin"><AdminArtisticDirection /></ProtectedRoute> },
        { path: '*', element: <NotFound /> },
      ],
    }
  ]);

  return (
    <DataProvider>
      <ReactRouterDOM.RouterProvider router={router} future={{ v7_startTransition: true, v7_relativeSplatPath: true }} />
    </DataProvider>
  );
};

export default App;