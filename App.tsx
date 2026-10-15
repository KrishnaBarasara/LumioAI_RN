import './global.css';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { RootNavigator } from '@/navigation/RootNavigator';
import { notificationService } from '@/services/notifications/notification.service';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
});

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'lumio-query-cache',
});

export default function App() {
  useEffect(() => {
    notificationService.register().catch(() => {});
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 }}
        >
          <SafeAreaProvider>
            <StatusBar style="dark" />
            <RootNavigator />
          </SafeAreaProvider>
        </PersistQueryClientProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
