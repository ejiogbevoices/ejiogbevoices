import React, { useState, useMemo } from 'react';
import { Navigation } from './Navigation';
import { HeroSection } from './HeroSection';
import { ElderSpotlight } from './ElderSpotlight';
import { SearchBar } from './SearchBar';
import { FilterPanel } from './FilterPanel';
import { RecordingCard } from './RecordingCard';
import { RecordingDetail } from './RecordingDetail';
import { AdminDashboard } from './AdminDashboard';
import { Footer } from './Footer';
import { elders as seedElders, recordings as seedRecordings } from '../data/seedData';
import { Elder, Recording } from '../types';

const AppLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLineages, setSelectedLineages] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [elders, setElders] = useState<Elder[]>(seedElders);
  const [recordings, setRecordings] = useState<Recording[]>(seedRecordings);

  const filteredRecordings = useMemo(() => {
    return recordings.filter((recording) => {
      const matchesSearch = searchQuery === '' || 
        recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recording.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLineage = selectedLineages.length === 0 || selectedLineages.includes(recording.lineage);
      const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.includes(recording.language);
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => recording.tags.includes(tag));

      return matchesSearch && matchesLineage && matchesLanguage && matchesTags;
    });
  }, [recordings, searchQuery, selectedLineages, selectedLanguages, selectedTags]);

  const handleLineageToggle = (lineage: string) => {
    setSelectedLineages(prev => 
      prev.includes(lineage) ? prev.filter(l => l !== lineage) : [...prev, lineage]
    );
  };

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language) ? prev.filter(l => l !== language) : [...prev, language]
    );
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedLineages([]);
    setSelectedLanguages([]);
    setSelectedTags([]);
    setSearchQuery('');
  };

  const scrollToRecordings = () => {
    const element = document.getElementById('recordings-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddElder = (elder: Partial<Elder>) => {
    const newElder: Elder = {
      id: Date.now().toString(),
      name: elder.name || '',
      lineage: elder.lineage || '',
      bio: elder.bio || '',
      photo_url: elder.photo_url || ''
    };
    setElders([...elders, newElder]);
  };

  const handleAddRecording = (recording: Partial<Recording>) => {
    const newRecording: Recording = {
      id: Date.now().toString(),
      title: recording.title || '',
      language: recording.language || 'Yoruba',
      lineage: recording.lineage || '',
      tags: recording.tags || [],
      duration_ms: recording.duration_ms || 0,
      storage_url: recording.storage_url || '',
      elder_id: recording.elder_id || '',
      consent_status: recording.consent_status || 'pending',
      published_at: recording.published_at || new Date().toISOString(),
      thumbnail: seedRecordings[0].thumbnail
    };
    setRecordings([...recordings, newRecording]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navigation 
        onAdminClick={() => setCurrentView(currentView === 'home' ? 'admin' : 'home')}
        currentView={currentView}
      />

      {currentView === 'home' ? (
        <div className="max-w-7xl mx-auto px-8 py-8">
          <HeroSection onExplore={scrollToRecordings} />
          <ElderSpotlight elders={elders} />

          <div id="recordings-section" className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Explore Recordings</h2>
            <div className="mb-6">
              <SearchBar onSearch={setSearchQuery} placeholder="Search by title, tags, or topics..." />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <FilterPanel
                selectedLineages={selectedLineages}
                selectedLanguages={selectedLanguages}
                selectedTags={selectedTags}
                onLineageToggle={handleLineageToggle}
                onLanguageToggle={handleLanguageToggle}
                onTagToggle={handleTagToggle}
                onClearFilters={handleClearFilters}
              />
            </div>

            <div className="lg:col-span-3">
              <div className="mb-4 text-slate-600 dark:text-slate-400">
                Showing {filteredRecordings.length} of {recordings.length} recordings
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRecordings.map((recording) => {
                  const elder = elders.find(e => e.id === recording.elder_id);
                  return (
                    <RecordingCard
                      key={recording.id}
                      recording={recording}
                      elder={elder}
                      onClick={() => setSelectedRecording(recording)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <AdminDashboard
          elders={elders}
          recordings={recordings}
          onAddElder={handleAddElder}
          onAddRecording={handleAddRecording}
        />
      )}

      {selectedRecording && (
        <RecordingDetail
          recording={selectedRecording}
          elder={elders.find(e => e.id === selectedRecording.elder_id)!}
          onClose={() => setSelectedRecording(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default AppLayout;
