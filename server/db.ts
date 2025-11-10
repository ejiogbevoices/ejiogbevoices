import { eq, and, desc, asc, like, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  recordings,
  transcript_segments,
  translations,
  elders,
  traditions,
  users,
  type Recording,
  type TranscriptSegment,
  type Translation,
  type Elder,
  type Tradition,
  type User,
  type InsertRecording,
  type InsertTranscriptSegment,
  type InsertTranslation,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// RECORDING QUERIES
// ============================================================================

/**
 * Get a single recording by ID with full details
 */
export async function getRecordingById(recordingId: string): Promise<Recording | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(recordings)
    .where(eq(recordings.id, recordingId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get all recordings for a tradition (paginated)
 */
export async function getRecordingsByTradition(
  traditionId: string,
  limit: number = 20,
  offset: number = 0
): Promise<Recording[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(recordings)
    .where(eq(recordings.tradition_id, traditionId))
    .orderBy(desc(recordings.published_at))
    .limit(limit)
    .offset(offset);
}

/**
 * Get all recordings by an elder (paginated)
 */
export async function getRecordingsByElder(
  elderId: string,
  limit: number = 20,
  offset: number = 0
): Promise<Recording[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(recordings)
    .where(eq(recordings.elder_id, elderId))
    .orderBy(desc(recordings.published_at))
    .limit(limit)
    .offset(offset);
}

/**
 * Get recordings by visibility and consent status
 */
export async function getPublicRecordings(
  limit: number = 20,
  offset: number = 0
): Promise<Recording[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(recordings)
    .where(
      and(
        eq(recordings.visibility, "public"),
        eq(recordings.consent_status, "public")
      )
    )
    .orderBy(desc(recordings.published_at))
    .limit(limit)
    .offset(offset);
}

/**
 * Search recordings by title or tags
 */
export async function searchRecordings(
  query: string,
  limit: number = 20,
  offset: number = 0
): Promise<Recording[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(recordings)
    .where(
      and(
        like(recordings.title, `%${query}%`),
        eq(recordings.visibility, "public")
      )
    )
    .orderBy(desc(recordings.published_at))
    .limit(limit)
    .offset(offset);
}

/**
 * Create a new recording
 */
export async function createRecording(
  data: InsertRecording
): Promise<Recording | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(recordings).values(data);
    return getRecordingById(data.id!);
  } catch (error) {
    console.error("[Database] Failed to create recording:", error);
    return null;
  }
}

/**
 * Update a recording
 */
export async function updateRecording(
  recordingId: string,
  data: Partial<InsertRecording>
): Promise<Recording | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db
      .update(recordings)
      .set({ ...data, updated_at: new Date() })
      .where(eq(recordings.id, recordingId));

    return getRecordingById(recordingId);
  } catch (error) {
    console.error("[Database] Failed to update recording:", error);
    return null;
  }
}

/**
 * Delete a recording
 */
export async function deleteRecording(recordingId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(recordings).where(eq(recordings.id, recordingId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete recording:", error);
    return false;
  }
}

// ============================================================================
// TRANSCRIPT SEGMENT QUERIES
// ============================================================================

/**
 * Get all transcript segments for a recording (ordered by segment_index)
 */
export async function getTranscriptSegmentsByRecording(
  recordingId: string
): Promise<TranscriptSegment[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(transcript_segments)
    .where(eq(transcript_segments.recording_id, recordingId))
    .orderBy(asc(transcript_segments.segment_index));
}

/**
 * Get a single transcript segment by ID
 */
export async function getTranscriptSegmentById(
  segmentId: string
): Promise<TranscriptSegment | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(transcript_segments)
    .where(eq(transcript_segments.id, segmentId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Create multiple transcript segments (bulk insert)
 */
export async function createTranscriptSegments(
  segments: InsertTranscriptSegment[]
): Promise<TranscriptSegment[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    await db.insert(transcript_segments).values(segments);
    
    // Return the created segments
    if (segments.length > 0) {
      return getTranscriptSegmentsByRecording(segments[0].recording_id!);
    }
    return [];
  } catch (error) {
    console.error("[Database] Failed to create transcript segments:", error);
    return [];
  }
}

/**
 * Update a transcript segment
 */
export async function updateTranscriptSegment(
  segmentId: string,
  data: Partial<InsertTranscriptSegment>
): Promise<TranscriptSegment | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db
      .update(transcript_segments)
      .set({ ...data, updated_at: new Date() })
      .where(eq(transcript_segments.id, segmentId));

    return getTranscriptSegmentById(segmentId);
  } catch (error) {
    console.error("[Database] Failed to update transcript segment:", error);
    return null;
  }
}

/**
 * Delete a transcript segment
 */
export async function deleteTranscriptSegment(segmentId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .delete(transcript_segments)
      .where(eq(transcript_segments.id, segmentId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete transcript segment:", error);
    return false;
  }
}

// ============================================================================
// TRANSLATION QUERIES
// ============================================================================

/**
 * Get translations for a transcript segment
 */
export async function getTranslationsBySegment(
  segmentId: string
): Promise<Translation[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(translations)
    .where(eq(translations.segment_id, segmentId));
}

/**
 * Get a translation by segment and language
 */
export async function getTranslationBySegmentAndLanguage(
  segmentId: string,
  languageCode: string
): Promise<Translation | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(translations)
    .where(
      and(
        eq(translations.segment_id, segmentId),
        eq(translations.language_code, languageCode)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Create a translation
 */
export async function createTranslation(
  data: InsertTranslation
): Promise<Translation | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(translations).values(data);
    return db
      .select()
      .from(translations)
      .where(eq(translations.id, data.id!))
      .then((res) => (res.length > 0 ? res[0] : null));
  } catch (error) {
    console.error("[Database] Failed to create translation:", error);
    return null;
  }
}

/**
 * Update a translation
 */
export async function updateTranslation(
  translationId: string,
  data: Partial<InsertTranslation>
): Promise<Translation | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db
      .update(translations)
      .set({ ...data, updated_at: new Date() })
      .where(eq(translations.id, translationId));

    return db
      .select()
      .from(translations)
      .where(eq(translations.id, translationId))
      .then((res) => (res.length > 0 ? res[0] : null));
  } catch (error) {
    console.error("[Database] Failed to update translation:", error);
    return null;
  }
}

// ============================================================================
// ELDER QUERIES
// ============================================================================

/**
 * Get all elders for a tradition
 */
export async function getEldersByTradition(
  traditionId: string
): Promise<Elder[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(elders)
    .where(eq(elders.tradition_id, traditionId))
    .orderBy(asc(elders.name));
}

/**
 * Get a single elder by ID
 */
export async function getElderById(elderId: string): Promise<Elder | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(elders)
    .where(eq(elders.id, elderId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

// ============================================================================
// TRADITION QUERIES
// ============================================================================

/**
 * Get a tradition by ID
 */
export async function getTraditionById(
  traditionId: string
): Promise<Tradition | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(traditions)
    .where(eq(traditions.id, traditionId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get all public traditions
 */
export async function getPublicTraditions(): Promise<Tradition[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(traditions)
    .where(eq(traditions.visibility, "public"))
    .orderBy(asc(traditions.name));
}

// ============================================================================
// USER QUERIES
// ============================================================================

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Create or update user
 */
export async function upsertUser(userData: Partial<User> & { id: string }): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    const existing = await getUserById(userData.id);
    if (existing) {
      await db
        .update(users)
        .set({ ...userData, updated_at: new Date() })
        .where(eq(users.id, userData.id));
    } else {
      await db.insert(users).values(userData as any);
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
  }
}
