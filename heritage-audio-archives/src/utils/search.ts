import { Recording } from '../types';

/**
 * Full-text search utility for recordings
 * Searches across title, tags, and would search transcripts in production
 */
export function searchRecordings(
  recordings: Recording[],
  query: string
): Recording[] {
  if (!query.trim()) return recordings;

  const lowerQuery = query.toLowerCase();
  
  return recordings.filter((recording) => {
    // Search in title
    if (recording.title.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Search in tags
    if (recording.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
      return true;
    }

    // Search in lineage
    if (recording.lineage.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    return false;
  });
}

/**
 * Highlight matching text in search results
 */
export function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Calculate relevance score for search ranking
 */
export function calculateRelevance(recording: Recording, query: string): number {
  const lowerQuery = query.toLowerCase();
  let score = 0;

  // Title match is highest priority
  if (recording.title.toLowerCase().includes(lowerQuery)) {
    score += 10;
  }

  // Tag matches
  const tagMatches = recording.tags.filter(tag => 
    tag.toLowerCase().includes(lowerQuery)
  ).length;
  score += tagMatches * 5;

  // Lineage match
  if (recording.lineage.toLowerCase().includes(lowerQuery)) {
    score += 3;
  }

  return score;
}
