'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleCallback = undefined;

// Post receipt back to webhook url
var handleCallback = exports.handleCallback = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(webhookurl, pushStatusData) {
    var response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _axios2.default.post(webhookurl, {
              pushStatusData: pushStatusData
            });

          case 3:
            response = _context.sent;

            console.log("Callback request completed", { response: response });
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](0);

            console.error("Callback request failed", { error: _context.t0 });

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 7]]);
  }));

  return function handleCallback(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.classifyInstallations = classifyInstallations;
exports.randomString = randomString;

var _crypto = require('crypto');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**g
   * Classify the device token of installations based on its device type.
   * @param {Object} installations An array of installations
   * @param {Array} validPushTypes An array of valid push types(string)
   * @returns {Object} A map whose key is device type and value is an array of device
   */
function classifyInstallations(installations, validPushTypes) {
  // Init deviceTokenMap, create a empty array for each valid pushType
  var deviceMap = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = validPushTypes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var validPushType = _step.value;

      deviceMap[validPushType] = [];
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

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = installations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var installation = _step2.value;

      // No deviceToken, ignore
      if (!installation.deviceToken) {
        continue;
      }
      var devices = deviceMap[installation.pushType] || deviceMap[installation.deviceType] || null;
      if (Array.isArray(devices)) {
        devices.push({
          deviceToken: installation.deviceToken,
          deviceType: installation.deviceType,
          appIdentifier: installation.appIdentifier
        });
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return deviceMap;
}

function randomString(size) {
  if (size === 0) {
    throw new Error('Zero-length randomString is useless.');
  }
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789';
  var objectId = '';
  var bytes = (0, _crypto.randomBytes)(size);
  for (var i = 0; i < bytes.length; ++i) {
    objectId += chars[bytes.readUInt8(i) % chars.length];
  }
  return objectId;
}