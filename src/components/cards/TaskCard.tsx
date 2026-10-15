import { Pressable, Text, View } from 'react-native';
import { CheckCircle2, Circle } from 'lucide-react-native';
import type { ActionItem } from '@/types';
import { colors, layout, typography } from '@/theme';

type Props = {
  task: ActionItem;
  onToggle?: () => void;
};

export function TaskCard({ task, onToggle }: Props) {
  return (
    <Pressable
      onPress={onToggle}
      className="flex-row items-start gap-3 border border-border bg-card"
      style={{
        padding: layout.cardPadding,
        marginBottom: layout.cardMarginBottom,
        borderRadius: layout.cardBorderRadius,
      }}
    >
      {task.completed ? (
        <CheckCircle2 size={layout.iconSize} color={colors.success} />
      ) : (
        <Circle size={layout.iconSize} color={colors.textSecondary} />
      )}
      <View className="min-w-0 flex-1">
        <Text
          style={typography.bodySmall}
          className={`font-medium ${task.completed ? 'text-text-secondary line-through' : 'text-text'}`}
          numberOfLines={3}
        >
          {task.title}
        </Text>
        {(task.assignee || task.dueDate) && (
          <Text style={typography.caption} className="mt-1 text-text-secondary">
            {[task.assignee, task.dueDate].filter(Boolean).join(' · ')}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
