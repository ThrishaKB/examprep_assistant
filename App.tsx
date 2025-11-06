
import React, { useState } from 'react';
import { Section } from './types';
import Header from './components/Header';
import RevisionMaterials from './components/RevisionMaterials';
import PYQsWeightage from './components/PYQsWeightage';
import MockTest from './components/MockTest';
import History from './components/History';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('revision');

  const renderSection = () => {
    switch (activeSection) {
      case 'revision':
        return <RevisionMaterials />;
      case 'pyqs':
        return <PYQsWeightage />;
      case 'mockTest':
        return <MockTest />;
      case 'history':
        return <History />;
      default:
        return <RevisionMaterials />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">AI Exam Prep Assistant</h1>
          <p className="text-slate-600 mt-2 text-lg">Your smart partner for board exam success.</p>
        </header>
        
        <Header activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <main className="mt-8">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default App;