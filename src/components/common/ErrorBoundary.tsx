import React from 'react';
import { Text, View } from 'react-native';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { analyticsService } from '@/services/analytics/analytics.service';
import { typography } from '@/theme';

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    analyticsService.recordError(error, 'ErrorBoundary');
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-background px-6">
          <Text style={typography.screenTitle} className="mb-2 text-center text-text">
            Something went wrong
          </Text>
          <Text style={typography.bodySmall} className="mb-6 text-center text-text-secondary">
            Please restart the app. If the issue continues, contact support.
          </Text>
          <PrimaryButton
            label="Try again"
            onPress={() => this.setState({ hasError: false })}
          />
        </View>
      );
    }
    return this.props.children;
  }
}
