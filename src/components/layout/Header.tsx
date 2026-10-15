import { Pressable, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { colors, layout, typography } from '@/theme';

type Props = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
};

export function Header({ title, subtitle, showBack, onBack, rightAction }: Props) {
  return (
    <View className="mb-6 flex-row items-center justify-between">
      <View className="min-w-0 flex-1 flex-row items-center">
        {showBack && onBack && (
          <Pressable
            onPress={onBack}
            className="mr-3 h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-card"
            hitSlop={8}
          >
            <ChevronLeft size={layout.iconSize} color={colors.text} />
          </Pressable>
        )}
        <View className="min-w-0 flex-1">
          {title && (
            <Text
              style={typography.screenTitle}
              className="text-text"
              numberOfLines={2}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              style={typography.bodySmall}
              className="mt-1 text-text-secondary"
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightAction ? <View className="ml-3 shrink-0">{rightAction}</View> : null}
    </View>
  );
}
