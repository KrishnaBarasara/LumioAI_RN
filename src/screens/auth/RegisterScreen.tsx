import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { GradientButton } from '@/components/buttons/GradientButton';
import { AppInput } from '@/components/inputs/AppInput';
import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useAuthStore } from '@/store';
import { registerSchema, type RegisterForm } from './schemas';

export function RegisterScreen() {
  const navigation = useNavigation();
  const { register: registerUser, isLoading } = useAuthStore();
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterForm) => {
    await registerUser(data.name, data.email, data.password);
  };

  return (
    <ScreenContainer tabBarOffset={false} keyboardAvoid extraBottomPadding={32}>
      <Header title="Create account" showBack onBack={() => navigation.goBack()} />

      <AppInput name="name" control={control} label="Full name" placeholder="Alex Morgan" error={errors.name?.message} />
      <AppInput name="email" control={control} label="Email" placeholder="you@company.com" keyboardType="email-address" autoCapitalize="none" error={errors.email?.message} />
      <AppInput name="password" control={control} label="Password" placeholder="••••••••" secureTextEntry error={errors.password?.message} />
      <AppInput name="confirmPassword" control={control} label="Confirm password" placeholder="••••••••" secureTextEntry error={errors.confirmPassword?.message} />

      <GradientButton label="Create Account" onPress={handleSubmit(onSubmit)} loading={isLoading} />
    </ScreenContainer>
  );
}
