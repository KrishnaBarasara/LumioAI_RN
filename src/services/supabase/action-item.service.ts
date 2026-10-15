import { requireSupabase } from '@/lib/supabase';

export const supabaseActionItemService = {
  async listByMeeting(meetingId: string) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('action_items')
      .select('*')
      .eq('meeting_id', meetingId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async replaceForMeeting(
    meetingId: string,
    userId: string,
    items: Array<{ title: string; assignee?: string; dueDate?: string; priority?: string }>,
  ) {
    const client = requireSupabase();
    await client.from('action_items').delete().eq('meeting_id', meetingId);
    if (items.length === 0) return;

    const { error } = await client.from('action_items').insert(
      items.map((item) => ({
        meeting_id: meetingId,
        user_id: userId,
        title: item.title,
        assignee: item.assignee ?? null,
        due_date: item.dueDate ?? null,
        priority: item.priority ?? 'medium',
      })),
    );
    if (error) throw error;
  },

  async toggleComplete(id: string, completed: boolean) {
    const client = requireSupabase();
    const { error } = await client
      .from('action_items')
      .update({ completed, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },

  async update(
    id: string,
    patch: Partial<{ title: string; assignee: string; due_date: string; priority: string }>,
  ) {
    const client = requireSupabase();
    const { error } = await client
      .from('action_items')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },

  async remove(id: string) {
    const client = requireSupabase();
    const { error } = await client.from('action_items').delete().eq('id', id);
    if (error) throw error;
  },
};
