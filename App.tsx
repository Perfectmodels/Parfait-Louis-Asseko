import React, { useEffect } from 'react';
// FIX: Fix react-router-dom imports by using a namespace import
import * as ReactRouterDOM from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AIAssistantIcon from './components/AIAssistantIcon';

// Pages
import Home from './pages/Home';
import Agency from './pages/Agency';
import Models from './pages/Models';
import ModelDetail from './pages/ModelDetail';
import FashionDay from './pages/FashionDay';
import Magazine from './pages/Magazine';
import ArticleDetail from './pages/ArticleDetail';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Casting from './pages/Casting';
import CastingForm from './pages/CastingForm';
import FashionDayApplicationForm from './pages/FashionDayApplicationForm';
import Login from './pages/Login';
import Activity from './pages/Activity'; // Renamed Formations
import ChapterDetail from './pages/ChapterDetail';
import ModelDashboard from './pages/ModelDashboard'; // Profil
import ClassroomForum from './pages/ClassroomForum';
import ForumThread from './pages/ForumThread';
import Chat from './pages/Chat';

// Admin Pages
import Admin from './pages/Admin';
import AdminAgency from './pages/AdminAgency';
import AdminCasting from './pages/AdminCasting';
import AdminCastingLive from './pages/AdminCastingLive';
import AdminClassroom from './pages/AdminClassroom';
import AdminClassroomProgress from './pages/AdminClassroomProgress';
import AdminFashionDay from './pages/AdminFashionDay';
import AdminFashionDayEvents from './pages/AdminFashionDayEvents';
import AdminMagazine from './pages/AdminMagazine';
import AdminModelAccess from './pages/AdminModelAccess';
import AdminModels from './pages/AdminModels';
import AdminNews from './pages/AdminNews';
import AdminRecovery from './pages/AdminRecovery';
import AdminSettings from './pages/AdminSettings';
import AdminComments from './pages/AdminComments';

// Role-specific pages
import JuryCasting from './pages/JuryCasting';
import RegistrationCasting from './pages/RegistrationCasting';

// Static Pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import NotFound from './pages/NotFound';

const ScrollToTop = () => {
  const { pathname } = ReactRouterDOM.useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
    const location = ReactRouterDOM.useLocation();
    const hideAIAssistant = [
        '/login', '/admin', '/jury', '/enregistrement', '/profil', '/chat'
    ].some(path => location.pathname.startsWith(path));

    return (
        <>
            <Layout>
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
                    <ReactRouterDOM.Route path="/casting" element={<Casting />} />
                    <ReactRouterDOM.Route path="/casting-formulaire" element={<CastingForm />} />
                    <ReactRouterDOM.Route path="/fashion-day-application" element={<FashionDayApplicationForm />} />
                    <ReactRouterDOM.Route path="/login" element={<Login />} />
                    <ReactRouterDOM.Route path="/chat" element={<Chat />} />
                    <ReactRouterDOM.Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <ReactRouterDOM.Route path="/terms-of-use" element={<TermsOfUse />} />

                    {/* Protected Routes */}
                    <ReactRouterDOM.Route path="/formations" element={<ProtectedRoute role="model"><Activity /></ProtectedRoute>} />
                    <ReactRouterDOM.Route path="/formations/:moduleSlug/:chapterSlug" element={<ProtectedRoute role="model"><ChapterDetail /></ProtectedRoute>} />
                    <ReactRouterDOM.Route path="/profil" element={<ProtectedRoute role="model"><ModelDashboard /></ProtectedRoute>} />
                    <ReactRouterDOM.Route path="/formations/forum" element={<ProtectedRoute role="model"><ClassroomForum /></ProtectedRoute>} />
                    <ReactRouterDOM.Route path="/formations/forum/:threadId" element={<ProtectedRoute role="model"><ForumThread /></ProtectedRoute>} />
                    
                    <ReactRouterDOM.Route path="/jury/casting" element={<ProtectedRoute role="jury"><JuryCasting /></ProtectedRoute>} />
                    <ReactRouterDOM.Route path="/enregistrement/casting" element={<ProtectedRoute role="registration"><RegistrationCasting /></ProtectedRoute>} />
                    
                    <ReactRouterDOM.Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
                    <ReactRouterDOM.Route path="/admin/models" element={<ProtectedRoute role="admin"><AdminModels /></ProtectedRoute>} />
                    <ReactRouterDOM.Route path="/admin/magazine" element={<ProtectedRoute role="admin"><AdminMagazine /></ProtectedRoute>} />
                    <ReactRouterDOM.Route path="/admin/classroom" element={<ProtectedRoute role="admin"><AdminClassroom /></ProtectedRoute>} />
                    <ReactRouterDOM.Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />
                    <ReactRouterDOM.Route path="/admin/agency" element={<ProtectedRoute role="admin"><AdminAgency /></ProtectedRoute>} />
                    <ReactRouterDOM.Route path="/admin/casting-applications" element={<ProtectedRoute role="admin"><AdminCasting /></ProtectedRoute>} />
                    <ReactRouterDOM.Route path="/admin/fashion-day-applications" element={<ProtectedRoute role="admin"><AdminFashionDay /></ProtectedRoute>} />
                    <ReactRouterDOM.Route path="/admin/fashion-day-events" element={<ProtectedRoute role="admin"><AdminFashionDayEvents /></ProtectedRoute>} />
                    <ReactRouterDOM.Route path="/admin/news" element={<ProtectedRoute role="admin"><AdminNews /></ProtectedRoute>} />
                    <ReactRouterDOM.Route path="/admin/classroom-progress" element={<ProtectedRoute role="admin"><AdminClassroomProgress /></ProtectedRoute>} />
                    <ReactRouterDOM.Route path="/admin/model-access" element={<ProtectedRoute role="admin"><AdminModelAccess /></ProtectedRoute>} />
                    <ReactRouterDOM.Route path="/admin/recovery-requests" element={<ProtectedRoute role="admin"><AdminRecovery /></ProtectedRoute>} />
                    <ReactRouterDOM.Route path="/admin/casting-live" element={<ProtectedRoute role="admin"><AdminCastingLive /></ProtectedRoute>} />
                    <ReactRouterDOM.Route path="/admin/comments" element={<ProtectedRoute role="admin"><AdminComments /></ProtectedRoute>} />

                    <ReactRouterDOM.Route path="*" element={<NotFound />} />
                </ReactRouterDOM.Routes>
            </Layout>
            {!hideAIAssistant && <AIAssistantIcon />}
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
      <ReactRouterDOM.HashRouter>
        <ScrollToTop />
        <AppContent />
      </ReactRouterDOM.HashRouter>
    </DataProvider>
  );
};

export default App;