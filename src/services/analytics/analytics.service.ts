/** Firebase Analytics / Crashlytics wrapper — no-op until native SDK is configured */

type EventParams = Record<string, string | number | boolean>;

export const analyticsService = {
  track(event: string, params?: EventParams) {
    if (__DEV__) {
      console.log('[analytics]', event, params ?? {});
    }
    // Integrate @react-native-firebase/analytics when EAS build is configured
  },

  setUserId(userId: string | null) {
    if (__DEV__) console.log('[analytics] user', userId);
  },

  recordError(error: Error, context?: string) {
    if (__DEV__) console.error('[crash]', context, error);
    // Integrate Crashlytics when configured
  },
};
