'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BoolFormat = undefined;

var _as_pretty_string = require('../../utils/as_pretty_string');

var _field_format = require('../../../../../ui/field_formats/field_format');

class BoolFormat extends _field_format.FieldFormat {
  _convert(value) {
    if (typeof value === 'string') {
      value = value.trim().toLowerCase();
    }

    switch (value) {
      case false:
      case 0:
      case 'false':
      case 'no':
        return 'false';
      case true:
      case 1:
      case 'true':
      case 'yes':
        return 'true';
      default:
        return (0, _as_pretty_string.asPrettyString)(value);
    }
  }

}
exports.BoolFormat = BoolFormat;
BoolFormat.id = 'boolean';
BoolFormat.title = 'Boolean';
BoolFormat.fieldType = ['boolean', 'number', 'string'];
