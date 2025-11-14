# API Integration Stubs

## ElevenLabs Integration

### TTS Render Endpoint
```typescript
// POST /api/tts/render
interface TTSRequest {
  text: string;
  voice_id: string;
  model_id?: string;
  pronunciation_dictionary?: Record<string, string>;
}

// Stub implementation
export async function renderTTS(request: TTSRequest) {
  // Call ElevenLabs TTS API
  // Apply pronunciation dictionary for Yoruba names, Orisa terms
  // Cache output audio URL
  return { audio_url: 'cached_audio_url', duration_ms: 45000 };
}
```

### Dubbing Render Endpoint
```typescript
// POST /api/dubbing/render
interface DubbingRequest {
  source_url: string;
  target_languages: string[];
  recording_id: string;
}

// Stub implementation
export async function renderDubbing(request: DubbingRequest) {
  // Call ElevenLabs Dubbing API
  // Generate multi-language versions
  // Cache outputs
  return {
    versions: [
      { language: 'en', audio_url: 'en_version_url' },
      { language: 'pt', audio_url: 'pt_version_url' }
    ]
  };
}
```

### Studio 3.0 Webhook
```typescript
// POST /api/studio/webhook
interface StudioWebhook {
  event: 'export_complete' | 'captions_updated';
  project_id: string;
  recording_id: string;
  assets: {
    audio_url?: string;
    captions_url?: string;
  };
}

// Stub implementation
export async function handleStudioWebhook(webhook: StudioWebhook) {
  // Update recording with new assets
  // Sync captions to database
  // Log event
}
```

## MCP Server Stubs

### voices-catalog-mcp (Read-only)
```typescript
// Node.js MCP server
const tools = {
  listRecordings: async (filters: { lineage?: string, tags?: string[] }) => {
    // Query recordings from database
    return recordings;
  },
  getRecording: async (id: string) => {
    // Fetch single recording with transcripts
    return recording;
  },
  getTranscript: async (recording_id: string, language: string) => {
    // Fetch transcript segments
    return segments;
  },
  search: async (query: string) => {
    // Full-text search across titles, tags, transcripts
    return results;
  }
};
```

### ops-mcp (Role-gated)
```typescript
// Node.js MCP server with auth
const tools = {
  createRecordingRow: async (data: RecordingData, user_role: string) => {
    if (!['admin', 'editor'].includes(user_role)) throw new Error('Unauthorized');
    // Insert new recording
    return recording_id;
  },
  updateConsent: async (elder_id: string, consent_data: ConsentData, user_role: string) => {
    if (user_role !== 'admin') throw new Error('Unauthorized');
    // Update consent status
    return success;
  },
  publish: async (recording_id: string, user_role: string) => {
    if (!['admin', 'editor'].includes(user_role)) throw new Error('Unauthorized');
    // Set published_at timestamp
    return success;
  }
};
```

## Pronunciation Dictionary
```typescript
// Load from database or config
export const pronunciationDictionary = {
  'Olodumare': 'oh-loh-doo-mah-reh',
  'Orunmila': 'oh-roon-mee-lah',
  'Obatala': 'oh-bah-tah-lah',
  'Oduduwa': 'oh-doo-doo-wah',
  'Ifa': 'ee-fah',
  'Odu': 'oh-doo',
  'Orisa': 'oh-ree-shah'
};

// Apply during TTS render
export function applyPronunciation(text: string): string {
  let processed = text;
  for (const [word, pronunciation] of Object.entries(pronunciationDictionary)) {
    const regex = new RegExp(word, 'gi');
    processed = processed.replace(regex, pronunciation);
  }
  return processed;
}
```
