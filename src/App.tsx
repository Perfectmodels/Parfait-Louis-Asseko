import React, { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { DataProvider, useData } from 'contexts/DataContext';
import Layout from 'components/Layout';
import ProtectedRoute from 'components/ProtectedRoute';

// Pages
import Home from 'pages/Home';
import Agency from 'pages/Agency';
import Models from 'pages/Models';
import ModelDetail from 'pages/ModelDetail';
import FashionDay from 'pages/FashionDay';
import Magazine from 'pages/Magazine';
import ArticleDetail from 'pages/ArticleDetail';
import Contact from 'pages/Contact';
import Services from 'pages/Services';
import Casting from 'pages/Casting';
import CastingForm from 'pages/CastingForm';
import FashionDayApplicationForm from 'pages/FashionDayApplicationForm';
import Login from 'pages/Login';
import Activity from 'pages/Activity'; // Renamed Formations
import ChapterDetail from 'pages/ChapterDetail';
import ModelDashboard from 'pages/ModelDashboard'; // Profil
import ClassroomForum from 'pages/ClassroomForum';
import ForumThread from 'pages/ForumThread';
import Chat from 'pages/Chat';


// Admin Pages
import Admin from 'pages/Admin';
import AdminAgency from 'pages/AdminAgency';
import AdminCasting from 'pages/AdminCasting';
import AdminCastingResults from 'pages/AdminCastingResults'; // Nouvelle page
import AdminClassroom from 'pages/AdminClassroom';
import AdminClassroomProgress from 'pages/AdminClassroomProgress';
import AdminFashionDay from 'pages/AdminFashionDay';
import AdminFashionDayEvents from 'pages/AdminFashionDayEvents';
import AdminMagazine from 'pages/AdminMagazine';
import AdminModelAccess from 'pages/AdminModelAccess';
import AdminModels from 'pages/AdminModels';
import AdminNews from 'pages/AdminNews';
import AdminRecovery from 'pages/AdminRecovery';
import AdminSettings from 'pages/AdminSettings';
import AdminComments from 'pages/AdminComments';
import AdminBookings from 'pages/AdminBookings';
import AdminMessages from 'pages/AdminMessages';

// Role-specific pages
import JuryCasting from 'pages/JuryCasting';
import RegistrationCasting from 'pages/RegistrationCasting';

// Static Pages
import PrivacyPolicy from 'pages/PrivacyPolicy';
import TermsOfUse from 'pages/TermsOfUse';
import NotFound from 'pages/NotFound';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
    const location = useLocation();
    const { data } = useData();
    const hideAIAssistant = [
        '/login', '/admin', '/jury', '/enregistrement', '/profil', '/chat'
    ].some(path => location.pathname.startsWith(path));

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
                    <Route path="/casting" element={<Casting />} />
                    <Route path="/casting-formulaire" element={<CastingForm />} />
                    <Route path="/fashion-day-application" element={<FashionDayApplicationForm />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-use" element={<TermsOfUse />} />

                    {/* Protected Routes */}
                    <Route path="/formations" element={<ProtectedRoute role="student"><Activity /></ProtectedRoute>} />
                    <Route path="/formations/forum" element={<ProtectedRoute role="student"><ClassroomForum /></ProtectedRoute>} />
                    <Route path="/formations/forum/:threadId" element={<ProtectedRoute role="student"><ForumThread /></ProtectedRoute>} />
                    <Route path="/formations/:moduleSlug/:chapterSlug" element={<ProtectedRoute role="student"><ChapterDetail /></ProtectedRoute>} />
                    <Route path="/profil" element={<ProtectedRoute role="student"><ModelDashboard /></ProtectedRoute>} />
                    
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
                    <Route path="/admin/recovery-requests" element={<ProtectedRoute role="admin"><AdminRecovery /></ProtectedRoute>} />
                    <Route path="/admin/comments" element={<ProtectedRoute role="admin"><AdminComments /></ProtectedRoute>} />
                    <Route path="/admin/messages" element={<ProtectedRoute role="admin"><AdminMessages /></ProtectedRoute>} />
                    <Route path="/admin/bookings" element={<ProtectedRoute role="admin"><AdminBookings /></ProtectedRoute>} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
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