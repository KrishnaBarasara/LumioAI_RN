import { Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { layout, typography } from '@/theme';

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: Props) {
  return (
    <View className="items-center justify-center py-12">
      <View
        className="mb-4 items-center justify-center rounded-2xl bg-primary/10"
        style={{ height: 64, width: 64 }}
      >
        <Icon size={32} color="#6D28FF" />
      </View>
      <Text style={typography.sectionTitle} className="mb-2 text-center text-text">
        {title}
      </Text>
      {description && (
        <Text
          style={typography.bodySmall}
          className="mb-6 px-4 text-center text-text-secondary"
        >
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <View style={{ width: '100%', maxWidth: 280 }}>
          <PrimaryButton label={actionLabel} onPress={onAction} />
        </View>
      )}
    </View>
  );
}
