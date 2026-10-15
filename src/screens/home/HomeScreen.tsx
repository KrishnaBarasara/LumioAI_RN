import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowUpFromLine,
  Mic,
  Play,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MeetingCard } from '@/components/cards/MeetingCard';
import { CardSkeleton } from '@/components/common/SkeletonLoader';
import { GradientButton } from '@/components/buttons/GradientButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Header } from '@/components/layout/Header';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ROUTES } from '@/constants/routes';
import { useMeetingsList } from '@/hooks';
import { useAuthStore } from '@/store';
import { colors, layout, shadows, typography } from '@/theme';
import type { MainTabScreenProps } from '@/navigation/types';

const quickActions = [
  { label: 'Record Meeting', icon: Mic, route: ROUTES.MEETING_RECORDING },
  { label: 'Upload Audio', icon: ArrowUpFromLine, route: ROUTES.MEETING_UPLOAD },
];

export function HomeScreen() {
  const { user } = useAuthStore();
  const { data: meetings, isLoading } = useMeetingsList();
  const navigation = useNavigation<MainTabScreenProps<typeof ROUTES.HOME>['navigation']>();
  const totalMeetings = meetings?.length ?? 0;
  const totalSummaries = meetings?.filter((m) => !!m.summary).length ?? 0;
  const pendingItems = meetings?.filter((m) => m.status !== 'completed').length ?? 0;

  return (
    <ScreenContainer>
      <Header title={`Hi, ${user?.name ?? 'there'} 👋`} subtitle="Meeting Notes Assistant" />

      <SectionHeader title="Overview" />
      <View className="mb-7 flex-row flex-wrap" style={{ gap: 12 }}>
        {[
          { label: 'Total Meetings', value: totalMeetings },
          { label: 'Total Summaries', value: totalSummaries },
          { label: 'Action Items Pending', value: pendingItems },
        ].map((stat) => (
          <View
            key={stat.label}
            className="border border-border bg-card"
            style={[
              shadows.card,
              {
                width: '47%',
                padding: layout.cardPadding,
                borderRadius: layout.cardBorderRadius,
              },
            ]}
          >
            <Text style={typography.screenTitle} className="text-primary">
              {stat.value}
            </Text>
            <Text style={typography.caption} className="mt-1 text-text-secondary" numberOfLines={2}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      <SectionHeader title="Quick Actions" />
      <View className="mb-7 flex-row" style={{ gap: 12 }}>
        {quickActions.map((action) => (
          <Pressable
            key={action.label}
            onPress={() =>
              navigation.navigate('MeetingsTab', {
                screen: action.route,
              })
            }
            className="min-w-0 flex-1 flex-row items-center gap-3 border border-border bg-card"
            style={[
              shadows.card,
              {
                padding: layout.cardPadding,
                borderRadius: layout.cardBorderRadius,
              },
            ]}
          >
            <View className="h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <action.icon size={layout.iconSize} color={colors.primary} />
            </View>
            <Text style={typography.label} className="flex-1 text-text" numberOfLines={1}>
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <SectionHeader
        title="Recent meetings"
        rightAction={
          <Pressable
            onPress={() => navigation.navigate('MeetingsTab', { screen: 'MeetingsList' })}
            hitSlop={8}
          >
            <Text style={typography.label} className="text-primary">
              See all
            </Text>
          </Pressable>
        }
      />
      {isLoading
        ? [1, 2].map((i) => <CardSkeleton key={i} />)
        : meetings?.slice(0, 5).map((m, i) => (
            <MeetingCard
              key={m.id}
              meeting={m}
              index={i}
              onPress={() =>
                navigation.navigate('MeetingsTab', {
                  screen: ROUTES.MEETING_SUMMARY,
                  params: { meetingId: m.id },
                })
              }
            />
          ))}
      <View className="mt-2">
        <GradientButton
          label="Start Recording"
          icon={<Play size={18} color="#fff" />}
          onPress={() => navigation.navigate(ROUTES.RECORD)}
        />
      </View>
    </ScreenContainer>
  );
}
