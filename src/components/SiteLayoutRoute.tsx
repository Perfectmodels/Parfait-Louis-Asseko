import React from 'react';
import Layout from './icons/Layout';
import { Outlet } from 'react-router-dom';

interface SiteLayoutRouteProps {
  children?: React.ReactNode;
}

const SiteLayoutRoute: React.FC<SiteLayoutRouteProps> = ({ children }) => {
  return (
    <Layout>
      {children || <Outlet />}
    </Layout>
  );
};

export default SiteLayoutRoute;
