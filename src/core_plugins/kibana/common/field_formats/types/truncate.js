'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TruncateFormat = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _field_format = require('../../../../../ui/field_formats/field_format');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const omission = '...';

class TruncateFormat extends _field_format.FieldFormat {
  _convert(val) {
    const length = this.param('fieldLength');
    if (length > 0) {
      return _lodash2.default.trunc(val, {
        'length': length + omission.length,
        'omission': omission
      });
    }

    return val;
  }

}
exports.TruncateFormat = TruncateFormat;
TruncateFormat.id = 'truncate';
TruncateFormat.title = 'Truncated String';
TruncateFormat.fieldType = ['string'];
