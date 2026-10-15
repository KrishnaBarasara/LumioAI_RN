import { Text, View } from 'react-native';
import { BarChart3, CalendarDays, Clock3, FileText } from 'lucide-react-native';
import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useMeetingsList } from '@/hooks';
import { colors, layout, shadows, typography } from '@/theme';
import { formatDuration } from '@/utils/format';

function startOfDay(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function AnalyticsScreen() {
  const { data: meetings = [] } = useMeetingsList();

  const totalMeetings = meetings.length;
  const totalDuration = meetings.reduce((sum, m) => sum + m.duration, 0);
  const totalSummaries = meetings.filter((m) => !!m.summary).length;

  const dayMap = meetings.reduce<Record<string, number>>((acc, m) => {
    const key = startOfDay(m.date);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const mostActiveDayCount = Object.values(dayMap).sort((a, b) => b - a)[0] ?? 0;

  return (
    <ScreenContainer>
      <Header title="Analytics" subtitle="Meeting activity overview" />

      <View className="mb-5 flex-row flex-wrap" style={{ gap: 12 }}>
        {[
          { label: 'Total Meetings', value: totalMeetings, icon: CalendarDays },
          { label: 'Recording Time', value: formatDuration(totalDuration), icon: Clock3 },
          { label: 'Summaries', value: totalSummaries, icon: FileText },
          { label: 'Most Active Day', value: `${mostActiveDayCount} meetings`, icon: BarChart3 },
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
            <stat.icon size={layout.iconSize} color={colors.primary} />
            <Text style={typography.sectionTitle} className="mt-2 text-text">
              {stat.value}
            </Text>
            <Text style={typography.caption} className="mt-1 text-text-secondary">
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      <View
        className="border border-border bg-card"
        style={[shadows.card, { padding: layout.cardPadding, borderRadius: layout.cardBorderRadius }]}
      >
        <Text style={typography.sectionTitle} className="mb-3 text-text">
          Monthly Activity
        </Text>
        {meetings.slice(0, 6).map((meeting) => (
          <View key={meeting.id} className="mb-2 flex-row items-center justify-between">
            <Text style={typography.bodySmall} className="text-text-secondary" numberOfLines={1}>
              {meeting.title}
            </Text>
            <Text style={typography.caption} className="text-primary">
              {formatDuration(meeting.duration)}
            </Text>
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}
