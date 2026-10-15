import { Platform, ViewStyle } from 'react-native';

export const shadows = {
  soft: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#6D28FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: { elevation: 4 },
    default: {},
  }),
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#121212',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
    default: {},
  }),
  elevated: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#6D28FF',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
    },
    android: { elevation: 8 },
    default: {},
  }),
} as const;
