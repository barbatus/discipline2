import { Alert, Linking, PushNotificationIOS } from 'react-native';
import RNPushNotification from 'react-native-push-notification';

const PushNotification = {
  configure() {
    RNPushNotification.configure({
      permissions: {
        alert: true,
        badge: false,
        sound: true,
      },
      onNotification(notification) {
        if (notification.data.openedInForeground) {
          notification.userInteraction = true;
        }

        if (!notification.data.openedInForeground) {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      popInitialNotification: true,
      requestPermissions: true,
      playSound: false,
    });
  },
  checkPermissions() {
    RNPushNotification.checkPermissions(({ alert }) => {
      if (!alert) {
        this.allowAlerts();
      }
    });
  },
  allowAlerts(delayMs = 1000) {
    setTimeout(() => {
      Alert.alert(
        'Allow Alerts?',
        'In order to receive tracker notifications, please enable them in the settings page.',
        [
          { text: 'Cancel' },
          { text: 'Settings', onPress: () => Linking.openURL('app-settings:') },
        ]
      );
    }, delayMs);
  },
  localNotification(title: string, message: string) {
    RNPushNotification.localNotification({
      title,
      message,
      playSound: false,
      alertAction: 'Click here to open',
    });
  },
};

export default PushNotification;
