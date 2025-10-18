import React, { useEffect, lazy, Suspense, useRef } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './contexts/DataContext';
import ProtectedRoute from './components/ProtectedRoute';
import SiteLayoutRoute from './components/SiteLayoutRoute';
import AdminLayout from './components/admin/AdminLayout';

// Lazy-loaded Pages
const Home = lazy(() => import('./pages/Home'));
const Agency = lazy(() => import('./pages/Agency'));
const Models = lazy(() => import('./pages/Models'));
const ModelDetail = lazy(() => import('./pages/ModelDetail'));
const FashionDay = lazy(() => import('./pages/FashionDay'));
const Magazine = lazy(() => import('./pages/Magazine'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Gallery = lazy(() => import('./pages/Gallery'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const AlbumDetail = lazy(() => import('./pages/AlbumDetail'));
const FashionDayEdition = lazy(() => import('./pages/FashionDayEdition'));
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
const AdminRecovery = lazy(() => import('./pages/AdminRecovery'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));
const AdminComments = lazy(() => import('./pages/AdminComments'));
const AdminBookings = lazy(() => import('./pages/AdminBookings'));
const AdminMessages = lazy(() => import('./pages/AdminMessages'));
const AdminPayments = lazy(() => import('./pages/AdminPayments'));
const AdminAbsences = lazy(() => import('./pages/AdminAbsences'));
const AdminArtisticDirection = lazy(() => import('./pages/AdminArtisticDirection'));
const AdminApiKeys = lazy(() => import('./pages/AdminApiKeys'));
const AdminProfile = lazy(() => import('./pages/AdminProfile'));
const AdminGallery = lazy(() => import('./pages/AdminGallery'));
// New admin pages (pilotage)
const AdminReports = lazy(() => import('./admin/pages/AdminReports'));
const AdminCalendar = lazy(() => import('./admin/pages/AdminCalendar'));
const AdminAuditLog = lazy(() => import('./admin/pages/AdminAuditLog'));


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

const LoadingFallback: React.FC<{fullscreen?: boolean}> = ({ fullscreen = false }) => (
  <div className={`w-full ${fullscreen ? 'min-h-[60vh]' : 'py-40'} flex items-center justify-center`}>
    <p className="text-pm-gold text-2xl font-playfair animate-pulse">Chargement...</p>
  </div>
);


const AppContent: React.FC = () => {
    const location = useLocation();
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


    if (!isInitialized || !data) {
      return <LoadingFallback fullscreen />;
    }

    return (
        <>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    {/* Public and non-admin protected routes under site layout */}
                    <Route element={<SiteLayoutRoute />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/agence" element={<Agency />} />
                        <Route path="/mannequins" element={<Models />} />
                        <Route path="/mannequins/:id" element={<ModelDetail />} />
                        <Route path="/fashion-day" element={<FashionDay />} />
                        <Route path="/magazine" element={<Magazine />} />
                        <Route path="/magazine/:slug" element={<ArticleDetail />} />
                        <Route path="/actualites/:id" element={<NewsDetail />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/galerie" element={<Gallery />} />
                        <Route path="/galerie/albums/:id" element={<AlbumDetail />} />
                        <Route path="/services/:slug" element={<ServiceDetail />} />
                        <Route path="/casting" element={<Casting />} />
                        <Route path="/casting-formulaire" element={<CastingForm />} />
                        <Route path="/fashion-day-application" element={<FashionDayApplicationForm />} />
                        <Route path="/fashion-day/:edition" element={<FashionDayEdition />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-of-use" element={<TermsOfUse />} />
                        <Route path="/chat" element={<Chat />} />

                        {/* Protected non-admin routes */}
                        <Route path="/formations" element={<ProtectedRoute role="student"><Activity /></ProtectedRoute>} />
                        <Route path="/formations/forum" element={<ProtectedRoute role="student"><ClassroomForum /></ProtectedRoute>} />
                        <Route path="/formations/forum/:threadId" element={<ProtectedRoute role="student"><ForumThread /></ProtectedRoute>} />
                        <Route path="/formations/:moduleSlug/:chapterSlug" element={<ProtectedRoute role="student"><ChapterDetail /></ProtectedRoute>} />
                        <Route path="/profil" element={<ProtectedRoute role="student"><ModelDashboard /></ProtectedRoute>} />
                        <Route path="/panel" element={<ProtectedRoute role="student"><ModelDashboard /></ProtectedRoute>} />

                        {/* Classroom Débutant retiré */}

                        <Route path="/jury/casting" element={<ProtectedRoute role="jury"><JuryCasting /></ProtectedRoute>} />
                        <Route path="/enregistrement/casting" element={<ProtectedRoute role="registration"><RegistrationCasting /></ProtectedRoute>} />
                    </Route>

                    {/* Admin routes with dedicated layout and nesting */}
                    <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
                        <Route index element={<Admin />} />
                        <Route path="profile" element={<AdminProfile />} />
                        <Route path="api-keys" element={<AdminApiKeys />} />
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
                        {/* Débutants retiré du panel admin */}
                        <Route path="recovery-requests" element={<AdminRecovery />} />
                        <Route path="comments" element={<AdminComments />} />
                        <Route path="messages" element={<AdminMessages />} />
                        <Route path="bookings" element={<AdminBookings />} />
                        <Route path="payments" element={<AdminPayments />} />
                        <Route path="absences" element={<AdminAbsences />} />
                        <Route path="artistic-direction" element={<AdminArtisticDirection />} />
                        <Route path="gallery" element={<AdminGallery />} />
                        {/* Pilotage */}
                        <Route path="reports" element={<AdminReports />} />
                        <Route path="calendar" element={<AdminCalendar />} />
                        <Route path="audit-log" element={<AdminAuditLog />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </>
    );
}

const App: React.FC = () => {
  // Register service worker
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

  // Rehydrate session from localStorage for up to 72 hours
  useEffect(() => {
    try {
      const raw = localStorage.getItem('pmm_auth');
      if (!raw) return;
      const auth = JSON.parse(raw) as { role: string; userId?: string; adminId?: string; expiresAt: number };
      if (!auth || !auth.expiresAt || Date.now() > auth.expiresAt) {
        localStorage.removeItem('pmm_auth');
        return;
      }
      // If sessionStorage not already set, restore minimal keys used across the app
      if (!sessionStorage.getItem('classroom_access')) {
        sessionStorage.setItem('classroom_access', 'granted');
        sessionStorage.setItem('classroom_role', auth.role);
        if (auth.adminId) sessionStorage.setItem('admin_id', auth.adminId);
        if (auth.userId) sessionStorage.setItem('userId', auth.userId);
      }
    } catch {
      // ignore
    }
  }, []);

  // Capture PWA beforeinstallprompt and optionally trigger after login
  const deferredPromptRef = useRef<any>(null);
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      (window as any).pmmDeferredPrompt = e;

      // If login requested an install prompt, show it now
      if (localStorage.getItem('pmm_install_on_login') === '1') {
        try {
          e.prompt();
          e.userChoice?.finally?.(() => {
            localStorage.removeItem('pmm_install_on_login');
            deferredPromptRef.current = null;
            (window as any).pmmDeferredPrompt = null;
          });
        } catch {
          // no-op
        }
      }
    };

    const handleInstalled = () => {
      localStorage.removeItem('pmm_install_on_login');
      deferredPromptRef.current = null;
      (window as any).pmmDeferredPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall as any);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall as any);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  return (
    <DataProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </DataProvider>
  );
};

export default App;