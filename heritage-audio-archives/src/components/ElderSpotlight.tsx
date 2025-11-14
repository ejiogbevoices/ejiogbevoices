import React from 'react';
import { Elder } from '../types';

interface ElderSpotlightProps {
  elders: Elder[];
}

export const ElderSpotlight: React.FC<ElderSpotlightProps> = ({ elders }) => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Featured Elders</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {elders.map((elder) => (
          <div
            key={elder.id}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img
              src={elder.photo_url}
              alt={elder.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {elder.name}
              </h3>
              <p className="text-amber-600 dark:text-amber-400 font-medium mb-3">
                {elder.lineage}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {elder.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
