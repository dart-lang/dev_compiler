'use strict';
require("./_debugger");
require("./html_common");
require("./html");
require("./_metadata");
require("./js");
require("./_js_mirrors");
require("./mirrors");
require("./convert");
require("./_js_primitives");
require("./_isolate_helper");
require("./_native_typed_data");
require("./typed_data");
require("./isolate");
require("./_js_helper");
require("./_js_embedded_names");
require("./_foreign_helper");
require("./async");
require("./_interceptors");
require("./math");
require("./_internal");
require("./collection");
require("./core");
let dart = require("./_runtime");
let _js_helper = require("./_js_helper");
let _interceptors = require("./_interceptors");
let _internal = require("./_internal");
let collection = require("./collection");
let convert = require("./convert");
let dartx = dart.dartx;
class Object {
  constructor() {
    let name = this.constructor.name;
    let result = void 0;
    if (name in this) result = this[name](...arguments);
    return result === void 0 ? this : result;
  }
  get hashCode() {
    return _js_helper.Primitives.objectHashCode(this);
  }
  toString() {
    return _js_helper.Primitives.objectToString(this);
  }
  noSuchMethod(invocation) {
    dart.throw(new NoSuchMethodError(this, invocation.memberName, invocation.positionalArguments, invocation.namedArguments));
  }
}
dart.setSignature(Object, {
  constructors: () => ({Object: [Object, []]}),
  methods: () => ({
    toString: [String, []],
    noSuchMethod: [dart.dynamic, [Invocation]]
  })
});
dart.defineExtensionNames([
  'toString'
]);
class bool extends Object {
  toString() {
    return this ? "true" : "false";
  }
}
const Comparator$ = dart.generic(function(T) {
  const Comparator = dart.typedef('Comparator', () => dart.functionType(int, [T, T]));
  return Comparator;
});
let Comparator = Comparator$();
const Comparable$ = dart.generic(function(T) {
  class Comparable extends Object {
    static compare(a, b) {
      return a[dartx.compareTo](b);
    }
  }
  dart.setSignature(Comparable, {
    statics: () => ({compare: [int, [Comparable$(), Comparable$()]]}),
    names: ['compare']
  });
  return Comparable;
});
let Comparable = Comparable$();
class DateTime extends Object {
  DateTime(year, month, day, hour, minute, second, millisecond) {
    if (month === void 0) month = 1;
    if (day === void 0) day = 1;
    if (hour === void 0) hour = 0;
    if (minute === void 0) minute = 0;
    if (second === void 0) second = 0;
    if (millisecond === void 0) millisecond = 0;
    this._internal(year, month, day, hour, minute, second, millisecond, false);
  }
  static parse(formattedString) {
    let re = RegExp.new('^([+-]?\\d{4,6})-?(\\d\\d)-?(\\d\\d)' + '(?:[ T](\\d\\d)(?::?(\\d\\d)(?::?(\\d\\d)(.\\d{1,6})?)?)?' + '( ?[zZ]| ?([-+])(\\d\\d)(?::?(\\d\\d))?)?)?$');
    let match = re.firstMatch(formattedString);
    if (match != null) {
      function parseIntOrZero(matched) {
        if (matched == null) return 0;
        return int.parse(matched);
      }
      dart.fn(parseIntOrZero, int, [String]);
      function parseDoubleOrZero(matched) {
        if (matched == null) return 0.0;
        return double.parse(matched);
      }
      dart.fn(parseDoubleOrZero, double, [String]);
      let years = int.parse(match.get(1));
      let month = int.parse(match.get(2));
      let day = int.parse(match.get(3));
      let hour = parseIntOrZero(match.get(4));
      let minute = parseIntOrZero(match.get(5));
      let second = parseIntOrZero(match.get(6));
      let addOneMillisecond = false;
      let millisecond = (dart.notNull(parseDoubleOrZero(match.get(7))) * 1000)[dartx.round]();
      if (millisecond == 1000) {
        addOneMillisecond = true;
        millisecond = 999;
      }
      let isUtc = false;
      if (match.get(8) != null) {
        isUtc = true;
        if (match.get(9) != null) {
          let sign = match.get(9) == '-' ? -1 : 1;
          let hourDifference = int.parse(match.get(10));
          let minuteDifference = parseIntOrZero(match.get(11));
          minuteDifference = dart.notNull(minuteDifference) + 60 * dart.notNull(hourDifference);
          minute = dart.notNull(minute) - sign * dart.notNull(minuteDifference);
        }
      }
      let millisecondsSinceEpoch = DateTime._brokenDownDateToMillisecondsSinceEpoch(years, month, day, hour, minute, second, millisecond, isUtc);
      if (millisecondsSinceEpoch == null) {
        dart.throw(new FormatException("Time out of range", formattedString));
      }
      if (addOneMillisecond) {
        millisecondsSinceEpoch = dart.notNull(millisecondsSinceEpoch) + 1;
      }
      return new DateTime.fromMillisecondsSinceEpoch(millisecondsSinceEpoch, {isUtc: isUtc});
    } else {
      dart.throw(new FormatException("Invalid date format", formattedString));
    }
  }
  fromMillisecondsSinceEpoch(millisecondsSinceEpoch, {isUtc = false} = {}) {
    this.millisecondsSinceEpoch = millisecondsSinceEpoch;
    this.isUtc = isUtc;
    if (dart.notNull(millisecondsSinceEpoch[dartx.abs]()) > dart.notNull(DateTime._MAX_MILLISECONDS_SINCE_EPOCH)) {
      dart.throw(new ArgumentError(millisecondsSinceEpoch));
    }
    if (isUtc == null) dart.throw(new ArgumentError(isUtc));
  }
  isBefore(other) {
    return dart.notNull(this.millisecondsSinceEpoch) < dart.notNull(other.millisecondsSinceEpoch);
  }
  isAfter(other) {
    return dart.notNull(this.millisecondsSinceEpoch) > dart.notNull(other.millisecondsSinceEpoch);
  }
  isAtSameMomentAs(other) {
    return this.millisecondsSinceEpoch == other.millisecondsSinceEpoch;
  }
  compareTo(other) {
    return this.millisecondsSinceEpoch[dartx.compareTo](other.millisecondsSinceEpoch);
  }
  get hashCode() {
    return this.millisecondsSinceEpoch;
  }
  toLocal() {
    if (dart.notNull(this.isUtc)) {
      return new DateTime.fromMillisecondsSinceEpoch(this.millisecondsSinceEpoch, {isUtc: false});
    }
    return this;
  }
  toUtc() {
    if (dart.notNull(this.isUtc)) return this;
    return new DateTime.fromMillisecondsSinceEpoch(this.millisecondsSinceEpoch, {isUtc: true});
  }
  toString() {
    let y = DateTime._fourDigits(this.year);
    let m = DateTime._twoDigits(this.month);
    let d = DateTime._twoDigits(this.day);
    let h = DateTime._twoDigits(this.hour);
    let min = DateTime._twoDigits(this.minute);
    let sec = DateTime._twoDigits(this.second);
    let ms = DateTime._threeDigits(this.millisecond);
    if (dart.notNull(this.isUtc)) {
      return `${y}-${m}-${d} ${h}:${min}:${sec}.${ms}Z`;
    } else {
      return `${y}-${m}-${d} ${h}:${min}:${sec}.${ms}`;
    }
  }
  add(duration) {
    let ms = this.millisecondsSinceEpoch;
    return new DateTime.fromMillisecondsSinceEpoch(dart.notNull(ms) + dart.notNull(duration.inMilliseconds), {isUtc: this.isUtc});
  }
  subtract(duration) {
    let ms = this.millisecondsSinceEpoch;
    return new DateTime.fromMillisecondsSinceEpoch(dart.notNull(ms) - dart.notNull(duration.inMilliseconds), {isUtc: this.isUtc});
  }
  difference(other) {
    let ms = this.millisecondsSinceEpoch;
    let otherMs = other.millisecondsSinceEpoch;
    return new Duration({milliseconds: dart.notNull(ms) - dart.notNull(otherMs)});
  }
  _internal(year, month, day, hour, minute, second, millisecond, isUtc) {
    this.isUtc = typeof isUtc == 'boolean' ? isUtc : dart.throw(new ArgumentError(isUtc));
    this.millisecondsSinceEpoch = dart.as(_js_helper.checkInt(_js_helper.Primitives.valueFromDecomposedDate(year, month, day, hour, minute, second, millisecond, isUtc)), int);
  }
  _now() {
    this.isUtc = false;
    this.millisecondsSinceEpoch = _js_helper.Primitives.dateNow();
  }
  get timeZoneName() {
    if (dart.notNull(this.isUtc)) return "UTC";
    return _js_helper.Primitives.getTimeZoneName(this);
  }
  get timeZoneOffset() {
    if (dart.notNull(this.isUtc)) return new Duration();
    return new Duration({minutes: _js_helper.Primitives.getTimeZoneOffsetInMinutes(this)});
  }
}
DateTime[dart.implements] = () => [Comparable];
dart.defineNamedConstructor(DateTime, 'fromMillisecondsSinceEpoch');
dart.defineNamedConstructor(DateTime, '_internal');
dart.defineNamedConstructor(DateTime, '_now');
dart.setSignature(DateTime, {
  constructors: () => ({
    DateTime: [DateTime, [int], [int, int, int, int, int, int]],
    fromMillisecondsSinceEpoch: [DateTime, [int], {isUtc: bool}],
    _internal: [DateTime, [int, int, int, int, int, int, int, bool]],
    _now: [DateTime, []]
  }),
  methods: () => ({
    isBefore: [bool, [DateTime]],
    isAfter: [bool, [DateTime]],
    isAtSameMomentAs: [bool, [DateTime]],
    compareTo: [int, [DateTime]],
    toLocal: [DateTime, []],
    toUtc: [DateTime, []],
    add: [DateTime, [Duration]],
    subtract: [DateTime, [Duration]],
    difference: [Duration, [DateTime]]
  }),
  statics: () => ({parse: [DateTime, [String]]}),
  names: ['parse']
});
dart.defineExtensionMembers(DateTime, ['compareTo']);
DateTime.MONDAY = 1;
DateTime.FRIDAY = 5;
DateTime.JANUARY = 1;
DateTime.AUGUST = 8;
DateTime._MAX_MILLISECONDS_SINCE_EPOCH = 8640000000000000;
class num extends Object {
  static parse(input, onError) {
    if (onError === void 0) onError = null;
    let source = input[dartx.trim]();
    num._parseError = false;
    let result = int.parse(source, {onError: num._onParseErrorInt});
    if (!dart.notNull(num._parseError)) return result;
    num._parseError = false;
    result = double.parse(source, num._onParseErrorDouble);
    if (!dart.notNull(num._parseError)) return result;
    if (onError == null) dart.throw(new FormatException(input));
    return onError(input);
  }
}
num[dart.implements] = () => [Comparable$(num)];
dart.setSignature(num, {
  statics: () => ({parse: [num, [String], [dart.functionType(num, [String])]]}),
  names: ['parse']
});
class double extends num {
  static parse(source, onError) {
    if (onError === void 0) onError = null;
    return _js_helper.Primitives.parseDouble(source, onError);
  }
}
dart.setSignature(double, {
  statics: () => ({parse: [double, [String], [dart.functionType(double, [String])]]}),
  names: ['parse']
});
const _duration = dart.JsSymbol('_duration');
class Duration extends Object {
  Duration({days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0, microseconds = 0} = {}) {
    this._microseconds(dart.notNull(days) * dart.notNull(Duration.MICROSECONDS_PER_DAY) + dart.notNull(hours) * dart.notNull(Duration.MICROSECONDS_PER_HOUR) + dart.notNull(minutes) * dart.notNull(Duration.MICROSECONDS_PER_MINUTE) + dart.notNull(seconds) * dart.notNull(Duration.MICROSECONDS_PER_SECOND) + dart.notNull(milliseconds) * dart.notNull(Duration.MICROSECONDS_PER_MILLISECOND) + dart.notNull(microseconds));
  }
  _microseconds(duration) {
    this[_duration] = duration;
  }
  get inDays() {
    return (dart.notNull(this[_duration]) / dart.notNull(Duration.MICROSECONDS_PER_DAY))[dartx.truncate]();
  }
  get inMilliseconds() {
    return (dart.notNull(this[_duration]) / dart.notNull(Duration.MICROSECONDS_PER_MILLISECOND))[dartx.truncate]();
  }
  get hashCode() {
    return dart.hashCode(this[_duration]);
  }
  compareTo(other) {
    return this[_duration][dartx.compareTo](other[_duration]);
  }
  toString() {
    function sixDigits(n) {
      if (dart.notNull(n) >= 100000) return `${n}`;
      if (dart.notNull(n) >= 10000) return `0${n}`;
      if (dart.notNull(n) >= 1000) return `00${n}`;
      if (dart.notNull(n) >= 100) return `000${n}`;
      if (dart.notNull(n) >= 10) return `0000${n}`;
      return `00000${n}`;
    }
    dart.fn(sixDigits, String, [int]);
    function twoDigits(n) {
      if (dart.notNull(n) >= 10) return `${n}`;
      return `0${n}`;
    }
    dart.fn(twoDigits, String, [int]);
    if (dart.notNull(this.inMicroseconds) < 0) {
      return `-${this['unary-']()}`;
    }
    let twoDigitMinutes = twoDigits(dart.asInt(this.inMinutes[dartx.remainder](Duration.MINUTES_PER_HOUR)));
    let twoDigitSeconds = twoDigits(dart.asInt(this.inSeconds[dartx.remainder](Duration.SECONDS_PER_MINUTE)));
    let sixDigitUs = sixDigits(dart.asInt(this.inMicroseconds[dartx.remainder](Duration.MICROSECONDS_PER_SECOND)));
    return `${this.inHours}:${twoDigitMinutes}:${twoDigitSeconds}.${sixDigitUs}`;
  }
  abs() {
    return new Duration._microseconds(this[_duration][dartx.abs]());
  }
}
Duration[dart.implements] = () => [Comparable$(Duration)];
dart.defineNamedConstructor(Duration, '_microseconds');
dart.setSignature(Duration, {
  constructors: () => ({
    Duration: [Duration, [], {days: int, hours: int, minutes: int, seconds: int, milliseconds: int, microseconds: int}],
    _microseconds: [Duration, [int]]
  }),
  methods: () => ({
    compareTo: [int, [Duration]],
    abs: [Duration, []]
  })
});
dart.defineExtensionMembers(Duration, ['compareTo']);
Duration.MICROSECONDS_PER_MILLISECOND = 1000;
Duration.MILLISECONDS_PER_SECOND = 1000;
Duration.SECONDS_PER_MINUTE = 60;
Duration.MINUTES_PER_HOUR = 60;
Duration.HOURS_PER_DAY = 24;
dart.defineLazyProperties(Duration, {
  get MICROSECONDS_PER_SECOND() {
    return dart.notNull(Duration.MICROSECONDS_PER_MILLISECOND) * dart.notNull(Duration.MILLISECONDS_PER_SECOND);
  },
  get MICROSECONDS_PER_MINUTE() {
    return dart.notNull(Duration.MICROSECONDS_PER_SECOND) * dart.notNull(Duration.SECONDS_PER_MINUTE);
  },
  get MICROSECONDS_PER_HOUR() {
    return dart.notNull(Duration.MICROSECONDS_PER_MINUTE) * dart.notNull(Duration.MINUTES_PER_HOUR);
  },
  get MICROSECONDS_PER_DAY() {
    return dart.notNull(Duration.MICROSECONDS_PER_HOUR) * dart.notNull(Duration.HOURS_PER_DAY);
  },
  get ZERO() {
    return dart.const(new Duration({seconds: 0}));
  }
});
class Error extends Object {
  Error() {
  }
  get stackTrace() {
    return _js_helper.Primitives.extractStackTrace(this);
  }
}
dart.setSignature(Error, {
  constructors: () => ({Error: [Error, []]})
});
class AssertionError extends Error {
  AssertionError() {
    super.Error();
  }
}
class CastError extends Error {
  CastError() {
    super.Error();
  }
}
class NullThrownError extends Error {
  NullThrownError() {
    super.Error();
  }
  toString() {
    return "Throw of null.";
  }
}
const _hasValue = dart.JsSymbol('_hasValue');
class ArgumentError extends Error {
  ArgumentError(message) {
    if (message === void 0) message = null;
    this.message = message;
    this.invalidValue = null;
    this[_hasValue] = false;
    this.name = null;
    super.Error();
  }
  value(value, name, message) {
    if (name === void 0) name = null;
    if (message === void 0) message = "Invalid argument";
    this.name = name;
    this.message = message;
    this.invalidValue = value;
    this[_hasValue] = true;
    super.Error();
  }
  toString() {
    if (!dart.notNull(this[_hasValue])) {
      let result = "Invalid arguments(s)";
      if (this.message != null) {
        result = `${result}: ${this.message}`;
      }
      return result;
    }
    let nameString = "";
    if (this.name != null) {
      nameString = ` (${this.name})`;
    }
    return `${this.message}${nameString}: ${Error.safeToString(this.invalidValue)}`;
  }
}
dart.defineNamedConstructor(ArgumentError, 'value');
dart.setSignature(ArgumentError, {
  constructors: () => ({
    ArgumentError: [ArgumentError, [], [dart.dynamic]],
    value: [ArgumentError, [dart.dynamic], [String, String]]
  })
});
class RangeError extends ArgumentError {
  RangeError(message) {
    this.start = null;
    this.end = null;
    super.ArgumentError(message);
  }
  range(invalidValue, minValue, maxValue, name, message) {
    if (name === void 0) name = null;
    if (message === void 0) message = null;
    this.start = minValue;
    this.end = maxValue;
    super.value(invalidValue, name, message != null ? message : "Invalid value");
  }
  static index(index, indexable, name, message, length) {
    return new IndexError(index, indexable, name, message, length);
  }
  static checkValidRange(start, end, length, startName, endName, message) {
    if (startName === void 0) startName = null;
    if (endName === void 0) endName = null;
    if (message === void 0) message = null;
    if (dart.notNull(start) < 0 || dart.notNull(start) > dart.notNull(length)) {
      if (startName == null) startName = "start";
      dart.throw(new RangeError.range(start, 0, length, startName, message));
    }
    if (end != null && (dart.notNull(end) < dart.notNull(start) || dart.notNull(end) > dart.notNull(length))) {
      if (endName == null) endName = "end";
      dart.throw(new RangeError.range(end, start, length, endName, message));
    }
  }
  toString() {
    if (!dart.notNull(this[_hasValue])) return `RangeError: ${this.message}`;
    let value = Error.safeToString(this.invalidValue);
    let explanation = "";
    if (this.start == null) {
      if (this.end != null) {
        explanation = `: Not less than or equal to ${this.end}`;
      }
    } else if (this.end == null) {
      explanation = `: Not greater than or equal to ${this.start}`;
    } else if (dart.notNull(this.end) > dart.notNull(this.start)) {
      explanation = `: Not in range ${this.start}..${this.end}, inclusive.`;
    } else if (dart.notNull(this.end) < dart.notNull(this.start)) {
      explanation = ": Valid value range is empty";
    } else {
      explanation = `: Only valid value is ${this.start}`;
    }
    return `RangeError: ${this.message} (${value})${explanation}`;
  }
}
dart.defineNamedConstructor(RangeError, 'range');
dart.setSignature(RangeError, {
  constructors: () => ({
    RangeError: [RangeError, [dart.dynamic]],
    range: [RangeError, [num, int, int], [String, String]],
    index: [RangeError, [int, dart.dynamic], [String, String, int]]
  }),
  statics: () => ({checkValidRange: [dart.void, [int, int, int], [String, String, String]]}),
  names: ['checkValidRange']
});
class IndexError extends ArgumentError {
  IndexError(invalidValue, indexable, name, message, length) {
    if (name === void 0) name = null;
    if (message === void 0) message = null;
    if (length === void 0) length = null;
    this.indexable = indexable;
    this.length = dart.as(length != null ? length : dart.dload(indexable, 'length'), int);
    super.value(invalidValue, name, message != null ? message : "Index out of range");
  }
  get start() {
    return 0;
  }
  get end() {
    return dart.notNull(this.length) - 1;
  }
  toString() {
    dart.assert(this[_hasValue]);
    let target = Error.safeToString(this.indexable);
    let explanation = `index should be less than ${this.length}`;
    if (dart.notNull(dart.as(dart.dsend(this.invalidValue, '<', 0), bool))) {
      explanation = "index must not be negative";
    }
    return `RangeError: ${this.message} (${target}[${this.invalidValue}]): ${explanation}`;
  }
}
IndexError[dart.implements] = () => [RangeError];
dart.setSignature(IndexError, {
  constructors: () => ({IndexError: [IndexError, [int, dart.dynamic], [String, String, int]]})
});
const _receiver = dart.JsSymbol('_receiver');
const _memberName = dart.JsSymbol('_memberName');
const _arguments = dart.JsSymbol('_arguments');
const _namedArguments = dart.JsSymbol('_namedArguments');
const _existingArgumentNames = dart.JsSymbol('_existingArgumentNames');
class NoSuchMethodError extends Error {
  NoSuchMethodError(receiver, memberName, positionalArguments, namedArguments, existingArgumentNames) {
    if (existingArgumentNames === void 0) existingArgumentNames = null;
    this[_receiver] = receiver;
    this[_memberName] = memberName;
    this[_arguments] = positionalArguments;
    this[_namedArguments] = namedArguments;
    this[_existingArgumentNames] = existingArgumentNames;
    super.Error();
  }
  toString() {
    let sb = new StringBuffer();
    let i = 0;
    if (this[_arguments] != null) {
      for (; i < dart.notNull(this[_arguments][dartx.length]); i++) {
        if (i > 0) {
          sb.write(", ");
        }
        sb.write(Error.safeToString(this[_arguments][dartx.get](i)));
      }
    }
    if (this[_namedArguments] != null) {
      this[_namedArguments].forEach(dart.fn((key, value) => {
        if (i > 0) {
          sb.write(", ");
        }
        sb.write(_symbolToString(key));
        sb.write(": ");
        sb.write(Error.safeToString(value));
        i++;
      }, dart.void, [Symbol, dart.dynamic]));
    }
    if (this[_existingArgumentNames] == null) {
      return `NoSuchMethodError : method not found: '${this[_memberName]}'\n` + `Receiver: ${Error.safeToString(this[_receiver])}\n` + `Arguments: [${sb}]`;
    } else {
      let actualParameters = dart.toString(sb);
      sb = new StringBuffer();
      for (let i = 0; i < dart.notNull(this[_existingArgumentNames][dartx.length]); i++) {
        if (i > 0) {
          sb.write(", ");
        }
        sb.write(this[_existingArgumentNames][dartx.get](i));
      }
      let formalParameters = dart.toString(sb);
      return "NoSuchMethodError: incorrect number of arguments passed to " + `method named '${this[_memberName]}'\n` + `Receiver: ${Error.safeToString(this[_receiver])}\n` + `Tried calling: ${this[_memberName]}(${actualParameters})\n` + `Found: ${this[_memberName]}(${formalParameters})`;
    }
  }
}
dart.setSignature(NoSuchMethodError, {
  constructors: () => ({NoSuchMethodError: [NoSuchMethodError, [Object, Symbol, List, Map$(Symbol, dart.dynamic)], [List]]})
});
class UnsupportedError extends Error {
  UnsupportedError(message) {
    this.message = message;
    super.Error();
  }
  toString() {
    return `Unsupported operation: ${this.message}`;
  }
}
dart.setSignature(UnsupportedError, {
  constructors: () => ({UnsupportedError: [UnsupportedError, [String]]})
});
class StateError extends Error {
  StateError(message) {
    this.message = message;
    super.Error();
  }
  toString() {
    return `Bad state: ${this.message}`;
  }
}
dart.setSignature(StateError, {
  constructors: () => ({StateError: [StateError, [String]]})
});
class ConcurrentModificationError extends Error {
  ConcurrentModificationError(modifiedObject) {
    if (modifiedObject === void 0) modifiedObject = null;
    this.modifiedObject = modifiedObject;
    super.Error();
  }
  toString() {
    if (this.modifiedObject == null) {
      return "Concurrent modification during iteration.";
    }
    return "Concurrent modification during iteration: " + `${Error.safeToString(this.modifiedObject)}.`;
  }
}
dart.setSignature(ConcurrentModificationError, {
  constructors: () => ({ConcurrentModificationError: [ConcurrentModificationError, [], [Object]]})
});
class Exception extends Object {
  static new(message) {
    if (message === void 0) message = null;
    return new _ExceptionImplementation(message);
  }
}
dart.setSignature(Exception, {
  constructors: () => ({new: [Exception, [], [dart.dynamic]]})
});
class _ExceptionImplementation extends Object {
  _ExceptionImplementation(message) {
    if (message === void 0) message = null;
    this.message = message;
  }
  toString() {
    if (this.message == null) return "Exception";
    return `Exception: ${this.message}`;
  }
}
_ExceptionImplementation[dart.implements] = () => [Exception];
dart.setSignature(_ExceptionImplementation, {
  constructors: () => ({_ExceptionImplementation: [_ExceptionImplementation, [], [dart.dynamic]]})
});
class FormatException extends Object {
  FormatException(message, source, offset) {
    if (message === void 0) message = "";
    if (source === void 0) source = null;
    if (offset === void 0) offset = -1;
    this.message = message;
    this.source = source;
    this.offset = offset;
  }
  toString() {
    let report = "FormatException";
    if (this.message != null && "" != this.message) {
      report = `${report}: ${this.message}`;
    }
    let offset = this.offset;
    if (!(typeof this.source == 'string')) {
      if (offset != -1) {
        report = report + ` (at offset ${offset})`;
      }
      return report;
    }
    if (offset != -1 && (dart.notNull(offset) < 0 || dart.notNull(offset) > dart.notNull(dart.as(dart.dload(this.source, 'length'), num)))) {
      offset = -1;
    }
    if (offset == -1) {
      let source = dart.as(this.source, String);
      if (dart.notNull(source[dartx.length]) > 78) {
        source = dart.notNull(source[dartx.substring](0, 75)) + "...";
      }
      return `${report}\n${source}`;
    }
    let lineNum = 1;
    let lineStart = 0;
    let lastWasCR = null;
    for (let i = 0; i < dart.notNull(offset); i++) {
      let char = dart.as(dart.dsend(this.source, 'codeUnitAt', i), int);
      if (char == 10) {
        if (lineStart != i || !dart.notNull(lastWasCR)) {
          lineNum++;
        }
        lineStart = i + 1;
        lastWasCR = false;
      } else if (char == 13) {
        lineNum++;
        lineStart = i + 1;
        lastWasCR = true;
      }
    }
    if (lineNum > 1) {
      report = report + ` (at line ${lineNum}, character ${dart.notNull(offset) - lineStart + 1})\n`;
    } else {
      report = report + ` (at character ${dart.notNull(offset) + 1})\n`;
    }
    let lineEnd = dart.as(dart.dload(this.source, 'length'), int);
    for (let i = offset; dart.notNull(i) < dart.notNull(dart.as(dart.dload(this.source, 'length'), num)); i = dart.notNull(i) + 1) {
      let char = dart.as(dart.dsend(this.source, 'codeUnitAt', i), int);
      if (char == 10 || char == 13) {
        lineEnd = i;
        break;
      }
    }
    let length = dart.notNull(lineEnd) - lineStart;
    let start = lineStart;
    let end = lineEnd;
    let prefix = "";
    let postfix = "";
    if (length > 78) {
      let index = dart.notNull(offset) - lineStart;
      if (index < 75) {
        end = start + 75;
        postfix = "...";
      } else if (dart.notNull(end) - dart.notNull(offset) < 75) {
        start = dart.notNull(end) - 75;
        prefix = "...";
      } else {
        start = dart.notNull(offset) - 36;
        end = dart.notNull(offset) + 36;
        prefix = postfix = "...";
      }
    }
    let slice = dart.as(dart.dsend(this.source, 'substring', start, end), String);
    let markOffset = dart.notNull(offset) - start + dart.notNull(prefix[dartx.length]);
    return `${report}${prefix}${slice}${postfix}\n${" "[dartx['*']](markOffset)}^\n`;
  }
}
FormatException[dart.implements] = () => [Exception];
dart.setSignature(FormatException, {
  constructors: () => ({FormatException: [FormatException, [], [String, dart.dynamic, int]]})
});
const _getKey = dart.JsSymbol('_getKey');
const Expando$ = dart.generic(function(T) {
  class Expando extends Object {
    Expando(name) {
      if (name === void 0) name = null;
      this.name = name;
    }
    toString() {
      return `Expando:${this.name}`;
    }
    get(object) {
      let values = _js_helper.Primitives.getProperty(object, Expando$()._EXPANDO_PROPERTY_NAME);
      return dart.as(values == null ? null : _js_helper.Primitives.getProperty(values, this[_getKey]()), T);
    }
    set(object, value) {
      dart.as(value, T);
      let values = _js_helper.Primitives.getProperty(object, Expando$()._EXPANDO_PROPERTY_NAME);
      if (values == null) {
        values = new Object();
        _js_helper.Primitives.setProperty(object, Expando$()._EXPANDO_PROPERTY_NAME, values);
      }
      _js_helper.Primitives.setProperty(values, this[_getKey](), value);
      return value;
    }
  }
  dart.setSignature(Expando, {
    constructors: () => ({Expando: [Expando$(T), [], [String]]}),
    methods: () => ({
      get: [T, [Object]],
      set: [dart.void, [Object, T]]
    })
  });
  return Expando;
});
let Expando = Expando$();
class Function extends Object {
  static apply(f, positionalArguments, namedArguments) {
    if (namedArguments === void 0) namedArguments = null;
    return dart.dcall.apply(null, [f].concat(positionalArguments));
  }
}
dart.setSignature(Function, {
  statics: () => ({apply: [dart.dynamic, [Function, List], [Map$(Symbol, dart.dynamic)]]}),
  names: ['apply']
});
function identical(a, b) {
  return _js_helper.Primitives.identicalImplementation(a, b);
}
dart.fn(identical, bool, [Object, Object]);
function identityHashCode(object) {
  return _js_helper.objectHashCode(object);
}
dart.fn(identityHashCode, () => dart.definiteFunctionType(int, [Object]));
class int extends num {
  static parse(source, {radix = null, onError = null} = {}) {
    return _js_helper.Primitives.parseInt(source, radix, onError);
  }
}
dart.setSignature(int, {
  statics: () => ({parse: [int, [String], {radix: int, onError: dart.functionType(int, [String])}]}),
  names: ['parse']
});
class Invocation extends Object {}
const Iterable$ = dart.generic(function(E) {
  dart.defineExtensionNames([
    'join'
  ]);
  class Iterable extends Object {
    Iterable() {
    }
    [dart.JsSymbol.iterator]() {
      return new dart.JsIterator(this[dartx.iterator]);
    }
    [dartx.join](separator) {
      if (separator === void 0) separator = "";
      let buffer = new StringBuffer();
      buffer.writeAll(this, separator);
      return dart.toString(buffer);
    }
  }
  dart.setSignature(Iterable, {
    constructors: () => ({Iterable: [Iterable$(E), []]}),
    methods: () => ({[dartx.join]: [String, [], [String]]})
  });
  return Iterable;
});
let Iterable = Iterable$();
const _Generator$ = dart.generic(function(E) {
  const _Generator = dart.typedef('_Generator', () => dart.functionType(E, [int]));
  return _Generator;
});
let _Generator = _Generator$();
const BidirectionalIterator$ = dart.generic(function(E) {
  class BidirectionalIterator extends Object {}
  BidirectionalIterator[dart.implements] = () => [Iterator$(E)];
  return BidirectionalIterator;
});
let BidirectionalIterator = BidirectionalIterator$();
const Iterator$ = dart.generic(function(E) {
  class Iterator extends Object {}
  return Iterator;
});
let Iterator = Iterator$();
const List$ = dart.generic(function(E) {
  class List extends Object {
    static new(length) {
      if (length === void 0) length = null;
      let list = null;
      if (length == null) {
        list = [];
      } else {
        if (!(typeof length == 'number') || dart.notNull(length) < 0) {
          dart.throw(new ArgumentError(`Length must be a non-negative integer: ${length}`));
        }
        list = _interceptors.JSArray.markFixedList(dart.as(new Array(length), List$()));
      }
      return _interceptors.JSArray$(E).typed(list);
    }
    static from(elements, {growable = true} = {}) {
      let list = List$(E).new();
      for (let e of elements) {
        list[dartx.add](dart.as(e, E));
      }
      if (dart.notNull(growable)) return list;
      return dart.as(_internal.makeListFixedLength(list), List$(E));
    }
    [dart.JsSymbol.iterator]() {
      return new dart.JsIterator(this[dartx.iterator]);
    }
  }
  List[dart.implements] = () => [Iterable$(E)];
  dart.setSignature(List, {
    constructors: () => ({
      new: [List$(E), [], [int]],
      from: [List$(E), [Iterable], {growable: bool}]
    })
  });
  return List;
});
let List = List$();
const Map$ = dart.generic(function(K, V) {
  class Map extends Object {
    static new() {
      return collection.LinkedHashMap$(K, V).new();
    }
    static identity() {
      return collection.LinkedHashMap$(K, V).identity();
    }
  }
  dart.setSignature(Map, {
    constructors: () => ({
      new: [Map$(K, V), []],
      identity: [Map$(K, V), []]
    })
  });
  return Map;
});
let Map = Map$();
class Null extends Object {
  toString() {
    return "null";
  }
}
class Pattern extends Object {}
function print(object) {
  let line = `${object}`;
  if (_internal.printToZone == null) {
    _internal.printToConsole(line);
  } else {
    dart.dcall(_internal.printToZone, line);
  }
}
dart.fn(print, dart.void, [Object]);
class Match extends Object {}
class RegExp extends Object {
  static new(source, {multiLine = false, caseSensitive = true} = {}) {
    return new _js_helper.JSSyntaxRegExp(source, {multiLine: multiLine, caseSensitive: caseSensitive});
  }
}
RegExp[dart.implements] = () => [Pattern];
dart.setSignature(RegExp, {
  constructors: () => ({new: [RegExp, [String], {multiLine: bool, caseSensitive: bool}]})
});
const Set$ = dart.generic(function(E) {
  class Set extends collection.IterableBase$(E) {
    static new() {
      return collection.LinkedHashSet$(E).new();
    }
    static identity() {
      return collection.LinkedHashSet$(E).identity();
    }
  }
  Set[dart.implements] = () => [_internal.EfficientLength];
  dart.setSignature(Set, {
    constructors: () => ({
      new: [exports.Set$(E), []],
      identity: [exports.Set$(E), []]
    })
  });
  return Set;
});
dart.defineLazyClassGeneric(exports, 'Set', {get: Set$});
const Sink$ = dart.generic(function(T) {
  class Sink extends Object {}
  return Sink;
});
let Sink = Sink$();
class StackTrace extends Object {}
class Stopwatch extends Object {
  Stopwatch() {
    Stopwatch._initTicker();
  }
  static _initTicker() {
    _js_helper.Primitives.initTicker();
    Stopwatch._frequency = _js_helper.Primitives.timerFrequency;
  }
}
dart.setSignature(Stopwatch, {
  constructors: () => ({Stopwatch: [Stopwatch, []]}),
  statics: () => ({_initTicker: [dart.void, []]}),
  names: ['_initTicker']
});
Stopwatch._frequency = null;
class String extends Object {
  static fromCharCodes(charCodes, start, end) {
    if (start === void 0) start = 0;
    if (end === void 0) end = null;
    if (!dart.is(charCodes, _interceptors.JSArray)) {
      return String._stringFromIterable(charCodes, start, end);
    }
    let list = dart.as(charCodes, List);
    let len = list[dartx.length];
    if (dart.notNull(start) < 0 || dart.notNull(start) > dart.notNull(len)) {
      dart.throw(new RangeError.range(start, 0, len));
    }
    if (end == null) {
      end = len;
    } else if (dart.notNull(end) < dart.notNull(start) || dart.notNull(end) > dart.notNull(len)) {
      dart.throw(new RangeError.range(end, start, len));
    }
    if (dart.notNull(start) > 0 || dart.notNull(end) < dart.notNull(len)) {
      list = list[dartx.sublist](start, end);
    }
    return _js_helper.Primitives.stringFromCharCodes(list);
  }
  static fromCharCode(charCode) {
    return _js_helper.Primitives.stringFromCharCode(charCode);
  }
  static _stringFromIterable(charCodes, start, end) {
    if (dart.notNull(start) < 0) dart.throw(new RangeError.range(start, 0, charCodes[dartx.length]));
    if (end != null && dart.notNull(end) < dart.notNull(start)) {
      dart.throw(new RangeError.range(end, start, charCodes[dartx.length]));
    }
    let it = charCodes[dartx.iterator];
    for (let i = 0; i < dart.notNull(start); i++) {
      if (!dart.notNull(it.moveNext())) {
        dart.throw(new RangeError.range(start, 0, i));
      }
    }
    let list = [];
    if (end == null) {
      while (dart.notNull(it.moveNext()))
        list[dartx.add](it.current);
    } else {
      for (let i = start; dart.notNull(i) < dart.notNull(end); i = dart.notNull(i) + 1) {
        if (!dart.notNull(it.moveNext())) {
          dart.throw(new RangeError.range(end, start, i));
        }
        list[dartx.add](it.current);
      }
    }
    return _js_helper.Primitives.stringFromCharCodes(list);
  }
}
String[dart.implements] = () => [Comparable$(String), Pattern];
dart.setSignature(String, {
  constructors: () => ({
    fromCharCodes: [String, [Iterable$(int)], [int, int]],
    fromCharCode: [String, [int]]
  }),
  statics: () => ({_stringFromIterable: [String, [Iterable$(int), int, int]]}),
  names: ['_stringFromIterable']
});
dart.defineLazyClass(exports, {
  get Runes() {
    class Runes extends collection.IterableBase$(int) {
      Runes(string) {
        this.string = string;
        super.IterableBase();
      }
      get iterator() {
        return new RuneIterator(this.string);
      }
      get last() {
        if (this.string[dartx.length] == 0) {
          dart.throw(new StateError('No elements.'));
        }
        let length = this.string[dartx.length];
        let code = this.string[dartx.codeUnitAt](dart.notNull(length) - 1);
        if (dart.notNull(_isTrailSurrogate(code)) && dart.notNull(this.string[dartx.length]) > 1) {
          let previousCode = this.string[dartx.codeUnitAt](dart.notNull(length) - 2);
          if (dart.notNull(_isLeadSurrogate(previousCode))) {
            return _combineSurrogatePair(previousCode, code);
          }
        }
        return code;
      }
    }
    dart.setSignature(Runes, {
      constructors: () => ({Runes: [exports.Runes, [String]]})
    });
    dart.defineExtensionMembers(Runes, ['iterator', 'last']);
    return Runes;
  }
});
const _position = dart.JsSymbol('_position');
const _nextPosition = dart.JsSymbol('_nextPosition');
const _currentCodePoint = dart.JsSymbol('_currentCodePoint');
class RuneIterator extends Object {
  RuneIterator(string) {
    this.string = string;
    this[_position] = 0;
    this[_nextPosition] = 0;
  }
  get current() {
    return dart.asInt(this[_currentCodePoint]);
  }
  moveNext() {
    this[_position] = this[_nextPosition];
    if (this[_position] == this.string[dartx.length]) {
      this[_currentCodePoint] = null;
      return false;
    }
    let codeUnit = this.string[dartx.codeUnitAt](this[_position]);
    let nextPosition = dart.notNull(this[_position]) + 1;
    if (dart.notNull(_isLeadSurrogate(codeUnit)) && nextPosition < dart.notNull(this.string[dartx.length])) {
      let nextCodeUnit = this.string[dartx.codeUnitAt](nextPosition);
      if (dart.notNull(_isTrailSurrogate(nextCodeUnit))) {
        this[_nextPosition] = nextPosition + 1;
        this[_currentCodePoint] = _combineSurrogatePair(codeUnit, nextCodeUnit);
        return true;
      }
    }
    this[_nextPosition] = nextPosition;
    this[_currentCodePoint] = codeUnit;
    return true;
  }
}
RuneIterator[dart.implements] = () => [BidirectionalIterator$(int)];
dart.setSignature(RuneIterator, {
  constructors: () => ({RuneIterator: [RuneIterator, [String]]}),
  methods: () => ({moveNext: [bool, []]})
});
const _contents = dart.JsSymbol('_contents');
const _writeString = dart.JsSymbol('_writeString');
class StringBuffer extends Object {
  StringBuffer(content) {
    if (content === void 0) content = "";
    this[_contents] = `${content}`;
  }
  get length() {
    return this[_contents][dartx.length];
  }
  get isEmpty() {
    return this.length == 0;
  }
  get isNotEmpty() {
    return !dart.notNull(this.isEmpty);
  }
  write(obj) {
    this[_writeString](`${obj}`);
  }
  writeCharCode(charCode) {
    this[_writeString](String.fromCharCode(charCode));
  }
  writeAll(objects, separator) {
    if (separator === void 0) separator = "";
    let iterator = objects[dartx.iterator];
    if (!dart.notNull(iterator.moveNext())) return;
    if (dart.notNull(separator[dartx.isEmpty])) {
      do {
        this.write(iterator.current);
      } while (dart.notNull(iterator.moveNext()));
    } else {
      this.write(iterator.current);
      while (dart.notNull(iterator.moveNext())) {
        this.write(separator);
        this.write(iterator.current);
      }
    }
  }
  clear() {
    this[_contents] = "";
  }
  toString() {
    return _js_helper.Primitives.flattenString(this[_contents]);
  }
  [_writeString](str) {
    this[_contents] = _js_helper.Primitives.stringConcatUnchecked(this[_contents], dart.as(str, String));
  }
}
StringBuffer[dart.implements] = () => [StringSink];
dart.setSignature(StringBuffer, {
  constructors: () => ({StringBuffer: [StringBuffer, [], [Object]]}),
  methods: () => ({
    write: [dart.void, [Object]],
    writeCharCode: [dart.void, [int]],
    writeAll: [dart.void, [Iterable], [String]],
    clear: [dart.void, []],
    [_writeString]: [dart.void, [dart.dynamic]]
  })
});
class StringSink extends Object {}
class Symbol extends Object {
  static new(name) {
    return new _internal.Symbol(name);
  }
}
dart.setSignature(Symbol, {
  constructors: () => ({new: [Symbol, [String]]})
});
class Type extends Object {}
const _userInfo = dart.JsSymbol('_userInfo');
const _host = dart.JsSymbol('_host');
const _port = dart.JsSymbol('_port');
const _path = dart.JsSymbol('_path');
const _query = dart.JsSymbol('_query');
const _fragment = dart.JsSymbol('_fragment');
const _queryParameters = dart.JsSymbol('_queryParameters');
const _writeAuthority = dart.JsSymbol('_writeAuthority');
class Uri extends Object {
  static _defaultPort(scheme) {
    if (scheme == "http") return 80;
    if (scheme == "https") return 443;
    return 0;
  }
  static parse(uri) {
    function isRegName(ch) {
      return dart.notNull(ch) < 128 && !dart.equals(dart.dsend(Uri._regNameTable[dartx.get](dart.notNull(ch) >> 4), '&', 1 << (dart.notNull(ch) & 15)), 0);
    }
    dart.fn(isRegName, bool, [int]);
    let EOI = -1;
    let scheme = "";
    let userinfo = "";
    let host = null;
    let port = null;
    let path = null;
    let query = null;
    let fragment = null;
    let index = 0;
    let pathStart = 0;
    let char = EOI;
    function parseAuth() {
      if (index == uri[dartx.length]) {
        char = EOI;
        return;
      }
      let authStart = index;
      let lastColon = -1;
      let lastAt = -1;
      char = uri[dartx.codeUnitAt](index);
      while (dart.notNull(index) < dart.notNull(uri[dartx.length])) {
        char = uri[dartx.codeUnitAt](index);
        if (char == Uri._SLASH || char == Uri._QUESTION || char == Uri._NUMBER_SIGN) {
          break;
        }
        if (char == Uri._AT_SIGN) {
          lastAt = index;
          lastColon = -1;
        } else if (char == Uri._COLON) {
          lastColon = index;
        } else if (char == Uri._LEFT_BRACKET) {
          lastColon = -1;
          let endBracket = uri[dartx.indexOf](']', dart.notNull(index) + 1);
          if (endBracket == -1) {
            index = uri[dartx.length];
            char = EOI;
            break;
          } else {
            index = endBracket;
          }
        }
        index = dart.notNull(index) + 1;
        char = EOI;
      }
      let hostStart = authStart;
      let hostEnd = index;
      if (dart.notNull(lastAt) >= 0) {
        userinfo = Uri._makeUserInfo(uri, authStart, lastAt);
        hostStart = dart.notNull(lastAt) + 1;
      }
      if (dart.notNull(lastColon) >= 0) {
        let portNumber = null;
        if (dart.notNull(lastColon) + 1 < dart.notNull(index)) {
          portNumber = 0;
          for (let i = dart.notNull(lastColon) + 1; i < dart.notNull(index); i++) {
            let digit = uri[dartx.codeUnitAt](i);
            if (dart.notNull(Uri._ZERO) > dart.notNull(digit) || dart.notNull(Uri._NINE) < dart.notNull(digit)) {
              Uri._fail(uri, i, "Invalid port number");
            }
            portNumber = dart.notNull(portNumber) * 10 + (dart.notNull(digit) - dart.notNull(Uri._ZERO));
          }
        }
        port = Uri._makePort(portNumber, scheme);
        hostEnd = lastColon;
      }
      host = Uri._makeHost(uri, hostStart, hostEnd, true);
      if (dart.notNull(index) < dart.notNull(uri[dartx.length])) {
        char = uri[dartx.codeUnitAt](index);
      }
    }
    dart.fn(parseAuth, dart.void, []);
    let NOT_IN_PATH = 0;
    let IN_PATH = 1;
    let ALLOW_AUTH = 2;
    let state = NOT_IN_PATH;
    let i = index;
    while (dart.notNull(i) < dart.notNull(uri[dartx.length])) {
      char = uri[dartx.codeUnitAt](i);
      if (char == Uri._QUESTION || char == Uri._NUMBER_SIGN) {
        state = NOT_IN_PATH;
        break;
      }
      if (char == Uri._SLASH) {
        state = i == 0 ? ALLOW_AUTH : IN_PATH;
        break;
      }
      if (char == Uri._COLON) {
        if (i == 0) Uri._fail(uri, 0, "Invalid empty scheme");
        scheme = Uri._makeScheme(uri, i);
        i = dart.notNull(i) + 1;
        pathStart = i;
        if (i == uri[dartx.length]) {
          char = EOI;
          state = NOT_IN_PATH;
        } else {
          char = uri[dartx.codeUnitAt](i);
          if (char == Uri._QUESTION || char == Uri._NUMBER_SIGN) {
            state = NOT_IN_PATH;
          } else if (char == Uri._SLASH) {
            state = ALLOW_AUTH;
          } else {
            state = IN_PATH;
          }
        }
        break;
      }
      i = dart.notNull(i) + 1;
      char = EOI;
    }
    index = i;
    if (state == ALLOW_AUTH) {
      dart.assert(char == Uri._SLASH);
      index = dart.notNull(index) + 1;
      if (index == uri[dartx.length]) {
        char = EOI;
        state = NOT_IN_PATH;
      } else {
        char = uri[dartx.codeUnitAt](index);
        if (char == Uri._SLASH) {
          index = dart.notNull(index) + 1;
          parseAuth();
          pathStart = index;
        }
        if (char == Uri._QUESTION || char == Uri._NUMBER_SIGN || char == EOI) {
          state = NOT_IN_PATH;
        } else {
          state = IN_PATH;
        }
      }
    }
    dart.assert(state == IN_PATH || state == NOT_IN_PATH);
    if (state == IN_PATH) {
      while ((index = dart.notNull(index) + 1) < dart.notNull(uri[dartx.length])) {
        char = uri[dartx.codeUnitAt](index);
        if (char == Uri._QUESTION || char == Uri._NUMBER_SIGN) {
          break;
        }
        char = EOI;
      }
      state = NOT_IN_PATH;
    }
    dart.assert(state == NOT_IN_PATH);
    let isFile = scheme == "file";
    let ensureLeadingSlash = host != null;
    path = Uri._makePath(uri, pathStart, index, null, ensureLeadingSlash, isFile);
    if (char == Uri._QUESTION) {
      let numberSignIndex = uri[dartx.indexOf]('#', dart.notNull(index) + 1);
      if (dart.notNull(numberSignIndex) < 0) {
        query = Uri._makeQuery(uri, dart.notNull(index) + 1, uri[dartx.length], null);
      } else {
        query = Uri._makeQuery(uri, dart.notNull(index) + 1, numberSignIndex, null);
        fragment = Uri._makeFragment(uri, dart.notNull(numberSignIndex) + 1, uri[dartx.length]);
      }
    } else if (char == Uri._NUMBER_SIGN) {
      fragment = Uri._makeFragment(uri, dart.notNull(index) + 1, uri[dartx.length]);
    }
    return new Uri._internal(scheme, userinfo, host, port, path, query, fragment);
  }
  static _fail(uri, index, message) {
    dart.throw(new FormatException(message, uri, index));
  }
  _internal(scheme, userInfo, host, port, path, query, fragment) {
    this.scheme = scheme;
    this[_userInfo] = userInfo;
    this[_host] = host;
    this[_port] = port;
    this[_path] = path;
    this[_query] = query;
    this[_fragment] = fragment;
  }
  static new({scheme = "", userInfo = "", host = null, port = null, path = null, pathSegments = null, query = null, queryParameters = null, fragment = null} = {}) {
    scheme = Uri._makeScheme(scheme, Uri._stringOrNullLength(scheme));
    userInfo = Uri._makeUserInfo(userInfo, 0, Uri._stringOrNullLength(userInfo));
    host = Uri._makeHost(host, 0, Uri._stringOrNullLength(host), false);
    if (query == "") query = null;
    query = Uri._makeQuery(query, 0, Uri._stringOrNullLength(query), queryParameters);
    fragment = Uri._makeFragment(fragment, 0, Uri._stringOrNullLength(fragment));
    port = Uri._makePort(port, scheme);
    let isFile = scheme == "file";
    if (host == null && (dart.notNull(userInfo[dartx.isNotEmpty]) || port != null || isFile)) {
      host = "";
    }
    let ensureLeadingSlash = host != null;
    path = Uri._makePath(path, 0, Uri._stringOrNullLength(path), pathSegments, ensureLeadingSlash, isFile);
    return new Uri._internal(scheme, userInfo, host, port, path, query, fragment);
  }
  get queryParameters() {
    if (this[_queryParameters] == null) {
      this[_queryParameters] = new (collection.UnmodifiableMapView$(String, String))(Uri.splitQueryString(this.query));
    }
    return this[_queryParameters];
  }
  static _makePort(port, scheme) {
    if (port != null && port == Uri._defaultPort(scheme)) return null;
    return port;
  }
  static _makeHost(host, start, end, strictIPv6) {
    if (host == null) return null;
    if (start == end) return "";
    if (host[dartx.codeUnitAt](start) == Uri._LEFT_BRACKET) {
      if (host[dartx.codeUnitAt](dart.notNull(end) - 1) != Uri._RIGHT_BRACKET) {
        Uri._fail(host, start, 'Missing end `]` to match `[` in host');
      }
      Uri.parseIPv6Address(host, dart.notNull(start) + 1, dart.notNull(end) - 1);
      return host[dartx.substring](start, end)[dartx.toLowerCase]();
    }
    if (!dart.notNull(strictIPv6)) {
      for (let i = start; dart.notNull(i) < dart.notNull(end); i = dart.notNull(i) + 1) {
        if (host[dartx.codeUnitAt](i) == Uri._COLON) {
          Uri.parseIPv6Address(host, start, end);
          return `[${host}]`;
        }
      }
    }
    return Uri._normalizeRegName(host, start, end);
  }
  static _isRegNameChar(char) {
    return dart.notNull(char) < 127 && !dart.equals(dart.dsend(Uri._regNameTable[dartx.get](dart.notNull(char) >> 4), '&', 1 << (dart.notNull(char) & 15)), 0);
  }
  static _normalizeRegName(host, start, end) {
    let buffer = null;
    let sectionStart = start;
    let index = start;
    let isNormalized = true;
    while (dart.notNull(index) < dart.notNull(end)) {
      let char = host[dartx.codeUnitAt](index);
      if (char == Uri._PERCENT) {
        let replacement = Uri._normalizeEscape(host, index, true);
        if (replacement == null && isNormalized) {
          index = dart.notNull(index) + 3;
          continue;
        }
        if (buffer == null) buffer = new StringBuffer();
        let slice = host[dartx.substring](sectionStart, index);
        if (!isNormalized) slice = slice[dartx.toLowerCase]();
        buffer.write(slice);
        let sourceLength = 3;
        if (replacement == null) {
          replacement = host[dartx.substring](index, dart.notNull(index) + 3);
        } else if (replacement == "%") {
          replacement = "%25";
          sourceLength = 1;
        }
        buffer.write(replacement);
        index = dart.notNull(index) + sourceLength;
        sectionStart = index;
        isNormalized = true;
      } else if (dart.notNull(Uri._isRegNameChar(char))) {
        if (isNormalized && dart.notNull(Uri._UPPER_CASE_A) <= dart.notNull(char) && dart.notNull(Uri._UPPER_CASE_Z) >= dart.notNull(char)) {
          if (buffer == null) buffer = new StringBuffer();
          if (dart.notNull(sectionStart) < dart.notNull(index)) {
            buffer.write(host[dartx.substring](sectionStart, index));
            sectionStart = index;
          }
          isNormalized = false;
        }
        index = dart.notNull(index) + 1;
      } else if (dart.notNull(Uri._isGeneralDelimiter(char))) {
        Uri._fail(host, index, "Invalid character");
      } else {
        let sourceLength = 1;
        if ((dart.notNull(char) & 64512) == 55296 && dart.notNull(index) + 1 < dart.notNull(end)) {
          let tail = host[dartx.codeUnitAt](dart.notNull(index) + 1);
          if ((dart.notNull(tail) & 64512) == 56320) {
            char = 65536 | (dart.notNull(char) & 1023) << 10 | dart.notNull(tail) & 1023;
            sourceLength = 2;
          }
        }
        if (buffer == null) buffer = new StringBuffer();
        let slice = host[dartx.substring](sectionStart, index);
        if (!isNormalized) slice = slice[dartx.toLowerCase]();
        buffer.write(slice);
        buffer.write(Uri._escapeChar(char));
        index = dart.notNull(index) + sourceLength;
        sectionStart = index;
      }
    }
    if (buffer == null) return host[dartx.substring](start, end);
    if (dart.notNull(sectionStart) < dart.notNull(end)) {
      let slice = host[dartx.substring](sectionStart, end);
      if (!isNormalized) slice = slice[dartx.toLowerCase]();
      buffer.write(slice);
    }
    return dart.toString(buffer);
  }
  static _makeScheme(scheme, end) {
    if (end == 0) return "";
    let firstCodeUnit = scheme[dartx.codeUnitAt](0);
    if (!dart.notNull(Uri._isAlphabeticCharacter(firstCodeUnit))) {
      Uri._fail(scheme, 0, "Scheme not starting with alphabetic character");
    }
    let allLowercase = dart.notNull(firstCodeUnit) >= dart.notNull(Uri._LOWER_CASE_A);
    for (let i = 0; i < dart.notNull(end); i++) {
      let codeUnit = scheme[dartx.codeUnitAt](i);
      if (!dart.notNull(Uri._isSchemeCharacter(codeUnit))) {
        Uri._fail(scheme, i, "Illegal scheme character");
      }
      if (dart.notNull(codeUnit) < dart.notNull(Uri._LOWER_CASE_A) || dart.notNull(codeUnit) > dart.notNull(Uri._LOWER_CASE_Z)) {
        allLowercase = false;
      }
    }
    scheme = scheme[dartx.substring](0, end);
    if (!allLowercase) scheme = scheme[dartx.toLowerCase]();
    return scheme;
  }
  static _makeUserInfo(userInfo, start, end) {
    if (userInfo == null) return "";
    return Uri._normalize(userInfo, start, end, dart.as(Uri._userinfoTable, List$(int)));
  }
  static _makePath(path, start, end, pathSegments, ensureLeadingSlash, isFile) {
    if (path == null && pathSegments == null) return dart.notNull(isFile) ? "/" : "";
    if (path != null && pathSegments != null) {
      dart.throw(new ArgumentError('Both path and pathSegments specified'));
    }
    let result = null;
    if (path != null) {
      result = Uri._normalize(path, start, end, dart.as(Uri._pathCharOrSlashTable, List$(int)));
    } else {
      result = pathSegments[dartx.map](dart.fn(s => Uri._uriEncode(dart.as(Uri._pathCharTable, List$(int)), s), String, [String]))[dartx.join]("/");
    }
    if (dart.notNull(dart.as(dart.dload(result, 'isEmpty'), bool))) {
      if (dart.notNull(isFile)) return "/";
    } else if ((dart.notNull(isFile) || dart.notNull(ensureLeadingSlash)) && !dart.equals(dart.dsend(result, 'codeUnitAt', 0), Uri._SLASH)) {
      return `/${result}`;
    }
    return dart.as(result, String);
  }
  static _makeQuery(query, start, end, queryParameters) {
    if (query == null && queryParameters == null) return null;
    if (query != null && queryParameters != null) {
      dart.throw(new ArgumentError('Both query and queryParameters specified'));
    }
    if (query != null) return Uri._normalize(query, start, end, dart.as(Uri._queryCharTable, List$(int)));
    let result = new StringBuffer();
    let first = true;
    queryParameters.forEach(dart.fn((key, value) => {
      if (!first) {
        result.write("&");
      }
      first = false;
      result.write(Uri.encodeQueryComponent(key));
      if (value != null && !dart.notNull(value[dartx.isEmpty])) {
        result.write("=");
        result.write(Uri.encodeQueryComponent(value));
      }
    }, dart.void, [String, String]));
    return dart.toString(result);
  }
  static _makeFragment(fragment, start, end) {
    if (fragment == null) return null;
    return Uri._normalize(fragment, start, end, dart.as(Uri._queryCharTable, List$(int)));
  }
  static _stringOrNullLength(s) {
    return s == null ? 0 : s[dartx.length];
  }
  static _isHexDigit(char) {
    if (dart.notNull(Uri._NINE) >= dart.notNull(char)) return dart.notNull(Uri._ZERO) <= dart.notNull(char);
    char = dart.notNull(char) | 32;
    return dart.notNull(Uri._LOWER_CASE_A) <= dart.notNull(char) && dart.notNull(Uri._LOWER_CASE_F) >= dart.notNull(char);
  }
  static _hexValue(char) {
    dart.assert(Uri._isHexDigit(char));
    if (dart.notNull(Uri._NINE) >= dart.notNull(char)) return dart.notNull(char) - dart.notNull(Uri._ZERO);
    char = dart.notNull(char) | 32;
    return dart.notNull(char) - (dart.notNull(Uri._LOWER_CASE_A) - 10);
  }
  static _normalizeEscape(source, index, lowerCase) {
    dart.assert(source[dartx.codeUnitAt](index) == Uri._PERCENT);
    if (dart.notNull(index) + 2 >= dart.notNull(source[dartx.length])) {
      return "%";
    }
    let firstDigit = source[dartx.codeUnitAt](dart.notNull(index) + 1);
    let secondDigit = source[dartx.codeUnitAt](dart.notNull(index) + 2);
    if (!dart.notNull(Uri._isHexDigit(firstDigit)) || !dart.notNull(Uri._isHexDigit(secondDigit))) {
      return "%";
    }
    let value = dart.notNull(Uri._hexValue(firstDigit)) * 16 + dart.notNull(Uri._hexValue(secondDigit));
    if (dart.notNull(Uri._isUnreservedChar(value))) {
      if (dart.notNull(lowerCase) && dart.notNull(Uri._UPPER_CASE_A) <= value && dart.notNull(Uri._UPPER_CASE_Z) >= value) {
        value = value | 32;
      }
      return String.fromCharCode(value);
    }
    if (dart.notNull(firstDigit) >= dart.notNull(Uri._LOWER_CASE_A) || dart.notNull(secondDigit) >= dart.notNull(Uri._LOWER_CASE_A)) {
      return source[dartx.substring](index, dart.notNull(index) + 3)[dartx.toUpperCase]();
    }
    return null;
  }
  static _isUnreservedChar(ch) {
    return dart.notNull(ch) < 127 && !dart.equals(dart.dsend(Uri._unreservedTable[dartx.get](dart.notNull(ch) >> 4), '&', 1 << (dart.notNull(ch) & 15)), 0);
  }
  static _escapeChar(char) {
    dart.assert(dart.dsend(char, '<=', 1114111));
    let hexDigits = "0123456789ABCDEF";
    let codeUnits = null;
    if (dart.notNull(dart.as(dart.dsend(char, '<', 128), bool))) {
      codeUnits = List.new(3);
      codeUnits[dartx.set](0, Uri._PERCENT);
      codeUnits[dartx.set](1, hexDigits[dartx.codeUnitAt](dart.as(dart.dsend(char, '>>', 4), int)));
      codeUnits[dartx.set](2, hexDigits[dartx.codeUnitAt](dart.as(dart.dsend(char, '&', 15), int)));
    } else {
      let flag = 192;
      let encodedBytes = 2;
      if (dart.notNull(dart.as(dart.dsend(char, '>', 2047), bool))) {
        flag = 224;
        encodedBytes = 3;
        if (dart.notNull(dart.as(dart.dsend(char, '>', 65535), bool))) {
          encodedBytes = 4;
          flag = 240;
        }
      }
      codeUnits = List.new(3 * encodedBytes);
      let index = 0;
      while (--encodedBytes >= 0) {
        let byte = dart.as(dart.dsend(dart.dsend(dart.dsend(char, '>>', 6 * encodedBytes), '&', 63), '|', flag), int);
        codeUnits[dartx.set](index, Uri._PERCENT);
        codeUnits[dartx.set](index + 1, hexDigits[dartx.codeUnitAt](dart.notNull(byte) >> 4));
        codeUnits[dartx.set](index + 2, hexDigits[dartx.codeUnitAt](dart.notNull(byte) & 15));
        index = index + 3;
        flag = 128;
      }
    }
    return String.fromCharCodes(dart.as(codeUnits, Iterable$(int)));
  }
  static _normalize(component, start, end, charTable) {
    let buffer = null;
    let sectionStart = start;
    let index = start;
    while (dart.notNull(index) < dart.notNull(end)) {
      let char = component[dartx.codeUnitAt](index);
      if (dart.notNull(char) < 127 && (dart.notNull(charTable[dartx.get](dart.notNull(char) >> 4)) & 1 << (dart.notNull(char) & 15)) != 0) {
        index = dart.notNull(index) + 1;
      } else {
        let replacement = null;
        let sourceLength = null;
        if (char == Uri._PERCENT) {
          replacement = Uri._normalizeEscape(component, index, false);
          if (replacement == null) {
            index = dart.notNull(index) + 3;
            continue;
          }
          if ("%" == replacement) {
            replacement = "%25";
            sourceLength = 1;
          } else {
            sourceLength = 3;
          }
        } else if (dart.notNull(Uri._isGeneralDelimiter(char))) {
          Uri._fail(component, index, "Invalid character");
        } else {
          sourceLength = 1;
          if ((dart.notNull(char) & 64512) == 55296) {
            if (dart.notNull(index) + 1 < dart.notNull(end)) {
              let tail = component[dartx.codeUnitAt](dart.notNull(index) + 1);
              if ((dart.notNull(tail) & 64512) == 56320) {
                sourceLength = 2;
                char = 65536 | (dart.notNull(char) & 1023) << 10 | dart.notNull(tail) & 1023;
              }
            }
          }
          replacement = Uri._escapeChar(char);
        }
        if (buffer == null) buffer = new StringBuffer();
        buffer.write(component[dartx.substring](sectionStart, index));
        buffer.write(replacement);
        index = dart.notNull(index) + dart.notNull(sourceLength);
        sectionStart = index;
      }
    }
    if (buffer == null) {
      return component[dartx.substring](start, end);
    }
    if (dart.notNull(sectionStart) < dart.notNull(end)) {
      buffer.write(component[dartx.substring](sectionStart, end));
    }
    return dart.toString(buffer);
  }
  static _isSchemeCharacter(ch) {
    return dart.notNull(ch) < 128 && !dart.equals(dart.dsend(Uri._schemeTable[dartx.get](dart.notNull(ch) >> 4), '&', 1 << (dart.notNull(ch) & 15)), 0);
  }
  static _isGeneralDelimiter(ch) {
    return dart.notNull(ch) <= dart.notNull(Uri._RIGHT_BRACKET) && !dart.equals(dart.dsend(Uri._genDelimitersTable[dartx.get](dart.notNull(ch) >> 4), '&', 1 << (dart.notNull(ch) & 15)), 0);
  }
  get hasAuthority() {
    return this[_host] != null;
  }
  toString() {
    let sb = new StringBuffer();
    Uri._addIfNonEmpty(sb, this.scheme, this.scheme, ':');
    if (dart.notNull(this.hasAuthority) || dart.notNull(this.path[dartx.startsWith]("//")) || this.scheme == "file") {
      sb.write("//");
      this[_writeAuthority](sb);
    }
    sb.write(this.path);
    if (this[_query] != null) {
      sb.write("?");
      sb.write(this[_query]);
    }
    if (this[_fragment] != null) {
      sb.write("#");
      sb.write(this[_fragment]);
    }
    return dart.toString(sb);
  }
  get hashCode() {
    function combine(part, current) {
      return dart.as(dart.dsend(dart.dsend(dart.dsend(current, '*', 31), '+', dart.hashCode(part)), '&', 1073741823), int);
    }
    dart.fn(combine, int, [dart.dynamic, dart.dynamic]);
    return combine(this.scheme, combine(this.userInfo, combine(this.host, combine(this.port, combine(this.path, combine(this.query, combine(this.fragment, 1)))))));
  }
  static encodeQueryComponent(component, {encoding = convert.UTF8} = {}) {
    return Uri._uriEncode(dart.as(Uri._unreservedTable, List$(int)), component, {encoding: encoding, spaceToPlus: true});
  }
  static parseIPv4Address(host) {
    function error(msg) {
      dart.throw(new FormatException(`Illegal IPv4 address, ${msg}`));
    }
    dart.fn(error, dart.void, [String]);
    let bytes = host[dartx.split]('.');
    if (bytes[dartx.length] != 4) {
      error('IPv4 address should contain exactly 4 parts');
    }
    return dart.as(bytes[dartx.map](dart.fn(byteString => {
      let byte = int.parse(byteString);
      if (dart.notNull(byte) < 0 || dart.notNull(byte) > 255) {
        error('each part must be in the range of `0..255`');
      }
      return byte;
    }, dart.dynamic, [String]))[dartx.toList](), List$(int));
  }
  static parseIPv6Address(host, start, end) {
    if (start === void 0) start = 0;
    if (end === void 0) end = null;
    if (end == null) end = host[dartx.length];
    function error(msg, position) {
      if (position === void 0) position = null;
      dart.throw(new FormatException(`Illegal IPv6 address, ${msg}`, host, dart.as(position, int)));
    }
    dart.fn(error, dart.void, [String], [dart.dynamic]);
    function parseHex(start, end) {
      if (dart.notNull(end) - dart.notNull(start) > 4) {
        error('an IPv6 part can only contain a maximum of 4 hex digits', start);
      }
      let value = int.parse(host[dartx.substring](start, end), {radix: 16});
      if (dart.notNull(value) < 0 || dart.notNull(value) > (1 << 16) - 1) {
        error('each part must be in the range of `0x0..0xFFFF`', start);
      }
      return value;
    }
    dart.fn(parseHex, int, [int, int]);
    if (dart.notNull(host[dartx.length]) < 2) error('address is too short');
    let parts = dart.list([], int);
    let wildcardSeen = false;
    let partStart = start;
    for (let i = start; dart.notNull(i) < dart.notNull(end); i = dart.notNull(i) + 1) {
      if (host[dartx.codeUnitAt](i) == Uri._COLON) {
        if (i == start) {
          i = dart.notNull(i) + 1;
          if (host[dartx.codeUnitAt](i) != Uri._COLON) {
            error('invalid start colon.', i);
          }
          partStart = i;
        }
        if (i == partStart) {
          if (wildcardSeen) {
            error('only one wildcard `::` is allowed', i);
          }
          wildcardSeen = true;
          parts[dartx.add](-1);
        } else {
          parts[dartx.add](parseHex(partStart, i));
        }
        partStart = dart.notNull(i) + 1;
      }
    }
    if (parts[dartx.length] == 0) error('too few parts');
    let atEnd = partStart == end;
    let isLastWildcard = parts[dartx.last] == -1;
    if (atEnd && !isLastWildcard) {
      error('expected a part after last `:`', end);
    }
    if (!atEnd) {
      try {
        parts[dartx.add](parseHex(partStart, end));
      } catch (e) {
        try {
          let last = Uri.parseIPv4Address(host[dartx.substring](partStart, end));
          parts[dartx.add](dart.notNull(last[dartx.get](0)) << 8 | dart.notNull(last[dartx.get](1)));
          parts[dartx.add](dart.notNull(last[dartx.get](2)) << 8 | dart.notNull(last[dartx.get](3)));
        } catch (e) {
          error('invalid end of IPv6 address.', partStart);
        }

      }

    }
    if (wildcardSeen) {
      if (dart.notNull(parts[dartx.length]) > 7) {
        error('an address with a wildcard must have less than 7 parts');
      }
    } else if (parts[dartx.length] != 8) {
      error('an address without a wildcard must contain exactly 8 parts');
    }
    let bytes = List$(int).new(16);
    for (let i = 0, index = 0; i < dart.notNull(parts[dartx.length]); i++) {
      let value = parts[dartx.get](i);
      if (value == -1) {
        let wildCardLength = 9 - dart.notNull(parts[dartx.length]);
        for (let j = 0; j < wildCardLength; j++) {
          bytes[dartx.set](index, 0);
          bytes[dartx.set](index + 1, 0);
          index = index + 2;
        }
      } else {
        bytes[dartx.set](index, dart.notNull(value) >> 8);
        bytes[dartx.set](index + 1, dart.notNull(value) & 255);
        index = index + 2;
      }
    }
    return dart.as(bytes, List$(int));
  }
  static _uriEncode(canonicalTable, text, {encoding = convert.UTF8, spaceToPlus = false} = {}) {
    function byteToHex(byte, buffer) {
      let hex = '0123456789ABCDEF';
      dart.dsend(buffer, 'writeCharCode', hex[dartx.codeUnitAt](dart.as(dart.dsend(byte, '>>', 4), int)));
      dart.dsend(buffer, 'writeCharCode', hex[dartx.codeUnitAt](dart.as(dart.dsend(byte, '&', 15), int)));
    }
    dart.fn(byteToHex);
    let result = new StringBuffer();
    let bytes = encoding.encode(text);
    for (let i = 0; i < dart.notNull(bytes[dartx.length]); i++) {
      let byte = bytes[dartx.get](i);
      if (dart.notNull(byte) < 128 && (dart.notNull(canonicalTable[dartx.get](dart.notNull(byte) >> 4)) & 1 << (dart.notNull(byte) & 15)) != 0) {
        result.writeCharCode(byte);
      } else if (dart.notNull(spaceToPlus) && byte == Uri._SPACE) {
        result.writeCharCode(Uri._PLUS);
      } else {
        result.writeCharCode(Uri._PERCENT);
        byteToHex(byte, result);
      }
    }
    return dart.toString(result);
  }
  static _isAlphabeticCharacter(codeUnit) {
    return dart.notNull(codeUnit) >= dart.notNull(Uri._LOWER_CASE_A) && dart.notNull(codeUnit) <= dart.notNull(Uri._LOWER_CASE_Z) || dart.notNull(codeUnit) >= dart.notNull(Uri._UPPER_CASE_A) && dart.notNull(codeUnit) <= dart.notNull(Uri._UPPER_CASE_Z);
  }
}
dart.defineNamedConstructor(Uri, '_internal');
dart.setSignature(Uri, {
  constructors: () => ({
    _internal: [Uri, [String, String, String, num, String, String, String]],
    new: [Uri, [], {scheme: String, userInfo: String, host: String, port: int, path: String, pathSegments: Iterable$(String), query: String, queryParameters: Map$(String, String), fragment: String}]
  }),
  statics: () => ({
    _defaultPort: [int, [String]],
    parse: [Uri, [String]],
    _fail: [dart.void, [String, int, String]],
    _makePort: [int, [int, String]],
    _makeHost: [String, [String, int, int, bool]],
    _isRegNameChar: [bool, [int]],
    _normalizeRegName: [String, [String, int, int]],
    _makeScheme: [String, [String, int]],
    _makeUserInfo: [String, [String, int, int]],
    _makePath: [String, [String, int, int, Iterable$(String), bool, bool]],
    _makeQuery: [String, [String, int, int, Map$(String, String)]],
    _makeFragment: [String, [String, int, int]],
    _stringOrNullLength: [int, [String]],
    _isHexDigit: [bool, [int]],
    _hexValue: [int, [int]],
    _normalizeEscape: [String, [String, int, bool]],
    _isUnreservedChar: [bool, [int]],
    _escapeChar: [String, [dart.dynamic]],
    _normalize: [String, [String, int, int, List$(int)]],
    _isSchemeCharacter: [bool, [int]],
    _isGeneralDelimiter: [bool, [int]],
    encodeQueryComponent: [String, [String], {encoding: convert.Encoding}],
    parseIPv4Address: [List$(int), [String]],
    parseIPv6Address: [List$(int), [String], [int, int]],
    _uriEncode: [String, [List$(int), String], {encoding: convert.Encoding, spaceToPlus: bool}],
    _isAlphabeticCharacter: [bool, [int]]
  }),
  names: ['_defaultPort', 'parse', '_fail', '_makePort', '_makeHost', '_isRegNameChar', '_normalizeRegName', '_makeScheme', '_makeUserInfo', '_makePath', '_makeQuery', '_makeFragment', '_stringOrNullLength', '_isHexDigit', '_hexValue', '_normalizeEscape', '_isUnreservedChar', '_escapeChar', '_normalize', '_isSchemeCharacter', '_isGeneralDelimiter', 'encodeQueryComponent', 'parseIPv4Address', 'parseIPv6Address', '_uriEncode', '_isAlphabeticCharacter']
});
Uri._SPACE = 32;
Uri._PERCENT = 37;
Uri._PLUS = 43;
Uri._SLASH = 47;
Uri._ZERO = 48;
Uri._NINE = 57;
Uri._COLON = 58;
Uri._UPPER_CASE_A = 65;
Uri._UPPER_CASE_Z = 90;
Uri._LEFT_BRACKET = 91;
Uri._RIGHT_BRACKET = 93;
Uri._LOWER_CASE_A = 97;
Uri._LOWER_CASE_F = 102;
Uri._LOWER_CASE_Z = 122;
Uri._unreservedTable = dart.const([0, 0, 24576, 1023, 65534, 34815, 65534, 18431]);
Uri._schemeTable = dart.const([0, 0, 26624, 1023, 65534, 2047, 65534, 2047]);
Uri._genDelimitersTable = dart.const([0, 0, 32776, 33792, 1, 10240, 0, 0]);
Uri._userinfoTable = dart.const([0, 0, 32722, 12287, 65534, 34815, 65534, 18431]);
Uri._regNameTable = dart.const([0, 0, 32754, 11263, 65534, 34815, 65534, 18431]);
Uri._pathCharTable = dart.const([0, 0, 32722, 12287, 65535, 34815, 65534, 18431]);
Uri._pathCharOrSlashTable = dart.const([0, 0, 65490, 12287, 65535, 34815, 65534, 18431]);
Uri._queryCharTable = dart.const([0, 0, 65490, 45055, 65535, 34815, 65534, 18431]);
// Exports:
exports.Object = Object;
exports.bool = bool;
exports.Comparator$ = Comparator$;
exports.Comparator = Comparator;
exports.Comparable$ = Comparable$;
exports.Comparable = Comparable;
exports.DateTime = DateTime;
exports.num = num;
exports.double = double;
exports.Duration = Duration;
exports.Error = Error;
exports.AssertionError = AssertionError;
exports.CastError = CastError;
exports.NullThrownError = NullThrownError;
exports.ArgumentError = ArgumentError;
exports.RangeError = RangeError;
exports.IndexError = IndexError;
exports.NoSuchMethodError = NoSuchMethodError;
exports.UnsupportedError = UnsupportedError;
exports.StateError = StateError;
exports.ConcurrentModificationError = ConcurrentModificationError;
exports.Exception = Exception;
exports.FormatException = FormatException;
exports.Expando$ = Expando$;
exports.Expando = Expando;
exports.Function = Function;
exports.identical = identical;
exports.identityHashCode = identityHashCode;
exports.int = int;
exports.Invocation = Invocation;
exports.Iterable$ = Iterable$;
exports.Iterable = Iterable;
exports.BidirectionalIterator$ = BidirectionalIterator$;
exports.BidirectionalIterator = BidirectionalIterator;
exports.Iterator$ = Iterator$;
exports.Iterator = Iterator;
exports.List$ = List$;
exports.List = List;
exports.Map$ = Map$;
exports.Map = Map;
exports.Null = Null;
exports.Pattern = Pattern;
exports.print = print;
exports.Match = Match;
exports.RegExp = RegExp;
exports.Set$ = Set$;
exports.Sink$ = Sink$;
exports.Sink = Sink;
exports.StackTrace = StackTrace;
exports.Stopwatch = Stopwatch;
exports.String = String;
exports.RuneIterator = RuneIterator;
exports.StringBuffer = StringBuffer;
exports.StringSink = StringSink;
exports.Symbol = Symbol;
exports.Type = Type;
exports.Uri = Uri;
