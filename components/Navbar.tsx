import React from 'react';

const BaseballIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-8 h-8">
        <circle cx="50" cy="50" r="48" fill="white" stroke="#333" strokeWidth="2"/>
        <path d="M25,25 C40,40 60,40 75,25" fill="none" stroke="#D93B3B" strokeWidth="4"/>
        <path d="M25,75 C40,60 60,60 75,75" fill="none" stroke="#D93B3B" strokeWidth="4"/>
    </svg>
);

interface NavbarProps {
  setPage: (page: 'main' | 'write' | 'team' | 'my') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setPage }) => {
  return (
    <header className="bg-[#FCF3E3] text-black py-2 px-6 flex justify-between items-center shadow-md sticky top-0 z-10">
      <button onClick={() => setPage('main')} className="text-2xl font-bold tracking-wider">
        STRIKE
      </button>
      <nav className="flex items-center space-x-8 text-lg font-semibold">
        <button onClick={() => setPage('write')} className="hover:text-red-600 transition-colors">WRITE</button>
        <button onClick={() => setPage('team')} className="hover:text-red-600 transition-colors">TEAM</button>
        <button onClick={() => setPage('my')} className="hover:text-red-600 transition-colors">MY</button>
      </nav>
      <div>
        <BaseballIcon />
      </div>
    </header>
  );
};