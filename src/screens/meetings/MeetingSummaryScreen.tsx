import { Alert, Text, View } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Brain, Share2, Target, TrendingUp } from 'lucide-react-native';
import { SummaryCard } from '@/components/cards/SummaryCard';
import { TaskCard } from '@/components/cards/TaskCard';
import { Loader } from '@/components/common/Loader';
import { GradientButton } from '@/components/buttons/GradientButton';
import { Header } from '@/components/layout/Header';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ROUTES } from '@/constants/routes';
import { useMeetingSummary } from '@/hooks';
import type { MeetingsStackParamList } from '@/navigation/types';
import { colors, layout, typography } from '@/theme';

export function MeetingSummaryScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MeetingsStackParamList, typeof ROUTES.MEETING_SUMMARY>>();
  const { data: summary, isLoading } = useMeetingSummary(route.params.meetingId);

  if (isLoading || !summary) {
    return <Loader fullScreen />;
  }

  return (
    <ScreenContainer extraBottomPadding={16}>
      <Header
        title="Meeting Summary"
        subtitle="AI-generated insights"
        showBack
        onBack={() => navigation.goBack()}
      />

      <SummaryCard
        title="Executive Summary"
        content={summary.executiveSummary}
        icon={<Brain size={layout.iconSize} color={colors.primary} />}
        delay={0}
      />

      <View
        className="border border-border bg-card"
        style={{
          padding: layout.cardPadding,
          marginBottom: layout.cardMarginBottom,
          borderRadius: layout.cardBorderRadius,
        }}
      >
        <View className="mb-3 flex-row items-center gap-2">
          <TrendingUp size={layout.iconSize} color={colors.primary} />
          <Text style={typography.sectionTitle} className="text-text">
            Sentiment Analysis
          </Text>
        </View>
        <View className="mb-2 flex-row items-end gap-2">
          <Text style={typography.largeHeading} className="text-primary">
            {summary.sentiment.score}%
          </Text>
          <Text style={typography.label} className="mb-1 text-success">
            {summary.sentiment.label}
          </Text>
        </View>
        <View className="h-2 overflow-hidden rounded-full bg-border">
          <View
            className="h-full rounded-full bg-primary"
            style={{ width: `${summary.sentiment.score}%` }}
          />
        </View>
        <Text style={typography.bodySmall} className="mt-2 text-text-secondary">
          {summary.sentiment.description}
        </Text>
      </View>

      <View
        className="border border-border bg-card"
        style={{
          padding: layout.cardPadding,
          marginBottom: layout.cardMarginBottom,
          borderRadius: layout.cardBorderRadius,
        }}
      >
        <View className="mb-3 flex-row items-center gap-2">
          <Target size={layout.iconSize} color={colors.primary} />
          <Text style={typography.sectionTitle} className="text-text">
            Key Points
          </Text>
        </View>
        {summary.keyPoints.map((point, i) => (
          <View key={i} className="mb-2 flex-row gap-2">
            <Text className="text-primary">•</Text>
            <Text style={typography.bodySmall} className="min-w-0 flex-1 text-text-secondary">
              {point}
            </Text>
          </View>
        ))}
      </View>

      <SectionHeader title="Action Items" />
      {summary.actionItems.map((item) => (
        <TaskCard key={item.id} task={item} />
      ))}

      <View
        className="mt-2 border border-border bg-card"
        style={{
          padding: layout.cardPadding,
          marginBottom: layout.cardMarginBottom,
          borderRadius: layout.cardBorderRadius,
        }}
      >
        <Text style={typography.sectionTitle} className="mb-3 text-text">
          Suggested Next Steps
        </Text>
        {summary.nextSteps.map((step, i) => (
          <Text key={i} style={typography.bodySmall} className="mb-2 text-text-secondary">
            {i + 1}. {step}
          </Text>
        ))}
      </View>

      <GradientButton
        label="Share Summary"
        onPress={async () => {
          const { exportService } = await import('@/services/export/export.service');
          await exportService.shareAsMarkdown(summary);
        }}
        icon={<Share2 size={18} color="#fff" />}
      />
      <GradientButton
        label="Export TXT"
        onPress={async () => {
          const { exportService } = await import('@/services/export/export.service');
          await exportService.shareAsText(summary);
        }}
      />
      <GradientButton
        label="Save"
        onPress={() => Alert.alert('Saved', 'Summary is stored in your meeting history.')}
      />
    </ScreenContainer>
  );
}
