import { isGeminiConfigured, isSupabaseConfigured, isTranscriptionConfigured } from '@/config/env';
import { geminiService } from '@/services/ai/gemini.service';
import { transcriptionService } from '@/services/ai/transcription.service';
import { supabaseMeetingService } from '@/services/supabase/meeting.service';
import { supabaseStorageService } from '@/services/supabase/storage.service';
import { supabaseSummaryService } from '@/services/supabase/summary.service';
import { supabaseTranscriptService } from '@/services/supabase/transcript.service';
import { analyticsService } from '@/services/analytics/analytics.service';
import { notificationService } from '@/services/notifications/notification.service';

export type PipelineProgress =
  | 'uploading'
  | 'transcribing'
  | 'summarizing'
  | 'completed'
  | 'failed';

export const meetingPipelineService = {
  async processRecording(params: {
    userId: string;
    meetingId: string;
    localAudioUri: string;
    durationSeconds: number;
    onProgress?: (stage: PipelineProgress) => void;
  }) {
    const { onProgress } = params;
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured');
    }

    try {
      onProgress?.('uploading');
      await supabaseMeetingService.update(params.meetingId, {
        status: 'uploading',
        duration_seconds: params.durationSeconds,
      });

      const { path, publicUrl } = await supabaseStorageService.uploadMeetingAudio(
        params.userId,
        params.meetingId,
        params.localAudioUri,
      );

      await supabaseMeetingService.update(params.meetingId, {
        audio_url: publicUrl,
        audio_path: path,
        status: 'transcribing',
      });

      onProgress?.('transcribing');
      let transcriptText = '';

      if (isTranscriptionConfigured) {
        const { text, segments } = await transcriptionService.transcribe(params.localAudioUri);
        transcriptText = text;
        await supabaseTranscriptService.save(
          params.meetingId,
          params.userId,
          text,
          segments,
          transcriptionService.isConfigured ? 'configured' : 'mock',
        );
      } else {
        transcriptText =
          'Transcription service not configured. Add OPENAI or DEEPGRAM API key to enable speech-to-text.';
        await supabaseTranscriptService.save(
          params.meetingId,
          params.userId,
          transcriptText,
          [],
          'placeholder',
        );
      }

      onProgress?.('summarizing');
      await supabaseMeetingService.update(params.meetingId, { status: 'summarizing' });

      if (isGeminiConfigured && transcriptText.length > 20) {
        const ai = await geminiService.generateMeetingSummary(transcriptText);
        await supabaseSummaryService.save(params.meetingId, params.userId, {
          executive_summary: ai.summary,
          key_points: ai.keyPoints,
          decisions: ai.decisions,
          risks: ai.risks,
          follow_ups: ai.followUps,
          sentiment_score: ai.sentiment.score,
          sentiment_label: ai.sentiment.label,
          sentiment_description: ai.sentiment.description,
          actionItems: ai.actionItems.map((a) => ({
            title: a.title,
            assignee: a.assignee,
            dueDate: a.dueDate,
            priority: a.priority,
          })),
          raw_json: ai as unknown as Record<string, unknown>,
        });
      } else {
        await supabaseSummaryService.save(params.meetingId, params.userId, {
          executive_summary: transcriptText.slice(0, 500) || 'Summary pending AI configuration.',
          key_points: [],
          decisions: [],
          risks: [],
          follow_ups: [],
          sentiment_score: 50,
          sentiment_label: 'Neutral',
          sentiment_description: 'Configure Gemini API for full analysis.',
          actionItems: [],
          raw_json: {},
        });
        await supabaseMeetingService.update(params.meetingId, { status: 'completed' });
      }

      onProgress?.('completed');
      analyticsService.track('meeting_processed', { meetingId: params.meetingId });
      await notificationService.notifySummaryReady(params.meetingId);

      return params.meetingId;
    } catch (error) {
      await supabaseMeetingService.update(params.meetingId, { status: 'failed' });
      onProgress?.('failed');
      throw error;
    }
  },
};
