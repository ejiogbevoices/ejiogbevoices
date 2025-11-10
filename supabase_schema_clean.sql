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

CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  visibility VARCHAR(50) DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'unlisted')),
  owner UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_playlists_owner ON playlists(owner);
CREATE INDEX idx_playlists_visibility ON playlists(visibility);

CREATE TABLE IF NOT EXISTS playlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  recording_id UUID REFERENCES recordings(id) ON DELETE CASCADE,
  position INT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_playlist_items_playlist_id ON playlist_items(playlist_id);
CREATE INDEX idx_playlist_items_recording_id ON playlist_items(recording_id);

CREATE TABLE IF NOT EXISTS review_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id UUID NOT NULL,
  task_type VARCHAR(50) NOT NULL CHECK (task_type IN ('consent_signoff', 'transcription_qc', 'translation_qc', 'dub_review')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'approved', 'rejected')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

CREATE INDEX idx_review_tasks_target_id ON review_tasks(target_id);
CREATE INDEX idx_review_tasks_task_type ON review_tasks(task_type);
CREATE INDEX idx_review_tasks_status ON review_tasks(status);
CREATE INDEX idx_review_tasks_assigned_to ON review_tasks(assigned_to);

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

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_entity_type ON events(entity_type);
CREATE INDEX idx_events_entity_id ON events(entity_id);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_created_at ON events(created_at);

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type VARCHAR(50) NOT NULL CHECK (job_type IN ('transcription', 'translation', 'dubbing')),
  status VARCHAR(50) DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  target_id UUID NOT NULL,
  payload JSONB,
  result JSONB,
  error_message TEXT,
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_jobs_job_type ON jobs(job_type);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_target_id ON jobs(target_id);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);

CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_tags_category ON tags(category);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE traditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
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

CREATE POLICY "public_recordings_readable" ON recordings FOR SELECT USING (visibility = 'public');
CREATE POLICY "user_recordings_readable" ON recordings FOR SELECT USING (visibility = 'members' AND auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor', 'member')));
CREATE POLICY "institution_recordings_readable" ON recordings FOR SELECT USING (visibility = 'institution' AND auth.uid() IN (SELECT id FROM users WHERE org_id IS NOT NULL));
CREATE POLICY "private_recordings_readable" ON recordings FOR SELECT USING (created_by = auth.uid());
CREATE POLICY "user_can_create_recordings" ON recordings FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "user_can_update_own_recordings" ON recordings FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "public_playlists_readable" ON playlists FOR SELECT USING (visibility = 'public');
CREATE POLICY "user_playlists_readable" ON playlists FOR SELECT USING (owner = auth.uid());
CREATE POLICY "user_can_create_playlists" ON playlists FOR INSERT WITH CHECK (auth.uid() = owner);
CREATE POLICY "user_can_update_own_playlists" ON playlists FOR UPDATE USING (owner = auth.uid());

CREATE POLICY "users_readable_self" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "users_insertable_self" ON users FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "users_updatable_self" ON users FOR UPDATE USING (id = auth.uid());

CREATE POLICY "clips_readable" ON clips FOR SELECT USING (TRUE);
CREATE POLICY "user_can_create_clips" ON clips FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "user_can_update_own_clips" ON clips FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "events_readable_by_admins" ON events FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));
CREATE POLICY "jobs_readable_by_admins" ON jobs FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));
