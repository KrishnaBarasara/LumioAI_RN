import type { Meeting, MeetingSummary, User } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'Alex Morgan',
  email: 'alex@lumio.ai',
  plan: 'pro',
  joinedAt: '2025-01-15',
};

export const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Product Roadmap Q2',
    duration: 2847,
    date: '2026-05-24T10:00:00Z',
    participants: ['Alex', 'Sarah', 'James'],
    status: 'completed',
    sentiment: 'positive',
    summary: 'Discussed Q2 priorities and resource allocation.',
  },
  {
    id: '2',
    title: 'Design Review — Mobile App',
    duration: 1923,
    date: '2026-05-23T14:30:00Z',
    participants: ['Alex', 'Mia', 'David'],
    status: 'completed',
    sentiment: 'neutral',
  },
  {
    id: '3',
    title: 'Weekly Standup',
    duration: 1245,
    date: '2026-05-22T09:00:00Z',
    participants: ['Team'],
    status: 'completed',
    sentiment: 'positive',
  },
];

export const mockMeetingSummary: MeetingSummary = {
  meetingId: '1',
  executiveSummary:
    'The team aligned on Q2 product priorities with focus on AI features and mobile experience. Key decisions include accelerating the interview assistant module and deferring analytics dashboard to Q3.',
  sentiment: {
    score: 78,
    label: 'Positive',
    description: 'Collaborative tone with constructive feedback throughout.',
  },
  keyPoints: [
    'Q2 priority: AI interview assistant launch',
    'Mobile redesign approved for June sprint',
    'Hiring plan: 2 senior engineers by July',
    'Customer feedback loop to run bi-weekly',
  ],
  actionItems: [
    {
      id: '1',
      title: 'Draft PRD for interview assistant v2',
      assignee: 'Alex',
      dueDate: '2026-05-28',
      completed: false,
    },
    {
      id: '2',
      title: 'Schedule design sprint kickoff',
      assignee: 'Mia',
      dueDate: '2026-05-26',
      completed: false,
    },
    {
      id: '3',
      title: 'Share hiring pipeline update',
      assignee: 'Sarah',
      completed: true,
    },
  ],
  nextSteps: [
    'Review PRD in next sync',
    'Set up beta testing group for interview module',
    'Prepare stakeholder update for Friday',
  ],
};

