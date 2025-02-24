import * as Notifications from 'expo-notifications';

export const scheduleInvestmentNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🎉 Investment Time!',
      body: 'You have saved $300! Time to invest.',
    },
    trigger: null,
  });
};
