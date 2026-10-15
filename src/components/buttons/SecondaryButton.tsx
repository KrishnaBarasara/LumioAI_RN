import { ActivityIndicator, Text } from 'react-native';
import { AnimatedPressable } from '@/components/common/AnimatedPressable';
import { colors, layout } from '@/theme';

type Props = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
};

export function SecondaryButton({
  label,
  onPress,
  disabled,
  loading,
  fullWidth = true,
}: Props) {
  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`items-center justify-center border border-border bg-card ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50' : ''}`}
      style={{
        height: layout.buttonHeight,
        borderRadius: layout.buttonBorderRadius,
        marginTop: layout.buttonMarginVertical,
        marginBottom: layout.buttonMarginVertical,
      }}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <Text className="text-base font-semibold text-primary">{label}</Text>
      )}
    </AnimatedPressable>
  );
}
