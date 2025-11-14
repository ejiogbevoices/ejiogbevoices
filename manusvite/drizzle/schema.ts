import {
  boolean,
  date,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

// ============================================================================
// CONTEXT TABLES: Tradition, User, Org, Elder
// ============================================================================

export const traditions = mysqlTable(
  "traditions",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    region: varchar("region", { length: 255 }),
    language_primary: varchar("language_primary", { length: 10 }),
    logo_url: text("logo_url"),
    visibility: mysqlEnum("visibility", ["public", "members", "institution", "private"]).default("public"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
    created_by: varchar("created_by", { length: 36 }),
  },
  (table) => ({
    idx_visibility: index("idx_traditions_visibility").on(table.visibility),
    idx_created_by: index("idx_traditions_created_by").on(table.created_by),
  })
);

export type Tradition = typeof traditions.$inferSelect;
export type InsertTradition = typeof traditions.$inferInsert;

export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    email: varchar("email", { length: 320 }),
    name: varchar("name", { length: 255 }),
    role: mysqlEnum("role", ["admin", "editor", "member", "guest"]).default("member"),
    ui_locale: varchar("ui_locale", { length: 10 }).default("en"),
    transcript_locale: varchar("transcript_locale", { length: 10 }).default("en"),
    theme: mysqlEnum("theme", ["light", "dark"]).default("light"),
    preferred_voice: varchar("preferred_voice", { length: 100 }),
    org_id: varchar("org_id", { length: 36 }),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idx_role: index("idx_users_role").on(table.role),
    idx_org_id: index("idx_users_org_id").on(table.org_id),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const organizations = mysqlTable(
  "organizations",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    type: mysqlEnum("type", ["institution", "house", "school", "other"]),
    seats_total: int("seats_total").default(10),
    seats_used: int("seats_used").default(0),
    sso_enabled: boolean("sso_enabled").default(false),
    visibility: mysqlEnum("visibility", ["public", "members", "institution", "private"]).default("private"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
    created_by: varchar("created_by", { length: 36 }),
  },
  (table) => ({
    idx_created_by: index("idx_organizations_created_by").on(table.created_by),
  })
);

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;

export const elders = mysqlTable(
  "elders",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    tradition_id: varchar("tradition_id", { length: 36 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    village: varchar("village", { length: 255 }),
    lineage: varchar("lineage", { length: 255 }),
    bio: text("bio"),
    photo_url: text("photo_url"),
    languages: json("languages"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idx_tradition_id: index("idx_elders_tradition_id").on(table.tradition_id),
    idx_name: index("idx_elders_name").on(table.name),
  })
);

export type Elder = typeof elders.$inferSelect;
export type InsertElder = typeof elders.$inferInsert;

// ============================================================================
// CONTENT TABLES: Recording, TranscriptSegment, Translation, Dub, GlossaryTerm
// ============================================================================

export const recordings = mysqlTable(
  "recordings",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    tradition_id: varchar("tradition_id", { length: 36 }).notNull(),
    elder_id: varchar("elder_id", { length: 36 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    language: varchar("language", { length: 10 }).notNull(),
    duration_ms: int("duration_ms"),
    storage_url: text("storage_url").notNull(),
    consent_status: mysqlEnum("consent_status", [
      "pending",
      "public",
      "members",
      "institution",
      "private",
      "restricted",
    ]).default("pending"),
    visibility: mysqlEnum("visibility", ["public", "members", "institution", "private"]).default("private"),
    embargo_until: timestamp("embargo_until"),
    published_at: timestamp("published_at"),
    tags: json("tags"),
    consent_documents: json("consent_documents"),
    consent_type: varchar("consent_type", { length: 100 }),
    consent_date: date("consent_date"),
    restriction_terms: text("restriction_terms"),
    provenance_notes: text("provenance_notes"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
    created_by: varchar("created_by", { length: 36 }),
  },
  (table) => ({
    idx_tradition_id: index("idx_recordings_tradition_id").on(table.tradition_id),
    idx_elder_id: index("idx_recordings_elder_id").on(table.elder_id),
    idx_visibility: index("idx_recordings_visibility").on(table.visibility),
    idx_consent_status: index("idx_recordings_consent_status").on(table.consent_status),
    idx_embargo_until: index("idx_recordings_embargo_until").on(table.embargo_until),
    idx_published_at: index("idx_recordings_published_at").on(table.published_at),
    idx_created_by: index("idx_recordings_created_by").on(table.created_by),
  })
);

export type Recording = typeof recordings.$inferSelect;
export type InsertRecording = typeof recordings.$inferInsert;

export const transcript_segments = mysqlTable(
  "transcript_segments",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    recording_id: varchar("recording_id", { length: 36 }).notNull(),
    segment_index: int("segment_index").notNull(),
    start_ms: int("start_ms").notNull(),
    end_ms: int("end_ms").notNull(),
    text_original: text("text_original").notNull(),
    qc_status: mysqlEnum("qc_status", ["pending", "approved", "rejected", "needs_review"]).default("pending"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idx_recording_id: index("idx_transcript_segments_recording_id").on(table.recording_id),
    idx_qc_status: index("idx_transcript_segments_qc_status").on(table.qc_status),
    uniq_recording_segment: uniqueIndex("uniq_recording_segment").on(table.recording_id, table.segment_index),
  })
);

export type TranscriptSegment = typeof transcript_segments.$inferSelect;
export type InsertTranscriptSegment = typeof transcript_segments.$inferInsert;

export const translations = mysqlTable(
  "translations",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    segment_id: varchar("segment_id", { length: 36 }).notNull(),
    language_code: varchar("language_code", { length: 10 }).notNull(),
    translated_text: text("translated_text").notNull(),
    qc_status: mysqlEnum("qc_status", ["pending", "approved", "rejected", "needs_review"]).default("pending"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
    created_by: varchar("created_by", { length: 36 }),
  },
  (table) => ({
    idx_segment_id: index("idx_translations_segment_id").on(table.segment_id),
    idx_language_code: index("idx_translations_language_code").on(table.language_code),
    idx_qc_status: index("idx_translations_qc_status").on(table.qc_status),
    uniq_segment_language: uniqueIndex("uniq_segment_language").on(table.segment_id, table.language_code),
  })
);

export type Translation = typeof translations.$inferSelect;
export type InsertTranslation = typeof translations.$inferInsert;

export const dubs = mysqlTable(
  "dubs",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    recording_id: varchar("recording_id", { length: 36 }).notNull(),
    language_code: varchar("language_code", { length: 10 }).notNull(),
    is_synthetic: boolean("is_synthetic").default(true),
    audio_url: text("audio_url").notNull(),
    disclosure_label: text("disclosure_label"),
    status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending"),
    params_hash: varchar("params_hash", { length: 64 }),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idx_recording_id: index("idx_dubs_recording_id").on(table.recording_id),
    idx_language_code: index("idx_dubs_language_code").on(table.language_code),
    idx_status: index("idx_dubs_status").on(table.status),
    uniq_recording_language: uniqueIndex("uniq_recording_language").on(table.recording_id, table.language_code),
  })
);

export type Dub = typeof dubs.$inferSelect;
export type InsertDub = typeof dubs.$inferInsert;

export const glossary_terms = mysqlTable(
  "glossary_terms",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    tradition_id: varchar("tradition_id", { length: 36 }).notNull(),
    term: varchar("term", { length: 255 }).notNull(),
    language_code: varchar("language_code", { length: 10 }).notNull(),
    preferred_translation: varchar("preferred_translation", { length: 255 }),
    definition: text("definition"),
    sensitive: boolean("sensitive").default(false),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idx_tradition_id: index("idx_glossary_terms_tradition_id").on(table.tradition_id),
    idx_language_code: index("idx_glossary_terms_language_code").on(table.language_code),
    uniq_term: uniqueIndex("uniq_term").on(table.tradition_id, table.term, table.language_code),
  })
);

