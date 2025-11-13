import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { queueDubbingJob, queueRecordingDubbing } from "../services/dubbingJob";
import { getVoicesForLanguage, getSupportedLanguages } from "../services/textToSpeech";
import { getDb } from "../db";
import { eq, and } from "drizzle-orm";
import { dubs, jobs } from "../../drizzle/schema";

export const dubbingRouter = router({
  /**
   * Get available voices for a language
   */
  getVoices: protectedProcedure
    .input(z.object({ language: z.string().default("en") }))
    .query(({ input }) => {
      return getVoicesForLanguage(input.language);
    }),

  /**
   * Get supported languages for dubbing
   */
  getSupportedLanguages: protectedProcedure.query(() => {
    return getSupportedLanguages();
  }),

  /**
   * Queue a dubbing job for a single segment
   */
  dubSegment: protectedProcedure
    .input(
      z.object({
        recording_id: z.string(),
        segment_id: z.string(),
        language: z.string().default("en"),
        voice_id: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const jobId = await queueDubbingJob(
          input.recording_id,
          input.segment_id,
          input.language,
          input.voice_id
        );

        return {
          job_id: jobId,
          status: "queued",
          message: "Dubbing job queued successfully",
        };
      } catch (error) {
        console.error("Failed to queue dubbing job:", error);
        throw error;
      }
    }),

  /**
   * Queue dubbing jobs for all segments of a recording
   */
  dubRecording: protectedProcedure
    .input(
      z.object({
        recording_id: z.string(),
        language: z.string().default("en"),
        voice_id: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const jobIds = await queueRecordingDubbing(
          input.recording_id,
          input.language,
          input.voice_id
        );

        return {
          job_ids: jobIds,
          count: jobIds.length,
          status: "queued",
          message: `${jobIds.length} dubbing jobs queued successfully`,
        };
      } catch (error) {
        console.error("Failed to queue recording dubbing:", error);
        throw error;
      }
    }),

  /**
   * Get dubs for a recording
   */
  getDubs: protectedProcedure
    .input(
      z.object({
        recording_id: z.string(),
        language: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const conditions = [eq(dubs.recording_id, input.recording_id)];
      if (input.language) {
        conditions.push(eq(dubs.language_code, input.language));
      }

      // Use and() to combine multiple conditions
      const { and } = await import("drizzle-orm");
      return db
        .select()
        .from(dubs)
        .where(and(...conditions));
    }),

  /**
   * Get dubbing job status
   */
  getJobStatus: protectedProcedure
    .input(z.object({ job_id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const result = await db
        .select()
        .from(jobs)
        .where(eq(jobs.id, input.job_id))
        .limit(1);

      if (!result || result.length === 0) {
        throw new Error("Job not found");
      }

      return result[0];
    }),

  /**
   * Get all dubbing jobs for a recording
   */
  getRecordingJobs: protectedProcedure
    .input(z.object({ recording_id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // This is a simplified query - in production you'd want to join with the payload
      const result = await db
        .select()
        .from(jobs)
        .where(eq(jobs.job_type, "dubbing"));

      // Filter by recording_id in the payload
      return result.filter((job) => {
        const payload = job.payload as any;
        return payload?.recording_id === input.recording_id;
      });
    }),
});
