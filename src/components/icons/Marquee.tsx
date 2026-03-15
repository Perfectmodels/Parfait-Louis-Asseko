import React from 'react';

const Marquee: React.FC<{ items: string[] }> = ({ items }) => {
    return (
        <div>{items.join(' - ')}</div>
    );
};

export default Marquee;