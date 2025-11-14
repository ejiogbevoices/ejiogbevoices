import React, { useState } from 'react';
import { elders } from '../data/mockData';
import { ElderCard } from './ElderCard';
import { SearchBar } from './SearchBar';

interface EldersViewProps {
  onElderClick: (elderId: string) => void;
}

export const EldersView: React.FC<EldersViewProps> = ({ onElderClick }) => {
  const [filteredElders, setFilteredElders] = useState(elders);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredElders(elders);
      return;
    }
    
    const filtered = elders.filter(elder =>
      elder.name.toLowerCase().includes(query.toLowerCase()) ||
      elder.village.toLowerCase().includes(query.toLowerCase()) ||
      elder.lineage.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredElders(filtered);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl font-serif font-bold text-white mb-4">Elders Directory</h2>
        <p className="text-lg text-silver mb-6">
          Meet the keepers of ancestral wisdom and oral traditions
        </p>
        <SearchBar onSearch={handleSearch} placeholder="Search elders by name, village, or lineage..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredElders.map((elder) => (
          <ElderCard
            key={elder.id}
            elder={elder}
            onClick={() => onElderClick(elder.id)}
          />
        ))}
      </div>

      {filteredElders.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-serif text-white mb-2">No elders found</h3>
          <p className="text-silver">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};
