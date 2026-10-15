import { Modal, Pressable, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { colors, layout, typography } from '@/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export function AppModal({ visible, onClose, title, children }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable className="absolute inset-0" onPress={onClose}>
          <BlurView intensity={20} tint="dark" style={{ flex: 1 }} />
        </Pressable>
        <View
          className="rounded-t-3xl bg-card"
          style={{
            paddingHorizontal: layout.screenPaddingHorizontal,
            paddingTop: 20,
            paddingBottom: Math.max(insets.bottom, 20),
          }}
        >
          <View className="mb-4 flex-row items-center justify-between gap-3">
            {title && (
              <Text style={typography.sectionTitle} className="flex-1 text-text" numberOfLines={1}>
                {title}
              </Text>
            )}
            <Pressable
              onPress={onClose}
              className="h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background"
              hitSlop={8}
            >
              <X size={layout.iconSize} color={colors.text} />
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}
