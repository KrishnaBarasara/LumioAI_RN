import { requireSupabase } from '@/lib/supabase';

export type TranscriptSegment = {
  speaker?: string;
  text: string;
  start?: number;
  end?: number;
};

export const supabaseTranscriptService = {
  async save(
    meetingId: string,
    userId: string,
    content: string,
    segments: TranscriptSegment[],
    provider: string,
  ) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('transcripts')
      .upsert(
        {
          meeting_id: meetingId,
          user_id: userId,
          content,
          segments,
          provider,
        },
        { onConflict: 'meeting_id' },
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getByMeetingId(meetingId: string) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('transcripts')
      .select('*')
      .eq('meeting_id', meetingId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
};
