import { Alert, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Trash2 } from 'lucide-react-native';
import { GradientButton } from '@/components/buttons/GradientButton';
import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ROUTES } from '@/constants/routes';
import { useMeetingSummary } from '@/hooks';
import type { MeetingsStackParamList } from '@/navigation/types';
import { layout, typography } from '@/theme';

export function MeetingDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MeetingsStackParamList, typeof ROUTES.MEETING_DETAILS>>();
  const { data: summary } = useMeetingSummary(route.params.meetingId);

  const deleteMeeting = async () => {
    try {
      const { supabaseMeetingService } = await import('@/services/supabase/meeting.service');
      await supabaseMeetingService.remove(route.params.meetingId);
      navigation.goBack();
    } catch {
      Alert.alert('Delete', 'Unable to delete this meeting right now.');
    }
  };

  return (
    <ScreenContainer>
      <Header title="Meeting Details" showBack onBack={() => navigation.goBack()} />

      <View className="mb-4 border border-border bg-card" style={{ borderRadius: layout.cardBorderRadius, padding: layout.cardPadding }}>
        <Text style={typography.sectionTitle} className="text-text">
          Summary
        </Text>
        <Text style={typography.bodySmall} className="mt-2 text-text-secondary">
          {summary?.executiveSummary ?? 'Summary will appear once processing is complete.'}
        </Text>
      </View>

      <View className="mb-4 border border-border bg-card" style={{ borderRadius: layout.cardBorderRadius, padding: layout.cardPadding }}>
        <Text style={typography.sectionTitle} className="text-text">
          Metadata
        </Text>
        <Text style={typography.bodySmall} className="mt-2 text-text-secondary">
          Meeting ID: {route.params.meetingId}
        </Text>
      </View>

      <GradientButton
        label="Open Summary"
        onPress={() =>
          (navigation as { navigate: (name: string, params?: object) => void }).navigate(
            ROUTES.MEETING_SUMMARY,
            { meetingId: route.params.meetingId },
          )
        }
      />
      <GradientButton
        label="Delete Meeting"
        onPress={deleteMeeting}
        icon={<Trash2 size={18} color="#fff" />}
      />
    </ScreenContainer>
  );
}
