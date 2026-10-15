import { TextInput, View } from 'react-native';
import { Search } from 'lucide-react-native';
import { colors, layout } from '@/theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
}: Props) {
  return (
    <View
      className="mb-4 flex-row items-center rounded-2xl border border-border bg-card px-4"
      style={{ height: layout.inputHeight }}
    >
      <Search size={layout.iconSize} color={colors.textSecondary} />
      <TextInput
        className="ml-3 flex-1 text-base text-text"
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
    </View>
  );
}
