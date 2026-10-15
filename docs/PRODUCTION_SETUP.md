# Lumio AI — Production Setup

## 1. Environment

Copy `.env.example` to `.env` and fill values:

```bash
cp .env.example .env
```

Required for full functionality:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_GEMINI_API_KEY`
- `EXPO_PUBLIC_OPENAI_API_KEY` or `EXPO_PUBLIC_DEEPGRAM_API_KEY`

## 2. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run SQL from `supabase/migrations/001_initial_schema.sql` in the SQL editor
3. Create Storage buckets (public or RLS policies):
   - `meeting-recordings`
   - `resumes`
4. Enable Google provider under Authentication → Providers (optional)
5. Add redirect URL: `lumioai://` for OAuth

## 3. Run app

```bash
npm install
npm start
npm run ios   # or npm run android
```

Without `.env`, the app falls back to **mock data** (demo mode).

## 4. Meeting pipeline

```
Record (expo-audio) → Upload (Supabase Storage) → Transcribe (Whisper/Deepgram)
→ Summarize (Gemini) → Save summary + action items
```

## 5. Native integrations (optional)

| Feature | Package | Notes |
|---------|---------|--------|
| Payments | RevenueCat | `EXPO_PUBLIC_REVENUECAT_API_KEY` + EAS build |
| Analytics | Firebase | Add config in EAS; wire `analyticsService` |
| Google Sign-In | Supabase OAuth | Configure in dashboard |

## 6. Prebuild after icon/native changes

```bash
npm run prebuild:ios
npm run ios
```
