import React, { useState } from 'react';

interface NavigationProps {
  onAdminClick: () => void;
  currentView: 'home' | 'admin';
}

export const Navigation: React.FC<NavigationProps> = ({ onAdminClick, currentView }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Ejiogbe Voices
            </h1>
            <div className="hidden md:flex gap-6">
              <button
                onClick={() => currentView === 'admin' && onAdminClick()}
                className="text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                Recordings
              </button>
              <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                Elders
              </a>
              <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                Playlists
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={onAdminClick}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentView === 'admin'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {currentView === 'admin' ? 'Back to Home' : 'Admin Dashboard'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
