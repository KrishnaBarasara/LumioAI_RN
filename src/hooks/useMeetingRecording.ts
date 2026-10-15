import { useCallback, useEffect, useRef, useState } from 'react';
import { useAudioRecorder, RecordingPresets, ensureRecordingReady } from '@/services/recording/recording.service';
import { meetingService } from '@/services/meetingService';
import { meetingPipelineService, type PipelineProgress } from '@/services/pipeline/meetingPipeline.service';
import { useAuthStore } from '@/store';

export function useMeetingRecording() {
  const userId = useAuthStore((s) => s.user?.id);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineStage, setPipelineStage] = useState<PipelineProgress | null>(null);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isRecording = recorder.isRecording;

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  const start = useCallback(async () => {
    await ensureRecordingReady();
    if (!userId) throw new Error('Not authenticated');
    const meeting = await meetingService.createMeeting(userId, 'Meeting Recording');
    setMeetingId(meeting.id);
    setSeconds(0);
    setIsPaused(false);
    await recorder.prepareToRecordAsync();
    recorder.record();
  }, [recorder, userId]);

  const pause = useCallback(() => {
    recorder.pause();
    setIsPaused(true);
  }, [recorder]);

  const resume = useCallback(() => {
    recorder.record();
    setIsPaused(false);
  }, [recorder]);

  const stopAndProcess = useCallback(async () => {
    if (!userId || !meetingId) throw new Error('Recording not started');
    setIsProcessing(true);
    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (!uri) throw new Error('No recording file');

      const id = await meetingPipelineService.processRecording({
        userId,
        meetingId,
        localAudioUri: uri,
        durationSeconds: seconds,
        onProgress: setPipelineStage,
      });
      return id;
    } finally {
      setIsProcessing(false);
      setPipelineStage(null);
    }
  }, [recorder, userId, meetingId, seconds]);

  return {
    seconds,
    isRecording,
    isPaused,
    isProcessing,
    pipelineStage,
    meetingId,
    start,
    pause,
    resume,
    stopAndProcess,
  };
}
