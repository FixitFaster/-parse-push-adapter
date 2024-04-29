"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _expoServerSdk = require("expo-server-sdk");

var _npmlog = require("npmlog");

var _npmlog2 = _interopRequireDefault(_npmlog);

var _PushAdapterUtils = require("../PushAdapterUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LOG_PREFIX = "parse-server-push-adapter EXPO";
var EXPOTimeToLiveMax = 4 * 7 * 24 * 60 * 60; // GCM allows a max of 4 weeks

var EXPO = function () {
  function EXPO(args) {
    _classCallCheck(this, EXPO);

    this.sender = new _expoServerSdk.Expo();
    this.webhookurl = args.webhookurl;
  }

  _createClass(EXPO, [{
    key: "send",
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data, devices) {
        var _this = this;

        var expirationTime, messages, devicesMap, deviceTokens, promises, registrationTokens, length, notificationData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, pushToken, chunks, tickets, receiptIds, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, ticket, receiptIdChunks, result;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                devices = devices.slice(0);
                expirationTime = void 0;
                // We handle the expiration_time convertion in push.js, so expiration_time is a valid date
                // in Unix epoch time in milliseconds here

                if (data["expiration_time"]) {
                  expirationTime = data["expiration_time"];
                }

                messages = [];

                // Build a device map

                devicesMap = devices.reduce(function (memo, device) {
                  memo[device.deviceToken] = device;
                  return memo;
                }, {});
                deviceTokens = Object.keys(devicesMap);
                promises = deviceTokens.map(function (token) {
                  return new Promise(function (resolve, _reject) {
                    return resolve(token);
                  });
                });
                registrationTokens = deviceTokens;
                length = registrationTokens.length;

                _npmlog2.default.verbose(LOG_PREFIX, "sending to " + length + " " + (length > 1 ? "devices" : "device"));
                notificationData = {
                  body: data.data.alert,
                  title: data.data.title,
                  badge: data.data.badge ? data.data.badge : 1,
                  data: data.data
                };
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context3.prev = 14;
                _iterator = registrationTokens[Symbol.iterator]();

              case 16:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context3.next = 25;
                  break;
                }

                pushToken = _step.value;

                if (_expoServerSdk.Expo.isExpoPushToken(pushToken)) {
                  _context3.next = 21;
                  break;
                }

                console.error("Push token " + pushToken + " is not a valid Expo push token");
                return _context3.abrupt("continue", 22);

              case 21:
                messages.push({
                  to: pushToken,
                  sound: "default",
                  body: notificationData.body,
                  title: notificationData.title,
                  badge: notificationData.badge,
                  data: notificationData,
                  ttl: EXPOTimeToLiveMax,
                  priority: "high",
                  channelId: "fif-notifications",
                  "content-available": 1,
                  user: devicesMap[pushToken] && devicesMap[pushToken].user ? devicesMap[pushToken].user : "NA"
                });

              case 22:
                _iteratorNormalCompletion = true;
                _context3.next = 16;
                break;

              case 25:
                _context3.next = 31;
                break;

              case 27:
                _context3.prev = 27;
                _context3.t0 = _context3["catch"](14);
                _didIteratorError = true;
                _iteratorError = _context3.t0;

              case 31:
                _context3.prev = 31;
                _context3.prev = 32;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 34:
                _context3.prev = 34;

                if (!_didIteratorError) {
                  _context3.next = 37;
                  break;
                }

                throw _iteratorError;

              case 37:
                return _context3.finish(34);

              case 38:
                return _context3.finish(31);

              case 39:
                chunks = this.sender.chunkPushNotifications(messages);
                tickets = [];

                _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                  var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, chunkList, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, chunk, ticketChunk;

                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _iteratorNormalCompletion2 = true;
                          _didIteratorError2 = false;
                          _iteratorError2 = undefined;
                          _context.prev = 3;
                          _iterator2 = chunks[Symbol.iterator]();

                        case 5:
                          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                            _context.next = 44;
                            break;
                          }

                          chunkList = _step2.value;
                          _iteratorNormalCompletion3 = true;
                          _didIteratorError3 = false;
                          _iteratorError3 = undefined;
                          _context.prev = 10;
                          _iterator3 = chunkList[Symbol.iterator]();

                        case 12:
                          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                            _context.next = 27;
                            break;
                          }

                          chunk = _step3.value;
                          _context.prev = 14;
                          _context.next = 17;
                          return _this.sender.sendPushNotificationsAsync([chunk]);

                        case 17:
                          ticketChunk = _context.sent;

                          //Post Reciepts to callback
                          if (ticketChunk.length) {
                            tickets.push(_extends({}, ticketChunk[0], chunk));
                          }
                          _context.next = 24;
                          break;

                        case 21:
                          _context.prev = 21;
                          _context.t0 = _context["catch"](14);

                          console.error(_context.t0);

                        case 24:
                          _iteratorNormalCompletion3 = true;
                          _context.next = 12;
                          break;

                        case 27:
                          _context.next = 33;
                          break;

                        case 29:
                          _context.prev = 29;
                          _context.t1 = _context["catch"](10);
                          _didIteratorError3 = true;
                          _iteratorError3 = _context.t1;

                        case 33:
                          _context.prev = 33;
                          _context.prev = 34;

                          if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                          }

                        case 36:
                          _context.prev = 36;

                          if (!_didIteratorError3) {
                            _context.next = 39;
                            break;
                          }

                          throw _iteratorError3;

                        case 39:
                          return _context.finish(36);

                        case 40:
                          return _context.finish(33);

                        case 41:
                          _iteratorNormalCompletion2 = true;
                          _context.next = 5;
                          break;

                        case 44:
                          _context.next = 50;
                          break;

                        case 46:
                          _context.prev = 46;
                          _context.t2 = _context["catch"](3);
                          _didIteratorError2 = true;
                          _iteratorError2 = _context.t2;

                        case 50:
                          _context.prev = 50;
                          _context.prev = 51;

                          if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                          }

                        case 53:
                          _context.prev = 53;

                          if (!_didIteratorError2) {
                            _context.next = 56;
                            break;
                          }

                          throw _iteratorError2;

                        case 56:
                          return _context.finish(53);

                        case 57:
                          return _context.finish(50);

                        case 58:
                          if (tickets.length) {
                            (0, _PushAdapterUtils.handleCallback)(_this.webhookurl, tickets);
                          }

                        case 59:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee, _this, [[3, 46, 50, 58], [10, 29, 33, 41], [14, 21], [34,, 36, 40], [51,, 53, 57]]);
                }))();

                receiptIds = [];
                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _iteratorError4 = undefined;
                _context3.prev = 46;

                for (_iterator4 = tickets[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  ticket = _step4.value;

                  if (ticket.id) {
                    receiptIds.push(ticket.id);
                  }
                }

                _context3.next = 54;
                break;

              case 50:
                _context3.prev = 50;
                _context3.t1 = _context3["catch"](46);
                _didIteratorError4 = true;
                _iteratorError4 = _context3.t1;

              case 54:
                _context3.prev = 54;
                _context3.prev = 55;

                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }

              case 57:
                _context3.prev = 57;

                if (!_didIteratorError4) {
                  _context3.next = 60;
                  break;
                }

                throw _iteratorError4;

              case 60:
                return _context3.finish(57);

              case 61:
                return _context3.finish(54);

              case 62:
                receiptIdChunks = this.sender.chunkPushNotificationReceiptIds(receiptIds);

                _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                  var _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, chunk, receipts, _loop, key;

                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _iteratorNormalCompletion5 = true;
                          _didIteratorError5 = false;
                          _iteratorError5 = undefined;
                          _context2.prev = 3;
                          _iterator5 = receiptIdChunks[Symbol.iterator]();

                        case 5:
                          if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                            _context2.next = 22;
                            break;
                          }

                          chunk = _step5.value;
                          _context2.prev = 7;
                          _context2.next = 10;
                          return _this.sender.getPushNotificationReceiptsAsync(chunk);

                        case 10:
                          receipts = _context2.sent;

                          console.log(receipts);

                          // The receipts specify whether Apple or Google successfully received the
                          // notification and information about an error, if one occurred.

                          _loop = function _loop(key) {
                            var receipt = receipts[key];
                            new Promise(function (resolve, reject) {
                              var device = devicesMap[token];
                              device.deviceType = "expo";
                              var resolution = {
                                device: device,
                                multicast_id: "multicast_id",
                                response: receipt,
                                transmitted: receipt.status !== "error"
                              };

                              if (receipt.status === "error") {
                                reject(resolution); // Rejecting the promise if there's an error
                              } else {
                                resolve(resolution); // Resolving the promise with the resolution object
                              }
                            });
                          };

                          for (key in receipts) {
                            _loop(key);
                          }
                          _context2.next = 19;
                          break;

                        case 16:
                          _context2.prev = 16;
                          _context2.t0 = _context2["catch"](7);

                          console.error(_context2.t0);

                        case 19:
                          _iteratorNormalCompletion5 = true;
                          _context2.next = 5;
                          break;

                        case 22:
                          _context2.next = 28;
                          break;

                        case 24:
                          _context2.prev = 24;
                          _context2.t1 = _context2["catch"](3);
                          _didIteratorError5 = true;
                          _iteratorError5 = _context2.t1;

                        case 28:
                          _context2.prev = 28;
                          _context2.prev = 29;

                          if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                          }

                        case 31:
                          _context2.prev = 31;

                          if (!_didIteratorError5) {
                            _context2.next = 34;
                            break;
                          }

                          throw _iteratorError5;

                        case 34:
                          return _context2.finish(31);

                        case 35:
                          return _context2.finish(28);

                        case 36:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2, _this, [[3, 24, 28, 36], [7, 16], [29,, 31, 35]]);
                }))();

                _context3.next = 66;
                return Promise.all(promises);

              case 66:
                result = _context3.sent;

                console.log("result", result);
                return _context3.abrupt("return", result);

              case 69:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[14, 27, 31, 39], [32,, 34, 38], [46, 50, 54, 62], [55,, 57, 61]]);
      }));

      function send(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return send;
    }()
  }]);

  return EXPO;
}();

exports.default = EXPO;