import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import { AudioLines } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GradientButton } from '@/components/buttons/GradientButton';
import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ROUTES } from '@/constants/routes';
import { meetingService } from '@/services/meetingService';
import { meetingPipelineService } from '@/services/pipeline/meetingPipeline.service';
import { useAuthStore } from '@/store';
import type { MeetingsStackParamList } from '@/navigation/types';
import { colors, layout, shadows, typography } from '@/theme';

export function UploadAudioScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MeetingsStackParamList>>();
  const userId = useAuthStore((s) => s.user?.id);
  const [processing, setProcessing] = useState(false);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const pickAndUpload = async () => {
    if (!userId) return;
    const result = await DocumentPicker.getDocumentAsync({
      type: ['audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/mp4', 'audio/*'],
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets[0]) return;

    const file = result.assets[0];
    setSelectedName(file.name ?? 'audio-file');
    setProcessing(true);
    try {
      const meeting = await meetingService.createMeeting(userId, file.name ?? 'Uploaded Audio');
      navigation.navigate(ROUTES.MEETING_PROCESSING, { meetingId: meeting.id });
      await meetingPipelineService.processRecording({
        userId,
        meetingId: meeting.id,
        localAudioUri: file.uri,
        durationSeconds: 0,
      });
      navigation.replace(ROUTES.MEETING_SUMMARY, { meetingId: meeting.id });
    } catch (e) {
      Alert.alert('Upload failed', String(e));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ScreenContainer>
      <Header title="Upload Audio" subtitle="MP3, WAV, M4A" showBack onBack={() => navigation.goBack()} />

      <View
        className="mb-4 items-center border border-border bg-card"
        style={[shadows.card, { borderRadius: layout.cardBorderRadius, padding: layout.cardPadding + 8 }]}
      >
        <AudioLines size={40} color={colors.primary} />
        <Text style={typography.sectionTitle} className="mt-3 text-text">
          Process Existing Recording
        </Text>
        <Text style={typography.bodySmall} className="mt-1 text-text-secondary">
          Select a supported audio file to transcribe and summarize.
        </Text>
        {!!selectedName && (
          <Text style={typography.caption} className="mt-3 text-primary">
            Selected: {selectedName}
          </Text>
        )}
      </View>

      <GradientButton
        label="Select Audio File"
        onPress={pickAndUpload}
        loading={processing}
      />
    </ScreenContainer>
  );
}
