
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Agency from './pages/Agency';
import Models from './pages/Models';
import ModelDetail from './pages/ModelDetail';
import FashionDay from './pages/FashionDay';
import Magazine from './pages/Magazine';
import Application from './pages/Application';
import Activity from './pages/Activity';
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
          <Route path="/activite" element={<Activity />} />
          <Route path="/candidature" element={<Application />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
