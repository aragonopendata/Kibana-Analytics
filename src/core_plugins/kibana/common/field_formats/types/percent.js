'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PercentFormat = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _numeral = require('./_numeral');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PercentFormat = exports.PercentFormat = _numeral.Numeral.factory({
  id: 'percent',
  title: 'Percentage',
  getParamDefaults: getConfig => {
    return {
      pattern: getConfig('format:percent:defaultPattern'),
      fractional: true
    };
  },
  prototype: {
    _convert: _lodash2.default.compose(_numeral.Numeral.prototype._convert, function (val) {
      return this.param('fractional') ? val : val / 100;
    })
  }
});
