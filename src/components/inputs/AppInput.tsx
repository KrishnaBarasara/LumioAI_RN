import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, layout, typography } from '@/theme';

type Props<T extends FieldValues> = TextInputProps & {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  error?: string;
};

export function AppInput<T extends FieldValues>({
  name,
  control,
  label,
  error,
  ...props
}: Props<T>) {
  return (
    <View style={{ marginBottom: layout.inputMarginBottom }}>
      {label && (
        <Text style={typography.label} className="mb-2 text-text">
          {label}
        </Text>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={`rounded-2xl border bg-card px-4 text-base text-text ${
              error ? 'border-error' : 'border-border'
            }`}
            style={{ height: layout.inputHeight }}
            placeholderTextColor={colors.textSecondary}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            {...props}
          />
        )}
      />
      {error && (
        <Text style={typography.bodySmall} className="mt-1.5 text-error">
          {error}
        </Text>
      )}
    </View>
  );
}
