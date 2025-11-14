import { generateSpeech } from "./textToSpeech";
import { getDb } from "../db";
import { eq } from "drizzle-orm";
import { jobs, dubs, transcript_segments } from "../../drizzle/schema";

/**
 * Process a dubbing job from the queue
 * Called by the background job processor
 */
export async function processDubbingJob(jobId: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    // Get the job
    const jobResult = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (!jobResult || jobResult.length === 0) {
      throw new Error(`Job ${jobId} not found`);
    }

    const job = jobResult[0];
    const payload = job.payload as any;

    if (job.job_type !== "dubbing") {
      throw new Error(`Invalid job type: ${job.job_type}`);
    }

    // Update job status to running
    await db
      .update(jobs)
      .set({
        status: "running",
        updated_at: new Date(),
      })
      .where(eq(jobs.id, jobId));

    // Get the transcript segment
    const segmentResult = await db
      .select()
      .from(transcript_segments)
      .where(eq(transcript_segments.id, payload.segment_id))
      .limit(1);

    if (!segmentResult || segmentResult.length === 0) {
      throw new Error(`Segment ${payload.segment_id} not found`);
    }

    const segment = segmentResult[0];

    // Generate speech
    const dubResult = await generateSpeech(
      segment.text_original,
      payload.language || "en",
      payload.voice_id
    );

    // Create dub record
    const dubId = `dub-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    await db.insert(dubs).values({
      id: dubId,
      recording_id: payload.recording_id,
      language_code: dubResult.language,
      is_synthetic: true,
      audio_url: dubResult.audio_url,
      disclosure_label: "This audio was generated using synthetic voice technology by ElevenLabs.",
      status: "completed" as any,
      params_hash: dubResult.params_hash,
      created_at: new Date(),
      updated_at: new Date(),
    })

    // Update job status to completed
    await db
      .update(jobs)
      .set({
        status: "completed" as any,
        result: {
          dub_id: dubId,
          audio_url: dubResult.audio_url,
          duration_ms: dubResult.duration_ms,
        },
        updated_at: new Date(),
        completed_at: new Date(),
      })
      .where(eq(jobs.id, jobId));

    console.log(
      `[Dubbing] Successfully dubbed segment ${segment.id} in ${dubResult.language}`
    );
  } catch (error) {
    console.error(`[Dubbing] Job ${jobId} failed:`, error);

    // Update job status to failed
    await db
      .update(jobs)
      .set({
        status: "failed" as any,
        error_message: error instanceof Error ? error.message : String(error),
        updated_at: new Date(),
      })
      .where(eq(jobs.id, jobId));

    throw error;
  }
}

/**
 * Queue a dubbing job for a transcript segment
 */
export async function queueDubbingJob(
  recordingId: string,
  segmentId: string,
  language: string = "en",
  voiceId?: string
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  await db.insert(jobs).values({
    id: jobId,
    job_type: "dubbing",
    status: "queued" as any,
    payload: {
      recording_id: recordingId,
      segment_id: segmentId,
      language,
      voice_id: voiceId,
    },
    created_at: new Date(),
    updated_at: new Date(),
  });

  return jobId;
}

/**
 * Queue dubbing jobs for all segments of a recording
 */
export async function queueRecordingDubbing(
  recordingId: string,
  language: string = "en",
  voiceId?: string
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Get all segments for the recording
  const segments = await db
    .select()
    .from(transcript_segments)
    .where(eq(transcript_segments.recording_id, recordingId));

  const jobIds: string[] = [];

  for (const segment of segments) {
    const jobId = await queueDubbingJob(
      recordingId,
      segment.id,
      language,
      voiceId
    );
    jobIds.push(jobId);
  }

  return jobIds;
}
