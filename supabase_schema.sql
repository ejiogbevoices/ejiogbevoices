-- ============================================================================
-- EJIOGBE VOICES: Complete Supabase Schema with RLS Policies
-- ============================================================================
-- This schema defines all 17 tables for the cultural preservation platform
-- with comprehensive Row-Level Security (RLS) policies for data governance.
-- ============================================================================

-- ============================================================================
-- 1. CONTEXT TABLES: Tradition, User, Org, Elder
-- ============================================================================

-- Tradition: Core cultural container for all content
CREATE TABLE IF NOT EXISTS traditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  region VARCHAR(255),
  language_primary VARCHAR(10),
  logo_url TEXT,
  visibility VARCHAR(50) DEFAULT 'public' CHECK (visibility IN ('public', 'members', 'institution', 'private')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_traditions_visibility ON traditions(visibility);
CREATE INDEX idx_traditions_created_by ON traditions(created_by);

-- User: Authentication and roles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'editor', 'member', 'guest')),
  ui_locale VARCHAR(10) DEFAULT 'en',
  transcript_locale VARCHAR(10) DEFAULT 'en',
  theme VARCHAR(50) DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  preferred_voice VARCHAR(100),
  org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_org_id ON users(org_id);

-- Organization: Institutional access and seat management
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('institution', 'house', 'school', 'other')),
  seats_total INT DEFAULT 10,
  seats_used INT DEFAULT 0,
  sso_enabled BOOLEAN DEFAULT FALSE,
  visibility VARCHAR(50) DEFAULT 'private' CHECK (visibility IN ('public', 'members', 'institution', 'private')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_organizations_created_by ON organizations(created_by);

-- Elder: Speaker profiles and lineage
CREATE TABLE IF NOT EXISTS elders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tradition_id UUID NOT NULL REFERENCES traditions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  village VARCHAR(255),
  lineage VARCHAR(255),
  bio TEXT,
  photo_url TEXT,
  languages TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_elders_tradition_id ON elders(tradition_id);
CREATE INDEX idx_elders_name ON elders(name);

-- ============================================================================
-- 2. CONTENT TABLES: Recording, TranscriptSegment, Translation, Dub, GlossaryTerm
-- ============================================================================

-- Recording: Core audio content with metadata and consent
CREATE TABLE IF NOT EXISTS recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tradition_id UUID NOT NULL REFERENCES traditions(id) ON DELETE CASCADE,
  elder_id UUID NOT NULL REFERENCES elders(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  language VARCHAR(10) NOT NULL,
  duration_ms INT,
  storage_url TEXT NOT NULL,
  consent_status VARCHAR(50) DEFAULT 'pending' CHECK (consent_status IN ('pending', 'public', 'members', 'institution', 'private', 'restricted')),
  visibility VARCHAR(50) DEFAULT 'private' CHECK (visibility IN ('public', 'members', 'institution', 'private')),
  embargo_until TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  consent_documents TEXT[] DEFAULT ARRAY[]::TEXT[],
  consent_type VARCHAR(100),
  consent_date DATE,
  restriction_terms TEXT,
  provenance_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_recordings_tradition_id ON recordings(tradition_id);
CREATE INDEX idx_recordings_elder_id ON recordings(elder_id);
CREATE INDEX idx_recordings_visibility ON recordings(visibility);
CREATE INDEX idx_recordings_consent_status ON recordings(consent_status);
CREATE INDEX idx_recordings_embargo_until ON recordings(embargo_until);
CREATE INDEX idx_recordings_published_at ON recordings(published_at);
CREATE INDEX idx_recordings_created_by ON recordings(created_by);

-- TranscriptSegment: Time-aligned original text
CREATE TABLE IF NOT EXISTS transcript_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recording_id UUID NOT NULL REFERENCES recordings(id) ON DELETE CASCADE,
  segment_index INT NOT NULL,
  start_ms INT NOT NULL,
  end_ms INT NOT NULL,
  text_original TEXT NOT NULL,
  qc_status VARCHAR(50) DEFAULT 'pending' CHECK (qc_status IN ('pending', 'approved', 'rejected', 'needs_review')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(recording_id, segment_index)
);

CREATE INDEX idx_transcript_segments_recording_id ON transcript_segments(recording_id);
CREATE INDEX idx_transcript_segments_qc_status ON transcript_segments(qc_status);

-- Translation: Translated text segments
CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment_id UUID NOT NULL REFERENCES transcript_segments(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL,
  translated_text TEXT NOT NULL,
  qc_status VARCHAR(50) DEFAULT 'pending' CHECK (qc_status IN ('pending', 'approved', 'rejected', 'needs_review')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE(segment_id, language_code)
);

CREATE INDEX idx_translations_segment_id ON translations(segment_id);
CREATE INDEX idx_translations_language_code ON translations(language_code);
CREATE INDEX idx_translations_qc_status ON translations(qc_status);

-- Dub: Synthetic audio files and metadata
CREATE TABLE IF NOT EXISTS dubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recording_id UUID NOT NULL REFERENCES recordings(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL,
  is_synthetic BOOLEAN DEFAULT TRUE,
  audio_url TEXT NOT NULL,
  disclosure_label TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  params_hash VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(recording_id, language_code)
);

CREATE INDEX idx_dubs_recording_id ON dubs(recording_id);
CREATE INDEX idx_dubs_language_code ON dubs(language_code);
CREATE INDEX idx_dubs_status ON dubs(status);

-- GlossaryTerm: Culturally specific terminology
CREATE TABLE IF NOT EXISTS glossary_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tradition_id UUID NOT NULL REFERENCES traditions(id) ON DELETE CASCADE,
  term VARCHAR(255) NOT NULL,
  language_code VARCHAR(10) NOT NULL,
  preferred_translation VARCHAR(255),
  definition TEXT,
  sensitive BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tradition_id, term, language_code)
);

CREATE INDEX idx_glossary_terms_tradition_id ON glossary_terms(tradition_id);
CREATE INDEX idx_glossary_terms_language_code ON glossary_terms(language_code);

-- ============================================================================
-- 3. CURATION TABLES: Clip, Playlist, PlaylistItem
-- ============================================================================

-- Clip: User-defined segments of a recording
CREATE TABLE IF NOT EXISTS clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recording_id UUID NOT NULL REFERENCES recordings(id) ON DELETE CASCADE,
  start_ms INT NOT NULL,
  end_ms INT NOT NULL,
  title VARCHAR(255),
  summary TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_clips_recording_id ON clips(recording_id);
CREATE INDEX idx_clips_created_by ON clips(created_by);

-- Playlist: User-created collections of clips/recordings
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  visibility VARCHAR(50) DEFAULT 'private' CHECK (visibility IN ('private', 'unlisted', 'public')),
  owner UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_playlists_owner ON playlists(owner);
CREATE INDEX idx_playlists_visibility ON playlists(visibility);

-- PlaylistItem: Links clips/recordings to a playlist
CREATE TABLE IF NOT EXISTS playlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  recording_id UUID REFERENCES recordings(id) ON DELETE CASCADE,
  clip_id UUID REFERENCES clips(id) ON DELETE CASCADE,
  "order" INT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT at_least_one_item CHECK (
    (recording_id IS NOT NULL AND clip_id IS NULL) OR
    (recording_id IS NULL AND clip_id IS NOT NULL)
  )
);

