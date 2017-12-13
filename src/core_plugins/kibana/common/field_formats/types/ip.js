'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IpFormat = undefined;

var _field_format = require('../../../../../ui/field_formats/field_format');

class IpFormat extends _field_format.FieldFormat {
  _convert(val) {
    if (val === undefined || val === null) return '-';
    if (!isFinite(val)) return val;

    // shazzam!
    return [val >>> 24, val >>> 16 & 0xFF, val >>> 8 & 0xFF, val & 0xFF].join('.');
  }

}
exports.IpFormat = IpFormat;
IpFormat.id = 'ip';
IpFormat.title = 'IP Address';
IpFormat.fieldType = 'ip';
