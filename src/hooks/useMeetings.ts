import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { meetingService } from '@/services/meetingService';
import { useAuthStore } from '@/store';

export function useMeetings(search?: string) {
  const userId = useAuthStore((s) => s.user?.id);

  return useInfiniteQuery({
    queryKey: ['meetings', userId, search],
    queryFn: ({ pageParam = 0 }) =>
      meetingService.getMeetings(userId, { page: pageParam, search }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.length >= 20 ? lastPageParam + 1 : undefined,
    enabled: !!userId,
  });
}

export function useMeetingsList(search?: string) {
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery({
    queryKey: ['meetings-list', userId, search],
    queryFn: () => meetingService.getMeetings(userId, { search }),
    enabled: !!userId,
  });
}

export function useMeetingSummary(meetingId: string) {
  return useQuery({
    queryKey: ['meeting-summary', meetingId],
    queryFn: () => meetingService.getMeetingSummary(meetingId),
    enabled: !!meetingId,
  });
}
