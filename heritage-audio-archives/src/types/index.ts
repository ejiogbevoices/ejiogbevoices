export interface Elder {
  id: string;
  name: string;
  lineage: string;
  bio: string;
  photo_url: string;
}

export interface Recording {
  id: string;
  title: string;
  language: string;
  lineage: string;
  tags: string[];
  duration_ms: number;
  storage_url: string;
  elder_id: string;
  consent_status: string;
  published_at: string;
  thumbnail: string;
}

export interface Transcript {
  id: string;
  recording_id: string;
  segment_index: number;
  start_ms: number;
  end_ms: number;
  text_original: string;
  text_en: string;
  text_pt: string;
  text_fr: string;
}

export interface Playlist {
  id: string;
  user_id: string;
  title: string;
  visibility: 'private' | 'unlisted' | 'public';
  created_at: string;
}

export type Language = 'original' | 'en' | 'pt' | 'fr';
export type UserRole = 'admin' | 'editor' | 'member' | 'guest';
