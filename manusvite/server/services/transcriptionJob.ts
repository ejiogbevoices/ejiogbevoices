import { transcribeAudio } from "./speechToText";
import { getDb } from "../db";
import { eq } from "drizzle-orm";
import { jobs, transcript_segments, recordings } from "../../drizzle/schema";

/**
 * Process a transcription job from the queue
 * Called by the background job processor
 */
export async function processTranscriptionJob(jobId: string) {
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

    if (job.job_type !== "transcription") {
      throw new Error(`Invalid job type: ${job.job_type}`);
    }

    // Get the recording
    const recordingResult = await db
      .select()
      .from(recordings)
      .where(eq(recordings.id, payload.recording_id))
      .limit(1);

    if (!recordingResult || recordingResult.length === 0) {
      throw new Error(`Recording ${payload.recording_id} not found`);
    }

    const recording = recordingResult[0];

    // Update job status to processing
    await db
      .update(jobs)
      .set({
        status: "running",
        updated_at: new Date(),
      })
      .where(eq(jobs.id, jobId));

    // Transcribe the audio
    const transcriptionResult = await transcribeAudio(
      recording.storage_url,
      payload.language || "en-US"
    );

    // Delete existing transcript segments for this recording
    await db
      .delete(transcript_segments)
      .where(eq(transcript_segments.recording_id, recording.id));

    // Insert new transcript segments
    const segmentsToInsert = transcriptionResult.segments.map((segment, index) => ({
      id: `seg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      recording_id: recording.id,
      segment_index: index,
      start_ms: Math.floor(segment.startTime),
      end_ms: Math.floor(segment.endTime),
      text_original: segment.text,
      qc_status: "pending" as const,
      created_at: new Date(),
      updated_at: new Date(),
    }))

    if (segmentsToInsert.length > 0) {
      await db.insert(transcript_segments).values(segmentsToInsert);
    }

    // Update job status to completed
    await db
      .update(jobs)
      .set({
        status: "completed" as any,
        result: {
          segments_created: segmentsToInsert.length,
          full_transcript: transcriptionResult.text,
          confidence: transcriptionResult.confidence,
        },
        updated_at: new Date(),
        completed_at: new Date(),
      })
      .where(eq(jobs.id, jobId));

    console.log(
      `[Transcription] Successfully transcribed recording ${recording.id}`
    );
  } catch (error) {
    console.error(`[Transcription] Job ${jobId} failed:`, error);

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
 * Queue a transcription job for a recording
 */
export async function queueTranscriptionJob(
  recordingId: string,
  language: string = "en-US"
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  await db.insert(jobs).values({
    id: jobId,
    job_type: "transcription",
    status: "queued" as any,
    payload: {
      recording_id: recordingId,
      language,
    },
    created_at: new Date(),
    updated_at: new Date(),
  })

  return jobId;
}
