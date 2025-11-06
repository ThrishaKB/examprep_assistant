
import React from 'react';
import { Section } from '../types';
import BookOpenIcon from './icons/BookOpenIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import PencilAltIcon from './icons/PencilAltIcon';
import ClockIcon from './icons/ClockIcon';

interface HeaderProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, setActiveSection }) => {
  const navItems = [
    { id: 'revision', label: 'Revision Materials', icon: <BookOpenIcon /> },
    { id: 'pyqs', label: 'PYQs & Weightage', icon: <ClipboardListIcon /> },
    { id: 'mockTest', label: 'Mock Test', icon: <PencilAltIcon /> },
    { id: 'history', label: 'Test History', icon: <ClockIcon /> },
  ];

  return (
    <nav className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2 bg-white p-2 rounded-xl shadow-md">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveSection(item.id as Section)}
          className={`w-full sm:w-auto flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            activeSection === item.id
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-transparent text-slate-600 hover:bg-slate-200'
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Header;