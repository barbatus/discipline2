import { Alert, Linking, Platform } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import RNPushNotification from 'react-native-push-notification';

import { caller } from 'app/utils/lang';

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
      requestPermissions: Platform.OS === 'ios',
      playSound: false,
    });
  },
  checkPermissions(onSuccess) {
    RNPushNotification.checkPermissions(({ alert }) => {
      if (!alert) {
        this.allowAlerts();
      } else {
        caller(onSuccess);
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
        ],
      );
    }, delayMs);
  },
  localNotification(
    title: string,
    message: string,
    checkPermissions: Boolean = false,
  ) {
    if (checkPermissions) {
      this.checkPermissions();
    }
    RNPushNotification.localNotification({
      title,
      message,
      playSound: false,
      alertAction: 'Click here to open',
    });
  },
};

export default PushNotification;
