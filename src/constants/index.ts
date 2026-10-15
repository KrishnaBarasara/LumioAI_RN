export { STORAGE_KEYS } from './storageKeys';
export { ROUTES } from './routes';
export {
  mockUser,
  mockMeetings,
  mockMeetingSummary,
} from './mockData';

export const APP_NAME = 'Lumio AI';

export const ONBOARDING_SLIDES = [
  {
    id: 1,
    title: 'Record Meetings',
    subtitle: 'Capture meetings with one tap and keep every detail.',
    icon: 'mic',
  },
  {
    id: 2,
    title: 'Transcribe and Summarize',
    subtitle: 'Turn audio into searchable notes and clear summaries.',
    icon: 'file-text',
  },
  {
    id: 3,
    title: 'Track Action Items',
    subtitle: 'Extract next steps and stay aligned after every call.',
    icon: 'sparkles',
  },
] as const;

export const SUGGESTED_PROMPTS = [
  'Summarize my last meeting',
  'Extract action items from this transcript',
  'Create concise meeting recap',
] as const;
