import { Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GradientButton } from '@/components/buttons/GradientButton';
import { SecondaryButton } from '@/components/buttons/SecondaryButton';
import { AppInput } from '@/components/inputs/AppInput';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store';
import type { AuthStackParamList } from '@/navigation/types';
import { typography } from '@/theme';
import { loginSchema, type LoginForm } from './schemas';

export function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { login, isLoading } = useAuthStore();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    await login(data.email, data.password);
  };

  return (
    <ScreenContainer tabBarOffset={false} keyboardAvoid extraBottomPadding={32}>
      <Text style={typography.largeHeading} className="text-text">
        Welcome back
      </Text>
      <Text style={typography.body} className="mb-6 mt-2 text-text-secondary">
        Sign in to your Lumio AI workspace
      </Text>

      <AppInput
        name="email"
        control={control}
        label="Email"
        placeholder="you@company.com"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email?.message}
      />
      <AppInput
        name="password"
        control={control}
        label="Password"
        placeholder="••••••••"
        secureTextEntry
        error={errors.password?.message}
      />

      <Text
        style={typography.label}
        className="mb-2 self-end text-primary"
        onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)}
      >
        Forgot password?
      </Text>

      <GradientButton label="Sign In" onPress={handleSubmit(onSubmit)} loading={isLoading} />

      <View className="mt-2 flex-row flex-wrap items-center justify-center gap-1">
        <Text style={typography.bodySmall} className="text-text-secondary">
          Don't have an account?
        </Text>
        <Text
          style={typography.label}
          className="text-primary"
          onPress={() => navigation.navigate(ROUTES.REGISTER)}
        >
          Sign up
        </Text>
      </View>

      <SecondaryButton
        label="Continue as Guest (Demo)"
        onPress={() => login('demo@lumio.ai', 'demo123')}
      />
    </ScreenContainer>
  );
}
