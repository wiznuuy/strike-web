import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { MainPage } from './components/MainPage';
import { WritePage } from './components/WritePage';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
    <div className="min-h-[calc(100vh-60px)] bg-[#FCF3E3] flex justify-center items-center">
        <h1 className="text-3xl font-bold text-gray-700">{title} Page Coming Soon!</h1>
    </div>
);

const App: React.FC = () => {
  const [page, setPage] = useState<'main' | 'write' | 'team' | 'my'>('main');

  const renderPage = () => {
    switch (page) {
      case 'write':
        return <WritePage onFinish={() => setPage('main')} />;
      case 'team':
        return <PlaceholderPage title="Team" />;
      case 'my':
        return <PlaceholderPage title="My" />;
      case 'main':
      default:
        return <MainPage />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar setPage={setPage} />
      <main>{renderPage()}</main>
    </div>
  );
};

export default App;