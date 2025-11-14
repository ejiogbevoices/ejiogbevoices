import { Recording, elders } from './mockData';

export const recordings: Recording[] = [
  {
    id: '1',
    title: 'The Origin of Ejiogbe: Creation Stories',
    language: 'Yoruba',
    lineage: 'Ejiogbe',
    duration_ms: 1847000,
    elder: elders[0],
    consent_status: 'public',
    visibility: 'public',
    published_at: '2024-10-15',
    tags: ['Creation', 'Mythology', 'Ifa']
  },
  {
    id: '2',
    title: 'Divination Rituals and Sacred Practices',
    language: 'Yoruba',
    lineage: 'Oyeku',
    duration_ms: 2134000,
    elder: elders[1],
    consent_status: 'members',
    visibility: 'members',
    published_at: '2024-10-12',
    tags: ['Ritual', 'Divination', 'Sacred']
  },
  {
    id: '3',
    title: 'Herbal Medicine and Healing Wisdom',
    language: 'Yoruba',
    lineage: 'Iwori',
    duration_ms: 1623000,
    elder: elders[2],
    consent_status: 'public',
    visibility: 'public',
    published_at: '2024-10-10',
    tags: ['Medicine', 'Healing', 'Plants']
  }
].concat(
  Array.from({ length: 12 }, (_, i) => ({
    id: `${i + 4}`,
    title: `Ancestral Teaching ${i + 4}: Wisdom of the Ages`,
    language: ['Yoruba', 'English'][i % 2],
    lineage: ['Ejiogbe', 'Oyeku', 'Iwori', 'Odi'][i % 4],
    duration_ms: 1200000 + Math.random() * 1800000,
    elder: elders[i % elders.length],
    consent_status: ['public', 'members'][i % 2] as 'public' | 'members',
    visibility: ['public', 'members'][i % 2] as 'public' | 'members',
    published_at: `2024-10-${String(9 - Math.floor(i / 3)).padStart(2, '0')}`,
    tags: ['Wisdom', 'Oral Tradition', 'History']
  }))
);
