import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Bookmark,
  Mic,
  Pause,
  Settings,
  Square,
  StickyNote,
  Users,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { GradientButton } from '@/components/buttons/GradientButton';
import { RecordingWave } from '@/components/common/RecordingWave';
import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppModal } from '@/components/modals/AppModal';
import { ROUTES } from '@/constants/routes';
import { useMeetingRecording } from '@/hooks/useMeetingRecording';
import { formatDuration } from '@/utils/format';
import { colors, layout, typography } from '@/theme';

export function MeetingRecordingScreen() {
  const navigation = useNavigation();
  const [bookmarked, setBookmarked] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [started, setStarted] = useState(false);

  const {
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
  } = useMeetingRecording();

  const activeWave = isRecording && !isPaused;

  const togglePause = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!started) {
      try {
        await start();
        setStarted(true);
      } catch (e) {
        Alert.alert('Recording error', String(e));
      }
      return;
    }
    if (isPaused) resume();
    else pause();
  };

  const stopRecording = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      if (meetingId) {
        (navigation as { navigate: (name: string, params?: object) => void }).navigate(
          ROUTES.MEETING_PROCESSING,
          { meetingId },
        );
      }
      const finalizedMeetingId = await stopAndProcess();
      (navigation as { navigate: (name: string, params?: object) => void }).navigate(
        ROUTES.MEETING_SUMMARY,
        { meetingId: finalizedMeetingId },
      );
    } catch (e) {
      Alert.alert('Processing failed', String(e));
    }
  };

  const statusLabel = isProcessing
    ? pipelineStage === 'uploading'
      ? 'Uploading audio…'
      : pipelineStage === 'transcribing'
        ? 'Transcribing…'
        : pipelineStage === 'summarizing'
          ? 'Generating AI summary…'
          : 'Processing…'
    : activeWave
      ? 'Live transcription active'
      : isPaused
        ? 'Paused'
        : started
          ? 'Ready'
          : 'Tap mic to start recording';

  return (
    <ScreenContainer scroll={false} tabBarOffset>
      <Header
        title="Recording"
        showBack={navigation.canGoBack()}
        onBack={() => navigation.goBack()}
      />

      <View className="flex-1 justify-center">
        <View className="mb-8 items-center">
          <RecordingWave active={activeWave} />
          <Text style={typography.largeHeading} className="mt-4 text-text">
            {formatDuration(seconds)}
          </Text>
          <Text style={typography.bodySmall} className="mt-2 text-text-secondary">
            {statusLabel}
          </Text>
        </View>

        <BlurView
          intensity={40}
          tint="light"
          className="mb-8 w-full overflow-hidden"
          style={{ borderRadius: layout.cardBorderRadius, padding: layout.cardPadding }}
        >
          <View className="flex-row items-center gap-2">
            <Users size={layout.iconSize} color={colors.primary} />
            <Text style={typography.label} className="text-text">
              Participants
            </Text>
          </View>
          <Text style={typography.bodySmall} className="mt-2 text-text-secondary">
            Alex, Sarah, James
          </Text>
        </BlurView>

        <View className="mb-8 w-full flex-row justify-around">
          {[
            {
              icon: Bookmark,
              label: 'Bookmark',
              active: bookmarked,
              onPress: () => {
                setBookmarked(!bookmarked);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              },
            },
            { icon: StickyNote, label: 'Add Note', onPress: () => {} },
            { icon: Settings, label: 'Settings', onPress: () => setSettingsOpen(true) },
          ].map(({ icon: Icon, label, active, onPress }) => (
            <Pressable key={label} onPress={onPress} className="min-w-[72px] items-center">
              <Icon
                size={layout.iconSize}
                color={active ? colors.primary : colors.textSecondary}
                fill={active ? colors.primary : 'transparent'}
              />
              <Text style={typography.caption} className="mt-1 text-text-secondary">
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="flex-row items-center gap-4" style={{ marginBottom: 8 }}>
        <Pressable
          onPress={togglePause}
          disabled={isProcessing}
          className="h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-card"
        >
          {activeWave ? (
            <Pause size={28} color={colors.primary} />
          ) : (
            <Mic size={28} color={colors.primary} />
          )}
        </Pressable>
        <View className="min-w-0 flex-1">
          <GradientButton
            label="Stop & Summarize"
            onPress={stopRecording}
            loading={isProcessing}
            disabled={!started}
            icon={<Square size={18} color="#fff" fill="#fff" />}
          />
        </View>
      </View>

      <AppModal visible={settingsOpen} onClose={() => setSettingsOpen(false)} title="Recording Settings">
        <Text style={typography.bodySmall} className="text-text-secondary">
          • Auto-transcribe: On
        </Text>
        <Text style={typography.bodySmall} className="mt-2 text-text-secondary">
          • Speaker detection: On
        </Text>
        <Text style={typography.bodySmall} className="mt-2 text-text-secondary">
          • Language: English
        </Text>
      </AppModal>
    </ScreenContainer>
  );
}
