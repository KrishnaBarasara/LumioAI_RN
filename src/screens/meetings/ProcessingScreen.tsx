import { Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { CheckCircle2, LoaderCircle } from 'lucide-react-native';
import type { RouteProp } from '@react-navigation/native';
import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ROUTES } from '@/constants/routes';
import type { MeetingsStackParamList } from '@/navigation/types';
import { colors, layout, typography } from '@/theme';

const STEPS = [
  'Uploading',
  'Transcribing',
  'Generating Summary',
  'Extracting Action Items',
];

export function ProcessingScreen() {
  const route = useRoute<RouteProp<MeetingsStackParamList, typeof ROUTES.MEETING_PROCESSING>>();

  return (
    <ScreenContainer>
      <Header title="Processing" subtitle={`Meeting ${route.params.meetingId.slice(0, 8)}`} />

      <View
        className="border border-border bg-card"
        style={{ borderRadius: layout.cardBorderRadius, padding: layout.cardPadding }}
      >
        {STEPS.map((step, index) => (
          <View key={step} className="mb-3 flex-row items-center gap-3">
            {index === 0 ? (
              <LoaderCircle size={18} color={colors.primary} />
            ) : (
              <CheckCircle2 size={18} color={`${colors.textSecondary}`} />
            )}
            <Text style={typography.body} className={index === 0 ? 'text-text' : 'text-text-secondary'}>
              {step}
            </Text>
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}
