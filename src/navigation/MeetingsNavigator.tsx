import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '@/constants/routes';
import { MeetingsScreen } from '@/screens/meetings/MeetingsScreen';
import { MeetingRecordingScreen } from '@/screens/meetings/MeetingRecordingScreen';
import { MeetingSummaryScreen } from '@/screens/meetings/MeetingSummaryScreen';
import { UploadAudioScreen } from '@/screens/meetings/UploadAudioScreen';
import { ProcessingScreen } from '@/screens/meetings/ProcessingScreen';
import { MeetingDetailsScreen } from '@/screens/meetings/MeetingDetailsScreen';
import { ActionItemsScreen } from '@/screens/meetings/ActionItemsScreen';
import type { MeetingsStackParamList } from './types';

const Stack = createNativeStackNavigator<MeetingsStackParamList>();

export function MeetingsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="MeetingsList" component={MeetingsScreen} />
      <Stack.Screen name={ROUTES.MEETING_RECORDING} component={MeetingRecordingScreen} />
      <Stack.Screen name={ROUTES.MEETING_UPLOAD} component={UploadAudioScreen} />
      <Stack.Screen name={ROUTES.MEETING_PROCESSING} component={ProcessingScreen} />
      <Stack.Screen name={ROUTES.MEETING_SUMMARY} component={MeetingSummaryScreen} />
      <Stack.Screen name={ROUTES.MEETING_DETAILS} component={MeetingDetailsScreen} />
      <Stack.Screen name={ROUTES.ACTION_ITEMS} component={ActionItemsScreen} />
    </Stack.Navigator>
  );
}
