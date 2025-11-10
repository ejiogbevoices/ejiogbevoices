import speech_v1 from "@google-cloud/speech";
import { Storage } from "@google-cloud/storage";

/**
 * Google Speech-to-Text Service
 * Handles automatic speech recognition and transcription of audio files
 */

const client = new speech_v1.SpeechClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export interface TranscriptionResult {
  text: string;
  confidence: number;
  segments: Array<{
    text: string;
    startTime: number;
    endTime: number;
    confidence: number;
  }>;
  language: string;
}

/**
 * Transcribe audio from a URL using Google Speech-to-Text
 * Supports long-running operations for audio > 1 minute
 */
export async function transcribeAudio(
  audioUrl: string,
  language: string = "en-US"
): Promise<TranscriptionResult> {
  try {
    const request = {
      config: {
        encoding: "LINEAR16" as const,
        sampleRateHertz: 16000,
        languageCode: language,
        enableAutomaticPunctuation: true,
        enableWordTimeOffsets: true,
        model: "latest_long" as const,
      },
      audio: {
        uri: audioUrl,
      },
    };

    // Use long-running operation for better accuracy
    const [operation] = await client.longRunningRecognize(request);
    const [response] = await operation.promise();

    if (!response.results || response.results.length === 0) {
      throw new Error("No transcription results returned");
    }

    // Extract full transcript
    let fullTranscript = "";
    const segments: TranscriptionResult["segments"] = [];

    for (const result of response.results) {
      if (!result.alternatives || result.alternatives.length === 0) continue;

      const alternative = result.alternatives[0];
      fullTranscript += alternative.transcript || "";

      // Extract word-level timing information
      if (alternative.words && alternative.words.length > 0) {
        let segmentText = "";
        let segmentStartTime = 0;
        let segmentConfidence = 0;
        let wordCount = 0;

        for (const word of alternative.words) {
          const startTime = word.startTime
            ? parseInt(word.startTime.seconds as any) * 1000 +
              (word.startTime.nanos || 0) / 1000000
            : 0;
          const endTime = word.endTime
            ? parseInt(word.endTime.seconds as any) * 1000 +
              (word.endTime.nanos || 0) / 1000000
            : 0;

          if (!segmentText) {
            segmentStartTime = startTime;
          }

          segmentText += (word.word || "") + " ";
          segmentConfidence += word.confidence || 0;
          wordCount++;

          // Create a segment every 10 words or at the end
          if (wordCount >= 10 || word === alternative.words[alternative.words.length - 1]) {
            segments.push({
              text: segmentText.trim(),
              startTime: segmentStartTime,
              endTime: endTime,
              confidence: wordCount > 0 ? segmentConfidence / wordCount : 0,
            });

            segmentText = "";
            segmentConfidence = 0;
            wordCount = 0;
          }
        }
      }
    }

    return {
      text: fullTranscript.trim(),
      confidence: response.results[0]?.alternatives?.[0]?.confidence || 0,
      segments,
      language,
    };
  } catch (error) {
    console.error("Speech-to-Text transcription error:", error);
    throw new Error(`Failed to transcribe audio: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Transcribe audio from a local file
 * Uploads to Google Cloud Storage temporarily for processing
 */
export async function transcribeLocalFile(
  filePath: string,
  language: string = "en-US"
): Promise<TranscriptionResult> {
  const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET!);
  const fileName = `temp-transcription-${Date.now()}-${Math.random().toString(36).substring(7)}.wav`;
  const file = bucket.file(fileName);

  try {
    // Upload file to GCS
    await bucket.upload(filePath, { destination: fileName });

    // Transcribe from GCS URL
    const gcsUri = `gs://${process.env.GOOGLE_CLOUD_STORAGE_BUCKET}/${fileName}`;
    const result = await transcribeAudio(gcsUri, language);

    // Clean up temporary file
    await file.delete().catch(() => {
      // Ignore deletion errors
    });

    return result;
  } catch (error) {
    // Clean up on error
    await file.delete().catch(() => {
      // Ignore deletion errors
    });
    throw error;
  }
}

/**
 * Get supported languages for transcription
 */
export function getSupportedLanguages(): Array<{ code: string; name: string }> {
  return [
    { code: "en-US", name: "English (US)" },
    { code: "en-GB", name: "English (UK)" },
    { code: "yo", name: "Yoruba" },
    { code: "fr-FR", name: "French" },
    { code: "es-ES", name: "Spanish" },
    { code: "de-DE", name: "German" },
    { code: "it-IT", name: "Italian" },
    { code: "pt-BR", name: "Portuguese (Brazil)" },
    { code: "zh-CN", name: "Chinese (Simplified)" },
    { code: "ja-JP", name: "Japanese" },
    { code: "ko-KR", name: "Korean" },
    { code: "ar-SA", name: "Arabic" },
    { code: "hi-IN", name: "Hindi" },
    { code: "ru-RU", name: "Russian" },
  ];
}
