import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { layout, shadows, typography } from '@/theme';

type Props = {
  title: string;
  content: string;
  icon?: React.ReactNode;
  delay?: number;
};

export function SummaryCard({ title, content, icon, delay = 0 }: Props) {
  return (
    <Animated.View
      entering={FadeIn.delay(delay).duration(400)}
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
      <View className="mb-3 flex-row items-center gap-2">
        {icon}
        <Text style={typography.sectionTitle} className="flex-1 text-text" numberOfLines={1}>
          {title}
        </Text>
      </View>
      <Text style={typography.bodySmall} className="text-text-secondary">
        {content}
      </Text>
    </Animated.View>
  );
}
