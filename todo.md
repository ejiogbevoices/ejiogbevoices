# Ejiogbe Voices - Project TODO

## Database & Schema
- [x] Create Supabase schema (Tradition, User, Org, Elder, Recording, TranscriptSegment, Translation, Dub, GlossaryTerm, Clip, Playlist, PlaylistItem, ReviewTask, PlaybackPosition, Event, Jobs, Tag)
- [ ] Integrate seed data from SQL files (elders, recordings, transcripts, playlists, consents, provenance)
- [ ] Set up Row-Level Security (RLS) policies for all tables
- [ ] Configure Supabase authentication (email/password)

## Backend API Routes
- [x] Create tRPC procedures for recordings (list, get, create, update, delete)
- [x] Create tRPC procedures for transcripts (list, get, create, update, delete)
- [x] Create tRPC procedures for translations (list, get, create, update, delete)
- [ ] Create tRPC procedures for playlists (list, get, create, update, delete)
- [ ] Create tRPC procedures for clips (list, get, create, update, delete)
- [ ] Create tRPC procedures for elders (list, get)
- [ ] Create tRPC procedures for review tasks (list, get, update status)
- [ ] Create tRPC procedures for search (Meilisearch with Postgres fallback)
- [ ] Create tRPC procedures for analytics (plays, searches, clip creations)
- [ ] Create tRPC procedures for consent management (upload, view, update status)

## External API Integrations
- [ ] Integrate Google Speech-to-Text API for ASR
- [ ] Integrate ElevenLabs API for synthetic dubbing
- [ ] Set up job queue for asynchronous processing (ASR, MT, Dubbing)
- [ ] Implement Vercel Cron Jobs for scheduled tasks (embargo lifter, job processor)
- [ ] Set up Meilisearch integration with fallback to Postgres pg_trgm

## Frontend - Core UX Screens
- [ ] Home / Browse - Grid of recordings with filters
- [ ] Recording Detail - Player, time-synced transcript, language toggle, clip builder
- [ ] Search Results - Query box, hit snippets with timestamps
- [ ] Playlist Detail - Ordered clips, play from start times, share link
- [ ] Create/Edit Playlist - Title, description, add/remove clips, reorder

## Frontend - Ingestion & Workflow Screens
- [ ] Upload / Ingest - Multi-step wizard, audio upload, metadata, progress
- [ ] Transcript Editor - Edit segments, merge/split, approve status
- [ ] Translation Editor - Pick target language, edit aligned text, approve status
- [ ] Review Tasks - Inbox for reviewers (transcription QC, translation QC, sacred sign-off)

## Frontend - Governance & Admin Screens
- [ ] Elders Directory - List of elders, profiles, recordings
- [ ] Sign in / Sign up - Email/password authentication
- [ ] Account & Preferences - UI locale, transcript language, theme, preferred voice
- [ ] Admin Dashboard - Quick stats, recent uploads, pending reviews, visibility/embargo toggles
- [ ] Categories / Topics Hub - Editorial landing with featured playlists
- [ ] Collections - Curated bundles (e.g., Morning Prayers, Initiation Prep)
- [ ] Consent & Provenance Panel - Attach/view consent doc, set restrictions
- [ ] Org Management - Seats, members, SSO toggle, institution visibility checks
- [ ] Analytics (Light) - Searches, plays, clip creations, most-used playlists
- [ ] Dub Manager - Attach/replace synthetic dubs, disclosure labels
- [ ] System Events / Audit Log - View all system events (publish/unpublish, edits, visibility changes)

## Frontend - UI Components & Utilities
- [ ] Synchronized audio player with time-linked transcript
- [ ] Deep-linking search with timestamp navigation
- [ ] Clip builder with start/end time selection
- [ ] Playlist builder with drag-and-drop reordering
- [ ] Consent workflow screens (upload, review, sign-off)
- [ ] Mobile navigation (bottom tabs: Recordings, Elders, Playlists, Admin)
- [ ] Desktop navigation (top bar with filters and account menu)
- [ ] Empty states for all list views
- [ ] Error states and loading skeletons
- [ ] Accessibility compliance (WCAG AA, keyboard navigation)
- [ ] Performance optimization (caching, lazy loading)

## Design & Styling
- [ ] Implement indigo and gold color scheme
- [ ] Set up Tailwind CSS with custom theme
- [ ] Create responsive design for mobile and desktop
- [ ] Implement dark/light theme support (if needed)

## Testing & Quality Assurance
- [ ] Test authentication flow (sign up, sign in, logout)
- [ ] Test recording upload and ASR processing
- [ ] Test ElevenLabs dubbing integration
- [ ] Test search functionality (Meilisearch + Postgres fallback)
- [ ] Test playlist creation and sharing
- [ ] Test consent workflow
- [ ] Test RLS policies for data access control
- [ ] Test mobile responsiveness
- [ ] Test accessibility (keyboard navigation, screen readers)

## Deployment & DevOps
- [ ] Configure Supabase project and database
- [ ] Set up Vercel deployment
- [ ] Configure environment variables (Google Cloud, ElevenLabs, Supabase)
- [ ] Set up CI/CD pipeline
- [ ] Configure custom domain (if needed)
- [ ] Set up monitoring and error tracking

## Documentation & Handoff
- [ ] Create API documentation
- [ ] Create user guide for content curators
- [ ] Create admin guide for platform management
- [ ] Document consent workflow and ethical guidelines
- [ ] Create deployment runbook

## Completed Tasks
- [x] Database schema with all 17 tables
- [x] Recording and TranscriptSegment database helpers
- [x] tRPC routers for recordings, transcripts, and translations
