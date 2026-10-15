import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  async register() {
    const { status: existing } = await Notifications.getPermissionsAsync();
    let final = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      final = status;
    }
    return final === 'granted';
  },

  async schedulePracticeReminder(hour = 18, minute = 0) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Interview practice',
        body: 'Take 10 minutes to practice with Lumio AI today.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  },

  async notifySummaryReady(meetingId: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Summary ready',
        body: 'Your meeting summary has been generated.',
        data: { screen: 'MeetingSummary', meetingId },
      },
      trigger: null,
    });
  },
};
