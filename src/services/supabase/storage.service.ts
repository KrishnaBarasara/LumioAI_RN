import { requireSupabase } from '@/lib/supabase';

const MEETINGS_BUCKET = 'meeting-recordings';

export const supabaseStorageService = {
  async uploadMeetingAudio(userId: string, meetingId: string, localUri: string) {
    const client = requireSupabase();
    const ext = localUri.split('.').pop()?.split('?')[0] ?? 'm4a';
    const path = `${userId}/${meetingId}.${ext}`;
    const contentType = ext === 'wav' ? 'audio/wav' : 'audio/mp4';

    const response = await fetch(localUri);
    const blob = await response.blob();

    const { error } = await client.storage.from(MEETINGS_BUCKET).upload(path, blob, {
      contentType,
      upsert: true,
    });
    if (error) throw error;

    const { data } = client.storage.from(MEETINGS_BUCKET).getPublicUrl(path);
    return { path, publicUrl: data.publicUrl };
  },
};
