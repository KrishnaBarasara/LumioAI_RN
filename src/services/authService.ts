import { isSupabaseConfigured } from '@/config/env';
import { mockUser } from '@/constants/mockData';
import { supabaseAuthService } from '@/services/supabase/auth.service';
import type { User } from '@/types';

export type LoginCredentials = { email: string; password: string };
export type RegisterData = LoginCredentials & { name: string };

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const authService = {
  async login(credentials: LoginCredentials) {
    if (isSupabaseConfigured) {
      return supabaseAuthService.signIn(credentials.email, credentials.password);
    }
    await delay(800);
    if (!credentials.email || !credentials.password) throw new Error('Invalid credentials');
    return { user: { ...mockUser, email: credentials.email }, token: 'mock-jwt-token' };
  },

  async register(data: RegisterData) {
    if (isSupabaseConfigured) {
      return supabaseAuthService.signUp(data.name, data.email, data.password);
    }
    await delay(1000);
    return {
      user: { ...mockUser, name: data.name, email: data.email },
      token: 'mock-jwt-token',
    };
  },

  async forgotPassword(email: string) {
    if (isSupabaseConfigured) {
      return supabaseAuthService.resetPassword(email);
    }
    await delay(600);
    if (!email) throw new Error('Email required');
  },

  async loginWithGoogle() {
    if (!isSupabaseConfigured) throw new Error('Google login requires Supabase configuration');
    return supabaseAuthService.signInWithGoogle();
  },

  async getCurrentUser(): Promise<User | null> {
    if (isSupabaseConfigured) {
      return supabaseAuthService.getCurrentUser();
    }
    return null;
  },

  async logout() {
    if (isSupabaseConfigured) {
      return supabaseAuthService.signOut();
    }
  },

  onAuthStateChange: isSupabaseConfigured
    ? supabaseAuthService.onAuthStateChange.bind(supabaseAuthService)
    : undefined,
};
