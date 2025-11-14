import React from 'react';
import { Button } from './ui/Button';

interface FilterBarProps {
  languages: string[];
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  onSortChange: (sort: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  languages,
  selectedLanguage,
  onLanguageChange,
  onSortChange
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center mb-8">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedLanguage === 'all' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onLanguageChange('all')}
        >
          All Languages
        </Button>
        {languages.map((lang) => (
          <Button
            key={lang}
            variant={selectedLanguage === lang ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onLanguageChange(lang)}
          >
            {lang}
          </Button>
        ))}
      </div>
      
      <select
        onChange={(e) => onSortChange(e.target.value)}
        className="ml-auto px-4 py-2 bg-indigo-950/50 border border-silver/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cerulean"
      >
        <option value="recent">Most Recent</option>
        <option value="oldest">Oldest First</option>
        <option value="duration">Duration</option>
        <option value="elder">Elder Name</option>
      </select>
    </div>
  );
};
