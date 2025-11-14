import React, { useState } from 'react';
import { recordings } from '../data/recordings';
import { RecordingCard } from './RecordingCard';
import { SearchBar } from './SearchBar';
import { FilterBar } from './FilterBar';
import { Hero } from './Hero';

interface HomeViewProps {
  onRecordingClick: (recordingId: string) => void;
  onUploadClick: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onRecordingClick, onUploadClick }) => {
  const [filteredRecordings, setFilteredRecordings] = useState(recordings);
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  const languages = Array.from(new Set(recordings.map(r => r.language)));

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredRecordings(recordings);
      return;
    }
    
    const filtered = recordings.filter(r =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.elder.name.toLowerCase().includes(query.toLowerCase()) ||
      r.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredRecordings(filtered);
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    if (lang === 'all') {
      setFilteredRecordings(recordings);
    } else {
      setFilteredRecordings(recordings.filter(r => r.language === lang));
    }
  };

  const handleSortChange = (sort: string) => {
    const sorted = [...filteredRecordings].sort((a, b) => {
      if (sort === 'recent') return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      if (sort === 'oldest') return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
      if (sort === 'duration') return b.duration_ms - a.duration_ms;
      if (sort === 'elder') return a.elder.name.localeCompare(b.elder.name);
      return 0;
    });
    setFilteredRecordings(sorted);
  };

  const handleExplore = () => {
    document.getElementById('recordings-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <Hero onExplore={handleExplore} onUpload={onUploadClick} />

      <div id="recordings-section" className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      <FilterBar
        languages={languages}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        onSortChange={handleSortChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRecordings.map((recording) => (
          <RecordingCard
            key={recording.id}
            recording={recording}
            onClick={() => onRecordingClick(recording.id)}
          />
        ))}
      </div>

      {filteredRecordings.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-serif text-white mb-2">No recordings found</h3>
          <p className="text-silver">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
};
