import { appCommonTypes } from '../@types/app-common';
import axios from 'axios';
import * as apn from 'apn';
import IFirebaseData = appCommonTypes.IFirebaseData;
import AnyObjectType = appCommonTypes.AnyObjectType;

type FCMConfig = {
  experienceId: string;
  scopeKey: string;
  baseURL: string;
  serverKey: string;
  pushToken: string;
};

type APNSData = {
  alert: string;
  badge?: number;
  expiry?: number;
  payload: AnyObjectType;
  priority?: number;
  sound?: string;
};

interface APNSConfig extends apn.ProviderOptions {
  token: {
    key: string; //"path/to/APNsAuthKey_XXXXXXXXXX.p8"
    keyId: string; //"key-id"
    teamId: string; //"developer-team-id"
  };
  production: boolean;
  pushToken: string;
  topic: string;
}

class FCM {
  private readonly experienceId: string;
  private readonly scopeKey: string;
  private baseURL: string;
  private serverKey: string;
  private readonly pushToken: string;

  constructor(fcmConfig: FCMConfig) {
    axios.defaults.baseURL = fcmConfig.baseURL;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.headers.common['Authorization'] = `key=${fcmConfig.serverKey}`;

    this.experienceId = fcmConfig.experienceId;
    this.scopeKey = fcmConfig.scopeKey;
    this.baseURL = fcmConfig.baseURL;
    this.serverKey = fcmConfig.serverKey;
    this.pushToken = fcmConfig.pushToken;
  }

  public static config(fcmConfig: FCMConfig) {
    return new FCM(fcmConfig);
  }

  public async sendToOne(firebaseData: IFirebaseData) {
    const payload = JSON.stringify({
      to: this.pushToken,
      priority: 'normal',
      data: {
        experienceId: this.experienceId,
        scopeKey: this.scopeKey,
        ...firebaseData,
      } as IFirebaseData,
    });

    return await axios.post('/send', payload);
  }
}

class APNS {
  private readonly apnProvider: apn.Provider;
  private readonly pushToken: string;
  private readonly topic: string;

  constructor(apnsConfig: APNSConfig) {
    this.pushToken = apnsConfig.pushToken;
    this.topic = apnsConfig.topic;
    this.apnProvider = new apn.Provider(apnsConfig);
  }

  public static config(apnsConfig: APNSConfig) {
    return new APNS(apnsConfig);
  }

  public async sendToOne(apnsData: APNSData) {
    const { priority = 1, sound = 'ping.aiff', badge = 3 } = apnsData;
    const notification = new apn.Notification();

    notification.topic = this.topic;
    notification.priority = priority;
    notification.sound = sound;
    notification.badge = badge;

    Object.assign(notification, apnsData);

    return this.apnProvider.send(notification, this.pushToken);
  }
}

const PushNotificationService = {
  fcmMessaging: FCM,
  apnMessaging: APNS,
};

export default PushNotificationService;
