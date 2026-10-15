import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { APP_NAME } from '@/constants';
import { colors, typography } from '@/theme';

type Props = {
  onFinish: () => void;
};

export function SplashScreen({ onFinish }: Props) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const glow = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    scale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200 }),
        withTiming(0.5, { duration: 1200 }),
      ),
      -1,
      true,
    );

    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish, opacity, scale, glow]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{ scale: 1 + glow.value * 0.2 }],
  }));

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center">
        <Animated.View
          style={[
            glowStyle,
            {
              position: 'absolute',
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: colors.primary,
            },
          ]}
        />
        <Animated.View style={logoStyle} className="items-center px-6">
          <LinearGradient
            colors={[colors.primary, colors.secondaryLight]}
            className="mb-6 h-24 w-24 items-center justify-center rounded-3xl"
          >
            <Text style={typography.largeHeading} className="text-white">
              L
            </Text>
          </LinearGradient>
          <Text style={typography.largeHeading} className="text-center text-text">
            {APP_NAME}
          </Text>
          <Text style={typography.body} className="mt-2 text-center text-text-secondary">
            AI Productivity Workspace
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
