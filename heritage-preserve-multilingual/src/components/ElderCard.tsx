import React from 'react';
import { Elder } from '../data/mockData';
import { Badge } from './ui/Badge';

interface ElderCardProps {
  elder: Elder;
  onClick: () => void;
}

export const ElderCard: React.FC<ElderCardProps> = ({ elder, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-indigo-950/30 border border-silver/10 rounded-xl overflow-hidden hover:border-gold/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-gold/10 hover:-translate-y-1"
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={elder.photo}
          alt={elder.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-serif font-semibold text-white mb-1 group-hover:text-gold transition-colors">
          {elder.name}
        </h3>
        <p className="text-sm text-silver mb-2">{elder.village} • {elder.lineage}</p>
        <p className="text-sm text-silver/70 mb-3 line-clamp-2">{elder.bio}</p>
        <div className="flex flex-wrap gap-1.5">
          {elder.languages.map((lang, i) => (
            <Badge key={i} variant="cerulean">{lang}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
