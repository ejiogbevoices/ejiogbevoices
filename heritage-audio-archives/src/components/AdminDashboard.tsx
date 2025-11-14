import React, { useState } from 'react';
import { Elder, Recording } from '../types';

interface AdminDashboardProps {
  elders: Elder[];
  recordings: Recording[];
  onAddElder: (elder: Partial<Elder>) => void;
  onAddRecording: (recording: Partial<Recording>) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  elders,
  recordings,
  onAddElder,
  onAddRecording
}) => {
  const [activeTab, setActiveTab] = useState<'elders' | 'recordings' | 'studio'>('elders');
  const [showElderForm, setShowElderForm] = useState(false);
  const [showRecordingForm, setShowRecordingForm] = useState(false);

  const [elderForm, setElderForm] = useState({
    name: '',
    lineage: '',
    bio: '',
    photo_url: ''
  });

  const [recordingForm, setRecordingForm] = useState({
    title: '',
    language: 'Yoruba',
    lineage: '',
    tags: '',
    duration_ms: 0,
    storage_url: '',
    elder_id: '',
    consent_status: 'pending'
  });

  const handleElderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddElder(elderForm);
    setElderForm({ name: '', lineage: '', bio: '', photo_url: '' });
    setShowElderForm(false);
  };

  const handleRecordingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRecording({
      ...recordingForm,
      tags: recordingForm.tags.split(',').map(t => t.trim()),
      published_at: new Date().toISOString()
    });
    setRecordingForm({
      title: '',
      language: 'Yoruba',
      lineage: '',
      tags: '',
      duration_ms: 0,
      storage_url: '',
      elder_id: '',
      consent_status: 'pending'
    });
    setShowRecordingForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Admin Dashboard</h2>

      <div className="flex gap-4 mb-8 border-b border-slate-200 dark:border-slate-700">
        {(['elders', 'recordings', 'studio'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'elders' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Manage Elders</h3>
            <button
              onClick={() => setShowElderForm(!showElderForm)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
            >
              {showElderForm ? 'Cancel' : 'Add Elder'}
            </button>
          </div>

          {showElderForm && (
            <form onSubmit={handleElderSubmit} className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-6 space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={elderForm.name}
                onChange={(e) => setElderForm({ ...elderForm, name: e.target.value })}
                required
                className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Lineage"
                value={elderForm.lineage}
                onChange={(e) => setElderForm({ ...elderForm, lineage: e.target.value })}
                required
                className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <textarea
                placeholder="Bio"
                value={elderForm.bio}
                onChange={(e) => setElderForm({ ...elderForm, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <input
                type="url"
                placeholder="Photo URL"
                value={elderForm.photo_url}
                onChange={(e) => setElderForm({ ...elderForm, photo_url: e.target.value })}
                className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                Save Elder
              </button>
            </form>
          )}

          <div className="grid gap-4">
            {elders.map((elder) => (
              <div key={elder.id} className="bg-white dark:bg-slate-800 rounded-lg p-4 flex items-center gap-4">
                <img src={elder.photo_url} alt={elder.name} className="w-16 h-16 rounded-full object-cover" />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{elder.name}</h4>
                  <p className="text-sm text-amber-600 dark:text-amber-400">{elder.lineage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'recordings' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Manage Recordings</h3>
            <button
              onClick={() => setShowRecordingForm(!showRecordingForm)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
            >
              {showRecordingForm ? 'Cancel' : 'Add Recording'}
            </button>
          </div>

          {showRecordingForm && (
            <form onSubmit={handleRecordingSubmit} className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-6 space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={recordingForm.title}
                onChange={(e) => setRecordingForm({ ...recordingForm, title: e.target.value })}
                required
                className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={recordingForm.elder_id}
                  onChange={(e) => setRecordingForm({ ...recordingForm, elder_id: e.target.value })}
                  required
                  className="px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="">Select Elder</option>
                  {elders.map((elder) => (
                    <option key={elder.id} value={elder.id}>{elder.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Lineage"
                  value={recordingForm.lineage}
                  onChange={(e) => setRecordingForm({ ...recordingForm, lineage: e.target.value })}
                  required
                  className="px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={recordingForm.tags}
                onChange={(e) => setRecordingForm({ ...recordingForm, tags: e.target.value })}
                className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                Save Recording
              </button>
            </form>
          )}

          <div className="grid gap-4">
            {recordings.map((recording) => (
              <div key={recording.id} className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{recording.title}</h4>
                <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <span>{recording.lineage}</span>
                  <span>•</span>
                  <span className={`font-medium ${
                    recording.consent_status === 'public' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {recording.consent_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'studio' && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Studio 3.0 Integration</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Manage ElevenLabs Studio projects, sync captions, and export finalized audio.
          </p>
          
          <div className="space-y-4">
            <div className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                ⚠️ <strong>Production Note:</strong> Always export finalized audio and captions back to storage. 
                Do not leave source-of-truth inside Studio.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button className="px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                🎬 Open in Studio
              </button>
              <button className="px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                📥 Pull Latest Captions
              </button>
              <button className="px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                🔄 Replace Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
