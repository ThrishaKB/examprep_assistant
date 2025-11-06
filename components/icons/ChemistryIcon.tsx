import React from 'react';

const ChemistryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5m-9.25-11.396c.251.023.501.05.75.082" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 14.5h14M5 14.5v5.25c0 .621.504 1.125 1.125 1.125h11.75c.621 0 1.125-.504 1.125-1.125V14.5" />
  </svg>
);

export default ChemistryIcon;