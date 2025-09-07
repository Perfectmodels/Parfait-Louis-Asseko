import React from 'react';
import { useData } from '../contexts/DataContext';

const Marquee: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return <div className="fixed top-0 left-0 right-0 z-50 h-8 bg-black"></div>;
  }

  const { models, fashionDayEvents, agencyPartners } = data;

  // Consolidate all names into one array
  const allItems = [
    ...new Set([
      ...models.map(m => m.name),
      ...fashionDayEvents.flatMap(e => e.stylists?.map(s => s.name) || []),
      ...fashionDayEvents.flatMap(e => e.partners?.map(p => p.name) || []),
      ...fashionDayEvents.map(e => e.theme),
      ...agencyPartners.map(p => p.name),
    ]),
  ].filter(Boolean); // Filter out any potential undefined/null values

  const marqueeItems = allItems.map((item, index) => (
    <React.Fragment key={index}>
      <span className="text-pm-gold">{item}</span>
      <span className="text-pm-off-white/50 mx-4">✦</span>
    </React.Fragment>
  ));

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-8 bg-black flex items-center border-b border-pm-gold/20 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Render the list twice for a seamless loop */}
        <div className="flex items-center px-4">{marqueeItems}</div>
        <div className="flex items-center px-4" aria-hidden="true">{marqueeItems}</div>
      </div>
    </div>
  );
};

export default Marquee;