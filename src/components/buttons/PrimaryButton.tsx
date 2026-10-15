import { ActivityIndicator, Text } from 'react-native';
import { AnimatedPressable } from '@/components/common/AnimatedPressable';
import { colors, layout, shadows } from '@/theme';

type Props = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
};

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  fullWidth = true,
  className = '',
}: Props) {
  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`items-center justify-center bg-primary ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50' : ''} ${className}`}
      style={[
        shadows.soft,
        {
          height: layout.buttonHeight,
          borderRadius: layout.buttonBorderRadius,
          marginTop: layout.buttonMarginVertical,
          marginBottom: layout.buttonMarginVertical,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text className="text-base font-semibold text-white">{label}</Text>
      )}
    </AnimatedPressable>
  );
}
