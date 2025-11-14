import React from 'react';
export const Footer: React.FC = () => {
  return <footer className="bg-slate-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Ejiogbe Voices</h3>
            <p className="text-slate-400 text-sm">
              Preserving sacred wisdom and oral traditions for future generations.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Recordings</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Elders</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Lineages</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Topics</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Study Guides</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Educator Bundles</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">MCP Integration</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Our Mission</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Governance</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
          <p>© 2025 Ejiogbe Voices. All recordings used with explicit elder consent and cultural protocols.</p>
        </div>
      </div>
    </footer>;
};