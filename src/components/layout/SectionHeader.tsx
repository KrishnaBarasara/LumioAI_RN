import { Text, View } from 'react-native';
import { typography } from '@/theme';

type Props = {
  title: string;
  rightAction?: React.ReactNode;
  className?: string;
};

export function SectionHeader({ title, rightAction, className = '' }: Props) {
  return (
    <View className={`mb-4 flex-row items-center justify-between ${className}`}>
      <Text
        style={typography.sectionTitle}
        className="flex-1 shrink text-text"
        numberOfLines={1}
      >
        {title}
      </Text>
      {rightAction}
    </View>
  );
}
