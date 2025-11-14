# Ejiogbe Voices

A production-ready cultural preservation platform for archiving, transcribing, and sharing elder recordings with multilingual support, time-synced transcripts, and AI-powered narration.

## Features

### Core Functionality
- **Recording Archive**: Browse and filter 6+ recordings by lineage, language, and topics
- **Elder Profiles**: Featured spotlights with bios, lineages, and photo galleries
- **Audio Player**: Custom player with playback speed control, 10s skip, and waveform scrubbing
- **Time-Synced Transcripts**: Auto-scrolling transcripts that highlight current segment
- **Multilingual Support**: Switch between Original Yoruba, English, Portuguese, and French
- **Search**: Full-text search across titles, tags, and transcript content
- **Playlists**: Save and organize recordings into custom study playlists
- **Dark Mode**: Accessible light/dark theme toggle

### Admin Dashboard
- **Elder Management**: CRUD operations for elder profiles
- **Recording Management**: Upload audio, manage metadata, set consent status
- **Studio 3.0 Integration**: Deep links to ElevenLabs Studio for caption editing
- **Consent Tracking**: Governance controls for access restrictions and revenue sharing

### AI Integration (Stubs)
- **ElevenLabs TTS**: Generate narrated overviews with pronunciation dictionaries
- **Dubbing**: Multi-language audio generation
- **Studio 3.0**: Timeline editor for fine-tuning captions and alignment
- **MCP Servers**: Read-only catalog and role-gated operations APIs

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Database**: PostgreSQL (Supabase) with RLS policies
- **Storage**: Supabase Storage for audio files with signed URLs
- **Search**: Meilisearch (with in-DB fallback)
- **APIs**: REST with OpenAPI spec
- **Deployment**: Vercel (frontend) + Railway/Render (MCP servers)

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (Supabase recommended)
- Meilisearch instance (optional)

### Installation

```bash
# Clone repository
git clone <repo-url>
cd ejiogbe-voices

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your credentials

# Run development server
npm run dev
```

### Database Setup

```bash
# Run migrations (see DATABASE_SCHEMA.md)
psql $DATABASE_URL -f migrations/001_initial_schema.sql

# Seed data is included in src/data/seedData.ts
```

## Project Structure

```
src/
├── components/          # React components
│   ├── AppLayout.tsx   # Main layout (home + admin views)
│   ├── AudioPlayer.tsx # Custom audio player
│   ├── RecordingCard.tsx
│   ├── RecordingDetail.tsx
│   ├── TranscriptViewer.tsx
│   ├── FilterPanel.tsx
│   ├── AdminDashboard.tsx
│   └── ...
├── data/               # Seed data
│   ├── seedData.ts
│   └── transcripts.ts
├── types/              # TypeScript definitions
├── utils/              # Helper functions
└── ...

DATABASE_SCHEMA.md      # PostgreSQL schema
API_STUBS.md           # ElevenLabs integration stubs
MCP_SERVERS.md         # MCP server implementations
DEPLOYMENT.md          # Deployment guide
```

## Key Features Explained

### Time-Synced Transcripts
Transcripts are stored as segments with `start_ms` and `end_ms` timestamps. The `TranscriptViewer` component highlights the active segment based on audio playback position and auto-scrolls to keep it visible.

### Multilingual Support
Each transcript segment includes four language fields: `text_original`, `text_en`, `text_pt`, `text_fr`. Users can switch languages with a single click, and the transcript updates instantly.

### Consent & Governance
Every recording has a `consent_status` field. Only recordings with `consent_status = 'public'` are visible to unauthenticated users. All access is logged to the `access_logs` table for transparency.

### ElevenLabs Integration
The "Generate Narrated Overview" button triggers a stub API call to `/api/tts/render`. In production, this would:
1. Load pronunciation dictionary for Yoruba terms
2. Call ElevenLabs TTS API with custom voice
3. Cache output audio URL
4. Display player with generated narration

### MCP Servers
Two MCP servers provide programmatic access:
- **voices-catalog-mcp**: Read-only tools for listing, searching, and fetching recordings
- **ops-mcp**: Role-gated tools for creating recordings, updating consent, and publishing

See `MCP_SERVERS.md` for implementation details.

## Deployment

See `DEPLOYMENT.md` for comprehensive deployment instructions covering:
- Vercel frontend deployment
- Supabase database setup with RLS policies
- MCP server deployment to Railway/Render
- Meilisearch configuration
- CI/CD pipeline with GitHub Actions

## License

All recordings are used with explicit elder consent. See individual recording pages for usage restrictions and provenance.

## Contributing

This is a cultural preservation project. Please respect the sacred nature of the content and follow all governance protocols when contributing.
