import React from 'react';

const PhysicsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
        <circle cx="8" cy="8" r="2" />
        <circle cx="12" cy="8" r="2" />
        <circle cx="16" cy="8" r="2" />
        <circle cx="8" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="16" cy="12" r="2" />
        <circle cx="8" cy="16" r="2" />
        <circle cx="12" cy="16" r="2" />
        <circle cx="16" cy="16" r="2" />
    </svg>
);

export default PhysicsIcon;