'use strict';
import Parse from 'parse';
import log from 'npmlog';
import APNS from './APNS';
import GCM from './GCM';
import FCM from './FCM';
import EXPO from './Handlers/EXPO'
import { classifyInstallations } from './PushAdapterUtils';

const LOG_PREFIX = 'parse-server-push-adapter';

export default class ParsePushAdapter {

  supportsPushTracking = true;

  constructor(pushConfig = {}) {
    this.validPushTypes = ['ios', 'osx', 'tvos', 'android', 'fcm', 'expo'];
    this.senderMap = {};
    // used in PushController for Dashboard Features
    this.feature = {
      immediatePush: true
    };
    let pushTypes = Object.keys(pushConfig);

    for (let pushType of pushTypes) {
      // adapter may be passed as part of the parse-server initialization
      if (this.validPushTypes.indexOf(pushType) < 0 && pushType != 'adapter') {
        throw new Parse.Error(Parse.Error.PUSH_MISCONFIGURED,
                             'Push to ' + pushType + ' is not supported');
      }
      console.log('pushType', pushType)
      switch (pushType) {
        case 'ios':
        case 'tvos':
        case 'osx':
          if (pushConfig[pushType].hasOwnProperty('firebaseServiceAccount')) {
            this.senderMap[pushType] = new FCM(pushConfig[pushType], 'apple');
          } else {
            this.senderMap[pushType] = new APNS(pushConfig[pushType]);
          }
          break;
        case 'android':
        case 'fcm':
          if (pushConfig[pushType].hasOwnProperty('firebaseServiceAccount')) {
            this.senderMap[pushType] = new FCM(pushConfig[pushType], 'android');
          } else {
            this.senderMap[pushType] = new GCM(pushConfig[pushType]);
          }
          break;
        case 'epxo':
          console.log('pushConfig', pushConfig)
          const ExpoObject = new EXPO(pushConfig[pushType]);
          console.log('init EXPO', ExpoObject)
          this.senderMap[pushType] = ExpoObject
          break;  
      }
    }
  }

  getValidPushTypes() {
    return this.validPushTypes;
  }

  static classifyInstallations(installations, validTypes) {
    return classifyInstallations(installations, validTypes)
  }

  async send(data, installations) {
    let deviceMap = classifyInstallations(installations, this.validPushTypes);
    let sendPromises = [];
    for (let pushType in deviceMap) {
      console.log('deviceMap', deviceMap)
      console.log('senderMap', this.senderMap)
      let sender = this.senderMap[pushType];
      let devices = deviceMap[pushType];

      if(Array.isArray(devices) && devices.length > 0) {
        if (!sender) {
          log.verbose(LOG_PREFIX, `Can not find sender for push type ${pushType}, ${data}`)
          let results = devices.map((device) => {
            return Promise.resolve({
              device,
              transmitted: false,
              response: {'error': `Can not find sender for push type ${pushType}, ${data}`}
            })
          });
          sendPromises.push(Promise.all(results));
        } else {
          sendPromises.push(sender.send(data, devices));
        }
      }
    }
    const promises = await Promise.all(sendPromises);
    return [].concat.apply([], promises);
  }
}
