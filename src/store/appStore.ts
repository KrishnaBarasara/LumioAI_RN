import { create } from 'zustand';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { getItem, setItem } from '@/utils/storage';

type AppState = {
  onboardingComplete: boolean;
  splashDone: boolean;
  isHydrated: boolean;
  setOnboardingComplete: (value: boolean) => Promise<void>;
  setSplashDone: (value: boolean) => void;
  hydrate: () => Promise<void>;
};

export const useAppStore = create<AppState>((set) => ({
  onboardingComplete: false,
  splashDone: false,
  isHydrated: false,

  hydrate: async () => {
    const onboardingComplete = await getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETE);
    set({ onboardingComplete: !!onboardingComplete, isHydrated: true });
  },

  setOnboardingComplete: async (value) => {
    await setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, value);
    set({ onboardingComplete: value });
  },

  setSplashDone: (value) => set({ splashDone: value }),
}));
