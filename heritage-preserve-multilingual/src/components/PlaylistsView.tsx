import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface Playlist {
  id: string;
  title: string;
  description: string;
  itemCount: number;
  visibility: 'private' | 'unlisted' | 'public';
  created: string;
}

export const PlaylistsView: React.FC = () => {
  const [playlists] = useState<Playlist[]>([
    {
      id: '1',
      title: 'Creation Myths & Origin Stories',
      description: 'A collection of recordings about the beginning of all things',
      itemCount: 8,
      visibility: 'public',
      created: '2024-10-15'
    },
    {
      id: '2',
      title: 'Healing & Medicine',
      description: 'Traditional healing practices and herbal wisdom',
      itemCount: 12,
      visibility: 'members',
      created: '2024-10-12'
    },
    {
      id: '3',
      title: 'Divination Rituals',
      description: 'Sacred practices of Ifa divination',
      itemCount: 6,
      visibility: 'private',
      created: '2024-10-10'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-serif font-bold text-white mb-2">Playlists</h2>
          <p className="text-lg text-silver">Curated collections of recordings</p>
        </div>
        <Button variant="gold" onClick={() => setShowCreateModal(true)}>
          Create Playlist
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-indigo-950/30 border border-silver/10 rounded-xl p-6 hover:border-cerulean/50 transition-all cursor-pointer hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-serif font-semibold text-white">{playlist.title}</h3>
              <Badge variant={playlist.visibility === 'public' ? 'success' : 'default'}>
                {playlist.visibility}
              </Badge>
            </div>
            <p className="text-silver/70 mb-4 line-clamp-2">{playlist.description}</p>
            <div className="flex items-center justify-between text-sm text-silver">
              <span>{playlist.itemCount} recordings</span>
              <span>{new Date(playlist.created).toLocaleDateString()}</span>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="primary" size="sm" className="flex-1">Open</Button>
              <Button variant="ghost" size="sm">Share</Button>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-indigo-950 border border-silver/20 rounded-xl p-8 max-w-lg w-full">
            <h3 className="text-2xl font-serif font-bold text-white mb-6">Create New Playlist</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Playlist title..."
                className="w-full px-4 py-3 bg-indigo-950/50 border border-silver/20 rounded-lg text-white"
              />
              <textarea
                placeholder="Description..."
                rows={3}
                className="w-full px-4 py-3 bg-indigo-950/50 border border-silver/20 rounded-lg text-white"
              />
              <select className="w-full px-4 py-3 bg-indigo-950/50 border border-silver/20 rounded-lg text-white">
                <option>Public</option>
                <option>Unlisted</option>
                <option>Private</option>
              </select>
              <div className="flex gap-3">
                <Button variant="gold" className="flex-1">Create</Button>
                <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
