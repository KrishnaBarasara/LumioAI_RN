export const env = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '',
  openaiApiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '',
  deepgramApiKey: process.env.EXPO_PUBLIC_DEEPGRAM_API_KEY ?? '',
  transcriptionProvider:
    (process.env.EXPO_PUBLIC_TRANSCRIPTION_PROVIDER as 'openai' | 'deepgram') ?? 'openai',
  revenueCatApiKey: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ?? '',
  googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
} as const;

export const isSupabaseConfigured = Boolean(
  env.supabaseUrl && env.supabaseAnonKey,
);

export const isGeminiConfigured = Boolean(env.geminiApiKey);

export const isTranscriptionConfigured = Boolean(
  env.transcriptionProvider === 'deepgram'
    ? env.deepgramApiKey
    : env.openaiApiKey,
);
