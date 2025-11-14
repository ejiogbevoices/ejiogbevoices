import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { traditions } from "../../drizzle/schema";
import {

  getRecordingById,
  getRecordingsByTradition,
  getRecordingsByElder,
  getPublicRecordings,
  searchRecordings,
  createRecording,
  updateRecording,
  deleteRecording,
  getTranscriptSegmentsByRecording,
  createTranscriptSegments,
  updateTranscriptSegment,
  deleteTranscriptSegment,
  getTranslationsBySegment,
  createTranslation,
  updateTranslation,
  getElderById,
  getTraditionById,
} from "../db";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

// ============================================================================
// SCHEMA VALIDATORS
// ============================================================================

const RecordingSchema = z.object({
  id: z.string().uuid().optional(),
  tradition_id: z.string().uuid(),
  elder_id: z.string().uuid(),
  title: z.string().min(1).max(255),
  language: z.string().length(2),
  duration_ms: z.number().int().positive().optional(),
  storage_url: z.string().url(),
  consent_status: z.enum(["pending", "public", "members", "institution", "private", "restricted"]),
  visibility: z.enum(["public", "members", "institution", "private"]),
  embargo_until: z.date().optional(),
  published_at: z.date().optional(),
  tags: z.array(z.string()).optional(),
  consent_documents: z.array(z.string()).optional(),
  consent_type: z.string().optional(),
  consent_date: z.date().optional(),
  restriction_terms: z.string().optional(),
  provenance_notes: z.string().optional(),
});

const TranscriptSegmentSchema = z.object({
  id: z.string().uuid().optional(),
  recording_id: z.string().uuid(),
  segment_index: z.number().int().nonnegative(),
  start_ms: z.number().int().nonnegative(),
  end_ms: z.number().int().positive(),
  text_original: z.string().min(1),
  qc_status: z.enum(["pending", "approved", "rejected", "needs_review"]).optional(),
});

const TranslationSchema = z.object({
  id: z.string().uuid().optional(),
  segment_id: z.string().uuid(),
  language_code: z.string().length(2),
  translated_text: z.string().min(1),
  qc_status: z.enum(["pending", "approved", "rejected", "needs_review"]).optional(),
});

// ============================================================================
// RECORDINGS ROUTER
// ============================================================================

