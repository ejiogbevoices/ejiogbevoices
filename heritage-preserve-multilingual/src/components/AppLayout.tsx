import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { HomeView } from './HomeView';
import { RecordingDetail } from './RecordingDetail';
import { UploadForm } from './UploadForm';
import { EldersView } from './EldersView';
import { AdminDashboard } from './AdminDashboard';
import { PlaylistsView } from './PlaylistsView';
import { recordings } from '../data/recordings';

export default function AppLayout() {
  const [currentView, setCurrentView] = useState<'home' | 'recording' | 'upload' | 'elders' | 'admin' | 'playlists'>('home');
  const [selectedRecordingId, setSelectedRecordingId] = useState<string | null>(null);

  const handleNavigate = (view: string) => {
    setCurrentView(view as any);
    setSelectedRecordingId(null);
  };

  const handleRecordingClick = (recordingId: string) => {
    setSelectedRecordingId(recordingId);
    setCurrentView('recording');
  };

  const selectedRecording = selectedRecordingId 
    ? recordings.find(r => r.id === selectedRecordingId) 
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-[#0f1729] to-indigo-950">
      <Navigation currentView={currentView} onNavigate={handleNavigate} />
      
      <main className="px-6 py-8 max-w-7xl mx-auto pb-24 md:pb-8">
        {currentView === 'home' && (
          <HomeView 
            onRecordingClick={handleRecordingClick}
            onUploadClick={() => setCurrentView('upload')}
          />
        )}
        
        {currentView === 'recording' && selectedRecording && (
          <RecordingDetail 
            recording={selectedRecording}
            onBack={() => setCurrentView('home')}
          />
        )}
        
        {currentView === 'upload' && (
          <UploadForm onBack={() => setCurrentView('home')} />
        )}
        
        {currentView === 'elders' && (
          <EldersView onElderClick={handleRecordingClick} />
        )}
        
        {currentView === 'playlists' && <PlaylistsView />}
        
        {currentView === 'admin' && <AdminDashboard />}
      </main>
      
      <Footer />
    </div>
  );
}
