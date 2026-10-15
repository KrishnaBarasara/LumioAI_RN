import { Alert, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell,
  ChevronRight,
  HelpCircle,
  Settings,
  Shield,
} from 'lucide-react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Header } from '@/components/layout/Header';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { SecondaryButton } from '@/components/buttons/SecondaryButton';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store';
import { notificationService } from '@/services/notifications/notification.service';
import { useMeetingsList } from '@/hooks';
import { colors, layout, shadows, typography } from '@/theme';

const menuItems = [
  { label: 'Notifications', icon: Bell },
  { label: 'Privacy & Security', icon: Shield },
  { label: 'Settings', icon: Settings },
  { label: 'Help & Support', icon: HelpCircle },
];

export function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();
  const { data: meetings = [] } = useMeetingsList();
  const summariesGenerated = meetings.filter((m) => !!m.summary).length;

  const handleMenuPress = async (label: string) => {
    if (label === 'Notifications') {
      await notificationService.schedulePracticeReminder();
      Alert.alert('Notifications', 'Practice reminder scheduled.');
      return;
    }
    if (label === 'Settings') {
      (navigation as { navigate: (name: string) => void }).navigate(ROUTES.SETTINGS);
    }
  };

  return (
    <ScreenContainer extraBottomPadding={20}>
      <Header title="Profile" />

      <LinearGradient
        colors={[colors.primary, colors.secondaryLight]}
        className="mb-7 overflow-hidden"
        style={[
          shadows.elevated,
          { padding: layout.cardPadding + 6, borderRadius: layout.cardBorderRadius + 6 },
        ]}
      >
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-white/20">
          <Text style={typography.screenTitle} className="text-white">
            {user?.name?.charAt(0) ?? 'A'}
          </Text>
        </View>
        <Text style={typography.sectionTitle} className="text-white" numberOfLines={1}>
          {user?.name ?? 'Guest'}
        </Text>
        <Text style={typography.bodySmall} className="mt-1 text-white/80" numberOfLines={1}>
          {user?.email}
        </Text>
        <View className="mt-4 self-start rounded-full bg-white/20 px-3 py-1">
          <Text style={typography.caption} className="font-semibold uppercase text-white">
            {meetings.length} meetings
          </Text>
        </View>
      </LinearGradient>

      <SectionHeader title="Statistics" />
      <View className="mb-7 flex-row flex-wrap" style={{ gap: 12 }}>
        {[
          { label: 'Meetings Recorded', value: meetings.length },
          { label: 'Summaries Generated', value: summariesGenerated },
        ].map((stat) => (
          <View
            key={stat.label}
            className="border border-border bg-card"
            style={[
              shadows.card,
              {
                width: '47%',
                padding: layout.cardPadding,
                borderRadius: layout.cardBorderRadius,
              },
            ]}
          >
            <Text style={typography.screenTitle} className="text-primary">
              {stat.value}
            </Text>
            <Text style={typography.caption} className="mt-1 text-text-secondary" numberOfLines={1}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      <SectionHeader title="Settings" />
      {menuItems.map((item) => (
        <Pressable
          key={item.label}
          onPress={() => handleMenuPress(item.label)}
          className="flex-row items-center justify-between border border-border bg-card"
          style={{
            padding: layout.cardPadding,
            marginBottom: layout.cardMarginBottom,
            borderRadius: layout.cardBorderRadius,
          }}
        >
          <View className="flex-row items-center gap-3">
            <item.icon size={layout.iconSize} color={colors.textSecondary} />
            <Text style={typography.body} className="text-text">
              {item.label}
            </Text>
          </View>
          <ChevronRight size={layout.iconSize} color={colors.textSecondary} />
        </Pressable>
      ))}

      <View style={{ marginTop: 8, marginBottom: 32 }}>
        <SecondaryButton label="Sign Out" onPress={logout} />
      </View>
    </ScreenContainer>
  );
}
