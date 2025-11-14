import React from 'react';
import { Button } from './ui/Button';
import { heroImage } from '../data/mockData';

interface HeroProps {
  onExplore: () => void;
  onUpload: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onUpload }) => {
  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-2xl mb-12">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/80 via-indigo-950/70 to-indigo-950" />
      </div>
      
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6 z-10">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
          Ejiogbe Voices
        </h1>
        <p className="text-xl md:text-2xl text-gold mb-4 max-w-3xl font-light">
          Preserving Ancestral Wisdom Through Sacred Sound
        </p>
        <p className="text-lg text-silver/90 mb-10 max-w-2xl">
          A human-curated digital archive to record, transcribe, translate, and share oral traditions with reverence and authenticity.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="gold" size="lg" onClick={onExplore}>
            Explore Recordings
          </Button>
          <Button variant="ghost" size="lg" onClick={onUpload}>
            Upload Recording
          </Button>
        </div>
      </div>
    </div>
  );
};
