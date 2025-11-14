# Feature Documentation

## Core Features

### 1. Recording Archive & Discovery

**Browse Interface**
- Grid layout with 3 columns (desktop), 2 (tablet), 1 (mobile)
- Each card displays: thumbnail, title, elder name, lineage, duration, tags
- Hover effects reveal additional metadata
- Click to open detailed view modal

**Filtering System**
- **Lineage Filter**: Multi-select checkboxes for 6 lineages
- **Language Filter**: Multi-select for Yoruba, English, Portuguese, French
- **Topic Tags**: 10+ clickable tag buttons
- Filters combine with AND logic
- "Clear All" button resets all filters
- Active filter count displayed

**Search Functionality**
- Real-time search as you type
- Searches across: titles, tags, lineages
- Case-insensitive matching
- Results update instantly without page reload

### 2. Recording Detail View

**Audio Player**
- Custom-built player with waveform visualization
- Controls: Play/Pause, 10s skip backward/forward
- Playback speed: 0.75x, 1x, 1.25x, 1.5x (cycle button)
- Progress bar with click-to-seek
- Current time / Total duration display
- Persists across page navigation (future enhancement)

**Time-Synced Transcripts**
- Segments auto-highlight as audio plays
- Active segment scrolls into view automatically
- Click segment to jump to that timestamp (future)
- Smooth transitions between segments

**Language Switching**
- 4 language buttons: Original, English, Português, Français
- Instant switch without audio interruption
- Transcript text fades smoothly during transition
- Selected language persists per session

**Metadata Display**
- Elder photo, name, lineage
- Recording title, publish date
- Full list of topic tags
- Consent status and usage restrictions

**Actions**
- "Generate Narrated Overview" (ElevenLabs TTS stub)
- "Add to Playlist" (saves to user's collection)
- Share button (future)
- Download transcript (future)

### 3. Admin Dashboard

**Elder Management**
- List view of all elders with photos
- "Add Elder" form with fields: name, lineage, bio, photo URL
- Edit/Delete actions (future)
- Upload photo directly to storage (future)

**Recording Management**
- List view with title, lineage, consent status
- "Add Recording" form with:
  - Title, language, lineage
  - Elder selection dropdown
  - Tags (comma-separated)
  - Audio file upload (future - currently URL input)
  - Duration calculation
  - Consent status dropdown
- Publish/Unpublish toggle
- Bulk operations (future)

**Studio 3.0 Integration Panel**
- "Open in Studio" deep link button
- "Pull Latest Captions" sync button
- "Replace Asset" for finalized exports
- Production notes warning about source-of-truth
- Webhook status indicator (future)

### 4. User Features

**Playlists** (Future Enhancement)
- Create unlimited playlists
- Add/remove recordings
- Drag-to-reorder items
- Set visibility: private, unlisted, public
- Share playlist link
- Export as JSON/M3U

**Study Progress** (Future Enhancement)
- Track last position in each recording
- Resume playback where you left off
- Mark recordings as "completed"
- Study streak counter
- Time spent listening analytics

### 5. Governance & Access Control

**Consent Management**
- Each recording has consent_status: pending, public, restricted
- Public recordings visible to all
- Restricted recordings require authentication
- Admin-only consent document uploads
- Revenue share terms tracking

**Access Logging**
- All playback events logged to database
- Tracks: user_id, recording_id, timestamp, action
- Used for analytics and elder compensation
- Exportable for transparency reports

**Role-Based Permissions**
- **Guest**: Browse public recordings only
- **Member**: Access restricted content, create playlists
- **Editor**: Upload recordings, manage transcripts
- **Admin**: Full access, consent management, user roles

## Technical Features

### Performance
- Lazy loading of recording cards
- Image optimization with CDN
- Audio streaming (not full download)
- Debounced search input
- Virtualized transcript scrolling for long recordings

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader announcements for playback state
- High contrast mode support
- Closed captions sync with audio

### Offline Support (Future)
- Service worker for offline browsing
- Cache recordings for offline playback
- Sync playlists when back online
- Download recordings for offline study

### Internationalization
- UI language selection (future)
- Right-to-left layout support (future)
- Date/time localization
- Number formatting per locale

## Integration Features

### ElevenLabs
- **TTS**: Generate narrated summaries with custom voices
- **Dubbing**: Create multi-language audio versions
- **Studio 3.0**: Fine-tune captions and alignment
- **Pronunciation Dictionary**: Ensure correct Yoruba pronunciation

### MCP Servers
- **voices-catalog-mcp**: Programmatic read access
- **ops-mcp**: Role-gated write operations
- Used by AI assistants and automation tools

### Meilisearch
- Full-text search with typo tolerance
- Faceted search by lineage, language, tags
- Instant search results (<50ms)
- Fallback to PostgreSQL full-text search

### Supabase
- PostgreSQL database with RLS
- Real-time subscriptions (future)
- Storage for audio files with signed URLs
- Authentication with email + OAuth
