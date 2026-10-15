import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { CheckCircle2, Circle } from 'lucide-react-native';
import { Header } from '@/components/layout/Header';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TaskCard } from '@/components/cards/TaskCard';
import { useMeetingsList, useMeetingSummary } from '@/hooks';
import { mockMeetingSummary } from '@/constants/mockData';
import { layout, typography } from '@/theme';

export function ActionItemsScreen() {
  const [showCompleted, setShowCompleted] = useState(false);
  const { data: meetings = [] } = useMeetingsList();
  const latestMeetingId = meetings[0]?.id ?? mockMeetingSummary.meetingId;
  const { data: summary } = useMeetingSummary(latestMeetingId);

  const tasks = useMemo(() => {
    const items = summary?.actionItems ?? mockMeetingSummary.actionItems;
    return items.filter((item) => item.completed === showCompleted);
  }, [summary?.actionItems, showCompleted]);

  return (
    <ScreenContainer>
      <Header title="Action Items" subtitle="Track pending and completed tasks" />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <Pressable
          onPress={() => setShowCompleted(false)}
          className={`mr-2 rounded-full px-4 py-2 ${!showCompleted ? 'bg-primary' : 'border border-border bg-card'}`}
        >
          <Text style={typography.label} className={!showCompleted ? 'text-white' : 'text-text-secondary'}>
            Pending
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setShowCompleted(true)}
          className={`rounded-full px-4 py-2 ${showCompleted ? 'bg-primary' : 'border border-border bg-card'}`}
        >
          <Text style={typography.label} className={showCompleted ? 'text-white' : 'text-text-secondary'}>
            Completed
          </Text>
        </Pressable>
      </ScrollView>

      <View className="mb-3 flex-row items-center gap-2">
        {showCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
        <Text style={typography.caption} className="text-text-secondary">
          {tasks.length} items
        </Text>
      </View>

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}

      {tasks.length === 0 && (
        <View className="border border-border bg-card" style={{ borderRadius: layout.cardBorderRadius, padding: layout.cardPadding }}>
          <Text style={typography.bodySmall} className="text-text-secondary">
            No tasks in this section yet.
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
}
