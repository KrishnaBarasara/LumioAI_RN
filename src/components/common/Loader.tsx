import { ActivityIndicator, View } from 'react-native';
import { colors } from '@/theme';

type Props = {
  size?: 'small' | 'large';
  fullScreen?: boolean;
};

export function Loader({ size = 'large', fullScreen = false }: Props) {
  const content = <ActivityIndicator size={size} color={colors.primary} />;

  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        {content}
      </View>
    );
  }

  return <View className="items-center justify-center py-8">{content}</View>;
}
