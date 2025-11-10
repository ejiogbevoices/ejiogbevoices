import { ElevenLabsClient } from "elevenlabs";
import { storagePut } from "../storage";

/**
 * ElevenLabs Text-to-Speech Service
 * Handles synthetic voice generation for dubbing
 */

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export interface VoiceOption {
  id: string;
  name: string;
  language: string;
  accent?: string;
}

export interface DubResult {
  audio_url: string;
  duration_ms: number;
  voice_id: string;
  language: string;
  params_hash: string;
}

/**
 * Available voices for different languages
 * These are ElevenLabs voice IDs
 */
const VOICE_MAPPING: Record<string, VoiceOption[]> = {
  "en": [
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", language: "en", accent: "American" },
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Rachel", language: "en", accent: "American" },
    { id: "21m00Tcm4TlvDq8ikWAM", name: "George", language: "en", accent: "British" },
  ],
  "yo": [
    { id: "9BWtsMINqrJLrRacOk9x", name: "Adeyemi", language: "yo", accent: "Nigerian" },
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Amara", language: "yo", accent: "Nigerian" },
  ],
  "fr": [
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Margot", language: "fr", accent: "French" },
  ],
  "es": [
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Diego", language: "es", accent: "Spanish" },
  ],
  "de": [
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Hans", language: "de", accent: "German" },
  ],
  "pt": [
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Paulo", language: "pt", accent: "Portuguese" },
  ],
  "zh": [
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Wei", language: "zh", accent: "Mandarin" },
  ],
  "ja": [
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Yuki", language: "ja", accent: "Japanese" },
  ],
  "ar": [
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Rashid", language: "ar", accent: "Arabic" },
  ],
};

/**
 * Generate a hash of the dubbing parameters for caching
 */
function generateParamsHash(text: string, voiceId: string, language: string): string {
  const crypto = require("crypto");
  const data = `${text}:${voiceId}:${language}`;
  return crypto.createHash("md5").update(data).digest("hex");
}

/**
 * Generate synthetic speech from text using ElevenLabs
 */
export async function generateSpeech(
  text: string,
  language: string = "en",
  voiceId?: string
): Promise<DubResult> {
  try {
    // Select voice if not provided
    if (!voiceId) {
      const voices = VOICE_MAPPING[language] || VOICE_MAPPING["en"];
      voiceId = voices[0].id;
    }

    // Generate audio using ElevenLabs
    const audioStream = await client.generate({
      voice: voiceId,
      text: text,
      model_id: "eleven_monolingual_v1",
    });

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    // Calculate duration (rough estimate: 1 second per 5 words)
    const wordCount = text.split(/\s+/).length;
    const durationMs = Math.ceil((wordCount / 5) * 1000);

    // Upload to storage
    const fileName = `dubs/${language}/${Date.now()}-${Math.random().toString(36).substring(7)}.mp3`;
    const { url } = await storagePut(fileName, audioBuffer, "audio/mpeg");

    // Generate params hash for caching
    const paramsHash = generateParamsHash(text, voiceId, language);

    return {
      audio_url: url,
      duration_ms: durationMs,
      voice_id: voiceId,
      language,
      params_hash: paramsHash,
    };
  } catch (error) {
    console.error("Text-to-speech generation error:", error);
    throw new Error(
      `Failed to generate speech: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Generate dubs for multiple transcript segments
 */
export async function generateSegmentDubs(
  segments: Array<{ id: string; text: string }>,
  language: string = "en",
  voiceId?: string
): Promise<Array<{ segment_id: string; dub_result: DubResult }>> {
  const results: Array<{ segment_id: string; dub_result: DubResult }> = [];

  for (const segment of segments) {
    try {
      const dubResult = await generateSpeech(segment.text, language, voiceId);
      results.push({
        segment_id: segment.id,
        dub_result: dubResult,
      });

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to dub segment ${segment.id}:`, error);
      // Continue with next segment instead of failing
    }
  }

  return results;
}

/**
 * Get available voices for a language
 */
export function getVoicesForLanguage(language: string): VoiceOption[] {
  return VOICE_MAPPING[language] || VOICE_MAPPING["en"];
}

/**
 * Get all supported languages
 */
export function getSupportedLanguages(): string[] {
  return Object.keys(VOICE_MAPPING);
}

/**
 * Clone a voice from audio (requires ElevenLabs Pro)
 */
export async function cloneVoice(
  name: string,
  audioUrl: string,
  description?: string
): Promise<string> {
  try {
    // Fetch audio from URL
    const response = await fetch(audioUrl);
    const audioBuffer = await response.arrayBuffer();

    // Clone voice using ElevenLabs API
    const clonedVoice = await client.voices.add({
      name,
      description,
      files: [new File([audioBuffer], "audio.mp3", { type: "audio/mpeg" })],
    });

    return clonedVoice.voice_id;
  } catch (error) {
    console.error("Voice cloning error:", error);
    throw new Error(
      `Failed to clone voice: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