export const recordingsRouter = router({
  /**
   * Get a single recording by ID
   * Public access for public/published recordings
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const recording = await getRecordingById(input.id);
      if (!recording) {
        throw new Error("Recording not found");
      }

      // Check visibility
      if (
        recording.visibility !== "public" ||
        recording.consent_status !== "public"
      ) {
        throw new Error("Access denied");
      }

      return recording;
    }),

  /**
   * Get all recordings for a tradition (paginated)
   */
  getByTradition: publicProcedure
    .input(
      z.object({
        tradition_id: z.string().uuid(),
        limit: z.number().int().positive().default(20),
        offset: z.number().int().nonnegative().default(0),
      })
    )
    .query(async ({ input }) => {
      return getRecordingsByTradition(
        input.tradition_id,
        input.limit,
        input.offset
      );
    }),

  /**
   * Get all recordings by an elder
   */
  getByElder: publicProcedure
    .input(
      z.object({
        elder_id: z.string().uuid(),
        limit: z.number().int().positive().default(20),
        offset: z.number().int().nonnegative().default(0),
      })
    )
    .query(async ({ input }) => {
      return getRecordingsByElder(input.elder_id, input.limit, input.offset);
    }),

  /**
   * Get all public recordings (paginated)
   */
  getPublic: publicProcedure
    .input(
      z.object({
        limit: z.number().int().positive().default(20),
        offset: z.number().int().nonnegative().default(0),
      })
    )
    .query(async ({ input }) => {
      return getPublicRecordings(input.limit, input.offset);
    }),

  /**
   * Get all traditions
   */
  getTraditions: publicProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(traditions);
    }),

  /**
   * Search recordings by title
   */
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().int().positive().default(20),
        offset: z.number().int().nonnegative().default(0),
      })
    )
    .query(async ({ input }) => {
      return searchRecordings(input.query, input.limit, input.offset);
    }),

  /**
   * Create a new recording (protected)
   */
  create: protectedProcedure
    .input(RecordingSchema)
    .mutation(async ({ input, ctx }) => {
      const recordingId = input.id || uuidv4();

      const recording = await createRecording({
        id: recordingId,
        ...input,
        created_by: ctx.user.id,
        created_at: new Date(),
        updated_at: new Date(),
      });

      if (!recording) {
        throw new Error("Failed to create recording");
      }

      return recording;
    }),

  /**
   * Update a recording (protected, owner only)
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: RecordingSchema.partial(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const recording = await getRecordingById(input.id);
      if (!recording) {
        throw new Error("Recording not found");
      }

      if (recording.created_by !== ctx.user.id) {
        throw new Error("Access denied");
      }

      const updated = await updateRecording(input.id, input.data);
      if (!updated) {
        throw new Error("Failed to update recording");
      }

      return updated;
    }),

  /**
   * Delete a recording (protected, owner only)
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const recording = await getRecordingById(input.id);
      if (!recording) {
        throw new Error("Recording not found");
      }

      if (recording.created_by !== ctx.user.id) {
        throw new Error("Access denied");
      }

      const success = await deleteRecording(input.id);
      if (!success) {
        throw new Error("Failed to delete recording");
      }

      return { success: true };
    }),
});

// ============================================================================
// TRANSCRIPT SEGMENTS ROUTER
// ============================================================================

export const transcriptRouter = router({
  /**
   * Get all transcript segments for a recording
   */
  getByRecording: publicProcedure
    .input(z.object({ recording_id: z.string().uuid() }))
    .query(async ({ input }) => {
      // Verify recording exists and is public
      const recording = await getRecordingById(input.recording_id);
      if (!recording) {
        throw new Error("Recording not found");
      }

      if (
        recording.visibility !== "public" ||
        recording.consent_status !== "public"
      ) {
        throw new Error("Access denied");
      }

      return getTranscriptSegmentsByRecording(input.recording_id);
    }),

  /**
   * Create transcript segments (protected, owner of recording only)
   */
  create: protectedProcedure
    .input(
      z.object({
        recording_id: z.string().uuid(),
        segments: z.array(TranscriptSegmentSchema),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const recording = await getRecordingById(input.recording_id);
      if (!recording) {
        throw new Error("Recording not found");
      }

      if (recording.created_by !== ctx.user.id) {
        throw new Error("Access denied");
      }

      const segmentsWithIds = input.segments.map((seg) => ({
        ...seg,
        id: seg.id || uuidv4(),
        created_at: new Date(),
        updated_at: new Date(),
      }));

      const created = await createTranscriptSegments(segmentsWithIds);
      if (created.length === 0) {
        throw new Error("Failed to create transcript segments");
      }

      return created;
    }),

  /**
   * Update a transcript segment (protected, owner of recording only)
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: TranscriptSegmentSchema.partial(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Get the segment to find the recording
      const segment = await getRecordingById(input.id);
      if (!segment) {
        throw new Error("Segment not found");
      }

      // Verify ownership
      const recording = await getRecordingById(segment.id);
      if (!recording || recording.created_by !== ctx.user.id) {
        throw new Error("Access denied");
      }

      const updated = await updateTranscriptSegment(input.id, input.data);
      if (!updated) {
        throw new Error("Failed to update segment");
      }

      return updated;
    }),

  /**
   * Delete a transcript segment (protected, owner of recording only)
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      // Verify ownership through recording
      const segment = await getRecordingById(input.id);
      if (!segment) {
        throw new Error("Segment not found");
      }

      const recording = await getRecordingById(segment.id);
      if (!recording || recording.created_by !== ctx.user.id) {
        throw new Error("Access denied");
      }

      const success = await deleteTranscriptSegment(input.id);
      if (!success) {
        throw new Error("Failed to delete segment");
      }

      return { success: true };
    }),
});

// ============================================================================
// TRANSLATIONS ROUTER
// ============================================================================

export const translationsRouter = router({
  /**
   * Get translations for a transcript segment
   */
  getBySegment: publicProcedure
    .input(z.object({ segment_id: z.string().uuid() }))
    .query(async ({ input }) => {
      return getTranslationsBySegment(input.segment_id);
    }),

  /**
   * Create a translation (protected)
   */
  create: protectedProcedure
    .input(TranslationSchema)
    .mutation(async ({ input, ctx }) => {
      const translationId = input.id || uuidv4();

      const translation = await createTranslation({
        id: translationId,
        ...input,
        created_by: ctx.user.id,
        created_at: new Date(),
        updated_at: new Date(),
      });

      if (!translation) {
        throw new Error("Failed to create translation");
      }

      return translation;
    }),

  /**
   * Update a translation (protected)
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: TranslationSchema.partial(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updated = await updateTranslation(input.id, input.data);
      if (!updated) {
        throw new Error("Failed to update translation");
      }

      return updated;
    }),
});
