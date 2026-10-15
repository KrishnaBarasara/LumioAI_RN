import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  BarChart3,
  Home,
  ListChecks,
  Mic,
  User,
} from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { ROUTES } from '@/constants/routes';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { MeetingRecordingScreen } from '@/screens/meetings/MeetingRecordingScreen';
import { AnalyticsScreen } from '@/screens/analytics/AnalyticsScreen';
import { MeetingsNavigator } from './MeetingsNavigator';
import type { MainTabParamList } from './types';
import { colors, layout, shadows, typography } from '@/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabConfig = [
  { name: ROUTES.HOME, component: HomeScreen, icon: Home, label: 'Home' },
  { name: 'MeetingsTab', component: MeetingsNavigator, icon: ListChecks, label: 'Meetings' },
  { name: ROUTES.RECORD, component: MeetingRecordingScreen, icon: Mic, label: 'Record' },
  { name: ROUTES.ANALYTICS, component: AnalyticsScreen, icon: BarChart3, label: 'Analytics' },
  { name: ROUTES.PROFILE, component: ProfileScreen, icon: User, label: 'Profile' },
] as const;

function TabIcon({
  focused,
  Icon,
  label,
}: {
  focused: boolean;
  Icon: typeof Home;
  label: string;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.05 : 1, { damping: 15 });
  }, [focused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[animatedStyle, { alignItems: 'center', justifyContent: 'center', flex: 1, minWidth: 0 }]}
    >
      <View
        style={{
          height: 36,
          width: 36,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          backgroundColor: focused ? `${colors.primary}18` : 'transparent',
          marginBottom: 2,
        }}
      >
        <Icon
          size={layout.iconSize}
          color={focused ? colors.primary : colors.textSecondary}
        />
      </View>
      <Text
        style={[
          typography.tabLabel,
          {
            color: focused ? colors.primary : colors.textSecondary,
            textAlign: 'center',
            width: '100%',
            fontSize: 10,
            lineHeight: 12,
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.75}
      >
        {label}
      </Text>
    </Animated.View>
  );
}

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: layout.tabBarMarginBottom,
          left: layout.tabBarMarginHorizontal,
          right: layout.tabBarMarginHorizontal,
          height: layout.tabBarHeight,
          borderRadius: layout.tabBarBorderRadius,
          backgroundColor: colors.card,
          borderTopWidth: 0,
          paddingTop: 10,
          paddingBottom: 10,
          paddingHorizontal: 4,
          ...shadows.elevated,
        },
        tabBarItemStyle: {
          flex: 1,
          minWidth: 0,
          paddingHorizontal: 2,
        },
      }}
    >
      {tabConfig.map(({ name, component, icon, label }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} Icon={icon} label={label} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
