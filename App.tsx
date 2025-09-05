import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Agency from './pages/Agency';
import Models from './pages/Models';
import ModelDetail from './pages/ModelDetail';
import FashionDay from './pages/FashionDay';
import Magazine from './pages/Magazine';
import ArticleDetail from './pages/ArticleDetail';
import Contact from './pages/Contact';
import CastingForm from './pages/CastingForm';
import FashionDayApplicationForm from './pages/FashionDayApplicationForm';
import Activity from './pages/Activity'; // Named Formations in nav
import ChapterDetail from './pages/ChapterDetail';
import Login from './pages/Login';
import ModelDashboard from './pages/ModelDashboard';
import Admin from './pages/Admin';
import AdminModels from './pages/AdminModels';
import AdminMagazine from './pages/AdminMagazine';
import AdminClassroom from './pages/AdminClassroom';
import AdminSettings from './pages/AdminSettings';
import AdminCasting from './pages/AdminCasting';
import AdminFashionDay from './pages/AdminFashionDay';
import AdminAgency from './pages/AdminAgency';
import AdminFashionDayEvents from './pages/AdminFashionDayEvents';
import AdminClassroomProgress from './pages/AdminClassroomProgress';
import AdminModelAccess from './pages/AdminModelAccess';
import AdminNews from './pages/AdminNews';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import Chat from './pages/Chat';
import AIAssistantIcon from './components/AIAssistantIcon';
import ClassroomForum from './pages/ClassroomForum';
import ForumThread from './pages/ForumThread';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import { useEffect } from 'react';
import Services from './pages/Services';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Component to decide whether to show AI icon
const AppContent: React.FC = () => {
    const location = useLocation();
    const hideAIAssistant = location.pathname.startsWith('/admin') || location.pathname === '/chat';

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
                    <Route path="/services" element={<Services />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/casting-formulaire" element={<CastingForm />} />
                    <Route path="/fashion-day-application" element={<FashionDayApplicationForm />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-use" element={<TermsOfUse />} />

                    {/* Protected Model Routes */}
                    <Route path="/profil" element={<ProtectedRoute role="model"><ModelDashboard /></ProtectedRoute>} />
                    <Route path="/formations" element={<ProtectedRoute role="model"><Activity /></ProtectedRoute>} />
                    <Route path="/formations/:moduleSlug/:chapterSlug" element={<ProtectedRoute role="model"><ChapterDetail /></ProtectedRoute>} />
                    <Route path="/formations/forum" element={<ProtectedRoute role="model"><ClassroomForum /></ProtectedRoute>} />
                    <Route path="/formations/forum/:threadId" element={<ProtectedRoute role="model"><ForumThread /></ProtectedRoute>} />

                    {/* Protected Admin Routes */}
                    <Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
                    <Route path="/admin/mannequins" element={<ProtectedRoute role="admin"><AdminModels /></ProtectedRoute>} />
                    <Route path="/admin/magazine" element={<ProtectedRoute role="admin"><AdminMagazine /></ProtectedRoute>} />
                    <Route path="/admin/classroom" element={<ProtectedRoute role="admin"><AdminClassroom /></ProtectedRoute>} />
                    <Route path="/admin/parametres" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />
                    <Route path="/admin/candidatures-casting" element={<ProtectedRoute role="admin"><AdminCasting /></ProtectedRoute>} />
                    <Route path="/admin/fashion-day-apps" element={<ProtectedRoute role="admin"><AdminFashionDay /></ProtectedRoute>} />
                    <Route path="/admin/agence" element={<ProtectedRoute role="admin"><AdminAgency /></ProtectedRoute>} />
                    <Route path="/admin/pfd-events" element={<ProtectedRoute role="admin"><AdminFashionDayEvents /></ProtectedRoute>} />
                    <Route path="/admin/suivi-classroom" element={<ProtectedRoute role="admin"><AdminClassroomProgress /></ProtectedRoute>} />
                    <Route path="/admin/acces-mannequins" element={<ProtectedRoute role="admin"><AdminModelAccess /></ProtectedRoute>} />
                    <Route path="/admin/actualites" element={<ProtectedRoute role="admin"><AdminNews /></ProtectedRoute>} />
                    
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
            {!hideAIAssistant && <AIAssistantIcon />}
        </>
    );
};


const App: React.FC = () => {
  return (
    <DataProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </DataProvider>
  );
};

export default App;