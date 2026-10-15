import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/theme';

const BAR_COUNT = 24;

function WaveBar({ index, active }: { index: number; active: boolean }) {
  const height = useSharedValue(8);

  useEffect(() => {
    if (active) {
      height.value = withRepeat(
        withSequence(
          withTiming(12 + Math.random() * 40, { duration: 300 + index * 20 }),
          withTiming(8 + Math.random() * 16, { duration: 300 + index * 20 }),
        ),
        -1,
        true,
      );
    } else {
      height.value = withTiming(8);
    }
  }, [active, index, height]);

  const style = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          width: 4,
          borderRadius: 2,
          backgroundColor: colors.primary,
          marginHorizontal: 2,
        },
      ]}
    />
  );
}

type Props = {
  active?: boolean;
};

export function RecordingWave({ active = true }: Props) {
  return (
    <View className="h-20 flex-row items-center justify-center">
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <WaveBar key={i} index={i} active={active} />
      ))}
    </View>
  );
}
