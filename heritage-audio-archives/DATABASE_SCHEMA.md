# Ejiogbe Voices Database Schema

## Tables

### elders
```sql
CREATE TABLE elders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  lineage TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### recordings
```sql
CREATE TABLE recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  language TEXT NOT NULL,
  lineage TEXT NOT NULL,
  tags TEXT[],
  duration_ms INTEGER NOT NULL,
  storage_url TEXT NOT NULL,
  elder_id UUID REFERENCES elders(id),
  consent_status TEXT DEFAULT 'pending',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### transcripts
```sql
CREATE TABLE transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recording_id UUID REFERENCES recordings(id),
  segment_index INTEGER NOT NULL,
  start_ms INTEGER NOT NULL,
  end_ms INTEGER NOT NULL,
  text_original TEXT,
  text_en TEXT,
  text_pt TEXT,
  text_fr TEXT
);
```

### playlists
```sql
CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  visibility TEXT DEFAULT 'private',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### playlist_items
```sql
CREATE TABLE playlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES playlists(id),
  recording_id UUID REFERENCES recordings(id),
  added_at TIMESTAMP DEFAULT NOW()
);
```

### consents
```sql
CREATE TABLE consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  elder_id UUID REFERENCES elders(id),
  document_url TEXT,
  access_restrictions TEXT,
  revenue_share_terms TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### access_logs
```sql
CREATE TABLE access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  recording_id UUID REFERENCES recordings(id),
  action TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);
```
