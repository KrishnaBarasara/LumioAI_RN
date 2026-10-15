import { ActivityIndicator, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { AnimatedPressable } from '@/components/common/AnimatedPressable';
import { colors, layout, shadows } from '@/theme';

type Props = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  /** When true, button is non-interactive but not visually disabled */
  icon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
};

export function GradientButton({
  label,
  onPress,
  disabled,
  loading,
  icon,
  fullWidth = true,
  className = '',
}: Props) {
  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      disabled={disabled || loading}
      className={`overflow-hidden ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50' : ''} ${className}`}
      style={[
        shadows.elevated,
        {
          height: layout.buttonHeight,
          borderRadius: layout.buttonBorderRadius,
          marginTop: layout.buttonMarginVertical,
          marginBottom: layout.buttonMarginVertical,
        },
      ]}
    >
      <LinearGradient
        colors={[colors.primary, colors.secondary, colors.secondaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          paddingHorizontal: 24,
        }}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <>
            {icon}
            <Text className="text-base font-semibold text-white">{label}</Text>
          </>
        )}
      </LinearGradient>
    </AnimatedPressable>
  );
}
