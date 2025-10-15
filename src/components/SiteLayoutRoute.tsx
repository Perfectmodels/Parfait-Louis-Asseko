import React from 'react';
import Layout from './icons/Layout';
import { Outlet } from 'react-router-dom';

const SiteLayoutRoute: React.FC = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default SiteLayoutRoute;
