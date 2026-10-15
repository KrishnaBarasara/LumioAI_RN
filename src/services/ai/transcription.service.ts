import { env, isTranscriptionConfigured } from '@/config/env';
import * as FileSystem from 'expo-file-system';
import type { TranscriptSegment } from '@/services/supabase/transcript.service';

const MAX_RETRIES = 3;

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw lastError;
}

async function transcribeWithOpenAI(localUri: string): Promise<{
  text: string;
  segments: TranscriptSegment[];
}> {
  const base64 = await FileSystem.readAsStringAsync(localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const formData = new FormData();
  formData.append('file', {
    uri: localUri,
    name: 'recording.m4a',
    type: 'audio/m4a',
  } as unknown as Blob);
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'verbose_json');

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.openaiApiKey}` },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Whisper failed: ${await res.text()}`);
  }

  const json = await res.json();
  const segments: TranscriptSegment[] =
    json.segments?.map((s: { text: string; start: number; end: number }) => ({
      text: s.text,
      start: s.start,
      end: s.end,
      speaker: 'Speaker',
    })) ?? [];

  return { text: json.text ?? '', segments };
}

async function transcribeWithDeepgram(localUri: string): Promise<{
  text: string;
  segments: TranscriptSegment[];
}> {
  const base64 = await FileSystem.readAsStringAsync(localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const res = await fetch(
    'https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&diarize=true',
    {
      method: 'POST',
      headers: {
        Authorization: `Token ${env.deepgramApiKey}`,
        'Content-Type': 'audio/m4a',
      },
      body: Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)),
    },
  );

  if (!res.ok) {
    throw new Error(`Deepgram failed: ${await res.text()}`);
  }

  const json = await res.json();
  const alt = json?.results?.channels?.[0]?.alternatives?.[0];
  const words = alt?.words ?? [];
  const segments: TranscriptSegment[] = words.length
    ? [
        {
          speaker: words[0]?.speaker != null ? `Speaker ${words[0].speaker}` : 'Speaker',
          text: alt?.transcript ?? '',
        },
      ]
    : [];

  return { text: alt?.transcript ?? '', segments };
}

export const transcriptionService = {
  isConfigured: isTranscriptionConfigured,

  async transcribe(localUri: string) {
    if (!isTranscriptionConfigured) {
      throw new Error('Transcription API is not configured');
    }

    return withRetry(async () => {
      if (env.transcriptionProvider === 'deepgram') {
        return transcribeWithDeepgram(localUri);
      }
      return transcribeWithOpenAI(localUri);
    });
  },
};
