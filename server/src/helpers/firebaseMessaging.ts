import * as admin from 'firebase-admin';

import { messaging } from 'firebase-admin/lib/messaging/messaging-namespace';
import { appCommonTypes } from '../@types/app-common';
import App = admin.app.App;
import Notification = messaging.Notification;
import AnyObjectType = appCommonTypes.AnyObjectType;

type FirebaseMsgConfig = {
  serviceAccount: admin.ServiceAccount | string;
};

type SendToOneConfig = {
  data?: AnyObjectType;
  token: string;
  notification: Notification;
};

type SendToManyConfig = Omit<SendToOneConfig, 'token'> & { tokens: string[] };

export default function firebaseMessaging(config?: FirebaseMsgConfig) {
  let app: ReturnType<() => App>;

  if (config && config.serviceAccount) {
    app = admin.initializeApp({ credential: admin.credential.cert(config.serviceAccount) });
  } else app = admin.initializeApp();

  return {
    async sendToOne(config: SendToOneConfig) {
      await app.messaging().send({
        data: config.data,
        token: config.token,
        notification: config.notification,
      });
    },

    async sendToMany(config: SendToManyConfig) {
      await app.messaging().sendMulticast({
        data: config.data,
        tokens: config.tokens,
        notification: config.notification,
      });
    },
  };
}
