export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  joinedAt: string;
};

export type Meeting = {
  id: string;
  title: string;
  duration: number;
  date: string;
  participants: string[];
  status: 'recording' | 'processing' | 'completed';
  sentiment?: 'positive' | 'neutral' | 'negative';
  summary?: string;
};

export type MeetingSummary = {
  meetingId: string;
  executiveSummary: string;
  sentiment: { score: number; label: string; description: string };
  keyPoints: string[];
  actionItems: ActionItem[];
  nextSteps: string[];
};

export type ActionItem = {
  id: string;
  title: string;
  assignee?: string;
  dueDate?: string;
  completed: boolean;
};

export type OnboardingSlide = {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
};