CREATE INDEX idx_playlist_items_playlist_id ON playlist_items(playlist_id);
CREATE INDEX idx_playlist_items_recording_id ON playlist_items(recording_id);
CREATE INDEX idx_playlist_items_clip_id ON playlist_items(clip_id);

-- ============================================================================
-- 4. WORKFLOW TABLES: ReviewTask, PlaybackPosition
-- ============================================================================

-- ReviewTask: Manages QC and approval processes
CREATE TABLE IF NOT EXISTS review_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('recording', 'segment', 'translation')),
  task_type VARCHAR(50) NOT NULL CHECK (task_type IN ('transcription_qc', 'translation_qc', 'sacred_signoff', 'consent_signoff')),
  target_id UUID NOT NULL,
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'approved', 'rejected', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_review_tasks_target_id ON review_tasks(target_id);
CREATE INDEX idx_review_tasks_assignee_id ON review_tasks(assignee_id);
CREATE INDEX idx_review_tasks_status ON review_tasks(status);
CREATE INDEX idx_review_tasks_task_type ON review_tasks(task_type);

-- PlaybackPosition: Tracks user listening progress
CREATE TABLE IF NOT EXISTS playback_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recording_id UUID NOT NULL REFERENCES recordings(id) ON DELETE CASCADE,
  position_ms INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recording_id)
);

