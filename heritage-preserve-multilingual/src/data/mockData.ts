// Mock data for Ejiogbe Voices

export const elderImages = [
  "https://d64gsuwffb70l.cloudfront.net/68fad1fdb2cbce37e85c35e6_1761268275934_a2a86e9e.webp",
  "https://d64gsuwffb70l.cloudfront.net/68fad1fdb2cbce37e85c35e6_1761268275934_a2a86e9e.webp",
  "https://d64gsuwffb70l.cloudfront.net/68fad1fdb2cbce37e85c35e6_1761268275934_a2a86e9e.webp",
  "https://d64gsuwffb70l.cloudfront.net/68fad1fdb2cbce37e85c35e6_1761268275934_a2a86e9e.webp",
  "https://d64gsuwffb70l.cloudfront.net/68fad1fdb2cbce37e85c35e6_1761268275934_a2a86e9e.webp",
  "https://d64gsuwffb70l.cloudfront.net/68fad1fdb2cbce37e85c35e6_1761268275934_a2a86e9e.webp",
  "https://d64gsuwffb70l.cloudfront.net/68fad1fdb2cbce37e85c35e6_1761268275934_a2a86e9e.webp",
  "https://d64gsuwffb70l.cloudfront.net/68fad1fdb2cbce37e85c35e6_1761268275934_a2a86e9e.webp",
  "https://d64gsuwffb70l.cloudfront.net/68fad1fdb2cbce37e85c35e6_1761268275934_a2a86e9e.webp",
  "https://d64gsuwffb70l.cloudfront.net/68fad1fdb2cbce37e85c35e6_1761268275934_a2a86e9e.webp",
  "https://d64gsuwffb70l.cloudfront.net/68fad1fdb2cbce37e85c35e6_1761268275934_a2a86e9e.webp",
  "https://d64gsuwffb70l.cloudfront.net/68fad1fdb2cbce37e85c35e6_1761268275934_a2a86e9e.webp"
];

export const heroImage = "https://d64gsuwffb70l.cloudfront.net/68fad1fdb2cbce37e85c35e6_1761268275148_5cf947a5.webp";

export interface Elder {
  id: string;
  name: string;
  village: string;
  lineage: string;
  bio: string;
  photo: string;
  languages: string[];
}

export interface Recording {
  id: string;
  title: string;
  language: string;
  lineage: string;
  duration_ms: number;
  elder: Elder;
  consent_status: 'public' | 'members' | 'restricted';
  visibility: 'public' | 'members' | 'institution' | 'private' | 'embargoed';
  published_at: string;
  tags: string[];
}

export const elders: Elder[] = [
  {
    id: '1',
    name: 'Baba Ifayemi Ogunlade',
    village: 'Ile-Ife',
    lineage: 'Ejiogbe',
    bio: 'Master diviner and keeper of Ifa oral traditions for over 50 years.',
    photo: elderImages[0],
    languages: ['Yoruba', 'English']
  },
  // Add 11 more elders...
].concat(Array.from({ length: 11 }, (_, i) => ({
  id: `${i + 2}`,
  name: `Elder ${i + 2}`,
  village: ['Ile-Ife', 'Oyo', 'Ibadan', 'Osogbo'][i % 4],
  lineage: ['Ejiogbe', 'Oyeku', 'Iwori', 'Odi'][i % 4],
  bio: 'Keeper of ancestral wisdom and oral traditions.',
  photo: elderImages[i + 1],
  languages: ['Yoruba', 'English', 'French'][i % 3] ? ['Yoruba', 'English'] : ['Yoruba']
})));
