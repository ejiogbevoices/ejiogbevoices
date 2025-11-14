import { Transcript } from '../types';

/**
 * Find the active transcript segment for a given playback time
 */
export function findActiveSegment(
  segments: Transcript[],
  currentTimeMs: number
): Transcript | null {
  return segments.find(
    (segment) => currentTimeMs >= segment.start_ms && currentTimeMs <= segment.end_ms
  ) || null;
}

/**
 * Calculate progress through a segment (0-1)
 */
export function getSegmentProgress(
  segment: Transcript,
  currentTimeMs: number
): number {
  if (currentTimeMs < segment.start_ms) return 0;
  if (currentTimeMs > segment.end_ms) return 1;

  const duration = segment.end_ms - segment.start_ms;
  const elapsed = currentTimeMs - segment.start_ms;
  return elapsed / duration;
}

/**
 * Validate transcript timing (no gaps or overlaps)
 */
export function validateTranscriptTiming(segments: Transcript[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const sorted = [...segments].sort((a, b) => a.start_ms - b.start_ms);

  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];

    // Check for overlaps
    if (current.end_ms > next.start_ms) {
      errors.push(
        `Overlap detected: Segment ${current.segment_index} ends at ${current.end_ms}ms but segment ${next.segment_index} starts at ${next.start_ms}ms`
      );
    }

    // Check for gaps > 500ms
    const gap = next.start_ms - current.end_ms;
    if (gap > 500) {
      errors.push(
        `Large gap detected: ${gap}ms between segments ${current.segment_index} and ${next.segment_index}`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Merge adjacent segments with same text (useful for cleaning up auto-captions)
 */
export function mergeAdjacentSegments(segments: Transcript[]): Transcript[] {
  if (segments.length === 0) return [];

  const merged: Transcript[] = [segments[0]];

  for (let i = 1; i < segments.length; i++) {
    const current = segments[i];
    const previous = merged[merged.length - 1];

    // If text is identical and segments are adjacent, merge them
    if (
      current.text_original === previous.text_original &&
      current.start_ms === previous.end_ms
    ) {
      previous.end_ms = current.end_ms;
    } else {
      merged.push(current);
    }
  }

  return merged;
}