export type GlossaryTerm = typeof glossary_terms.$inferSelect;
export type InsertGlossaryTerm = typeof glossary_terms.$inferInsert;

// ============================================================================
// CURATION TABLES: Clip, Playlist, PlaylistItem
// ============================================================================

export const clips = mysqlTable(
  "clips",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    recording_id: varchar("recording_id", { length: 36 }).notNull(),
    start_ms: int("start_ms").notNull(),
    end_ms: int("end_ms").notNull(),
    title: varchar("title", { length: 255 }),
    summary: text("summary"),
    created_by: varchar("created_by", { length: 36 }).notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idx_recording_id: index("idx_clips_recording_id").on(table.recording_id),
    idx_created_by: index("idx_clips_created_by").on(table.created_by),
  })
);

export type Clip = typeof clips.$inferSelect;
export type InsertClip = typeof clips.$inferInsert;

export const playlists = mysqlTable(
  "playlists",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    visibility: mysqlEnum("visibility", ["private", "unlisted", "public"]).default("private"),
    owner: varchar("owner", { length: 36 }).notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idx_owner: index("idx_playlists_owner").on(table.owner),
    idx_visibility: index("idx_playlists_visibility").on(table.visibility),
  })
);

export type Playlist = typeof playlists.$inferSelect;
export type InsertPlaylist = typeof playlists.$inferInsert;

