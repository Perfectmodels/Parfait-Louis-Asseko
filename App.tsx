import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Agency from './pages/Agency';
import Models from './pages/Models';
import ModelDetail from './pages/ModelDetail';
import FashionDay from './pages/FashionDay';
import Magazine from './pages/Magazine';
import ArticleDetail from './pages/ArticleDetail';
import Formations from './pages/Activity';
import ChapterDetail from './pages/ChapterDetail';
import Contact from './pages/Contact';
import Casting from './pages/Casting';
import CastingForm from './pages/CastingForm';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { DataProvider } from './contexts/DataContext';
import Admin from './pages/Admin';
import AdminModels from './pages/AdminModels';
import AdminMagazine from './pages/AdminMagazine';
import AdminClassroom from './pages/AdminClassroom';
import AdminSettings from './pages/AdminSettings';
import ProtectedRoute from './components/ProtectedRoute';
import AdminCasting from './pages/AdminCasting';
import FashionDayApplicationForm from './pages/FashionDayApplicationForm';
import AdminFashionDayApps from './pages/AdminFashionDay';
import AdminAgency from './pages/AdminAgency';
import AdminFashionDayEvents from './pages/AdminFashionDayEvents';
import ModelDashboard from './pages/ModelDashboard';
import AdminClassroomProgress from './pages/AdminClassroomProgress';
import AdminModelAccess from './pages/AdminModelAccess';
import AdminNews from './pages/AdminNews';
import ClassroomForum from './pages/ClassroomForum';
import ForumThread from './pages/ForumThread';


const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <HashRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/agence" element={<Agency />} />
            <Route path="/mannequins" element={<Models />} />
            <Route path="/mannequins/:id" element={<ModelDetail />} />
            <Route path="/fashion-day" element={<FashionDay />} />
            <Route path="/magazine" element={<Magazine />} />
            <Route path="/magazine/:slug" element={<ArticleDetail />} />
            <Route path="/formations" element={<Formations />} />
            <Route path="/formations/:moduleSlug/:chapterSlug" element={<ChapterDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/casting" element={<Casting />} />
            <Route path="/casting-formulaire" element={<CastingForm />} />
            <Route path="/fashion-day-application" element={<FashionDayApplicationForm />} />
            <Route path="/login" element={<Login />} />

            {/* Model Routes */}
            <Route path="/profil" element={
              <ProtectedRoute role="model"><ModelDashboard /></ProtectedRoute>
            } />
            <Route path="/formations/forum" element={
              <ProtectedRoute role="model"><ClassroomForum /></ProtectedRoute>
            } />
            <Route path="/formations/forum/:threadId" element={
              <ProtectedRoute role="model"><ForumThread /></ProtectedRoute>
            } />


            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute role="admin"><Admin /></ProtectedRoute>
            } />
            <Route path="/admin/mannequins" element={
              <ProtectedRoute role="admin"><AdminModels /></ProtectedRoute>
            } />
            <Route path="/admin/acces-mannequins" element={
              <ProtectedRoute role="admin"><AdminModelAccess /></ProtectedRoute>
            } />
            <Route path="/admin/magazine" element={
              <ProtectedRoute role="admin"><AdminMagazine /></ProtectedRoute>
            } />
            <Route path="/admin/actualites" element={
              <ProtectedRoute role="admin"><AdminNews /></ProtectedRoute>
            } />
            <Route path="/admin/classroom" element={
              <ProtectedRoute role="admin"><AdminClassroom /></ProtectedRoute>
            } />
            <Route path="/admin/suivi-classroom" element={
              <ProtectedRoute role="admin"><AdminClassroomProgress /></ProtectedRoute>
            } />
            <Route path="/admin/candidatures-casting" element={
              <ProtectedRoute role="admin"><AdminCasting /></ProtectedRoute>
            } />
            <Route path="/admin/fashion-day-apps" element={
              <ProtectedRoute role="admin"><AdminFashionDayApps /></ProtectedRoute>
            } />
            <Route path="/admin/agence" element={
              <ProtectedRoute role="admin"><AdminAgency /></ProtectedRoute>
            } />
            <Route path="/admin/pfd-events" element={
              <ProtectedRoute role="admin"><AdminFashionDayEvents /></ProtectedRoute>
            } />
            <Route path="/admin/parametres" element={
              <ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </HashRouter>
    </DataProvider>
  );
};

export default App;