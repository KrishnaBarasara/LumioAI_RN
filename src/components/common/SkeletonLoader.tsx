import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { layout } from '@/theme';

type Props = {
  width?: number | string;
  height?: number;
};

export function SkeletonLoader({ width = '100%', height = 16 }: Props) {
  const opacity = useSharedValue(0.4);

  opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[{ width: width as number, height, borderRadius: 12 }, style]}
      className="bg-border"
    />
  );
}

export function CardSkeleton() {
  return (
    <View
      className="border border-border bg-card"
      style={{
        padding: layout.cardPadding,
        marginBottom: layout.cardMarginBottom,
        borderRadius: layout.cardBorderRadius,
      }}
    >
      <SkeletonLoader height={20} width="70%" />
      <View style={{ height: 12 }} />
      <SkeletonLoader height={14} />
      <View style={{ height: 8 }} />
      <SkeletonLoader height={14} width="50%" />
    </View>
  );
}
