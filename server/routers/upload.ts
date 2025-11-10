import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { queueTranscriptionJob } from "../services/transcriptionJob";
import { getDb } from "../db";
import { recordings, events } from "../../drizzle/schema";

export const uploadRouter = router({
  /**
   * Create a new recording and queue transcription
   */
  createRecording: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        tradition_id: z.string(),
        elder_id: z.string(),
        language: z.string().default("en"),
        storage_url: z.string().url(),
        consent_status: z.enum(["public", "members", "institution", "private"]).default("private"),
        visibility: z.enum(["public", "members", "institution", "private"]).default("private"),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const recordingId = `rec-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      try {
        // Create the recording
        await db.insert(recordings).values({
          id: recordingId,
          title: input.title,
          tradition_id: input.tradition_id,
          elder_id: input.elder_id,
          language: input.language,
          storage_url: input.storage_url,
          consent_status: input.consent_status as any,
          visibility: input.visibility,
          tags: input.tags || [],
          duration_ms: 0,
          published_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        })

        // Queue transcription job
        const jobId = await queueTranscriptionJob(recordingId, input.language);

        // Log the event
        await db.insert(events).values({
          id: `evt-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          event_type: "recording_created",
          target_type: "recording",
          target_id: recordingId,
          user_id: ctx.user?.id || "system",
          meta: {
            title: input.title,
            transcription_job_id: jobId,
          },
          created_at: new Date(),
        })

        return {
          recording_id: recordingId,
          transcription_job_id: jobId,
          status: "created",
        };
      } catch (error) {
        console.error("Failed to create recording:", error);
        throw error;
      }
    }),

  /**
   * Get transcription job status
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
});

import { jobs } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
