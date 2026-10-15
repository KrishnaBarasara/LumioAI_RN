import { requireSupabase } from '@/lib/supabase';
import type { Meeting } from '@/types';

type ListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  sort?: 'newest' | 'oldest';
};

function rowToMeeting(row: {
  id: string;
  title: string;
  duration_seconds: number;
  recorded_at: string;
  participants: string[] | null;
  status: string;
  sentiment: string | null;
  summaries?: { executive_summary: string }[] | { executive_summary: string } | null;
}): Meeting {
  const summary =
    Array.isArray(row.summaries) ? row.summaries[0]?.executive_summary : row.summaries?.executive_summary;

  return {
    id: row.id,
    title: row.title,
    duration: row.duration_seconds,
    date: row.recorded_at,
    participants: row.participants ?? [],
    status: row.status as Meeting['status'],
    sentiment: (row.sentiment as Meeting['sentiment']) ?? undefined,
    summary: summary ?? undefined,
  };
}

export const supabaseMeetingService = {
  async list(userId: string, params: ListParams = {}) {
    const client = requireSupabase();
    const page = params.page ?? 0;
    const pageSize = params.pageSize ?? 20;
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = client
      .from('meetings')
      .select('*, summaries(executive_summary)')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: params.sort === 'oldest' })
      .range(from, to);

    if (params.search) {
      query = query.ilike('title', `%${params.search}%`);
    }
    if (params.status) {
      query = query.eq('status', params.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(rowToMeeting);
  },

  async getById(meetingId: string) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('meetings')
      .select('*, summaries(executive_summary)')
      .eq('id', meetingId)
      .single();
    if (error) throw error;
    return rowToMeeting(data);
  },

  async create(userId: string, title = 'New Meeting') {
    const client = requireSupabase();
    const { data, error } = await client
      .from('meetings')
      .insert({ user_id: userId, title, status: 'recording' })
      .select()
      .single();
    if (error) throw error;
    return rowToMeeting({ ...data, summaries: null });
  },

  async update(
    meetingId: string,
    patch: Partial<{
      title: string;
      duration_seconds: number;
      audio_url: string;
      audio_path: string;
      status: string;
      sentiment: string;
    }>,
  ) {
    const client = requireSupabase();
    const { error } = await client
      .from('meetings')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', meetingId);
    if (error) throw error;
  },

  async remove(meetingId: string) {
    const client = requireSupabase();
    const { error } = await client.from('meetings').delete().eq('id', meetingId);
    if (error) throw error;
  },
};
