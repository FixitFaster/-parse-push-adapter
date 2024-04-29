'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _parse = require('parse');

var _parse2 = _interopRequireDefault(_parse);

var _npmlog = require('npmlog');

var _npmlog2 = _interopRequireDefault(_npmlog);

var _APNS = require('./APNS');

var _APNS2 = _interopRequireDefault(_APNS);

var _GCM = require('./GCM');

var _GCM2 = _interopRequireDefault(_GCM);

var _FCM = require('./FCM');

var _FCM2 = _interopRequireDefault(_FCM);

var _EXPO = require('./EXPO');

var _EXPO2 = _interopRequireDefault(_EXPO);

var _PushAdapterUtils = require('./PushAdapterUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LOG_PREFIX = 'parse-server-push-adapter';

var ParsePushAdapter = function () {
  function ParsePushAdapter() {
    var pushConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ParsePushAdapter);

    this.supportsPushTracking = true;

    this.validPushTypes = ['ios', 'osx', 'tvos', 'android', 'fcm', 'expo'];
    this.senderMap = {};
    // used in PushController for Dashboard Features
    this.feature = {
      immediatePush: true
    };
    var pushTypes = Object.keys(pushConfig);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = pushTypes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var pushType = _step.value;

        // adapter may be passed as part of the parse-server initialization
        if (this.validPushTypes.indexOf(pushType) < 0 && pushType != 'adapter') {
          throw new _parse2.default.Error(_parse2.default.Error.PUSH_MISCONFIGURED, 'Push to ' + pushType + ' is not supported');
        }
        console.log('pushType', pushType);
        switch (pushType) {
          case 'ios':
          case 'tvos':
          case 'osx':
            if (pushConfig[pushType].hasOwnProperty('firebaseServiceAccount')) {
              this.senderMap[pushType] = new _FCM2.default(pushConfig[pushType], 'apple');
            } else {
              this.senderMap[pushType] = new _APNS2.default(pushConfig[pushType]);
            }
            break;
          case 'android':
          case 'fcm':
            if (pushConfig[pushType].hasOwnProperty('firebaseServiceAccount')) {
              this.senderMap[pushType] = new _FCM2.default(pushConfig[pushType], 'android');
            } else {
              this.senderMap[pushType] = new _GCM2.default(pushConfig[pushType]);
            }
            break;
          case 'epxo':
            this.senderMap[pushType] = new _EXPO2.default(pushConfig[pushType]);
            break;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  _createClass(ParsePushAdapter, [{
    key: 'getValidPushTypes',
    value: function getValidPushTypes() {
      return this.validPushTypes;
    }
  }, {
    key: 'send',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data, installations) {
        var _this = this;

        var deviceMap, sendPromises, _loop, pushType, promises;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                deviceMap = (0, _PushAdapterUtils.classifyInstallations)(installations, this.validPushTypes);
                sendPromises = [];

                _loop = function _loop(pushType) {
                  console.log('deviceMap', deviceMap);
                  console.log('senderMap', _this.senderMap);
                  var sender = _this.senderMap[pushType];
                  var devices = deviceMap[pushType];

                  if (Array.isArray(devices) && devices.length > 0) {
                    if (!sender) {
                      _npmlog2.default.verbose(LOG_PREFIX, 'Can not find sender for push type ' + pushType + ', ' + data);
                      var results = devices.map(function (device) {
                        return Promise.resolve({
                          device: device,
                          transmitted: false,
                          response: { 'error': 'Can not find sender for push type ' + pushType + ', ' + data }
                        });
                      });
                      sendPromises.push(Promise.all(results));
                    } else {
                      sendPromises.push(sender.send(data, devices));
                    }
                  }
                };

                for (pushType in deviceMap) {
                  _loop(pushType);
                }
                _context.next = 6;
                return Promise.all(sendPromises);

              case 6:
                promises = _context.sent;
                return _context.abrupt('return', [].concat.apply([], promises));

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function send(_x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return send;
    }()
  }], [{
    key: 'classifyInstallations',
    value: function classifyInstallations(installations, validTypes) {
      return (0, _PushAdapterUtils.classifyInstallations)(installations, validTypes);
    }
  }]);

  return ParsePushAdapter;
}();

exports.default = ParsePushAdapter;