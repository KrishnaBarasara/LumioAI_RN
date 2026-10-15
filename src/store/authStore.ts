import { create } from 'zustand';
import { isSupabaseConfigured } from '@/config/env';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { authService } from '@/services/authService';
import { supabaseAuthService } from '@/services/supabase/auth.service';
import { analyticsService } from '@/services/analytics/analytics.service';
import type { User } from '@/types';
import { getItem, removeItem, setItem } from '@/utils/storage';

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
};

async function persistSession(user: User, token: string) {
  await Promise.all([
    setItem(STORAGE_KEYS.USER, user),
    setItem(STORAGE_KEYS.AUTH_TOKEN, token),
  ]);
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isHydrated: false,

  hydrate: async () => {
    if (isSupabaseConfigured) {
      try {
        const session = await supabaseAuthService.getSession();
        if (session) {
          const user = await supabaseAuthService.getCurrentUser();
          set({
            user,
            token: session.access_token,
            isHydrated: true,
          });
          analyticsService.setUserId(user?.id ?? null);
          supabaseAuthService.onAuthStateChange(async () => {
            const u = await supabaseAuthService.getCurrentUser();
            const s = await supabaseAuthService.getSession();
            set({ user: u, token: s?.access_token ?? null });
          });
          return;
        }
      } catch {
        // fall through to clear
      }
      set({ user: null, token: null, isHydrated: true });
      return;
    }

    const [user, token] = await Promise.all([
      getItem<User>(STORAGE_KEYS.USER),
      getItem<string>(STORAGE_KEYS.AUTH_TOKEN),
    ]);
    set({ user, token, isHydrated: true });
    analyticsService.setUserId(user?.id ?? null);
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { user, token } = await authService.login({ email, password });
      await persistSession(user, token);
      set({ user, token });
      analyticsService.setUserId(user.id);
    } finally {
      set({ isLoading: false });
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const { user, token } = await authService.loginWithGoogle();
      await persistSession(user, token);
      set({ user, token });
      analyticsService.setUserId(user.id);
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const { user, token } = await authService.register({ name, email, password });
      await persistSession(user, token);
      set({ user, token });
      analyticsService.setUserId(user.id);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await authService.logout();
    await Promise.all([
      removeItem(STORAGE_KEYS.USER),
      removeItem(STORAGE_KEYS.AUTH_TOKEN),
    ]);
    set({ user: null, token: null });
    analyticsService.setUserId(null);
  },
}));
