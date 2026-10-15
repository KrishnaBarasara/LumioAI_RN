import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '@/constants/routes';
import { useAppStore, useAuthStore } from '@/store';
import { Loader } from '@/components/common/Loader';
import { SplashScreen } from '@/screens/onboarding/SplashScreen';
import { OnboardingScreen } from '@/screens/onboarding/OnboardingScreen';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const [showSplash, setShowSplash] = useState(true);
  const { user, token, isHydrated: authHydrated, hydrate: hydrateAuth } = useAuthStore();
  const {
    onboardingComplete,
    isHydrated: appHydrated,
    hydrate: hydrateApp,
    setOnboardingComplete,
  } = useAppStore();

  useEffect(() => {
    hydrateAuth();
    hydrateApp();
  }, [hydrateAuth, hydrateApp]);

  if (!authHydrated || !appHydrated) {
    return <Loader fullScreen />;
  }

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  const isAuthenticated = !!(user && token);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!onboardingComplete ? (
          <Stack.Screen name={ROUTES.ONBOARDING}>
            {() => (
              <OnboardingScreen
                onComplete={() => setOnboardingComplete(true)}
              />
            )}
          </Stack.Screen>
        ) : !isAuthenticated ? (
          <Stack.Screen name={ROUTES.AUTH} component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name={ROUTES.MAIN} component={MainTabNavigator} />
            <Stack.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
