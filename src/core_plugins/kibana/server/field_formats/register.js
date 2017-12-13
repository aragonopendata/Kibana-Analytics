'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFieldFormats = registerFieldFormats;

var _url = require('../../common/field_formats/types/url');

var _bytes = require('../../common/field_formats/types/bytes');

var _date = require('../../common/field_formats/types/date');

var _duration = require('../../common/field_formats/types/duration');

var _ip = require('../../common/field_formats/types/ip');

var _number = require('../../common/field_formats/types/number');

var _percent = require('../../common/field_formats/types/percent');

var _string = require('../../common/field_formats/types/string');

var _source = require('../../common/field_formats/types/source');

var _color = require('../../common/field_formats/types/color');

var _truncate = require('../../common/field_formats/types/truncate');

var _boolean = require('../../common/field_formats/types/boolean');

function registerFieldFormats(server) {
  server.registerFieldFormatClass(_url.UrlFormat);
  server.registerFieldFormatClass(_bytes.BytesFormat);
  server.registerFieldFormatClass(_date.DateFormat);
  server.registerFieldFormatClass(_duration.DurationFormat);
  server.registerFieldFormatClass(_ip.IpFormat);
  server.registerFieldFormatClass(_number.NumberFormat);
  server.registerFieldFormatClass(_percent.PercentFormat);
  server.registerFieldFormatClass(_string.StringFormat);
  server.registerFieldFormatClass(_source.SourceFormat);
  server.registerFieldFormatClass(_color.ColorFormat);
  server.registerFieldFormatClass(_truncate.TruncateFormat);
  server.registerFieldFormatClass(_boolean.BoolFormat);
}
