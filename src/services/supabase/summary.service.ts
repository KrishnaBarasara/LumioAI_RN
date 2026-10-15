import { requireSupabase } from '@/lib/supabase';
import type { Json } from '@/types/database';
import type { ActionItem, MeetingSummary } from '@/types';
import { supabaseActionItemService } from './action-item.service';

export const supabaseSummaryService = {
  async save(
    meetingId: string,
    userId: string,
    payload: {
      executive_summary: string;
      key_points: string[];
      decisions: string[];
      risks: string[];
      follow_ups: string[];
      sentiment_score: number;
      sentiment_label: string;
      sentiment_description: string;
      actionItems: Array<{
        title: string;
        assignee?: string;
        dueDate?: string;
        priority?: string;
      }>;
      raw_json: Record<string, unknown>;
    },
  ) {
    const client = requireSupabase();

    const { error: summaryError } = await client.from('summaries').upsert(
      {
        meeting_id: meetingId,
        user_id: userId,
        executive_summary: payload.executive_summary,
        key_points: payload.key_points,
        decisions: payload.decisions,
        risks: payload.risks,
        follow_ups: payload.follow_ups,
        sentiment_score: payload.sentiment_score,
        sentiment_label: payload.sentiment_label,
        sentiment_description: payload.sentiment_description,
        raw_json: payload.raw_json as Json,
      },
      { onConflict: 'meeting_id' },
    );
    if (summaryError) throw summaryError;

    await supabaseActionItemService.replaceForMeeting(
      meetingId,
      userId,
      payload.actionItems,
    );

    await client
      .from('meetings')
      .update({
        status: 'completed',
        sentiment: payload.sentiment_label.toLowerCase().includes('positive')
          ? 'positive'
          : payload.sentiment_label.toLowerCase().includes('negative')
            ? 'negative'
            : 'neutral',
        updated_at: new Date().toISOString(),
      })
      .eq('id', meetingId);
  },

  async getMeetingSummary(meetingId: string): Promise<MeetingSummary | null> {
    const client = requireSupabase();
    const { data: summary, error } = await client
      .from('summaries')
      .select('*')
      .eq('meeting_id', meetingId)
      .maybeSingle();
    if (error) throw error;
    if (!summary) return null;

    const actionItems = await supabaseActionItemService.listByMeeting(meetingId);

    return {
      meetingId,
      executiveSummary: summary.executive_summary,
      sentiment: {
        score: summary.sentiment_score ?? 0,
        label: summary.sentiment_label ?? 'Neutral',
        description: summary.sentiment_description ?? '',
      },
      keyPoints: (summary.key_points as string[]) ?? [],
      actionItems: actionItems.map(
        (a): ActionItem => ({
          id: a.id,
          title: a.title,
          assignee: a.assignee ?? undefined,
          dueDate: a.due_date ?? undefined,
          completed: a.completed,
        }),
      ),
      nextSteps: (summary.follow_ups as string[]) ?? [],
    };
  },
};
