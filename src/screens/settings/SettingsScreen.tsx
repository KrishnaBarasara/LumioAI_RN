import { Text, View } from 'react-native';
import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { layout, typography } from '@/theme';

const settings = [
  { title: 'Recording Quality', value: 'High' },
  { title: 'Auto Summary', value: 'Enabled' },
  { title: 'Notification Preferences', value: 'Daily + Summary Ready' },
  { title: 'Export Preferences', value: 'Markdown + TXT' },
];

export function SettingsScreen() {
  return (
    <ScreenContainer>
      <Header title="Settings" subtitle="Meeting notes preferences" />
      {settings.map((item) => (
        <View
          key={item.title}
          className="mb-3 border border-border bg-card"
          style={{ borderRadius: layout.cardBorderRadius, padding: layout.cardPadding }}
        >
          <Text style={typography.label} className="text-text">
            {item.title}
          </Text>
          <Text style={typography.bodySmall} className="mt-1 text-text-secondary">
            {item.value}
          </Text>
        </View>
      ))}
    </ScreenContainer>
  );
}
