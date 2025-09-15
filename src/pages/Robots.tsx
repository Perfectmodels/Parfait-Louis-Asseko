import React from 'react';

const Robots: React.FC = () => {
  const robotsTxtContent = `User-agent: *
Allow: /

Sitemap: https://www.perfectmodels.ga/sitemap.xml
`;

  // This effect will replace the current HTML document with plain text.
  // It's a workaround for Single-Page-Applications to serve text-based files dynamically
  // without needing actual files on the server, which is useful for platforms like AI Studio.
  React.useEffect(() => {
    document.open('text/plain');
    document.write(robotsTxtContent);
    document.close();
  }, [robotsTxtContent]);

  return null; // The component itself renders nothing, the effect does all the work.
};

export default Robots;