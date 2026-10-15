import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus } from 'lucide-react-native';
import { MeetingCard } from '@/components/cards/MeetingCard';
import { CardSkeleton } from '@/components/common/SkeletonLoader';
import { EmptyState } from '@/components/common/EmptyState';
import { GradientButton } from '@/components/buttons/GradientButton';
import { SearchBar } from '@/components/inputs/SearchBar';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Header } from '@/components/layout/Header';
import { ROUTES } from '@/constants/routes';
import { useMeetingsList } from '@/hooks';
import type { MeetingsStackParamList } from '@/navigation/types';
import { colors, layout, typography } from '@/theme';
import { Mic } from 'lucide-react-native';

export function MeetingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MeetingsStackParamList>>();
  const { data: meetings = [], isLoading, refetch, isRefetching } = useMeetingsList();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [filter, setFilter] = useState<'all' | 'completed' | 'processing'>('all');

  const filteredMeetings = useMemo(() => {
    let next = meetings.filter((m) =>
      !search ? true : m.title.toLowerCase().includes(search.toLowerCase()),
    );
    if (filter !== 'all') {
      next = next.filter((m) => (filter === 'completed' ? m.status === 'completed' : m.status !== 'completed'));
    }
    next = [...next].sort((a, b) =>
      sort === 'newest'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    return next;
  }, [meetings, search, filter, sort]);

  const listHeader = (
    <>
      <Header
        title="Meetings"
        subtitle="Record & summarize with AI"
        rightAction={
          <Pressable
            onPress={() => navigation.navigate(ROUTES.MEETING_RECORDING)}
            className="h-11 w-11 items-center justify-center rounded-2xl bg-primary/10"
            hitSlop={8}
          >
            <Plus size={layout.iconSize} color={colors.primary} />
          </Pressable>
        }
      />
      <GradientButton
        label="Start Recording"
        onPress={() => navigation.navigate(ROUTES.MEETING_RECORDING)}
      />
      <GradientButton
        label="Upload Audio"
        onPress={() => navigation.navigate(ROUTES.MEETING_UPLOAD)}
      />
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search meetings..."
      />
      <View className="mb-4 flex-row" style={{ gap: 8 }}>
        {[
          { key: 'all', label: 'All' },
          { key: 'completed', label: 'Completed' },
          { key: 'processing', label: 'Processing' },
        ].map((item) => (
          <Pressable
            key={item.key}
            onPress={() => setFilter(item.key as typeof filter)}
            className={`rounded-full px-3 py-2 ${filter === item.key ? 'bg-primary' : 'border border-border bg-card'}`}
          >
            <Text style={typography.caption} className={filter === item.key ? 'text-white' : 'text-text-secondary'}>
              {item.label}
            </Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() => setSort((s) => (s === 'newest' ? 'oldest' : 'newest'))}
          className="rounded-full border border-border bg-card px-3 py-2"
        >
          <Text style={typography.caption} className="text-text-secondary">
            Sort: {sort === 'newest' ? 'Newest' : 'Oldest'}
          </Text>
        </Pressable>
      </View>
    </>
  );

  if (isLoading) {
    return (
      <ScreenContainer scroll={false}>
        <View style={{ paddingHorizontal: layout.screenPaddingHorizontal, paddingTop: layout.screenPaddingTop }}>
          {listHeader}
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </View>
      </ScreenContainer>
    );
  }

  if (!filteredMeetings.length) {
    return (
      <ScreenContainer>
        {listHeader}
        <EmptyState
          icon={Mic}
          title="No meetings yet"
          description="Start your first AI-powered meeting recording"
          actionLabel="Record Meeting"
          onAction={() => navigation.navigate(ROUTES.MEETING_RECORDING)}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll={false}>
      <FlatList
        data={filteredMeetings}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: layout.screenPaddingHorizontal,
          paddingTop: layout.screenPaddingTop,
          paddingBottom: layout.tabBarContentOffset,
          flexGrow: 1,
        }}
        ListHeaderComponent={listHeader}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
        }
        renderItem={({ item, index }) => (
          <MeetingCard
            meeting={item}
            index={index}
            onPress={() =>
              navigation.navigate(ROUTES.MEETING_DETAILS, { meetingId: item.id })
            }
          />
        )}
      />
    </ScreenContainer>
  );
}
