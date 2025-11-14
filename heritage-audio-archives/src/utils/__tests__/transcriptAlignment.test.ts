import { describe, it, expect } from 'vitest';
import {
  findActiveSegment,
  getSegmentProgress,
  validateTranscriptTiming,
  mergeAdjacentSegments
} from '../transcriptAlignment';
import { Transcript } from '../../types';

const mockSegments: Transcript[] = [
  {
    id: '1',
    recording_id: 'r1',
    segment_index: 0,
    start_ms: 0,
    end_ms: 5000,
    text_original: 'First segment',
    text_en: 'First segment',
    text_pt: 'Primeiro segmento',
    text_fr: 'Premier segment'
  },
  {
    id: '2',
    recording_id: 'r1',
    segment_index: 1,
    start_ms: 5000,
    end_ms: 10000,
    text_original: 'Second segment',
    text_en: 'Second segment',
    text_pt: 'Segundo segmento',
    text_fr: 'Deuxième segment'
  }
];

describe('findActiveSegment', () => {
  it('finds segment at start time', () => {
    const segment = findActiveSegment(mockSegments, 0);
    expect(segment?.id).toBe('1');
  });

  it('finds segment at middle time', () => {
    const segment = findActiveSegment(mockSegments, 7000);
    expect(segment?.id).toBe('2');
  });

  it('returns null when no segment matches', () => {
    const segment = findActiveSegment(mockSegments, 15000);
    expect(segment).toBeNull();
  });
});

describe('getSegmentProgress', () => {
  it('returns 0 at start', () => {
    const progress = getSegmentProgress(mockSegments[0], 0);
    expect(progress).toBe(0);
  });

  it('returns 1 at end', () => {
    const progress = getSegmentProgress(mockSegments[0], 5000);
    expect(progress).toBe(1);
  });

  it('returns 0.5 at midpoint', () => {
    const progress = getSegmentProgress(mockSegments[0], 2500);
    expect(progress).toBe(0.5);
  });
});

describe('validateTranscriptTiming', () => {
  it('validates correct timing', () => {
    const result = validateTranscriptTiming(mockSegments);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('detects overlaps', () => {
    const overlapping: Transcript[] = [
      { ...mockSegments[0] },
      { ...mockSegments[1], start_ms: 4000 }
    ];
    const result = validateTranscriptTiming(overlapping);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