export const playlist_items = mysqlTable(
  "playlist_items",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    playlist_id: varchar("playlist_id", { length: 36 }).notNull(),
    recording_id: varchar("recording_id", { length: 36 }),
    clip_id: varchar("clip_id", { length: 36 }),
    order: int("order").notNull(),
    added_at: timestamp("added_at").defaultNow(),
  },
  (table) => ({
    idx_playlist_id: index("idx_playlist_items_playlist_id").on(table.playlist_id),
    idx_recording_id: index("idx_playlist_items_recording_id").on(table.recording_id),
    idx_clip_id: index("idx_playlist_items_clip_id").on(table.clip_id),
  })
);

export type PlaylistItem = typeof playlist_items.$inferSelect;
export type InsertPlaylistItem = typeof playlist_items.$inferInsert;

// ============================================================================
// WORKFLOW TABLES: ReviewTask, PlaybackPosition
// ============================================================================

export const review_tasks = mysqlTable(
  "review_tasks",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    target_type: mysqlEnum("target_type", ["recording", "segment", "translation"]).notNull(),
    task_type: mysqlEnum("task_type", [
      "transcription_qc",
      "translation_qc",
      "sacred_signoff",
      "consent_signoff",
    ]).notNull(),
    target_id: varchar("target_id", { length: 36 }).notNull(),
    assignee_id: varchar("assignee_id", { length: 36 }),
    status: mysqlEnum("status", ["pending", "in_progress", "approved", "rejected", "completed"]).default("pending"),
    notes: text("notes"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
    created_by: varchar("created_by", { length: 36 }),
  },
  (table) => ({
    idx_target_id: index("idx_review_tasks_target_id").on(table.target_id),
    idx_assignee_id: index("idx_review_tasks_assignee_id").on(table.assignee_id),
    idx_status: index("idx_review_tasks_status").on(table.status),
    idx_task_type: index("idx_review_tasks_task_type").on(table.task_type),
  })
);

export type ReviewTask = typeof review_tasks.$inferSelect;
export type InsertReviewTask = typeof review_tasks.$inferInsert;

export const playback_positions = mysqlTable(
  "playback_positions",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    user_id: varchar("user_id", { length: 36 }).notNull(),
    recording_id: varchar("recording_id", { length: 36 }).notNull(),
    position_ms: int("position_ms").default(0),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idx_user_id: index("idx_playback_positions_user_id").on(table.user_id),
    idx_recording_id: index("idx_playback_positions_recording_id").on(table.recording_id),
    uniq_user_recording: uniqueIndex("uniq_user_recording").on(table.user_id, table.recording_id),
  })
);

export type PlaybackPosition = typeof playback_positions.$inferSelect;
export type InsertPlaybackPosition = typeof playback_positions.$inferInsert;

// ============================================================================
// SYSTEM TABLES: Event (Audit Log), Jobs, Tag
// ============================================================================

export const events = mysqlTable(
  "events",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    user_id: varchar("user_id", { length: 36 }),
    event_type: varchar("event_type", { length: 100 }).notNull(),
    target_type: varchar("target_type", { length: 50 }),
    target_id: varchar("target_id", { length: 36 }),
    meta: json("meta"),
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    idx_user_id: index("idx_events_user_id").on(table.user_id),
    idx_event_type: index("idx_events_event_type").on(table.event_type),
    idx_target_id: index("idx_events_target_id").on(table.target_id),
    idx_created_at: index("idx_events_created_at").on(table.created_at),
  })
);

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

export const jobs = mysqlTable(
  "jobs",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    status: mysqlEnum("status", ["queued", "running", "completed", "failed"]).default("queued"),
    job_type: varchar("job_type", { length: 100 }).notNull(),
    payload: json("payload").notNull(),
    result: json("result"),
    error_message: text("error_message"),
    retry_count: int("retry_count").default(0),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
    started_at: timestamp("started_at"),
    completed_at: timestamp("completed_at"),
  },
  (table) => ({
    idx_status: index("idx_jobs_status").on(table.status),
    idx_job_type: index("idx_jobs_job_type").on(table.job_type),
    idx_created_at: index("idx_jobs_created_at").on(table.created_at),
  })
);

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

export const tags = mysqlTable(
  "tags",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    description: text("description"),
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    idx_name: index("idx_tags_name").on(table.name),
  })
);

export type Tag = typeof tags.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;
