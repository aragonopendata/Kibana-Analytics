'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StringFormat = undefined;

var _as_pretty_string = require('../../utils/as_pretty_string');

var _field_format = require('../../../../../ui/field_formats/field_format');

var _shorten_dotted_string = require('../../utils/shorten_dotted_string');

class StringFormat extends _field_format.FieldFormat {
  getParamDefaults() {
    return {
      transform: false
    };
  }

  _base64Decode(val) {
    try {
      return Buffer.from(val, 'base64').toString('utf8');
    } catch (e) {
      return (0, _as_pretty_string.asPrettyString)(val);
    }
  }

  _toTitleCase(val) {
    return val.replace(/\w\S*/g, txt => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  _convert(val) {
    switch (this.param('transform')) {
      case 'lower':
        return String(val).toLowerCase();
      case 'upper':
        return String(val).toUpperCase();
      case 'title':
        return this._toTitleCase(val);
      case 'short':
        return (0, _shorten_dotted_string.shortenDottedString)(val);
      case 'base64':
        return this._base64Decode(val);
      default:
        return (0, _as_pretty_string.asPrettyString)(val);
    }
  }

}
exports.StringFormat = StringFormat;
StringFormat.id = 'string';
StringFormat.title = 'String';
StringFormat.fieldType = ['number', 'boolean', 'date', 'ip', 'attachment', 'geo_point', 'geo_shape', 'string', 'murmur3', 'unknown', 'conflict'];
