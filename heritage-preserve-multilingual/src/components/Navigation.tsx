import React, { useState } from 'react';
import { Button } from './ui/Button';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-indigo-950/80 backdrop-blur-lg border-b border-silver/10 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-serif font-bold text-gold">Ejiogbe Voices</h1>
          <div className="flex gap-4">
            <Button
              variant={currentView === 'home' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('home')}
            >
              Recordings
            </Button>
            <Button
              variant={currentView === 'elders' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('elders')}
            >
              Elders
            </Button>
            <Button
              variant={currentView === 'playlists' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('playlists')}
            >
              Playlists
            </Button>
            <Button
              variant={currentView === 'admin' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('admin')}
            >
              Admin
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </Button>
          <Button variant="gold" size="sm" onClick={() => onNavigate('upload')}>
            Upload
          </Button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-indigo-950/95 backdrop-blur-lg border-t border-silver/10 z-50">
        <div className="flex justify-around py-3">
          {['home', 'elders', 'playlists', 'admin'].map((view) => (
            <button
              key={view}
              onClick={() => onNavigate(view)}
              className={`flex flex-col items-center gap-1 px-4 py-2 ${
                currentView === view ? 'text-cerulean' : 'text-silver'
              }`}
            >
              <span className="text-xl">
                {view === 'home' && '🎵'}
                {view === 'elders' && '👤'}
                {view === 'playlists' && '📋'}
                {view === 'admin' && '⚙️'}
              </span>
              <span className="text-xs capitalize">{view}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};
