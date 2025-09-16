// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import { DataProvider, useData } from './contexts/DataContext';
import Layout from './components/icons/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded Pages
const Home = ReactRouterDOM.lazy(() => import('./pages/Home'));
const Agency = ReactRouterDOM.lazy(() => import('./pages/Agency'));
const Models = ReactRouterDOM.lazy(() => import('./pages/Models'));
const ModelDetail = ReactRouterDOM.lazy(() => import('./pages/ModelDetail'));
const FashionDay = ReactRouterDOM.lazy(() => import('./pages/FashionDay'));
const Magazine = ReactRouterDOM.lazy(() => import('./pages/Magazine'));
const ArticleDetail = ReactRouterDOM.lazy(() => import('./pages/ArticleDetail'));
const Contact = ReactRouterDOM.lazy(() => import('./pages/Contact'));
const Services = ReactRouterDOM.lazy(() => import('./pages/Services'));
const ServiceDetail = ReactRouterDOM.lazy(() => import('./pages/ServiceDetail'));
const Casting = ReactRouterDOM.lazy(() => import('./pages/Casting'));
const CastingForm = ReactRouterDOM.lazy(() => import('./pages/CastingForm'));
const FashionDayApplicationForm = ReactRouterDOM.lazy(() => import('./pages/FashionDayApplicationForm'));
const Login = ReactRouterDOM.lazy(() => import('./pages/Login'));
const Activity = ReactRouterDOM.lazy(() => import('./pages/Activity')); // Renamed Formations
const ChapterDetail = ReactRouterDOM.lazy(() => import('./pages/ChapterDetail'));
const ModelDashboard = ReactRouterDOM.lazy(() => import('./pages/ModelDashboard')); // Profil
const ClassroomForum = ReactRouterDOM.lazy(() => import('./pages/ClassroomForum'));
const ForumThread = ReactRouterDOM.lazy(() => import('./pages/ForumThread'));
const BeginnerClassroom = ReactRouterDOM.lazy(() => import('./pages/BeginnerClassroom'));
const BeginnerChapterDetail = ReactRouterDOM.lazy(() => import('./pages/BeginnerChapterDetail'));
const Chat = ReactRouterDOM.lazy(() => import('./pages/Chat'));

// Admin Pages
const Admin = ReactRouterDOM.lazy(() => import('./pages/Admin'));
const AdminAgency = ReactRouterDOM.lazy(() => import('./pages/AdminAgency'));
const AdminCasting = ReactRouterDOM.lazy(() => import('./pages/AdminCasting'));
const AdminCastingResults = ReactRouterDOM.lazy(() => import('./pages/AdminCastingResults'));
const AdminClassroom = ReactRouterDOM.lazy(() => import('./pages/AdminClassroom'));
const AdminClassroomProgress = ReactRouterDOM.lazy(() => import('./pages/AdminClassroomProgress'));
const AdminFashionDay = ReactRouterDOM.lazy(() => import('./pages/AdminFashionDay'));
const AdminFashionDayEvents = ReactRouterDOM.lazy(() => import('./pages/AdminFashionDayEvents'));
const AdminMagazine = ReactRouterDOM.lazy(() => import('./pages/AdminMagazine'));
const AdminModelAccess = ReactRouterDOM.lazy(() => import('./pages/AdminModelAccess'));
const AdminModels = ReactRouterDOM.lazy(() => import('./pages/AdminModels'));
const AdminNews = ReactRouterDOM.lazy(() => import('./pages/AdminNews'));
const AdminRecovery = ReactRouterDOM.lazy(() => import('./pages/AdminRecovery'));
const AdminSettings = ReactRouterDOM.lazy(() => import('./pages/AdminSettings'));
const AdminComments = ReactRouterDOM.lazy(() => import('./pages/AdminComments'));
const AdminBookings = ReactRouterDOM.lazy(() => import('./pages/AdminBookings'));
const AdminMessages = ReactRouterDOM.lazy(() => import('./pages/AdminMessages'));
const AdminBeginnerStudents = ReactRouterDOM.lazy(() => import('./pages/AdminBeginnerStudents'));
const AdminPayments = ReactRouterDOM.lazy(() => import('./pages/AdminPayments'));
const AdminAbsences = ReactRouterDOM.lazy(() => import('./pages/AdminAbsences'));
const AdminArtisticDirection = ReactRouterDOM.lazy(() => import('./pages/AdminArtisticDirection'));

// Role-specific pages
const JuryCasting = ReactRouterDOM.lazy(() => import('./pages/JuryCasting'));
const RegistrationCasting = ReactRouterDOM.lazy(() => import('./pages/RegistrationCasting'));

// Static Pages
const PrivacyPolicy = ReactRouterDOM.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = ReactRouterDOM.lazy(() => import('./pages/TermsOfUse'));
const NotFound = ReactRouterDOM.lazy(() => import('./pages/NotFound'));


const ScrollToTop: React.FC = () => {
  const { pathname } = ReactRouterDOM.useLocation();
  ReactRouterDOM.useEffect(() => {
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
    ReactRouterDOM.useEffect(() => {
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
                <ReactRouterDOM.Suspense fallback={<LoadingFallback />}>
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

                        {/* Protected Routes */}
                        <ReactRouterDOM.Route path="/formations" element={<ProtectedRoute role="student"><Activity /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/formations/forum" element={<ProtectedRoute role="student"><ClassroomForum /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/formations/forum/:threadId" element={<ProtectedRoute role="student"><ForumThread /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/formations/:moduleSlug/:chapterSlug" element={<ProtectedRoute role="student"><ChapterDetail /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/profil" element={<ProtectedRoute role="student"><ModelDashboard /></ProtectedRoute>} />
                        
                        <ReactRouterDOM.Route path="/classroom-debutant" element={<ProtectedRoute role="beginner"><BeginnerClassroom /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/classroom-debutant/:moduleSlug/:chapterSlug" element={<ProtectedRoute role="beginner"><BeginnerChapterDetail /></ProtectedRoute>} />
                        
                        <ReactRouterDOM.Route path="/jury/casting" element={<ProtectedRoute role="jury"><JuryCasting /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/enregistrement/casting" element={<ProtectedRoute role="registration"><RegistrationCasting /></ProtectedRoute>} />
                        
                        <ReactRouterDOM.Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/models" element={<ProtectedRoute role="admin"><AdminModels /></ProtectedRoute>} />
                        <ReactRouterDOM.Route path="/admin/magazine" element={<ProtectedRoute role="admin"><AdminMagazine /></ProtectedRoute>} />
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
                </ReactRouterDOM.Suspense>
            </Layout>
        </>
    );
}

const App: React.FC = () => {

  ReactRouterDOM.useEffect(() => {
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
      <ReactRouterDOM.HashRouter>
        <ScrollToTop />
        <AppContent />
      </ReactRouterDOM.HashRouter>
    </DataProvider>
  );
};

export default App;