import React from 'react';

interface HeroSectionProps {
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore }) => {
  return (
    <div className="relative h-[500px] rounded-2xl overflow-hidden mb-12">
      <img
        src="https://d64gsuwffb70l.cloudfront.net/68ee862c37dbb473bf327d43_1760462435525_3c75d3b1.webp"
        alt="Ejiogbe Voices"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/50 flex items-center">
        <div className="max-w-7xl mx-auto px-8 text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Ejiogbe Voices
          </h1>
          <p className="text-xl md:text-2xl mb-2 text-slate-200">
            Preserving Sacred Wisdom Through Elder Recordings
          </p>
          <p className="text-lg mb-8 text-slate-300 max-w-2xl">
            A human-curated archive where oral traditions meet modern accessibility. 
            Listen, learn, and carry forward the knowledge of our elders.
          </p>
          <div className="flex gap-4">
            <button
              onClick={onExplore}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
            >
              Explore Recordings
            </button>
            <button className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
