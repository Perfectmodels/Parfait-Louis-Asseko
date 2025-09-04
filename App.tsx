
import React from 'react';
// FIX: Updated react-router-dom imports for v5 compatibility. Replaced Routes with Switch.
import { HashRouter, Switch, Route, useLocation } from 'react-router-dom';
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
import Chat from './pages/Chat';
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
          {/* FIX: Using Switch and v5 Route syntax */}
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/agence" component={Agency} />
            <Route exact path="/mannequins" component={Models} />
            <Route path="/mannequins/:id" component={ModelDetail} />
            <Route path="/fashion-day" component={FashionDay} />
            <Route exact path="/magazine" component={Magazine} />
            <Route path="/magazine/:slug" component={ArticleDetail} />
            <Route exact path="/formations" component={Formations} />
            <Route path="/formations/:moduleSlug/:chapterSlug" component={ChapterDetail} />
            <Route path="/contact" component={Contact} />
            <Route path="/casting" component={Casting} />
            <Route path="/casting-formulaire" component={CastingForm} />
            <Route path="/fashion-day-application" component={FashionDayApplicationForm} />
            <Route path="/chat" component={Chat} />
            <Route path="/login" component={Login} />

            {/* Model Routes */}
            <Route path="/profil">
              <ProtectedRoute role="model"><ModelDashboard /></ProtectedRoute>
            </Route>

            {/* Admin Routes */}
            <Route exact path="/admin">
              <ProtectedRoute role="admin"><Admin /></ProtectedRoute>
            </Route>
            <Route path="/admin/mannequins">
              <ProtectedRoute role="admin"><AdminModels /></ProtectedRoute>
            </Route>
            <Route path="/admin/acces-mannequins">
              <ProtectedRoute role="admin"><AdminModelAccess /></ProtectedRoute>
            </Route>
            <Route path="/admin/magazine">
              <ProtectedRoute role="admin"><AdminMagazine /></ProtectedRoute>
            </Route>
            <Route path="/admin/actualites">
              <ProtectedRoute role="admin"><AdminNews /></ProtectedRoute>
            </Route>
            <Route path="/admin/classroom">
              <ProtectedRoute role="admin"><AdminClassroom /></ProtectedRoute>
            </Route>
            <Route path="/admin/suivi-classroom">
              <ProtectedRoute role="admin"><AdminClassroomProgress /></ProtectedRoute>
            </Route>
            <Route path="/admin/candidatures-casting">
              <ProtectedRoute role="admin"><AdminCasting /></ProtectedRoute>
            </Route>
            <Route path="/admin/fashion-day-apps">
              <ProtectedRoute role="admin"><AdminFashionDayApps /></ProtectedRoute>
            </Route>
            <Route path="/admin/agence">
              <ProtectedRoute role="admin"><AdminAgency /></ProtectedRoute>
            </Route>
            <Route path="/admin/pfd-events">
              <ProtectedRoute role="admin"><AdminFashionDayEvents /></ProtectedRoute>
            </Route>
            <Route path="/admin/parametres">
              <ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>
            </Route>
            
            <Route path="*" component={NotFound} />
          </Switch>
        </Layout>
      </HashRouter>
    </DataProvider>
  );
};

export default App;
