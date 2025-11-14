import { describe, it, expect } from 'vitest';
import { searchRecordings, calculateRelevance } from '../search';
import { Recording } from '../../types';

const mockRecordings: Recording[] = [
  {
    id: '1',
    title: 'Creation Stories',
    language: 'Yoruba',
    lineage: 'Oyeku Meji',
    tags: ['creation', 'cosmology'],
    duration_ms: 120000,
    storage_url: '/audio/1.mp3',
    elder_id: '1',
    consent_status: 'public',
    published_at: '2024-01-01',
    thumbnail: '/img/1.jpg'
  },
  {
    id: '2',
    title: 'Divination Practices',
    language: 'Yoruba',
    lineage: 'Irosun Meji',
    tags: ['divination', 'ritual'],
    duration_ms: 180000,
    storage_url: '/audio/2.mp3',
    elder_id: '2',
    consent_status: 'public',
    published_at: '2024-01-02',
    thumbnail: '/img/2.jpg'
  }
];

describe('searchRecordings', () => {
  it('returns all recordings when query is empty', () => {
    const results = searchRecordings(mockRecordings, '');
    expect(results).toHaveLength(2);
  });

  it('searches by title', () => {
    const results = searchRecordings(mockRecordings, 'creation');
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Creation Stories');
  });

  it('searches by tag', () => {
    const results = searchRecordings(mockRecordings, 'divination');
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Divination Practices');
  });

  it('is case-insensitive', () => {
    const results = searchRecordings(mockRecordings, 'CREATION');
    expect(results).toHaveLength(1);
  });
});

describe('calculateRelevance', () => {
  it('gives higher score for title matches', () => {
    const score = calculateRelevance(mockRecordings[0], 'creation');
    expect(score).toBeGreaterThan(0);
  });

  it('gives points for tag matches', () => {
    const score = calculateRelevance(mockRecordings[1], 'divination');
    expect(score).toBeGreaterThan(0);
  });
});
