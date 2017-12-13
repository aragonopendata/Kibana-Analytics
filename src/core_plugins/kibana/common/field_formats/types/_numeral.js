'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Numeral = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _numeral = require('@elastic/numeral');

var _numeral2 = _interopRequireDefault(_numeral);

var _field_format = require('../../../../../ui/field_formats/field_format');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const numeralInst = (0, _numeral2.default)();

class Numeral extends _field_format.FieldFormat {
  _convert(val) {
    if (val === -Infinity) return '-∞';
    if (val === +Infinity) return '+∞';
    if (typeof val !== 'number') {
      val = parseFloat(val);
    }

    if (isNaN(val)) return '';

    return numeralInst.set(val).format(this.param('pattern'));
  }

  static factory(opts) {
    class Class extends Numeral {
      constructor(params, getConfig) {
        super(params);

        this.getConfig = getConfig;
      }

      getParamDefaults() {
        if (_lodash2.default.has(opts, 'getParamDefaults')) {
          return opts.getParamDefaults(this.getConfig);
        }

        return {
          pattern: this.getConfig(`format:${opts.id}:defaultPattern`)
        };
      }

    }

    Class.id = opts.id;
    Class.title = opts.title;
    Class.fieldType = 'number';
    if (opts.prototype) {
      _lodash2.default.assign(Class.prototype, opts.prototype);
    }

    return Class;
  }
}
exports.Numeral = Numeral;
