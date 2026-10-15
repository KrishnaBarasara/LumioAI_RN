import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { requireSupabase } from '@/lib/supabase';
import type { User } from '@/types';

WebBrowser.maybeCompleteAuthSession();

function mapProfileToUser(
  id: string,
  email: string,
  profile?: { name: string | null; plan: string; avatar_url: string | null; created_at: string } | null,
): User {
  return {
    id,
    email,
    name: profile?.name ?? email.split('@')[0],
    avatar: profile?.avatar_url ?? undefined,
    plan: (profile?.plan as User['plan']) ?? 'free',
    joinedAt: profile?.created_at ?? new Date().toISOString(),
  };
}

export const supabaseAuthService = {
  async signUp(name: string, email: string, password: string) {
    const client = requireSupabase();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    if (!data.session) {
      throw new Error('Check your email to confirm your account.');
    }
    const user = await this.getCurrentUser();
    return { user: user!, token: data.session.access_token };
  },

  async signIn(email: string, password: string) {
    const client = requireSupabase();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const user = await this.getCurrentUser();
    return { user: user!, token: data.session.access_token };
  },

  async signInWithGoogle() {
    const client = requireSupabase();
    const redirectTo = makeRedirectUri({ scheme: 'lumioai' });
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, skipBrowserRedirect: true },
    });
    if (error) throw error;
    if (!data.url) throw new Error('Google sign-in failed');

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== 'success' || !result.url) {
      throw new Error('Google sign-in was cancelled');
    }

    const url = new URL(result.url);
    const access_token = url.searchParams.get('access_token');
    const refresh_token = url.searchParams.get('refresh_token');
    if (access_token && refresh_token) {
      await client.auth.setSession({ access_token, refresh_token });
    }
    const user = await this.getCurrentUser();
    const session = (await client.auth.getSession()).data.session;
    return { user: user!, token: session?.access_token ?? '' };
  },

  async resetPassword(email: string) {
    const client = requireSupabase();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: makeRedirectUri({ scheme: 'lumioai', path: 'reset-password' }),
    });
    if (error) throw error;
  },

  async signOut() {
    const client = requireSupabase();
    const { error } = await client.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const client = requireSupabase();
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getCurrentUser(): Promise<User | null> {
    const client = requireSupabase();
    const { data: { user } } = await client.auth.getUser();
    if (!user?.email) return null;

    const { data: profile } = await client
      .from('profiles')
      .select('name, plan, avatar_url, created_at')
      .eq('id', user.id)
      .single();

    return mapProfileToUser(user.id, user.email, profile);
  },

  onAuthStateChange(callback: (event: string, session: { access_token: string } | null) => void) {
    const client = requireSupabase();
    const { data } = client.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return data.subscription;
  },
};