CREATE INDEX idx_playback_positions_user_id ON playback_positions(user_id);
CREATE INDEX idx_playback_positions_recording_id ON playback_positions(recording_id);

-- ============================================================================
-- 5. SYSTEM TABLES: Event (Audit Log), Jobs, Tag
-- ============================================================================

-- Event (Audit Log): Tracks all critical system and user actions
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id UUID,
  meta JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_target_id ON events(target_id);
CREATE INDEX idx_events_created_at ON events(created_at);

-- Jobs: Queue for background processing (ASR, MT, Dubbing)
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status VARCHAR(50) DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  job_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  result JSONB,
  error_message TEXT,
  retry_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_job_type ON jobs(job_type);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);

-- Tag: Content categorization and filtering
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tags_name ON tags(name);

-- ============================================================================
-- 6. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE traditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE elders ENABLE ROW LEVEL SECURITY;
ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcript_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE playback_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TRADITIONS: Public read, admin/creator write
-- ============================================================================
CREATE POLICY "traditions_public_read" ON traditions
  FOR SELECT USING (visibility = 'public' OR auth.uid() = created_by);

CREATE POLICY "traditions_admin_write" ON traditions
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "traditions_admin_update" ON traditions
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "traditions_admin_delete" ON traditions
  FOR DELETE USING (auth.uid() = created_by);

-- ============================================================================
-- USERS: Users can read own profile, admins can read all
-- ============================================================================
CREATE POLICY "users_read_own" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_read_all_admin" ON users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- ORGANIZATIONS: Members can read, admins can write
-- ============================================================================
CREATE POLICY "organizations_read_members" ON organizations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND org_id = organizations.id)
  );

CREATE POLICY "organizations_admin_write" ON organizations
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "organizations_admin_update" ON organizations
  FOR UPDATE USING (auth.uid() = created_by);

-- ============================================================================
-- ELDERS: Public read, tradition creator can write
-- ============================================================================
CREATE POLICY "elders_public_read" ON elders
  FOR SELECT USING (TRUE);

CREATE POLICY "elders_creator_write" ON elders
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM traditions WHERE id = tradition_id AND created_by = auth.uid())
  );

CREATE POLICY "elders_creator_update" ON elders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM traditions WHERE id = tradition_id AND created_by = auth.uid())
  );

-- ============================================================================
-- RECORDINGS: Visibility-based access control
-- ============================================================================
CREATE POLICY "recordings_public_read" ON recordings
  FOR SELECT USING (visibility = 'public' OR consent_status = 'public');

CREATE POLICY "recordings_members_read" ON recordings
  FOR SELECT USING (
    visibility = 'members' OR consent_status = 'members' OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "recordings_institution_read" ON recordings
  FOR SELECT USING (
    (visibility = 'institution' OR consent_status = 'institution') AND
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.org_id IS NOT NULL)
  );

CREATE POLICY "recordings_private_read" ON recordings
  FOR SELECT USING (
    auth.uid() = created_by OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "recordings_creator_write" ON recordings
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "recordings_creator_update" ON recordings
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "recordings_creator_delete" ON recordings
  FOR DELETE USING (auth.uid() = created_by);

-- ============================================================================
-- TRANSCRIPT_SEGMENTS: Inherit from recording visibility
-- ============================================================================
CREATE POLICY "transcript_segments_read" ON transcript_segments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = transcript_segments.recording_id AND (
        recordings.visibility = 'public' OR
        recordings.created_by = auth.uid() OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
      )
    )
  );

CREATE POLICY "transcript_segments_write" ON transcript_segments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = recording_id AND recordings.created_by = auth.uid()
    )
  );

CREATE POLICY "transcript_segments_update" ON transcript_segments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = recording_id AND recordings.created_by = auth.uid()
    )
  );

-- ============================================================================
-- TRANSLATIONS: Inherit from recording visibility
-- ============================================================================
CREATE POLICY "translations_read" ON translations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM transcript_segments ts
      JOIN recordings r ON r.id = ts.recording_id
      WHERE ts.id = segment_id AND (
        r.visibility = 'public' OR
        r.created_by = auth.uid() OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
      )
    )
  );

CREATE POLICY "translations_write" ON translations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM transcript_segments ts
      JOIN recordings r ON r.id = ts.recording_id
      WHERE ts.id = segment_id AND r.created_by = auth.uid()
    )
  );

