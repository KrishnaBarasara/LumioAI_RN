import { Text } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { GradientButton } from '@/components/buttons/GradientButton';
import { AppInput } from '@/components/inputs/AppInput';
import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { authService } from '@/services/authService';
import { typography } from '@/theme';
import { forgotPasswordSchema, type ForgotPasswordForm } from './schemas';

export function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer tabBarOffset={false} keyboardAvoid extraBottomPadding={32}>
      <Header title="Reset password" showBack onBack={() => navigation.goBack()} />
      <Text style={typography.body} className="mb-6 text-text-secondary">
        {sent
          ? 'Check your email for reset instructions.'
          : "Enter your email and we'll send you a reset link."}
      </Text>
      {!sent && (
        <>
          <AppInput name="email" control={control} label="Email" placeholder="you@company.com" keyboardType="email-address" autoCapitalize="none" error={errors.email?.message} />
          <GradientButton label="Send Reset Link" onPress={handleSubmit(onSubmit)} loading={loading} />
        </>
      )}
    </ScreenContainer>
  );
}
