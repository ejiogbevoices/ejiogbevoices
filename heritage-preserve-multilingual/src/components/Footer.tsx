import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-indigo-950/50 border-t border-silver/10 mt-20 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-serif font-bold text-gold mb-4">Ejiogbe Voices</h3>
          <p className="text-silver/70 text-sm leading-relaxed">
            Preserving ancestral wisdom through sacred sound and ethical digital archiving.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-silver/70">
            <li><a href="#" className="hover:text-cerulean transition-colors">Recordings</a></li>
            <li><a href="#" className="hover:text-cerulean transition-colors">Elders Directory</a></li>
            <li><a href="#" className="hover:text-cerulean transition-colors">Playlists</a></li>
            <li><a href="#" className="hover:text-cerulean transition-colors">Search</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-silver/70">
            <li><a href="#" className="hover:text-cerulean transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-cerulean transition-colors">Ethics & Consent</a></li>
            <li><a href="#" className="hover:text-cerulean transition-colors">Glossary</a></li>
            <li><a href="#" className="hover:text-cerulean transition-colors">API Docs</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Connect</h4>
          <ul className="space-y-2 text-sm text-silver/70">
            <li><a href="#" className="hover:text-cerulean transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-cerulean transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-cerulean transition-colors">Terms of Use</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-silver/10 text-center text-sm text-silver/50">
        © 2024 Ejiogbe Voices. All rights reserved. Built with reverence for ancestral wisdom.
      </div>
    </footer>
  );
};
