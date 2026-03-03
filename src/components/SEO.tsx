import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  schema?: any;
  noIndex?: boolean;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords, image, schema, noIndex }) => {
  return null;
};

export default SEO;
