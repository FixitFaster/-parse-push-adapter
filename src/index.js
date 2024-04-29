"use strict";
// ParsePushAdapter is the default implementation of
// PushAdapter, it uses GCM for android push and APNS
// for ios push.
import log from 'npmlog';

/* istanbul ignore if */
if (process.env.VERBOSE || process.env.VERBOSE_PARSE_SERVER_PUSH_ADAPTER) {
  log.level = 'verbose';
}

import ParsePushAdapter from './ParsePushAdapter';
import GCM from './GCM';
import APNS from './APNS';
import EXPO from './handlers/EXPO'
import * as utils from './PushAdapterUtils';

export default ParsePushAdapter;
export { ParsePushAdapter, APNS, GCM, EXPO, utils };