CREATE POLICY "translations_update" ON translations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM transcript_segments ts
      JOIN recordings r ON r.id = ts.recording_id
      WHERE ts.id = segment_id AND r.created_by = auth.uid()
    )
  );

-- ============================================================================
-- DUBS: Inherit from recording visibility
-- ============================================================================
CREATE POLICY "dubs_read" ON dubs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = recording_id AND (
        recordings.visibility = 'public' OR
        recordings.created_by = auth.uid() OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
      )
    )
  );

CREATE POLICY "dubs_write" ON dubs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM recordings
      WHERE recordings.id = recording_id AND recordings.created_by = auth.uid()
    )
  );

-- ============================================================================
-- GLOSSARY_TERMS: Public read, tradition creator can write
-- ============================================================================
CREATE POLICY "glossary_terms_public_read" ON glossary_terms
  FOR SELECT USING (TRUE);

CREATE POLICY "glossary_terms_creator_write" ON glossary_terms
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM traditions WHERE id = tradition_id AND created_by = auth.uid())
  );

-- ============================================================================
-- CLIPS: Creator can read/write, public if in public playlist
-- ============================================================================
CREATE POLICY "clips_creator_read" ON clips
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "clips_public_read" ON clips
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM playlist_items pi
      JOIN playlists p ON p.id = pi.playlist_id
      WHERE pi.clip_id = clips.id AND p.visibility = 'public'
    )
  );

CREATE POLICY "clips_creator_write" ON clips
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "clips_creator_update" ON clips
  FOR UPDATE USING (auth.uid() = created_by);

-- ============================================================================
-- PLAYLISTS: Visibility-based access control
-- ============================================================================
CREATE POLICY "playlists_public_read" ON playlists
  FOR SELECT USING (visibility = 'public');

CREATE POLICY "playlists_owner_read" ON playlists
  FOR SELECT USING (auth.uid() = owner);

CREATE POLICY "playlists_owner_write" ON playlists
  FOR INSERT WITH CHECK (auth.uid() = owner);

CREATE POLICY "playlists_owner_update" ON playlists
  FOR UPDATE USING (auth.uid() = owner);

CREATE POLICY "playlists_owner_delete" ON playlists
  FOR DELETE USING (auth.uid() = owner);

-- ============================================================================
-- PLAYLIST_ITEMS: Inherit from playlist visibility
-- ============================================================================
CREATE POLICY "playlist_items_read" ON playlist_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = playlist_id AND (
        playlists.visibility = 'public' OR
        playlists.owner = auth.uid()
      )
    )
  );

CREATE POLICY "playlist_items_owner_write" ON playlist_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = playlist_id AND playlists.owner = auth.uid()
    )
  );

CREATE POLICY "playlist_items_owner_update" ON playlist_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = playlist_id AND playlists.owner = auth.uid()
    )
  );

CREATE POLICY "playlist_items_owner_delete" ON playlist_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = playlist_id AND playlists.owner = auth.uid()
    )
  );

-- ============================================================================
-- REVIEW_TASKS: Assigned users and admins can read/write
-- ============================================================================
CREATE POLICY "review_tasks_assigned_read" ON review_tasks
  FOR SELECT USING (
    auth.uid() = assignee_id OR
    auth.uid() = created_by OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "review_tasks_admin_write" ON review_tasks
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "review_tasks_assigned_update" ON review_tasks
  FOR UPDATE USING (
    auth.uid() = assignee_id OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- PLAYBACK_POSITIONS: Users can only read/write their own
-- ============================================================================
CREATE POLICY "playback_positions_own_read" ON playback_positions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "playback_positions_own_write" ON playback_positions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "playback_positions_own_update" ON playback_positions
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- EVENTS: Admins can read all, users can read own events
-- ============================================================================
CREATE POLICY "events_admin_read" ON events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "events_own_read" ON events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "events_insert" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- ============================================================================
-- JOBS: Admins can read, system can write
-- ============================================================================
CREATE POLICY "jobs_admin_read" ON jobs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "jobs_insert" ON jobs
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "jobs_update" ON jobs
  FOR UPDATE USING (TRUE);

-- ============================================================================
-- TAGS: Public read, admins can write
-- ============================================================================
CREATE POLICY "tags_public_read" ON tags
  FOR SELECT USING (TRUE);

CREATE POLICY "tags_admin_write" ON tags
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
