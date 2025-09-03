
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
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
            <Route path="/admin/mannequins" element={<ProtectedRoute role="admin"><AdminModels /></ProtectedRoute>} />
            <Route path="/admin/magazine" element={<ProtectedRoute role="admin"><AdminMagazine /></ProtectedRoute>} />
            <Route path="/admin/classroom" element={<ProtectedRoute role="admin"><AdminClassroom /></ProtectedRoute>} />
            <Route path="/admin/parametres" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />
            <Route path="/admin/candidatures" element={<ProtectedRoute role="admin"><AdminCasting /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </HashRouter>
    </DataProvider>
  );
};

export default App;