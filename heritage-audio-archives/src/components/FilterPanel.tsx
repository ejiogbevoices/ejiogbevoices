import React from 'react';

interface FilterPanelProps {
  selectedLineages: string[];
  selectedLanguages: string[];
  selectedTags: string[];
  onLineageToggle: (lineage: string) => void;
  onLanguageToggle: (language: string) => void;
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
}

const lineages = ['Oyeku Meji', 'Irosun Meji', 'Odi Meji', 'Ogbe Meji', 'Iwori Meji', 'Obara Meji'];
const languages = ['Yoruba', 'English', 'Portuguese', 'French'];
const tags = ['creation stories', 'divination', 'herbalism', 'ritual', 'ceremony', 'orishas', 'healing', 'wisdom', 'history', 'lineage'];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedLineages,
  selectedLanguages,
  selectedTags,
  onLineageToggle,
  onLanguageToggle,
  onTagToggle,
  onClearFilters
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400"
        >
          Clear All
        </button>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Lineage</h4>
        <div className="space-y-2">
          {lineages.map((lineage) => (
            <label key={lineage} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLineages.includes(lineage)}
                onChange={() => onLineageToggle(lineage)}
                className="mr-2 rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">{lineage}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Language</h4>
        <div className="space-y-2">
          {languages.map((language) => (
            <label key={language} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLanguages.includes(language)}
                onChange={() => onLanguageToggle(language)}
                className="mr-2 rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">{language}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Topics</h4>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
