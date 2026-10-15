import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  ViewProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { layout } from '@/theme/layout';

type Props = ViewProps & {
  scroll?: boolean;
  /** Adds bottom padding to clear the floating tab bar */
  tabBarOffset?: boolean;
  /** Wraps content in KeyboardAvoidingView and dismisses keyboard on outside tap */
  keyboardAvoid?: boolean;
  /** Additional bottom padding (e.g. sign-out button clearance) */
  extraBottomPadding?: number;
};

export function ScreenContainer({
  children,
  scroll = true,
  tabBarOffset = true,
  keyboardAvoid = false,
  extraBottomPadding = 0,
  className = '',
  style,
  ...props
}: Props) {
  const bottomPadding =
    (tabBarOffset ? layout.tabBarContentOffset : layout.screenPaddingBottom) +
    extraBottomPadding;

  const contentStyle = {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: layout.screenPaddingTop,
    paddingBottom: bottomPadding,
  };

  const body = scroll ? (
    <ScrollView
      className={`flex-1 bg-background ${className}`}
      contentContainerStyle={{ ...contentStyle, flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      {...props}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      className={`flex-1 bg-background ${className}`}
      style={[contentStyle, style]}
      {...props}
    >
      {children}
    </View>
  );

  const withKeyboard = keyboardAvoid ? (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1">{body}</View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  ) : (
    body
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {withKeyboard}
    </SafeAreaView>
  );
}
