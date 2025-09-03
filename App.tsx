
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
import Login from './pages/Login';
import NotFound from './pages/NotFound';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
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
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;