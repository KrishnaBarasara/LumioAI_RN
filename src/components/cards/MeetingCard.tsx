import { Pressable, Text, View } from 'react-native';
import { Calendar, Clock, Users } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { formatDate, formatDuration } from '@/utils/format';
import type { Meeting } from '@/types';
import { colors, layout, shadows, typography } from '@/theme';

type Props = {
  meeting: Meeting;
  onPress?: () => void;
  index?: number;
};

export function MeetingCard({ meeting, onPress, index = 0 }: Props) {
  const sentimentColor =
    meeting.sentiment === 'positive'
      ? colors.success
      : meeting.sentiment === 'negative'
        ? colors.error
        : colors.textSecondary;

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
      <Pressable
        onPress={onPress}
        className="border border-border bg-card"
        style={[
          shadows.card,
          {
            padding: layout.cardPadding,
            marginBottom: layout.cardMarginBottom,
            borderRadius: layout.cardBorderRadius,
          },
        ]}
      >
        <View className="mb-2 flex-row items-start justify-between gap-2">
          <Text
            style={typography.label}
            className="min-w-0 flex-1 text-text"
            numberOfLines={2}
          >
            {meeting.title}
          </Text>
          {meeting.sentiment && (
            <View
              className="shrink-0 rounded-full px-2 py-0.5"
              style={{ backgroundColor: `${sentimentColor}20` }}
            >
              <Text className="text-xs font-medium capitalize" style={{ color: sentimentColor }}>
                {meeting.sentiment}
              </Text>
            </View>
          )}
        </View>
        {meeting.summary && (
          <Text
            style={typography.bodySmall}
            className="mb-3 text-text-secondary"
            numberOfLines={2}
          >
            {meeting.summary}
          </Text>
        )}
        <View className="flex-row flex-wrap items-center gap-x-4 gap-y-1">
          <View className="flex-row items-center gap-1">
            <Calendar size={14} color={colors.textSecondary} />
            <Text style={typography.caption} className="text-text-secondary">
              {formatDate(meeting.date)}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Clock size={14} color={colors.textSecondary} />
            <Text style={typography.caption} className="text-text-secondary">
              {formatDuration(meeting.duration)}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Users size={14} color={colors.textSecondary} />
            <Text style={typography.caption} className="text-text-secondary">
              {meeting.participants.length}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
