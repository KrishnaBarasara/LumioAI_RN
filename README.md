# Lumio AI

AI-powered productivity workspace built with React Native and Expo. Combines meeting assistance, interview practice, smart notes, and an AI chat workspace.

## Tech Stack

- **React Native** + **Expo** (SDK 56)
- **TypeScript**
- **React Navigation v7** — stack + bottom tabs
- **Zustand** — local/UI state (auth, onboarding)
- **TanStack Query** — server/API state
- **React Hook Form** + **Zod** — forms & validation
- **NativeWind v4** — Tailwind CSS styling
- **React Native Reanimated** — animations
- **Lucide React Native** — icons
- **AsyncStorage** — persistence
- **date-fns** — date utilities
- **Expo Image, Audio, Blur, Haptics, Linear Gradient** (`expo-av` is deprecated on SDK 56+; use `expo-audio` / `expo-video` when adding real media)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app (optional) or iOS Simulator / Android Emulator

### Install

```bash
cd LumioAI
npm install
```

### Run

```bash
# Start dev server
npm start

# iOS
npm run ios

# Android
npm run android
```

### Demo Login

On the login screen, use **Continue as Guest (Demo)** or any email with a password of 6+ characters.

## Project Structure

```
src/
├── assets/           # Images, fonts
├── components/       # Reusable UI (buttons, cards, inputs, layout, modals)
├── screens/          # Feature screens (onboarding, auth, home, meetings, etc.)
├── navigation/       # Navigators & types
├── hooks/            # TanStack Query hooks
├── services/         # API & mock services
├── store/            # Zustand stores
├── theme/            # Colors, spacing, typography, shadows
├── utils/            # Helpers (storage, format, animations)
├── constants/        # Routes, mock data, app config
└── types/            # TypeScript definitions
```

## App Flow

1. **Splash** — logo glow animation
2. **Onboarding** — 3 slides
3. **Auth** — Login / Register / Forgot Password
4. **Main tabs** — Home, Meetings, Interview, AI Chat, Profile
5. **Notes** — accessible from Home quick actions

## Design System

| Token | Value |
|-------|-------|
| Primary | `#6D28FF` |
| Background | `#F7F4FB` |
| Card | `#FFFFFF` |
| Text | `#121212` |
| Border radius | 16–28px |

## Architecture Notes

- **React Navigation** (not Expo Router) for explicit stack/tab control
- **Mock services** simulate API latency; swap `src/services/*` for real backends
- **Zustand + AsyncStorage** persist auth and onboarding state
- **TanStack Query** caches meetings and notes

## License

See [LICENSE](./LICENSE).
