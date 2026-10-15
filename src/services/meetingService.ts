import { isSupabaseConfigured } from '@/config/env';
import { mockMeetingSummary, mockMeetings } from '@/constants/mockData';
import { supabaseMeetingService } from '@/services/supabase/meeting.service';
import { supabaseSummaryService } from '@/services/supabase/summary.service';
import { requireSupabase } from '@/lib/supabase';
import type { Meeting, MeetingSummary } from '@/types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const meetingService = {
  async getMeetings(userId?: string, params?: { page?: number; search?: string }) {
    if (isSupabaseConfigured && userId) {
      return supabaseMeetingService.list(userId, {
        page: params?.page ?? 0,
        search: params?.search,
        sort: 'newest',
      });
    }
    await delay(300);
    return mockMeetings;
  },

  async getMeetingSummary(meetingId: string): Promise<MeetingSummary> {
    if (isSupabaseConfigured) {
      const summary = await supabaseSummaryService.getMeetingSummary(meetingId);
      if (summary) return summary;
    }
    await delay(400);
    return { ...mockMeetingSummary, meetingId };
  },

  async createMeeting(userId: string, title?: string): Promise<Meeting> {
    if (isSupabaseConfigured) {
      return supabaseMeetingService.create(userId, title);
    }
    return {
      id: `mock-${Date.now()}`,
      title: title ?? 'New Meeting',
      duration: 0,
      date: new Date().toISOString(),
      participants: [],
      status: 'recording',
    };
  },

  async getUserId(): Promise<string | null> {
    if (!isSupabaseConfigured) return 'demo-user';
    const client = requireSupabase();
    const { data } = await client.auth.getUser();
    return data.user?.id ?? null;
  },
};
