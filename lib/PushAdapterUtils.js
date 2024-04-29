function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import { randomBytes } from 'crypto';
import axios from 'axios';

/**g
   * Classify the device token of installations based on its device type.
   * @param {Object} installations An array of installations
   * @param {Array} validPushTypes An array of valid push types(string)
   * @returns {Object} A map whose key is device type and value is an array of device
   */
export function classifyInstallations(installations, validPushTypes) {
  // Init deviceTokenMap, create a empty array for each valid pushType
  let deviceMap = {};
  for (let validPushType of validPushTypes) {
    deviceMap[validPushType] = [];
  }
  for (let installation of installations) {
    // No deviceToken, ignore
    if (!installation.deviceToken) {
      continue;
    }
    let devices = deviceMap[installation.pushType] || deviceMap[installation.deviceType] || null;
    if (Array.isArray(devices)) {
      devices.push({
        deviceToken: installation.deviceToken,
        deviceType: installation.deviceType,
        appIdentifier: installation.appIdentifier
      });
    }
  }
  return deviceMap;
}

export function randomString(size) {
  if (size === 0) {
    throw new Error('Zero-length randomString is useless.');
  }
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789';
  let objectId = '';
  let bytes = randomBytes(size);
  for (let i = 0; i < bytes.length; ++i) {
    objectId += chars[bytes.readUInt8(i) % chars.length];
  }
  return objectId;
}

// Post receipt back to webhook url
export let handleCallback = (() => {
  var _ref = _asyncToGenerator(function* (webhookurl, pushStatusData) {
    try {
      const response = yield axios.post(webhookurl, {
        pushStatusData: pushStatusData
      });
      console.log("Callback request completed", { response });
    } catch (error) {
      console.error("Callback request failed", { error });
    }
  });

  return function handleCallback(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();