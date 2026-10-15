import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { ROUTES } from '@/constants/routes';

export type AuthStackParamList = {
  [ROUTES.LOGIN]: undefined;
  [ROUTES.REGISTER]: undefined;
  [ROUTES.FORGOT_PASSWORD]: undefined;
};

export type MeetingsStackParamList = {
  MeetingsList: undefined;
  [ROUTES.MEETING_RECORDING]: undefined;
  [ROUTES.MEETING_SUMMARY]: { meetingId: string };
  [ROUTES.MEETING_UPLOAD]: undefined;
  [ROUTES.MEETING_PROCESSING]: { meetingId: string };
  [ROUTES.MEETING_DETAILS]: { meetingId: string };
  [ROUTES.ACTION_ITEMS]: undefined;
};

export type MainTabParamList = {
  [ROUTES.HOME]: undefined;
  MeetingsTab: NavigatorScreenParams<MeetingsStackParamList>;
  [ROUTES.RECORD]: undefined;
  [ROUTES.ANALYTICS]: undefined;
  [ROUTES.PROFILE]: undefined;
};

export type RootStackParamList = {
  [ROUTES.SPLASH]: undefined;
  [ROUTES.ONBOARDING]: undefined;
  [ROUTES.AUTH]: NavigatorScreenParams<AuthStackParamList>;
  [ROUTES.MAIN]: NavigatorScreenParams<MainTabParamList>;
  [ROUTES.SETTINGS]: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthScreenProps<T extends keyof AuthStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;
