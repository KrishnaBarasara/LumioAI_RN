import { Pressable, PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

type Props = PressableProps & {
  scale?: number;
};

export function AnimatedPressable({ scale = 0.96, children, style, ...props }: Props) {
  const pressed = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressed.value }],
  }));

  return (
    <AnimatedPressableBase
      style={[animatedStyle, style]}
      onPressIn={() => {
        pressed.value = withSpring(scale, { damping: 15 });
      }}
      onPressOut={() => {
        pressed.value = withSpring(1, { damping: 15 });
      }}
      {...props}
    >
      {children}
    </AnimatedPressableBase>
  );
}
