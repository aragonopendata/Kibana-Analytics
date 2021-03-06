'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UrlFormat = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _field_format = require('../../../../../ui/field_formats/field_format');

var _highlight_html = require('../../highlight/highlight_html');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const templateMatchRE = /{{([\s\S]+?)}}/g;

class UrlFormat extends _field_format.FieldFormat {
  constructor(params) {
    super(params);
    this._compileTemplate = _lodash2.default.memoize(this._compileTemplate);
  }

  getParamDefaults() {
    return {
      type: 'a',
      urlTemplate: null,
      labelTemplate: null
    };
  }

  _formatLabel(value, url) {
    const template = this.param('labelTemplate');
    if (url == null) url = this._formatUrl(value);
    if (!template) return url;

    return this._compileTemplate(template)({
      value: value,
      url: url
    });
  }

  _formatUrl(value) {
    const template = this.param('urlTemplate');
    if (!template) return value;

    return this._compileTemplate(template)({
      value: encodeURIComponent(value),
      rawValue: value
    });
  }

  _compileTemplate(template) {
    const parts = template.split(templateMatchRE).map(function (part, i) {
      // trim all the odd bits, the variable names
      return i % 2 ? part.trim() : part;
    });

    return function (locals) {
      // replace all the odd bits with their local var
      let output = '';
      let i = -1;
      while (++i < parts.length) {
        if (i % 2) {
          if (locals.hasOwnProperty(parts[i])) {
            const local = locals[parts[i]];
            output += local == null ? '' : local;
          }
        } else {
          output += parts[i];
        }
      }

      return output;
    };
  }

}

exports.UrlFormat = UrlFormat;
UrlFormat.id = 'url';
UrlFormat.title = 'Url';
UrlFormat.fieldType = ['number', 'boolean', 'date', 'ip', 'string', 'murmur3', 'unknown', 'conflict'];
UrlFormat.prototype._convert = {
  text: function text(value) {
    return this._formatLabel(value);
  },

  html: function html(rawValue, field, hit) {
    const url = _lodash2.default.escape(this._formatUrl(rawValue));
    const label = _lodash2.default.escape(this._formatLabel(rawValue, url));

    switch (this.param('type')) {
      case 'img':
        // If the URL hasn't been formatted to become a meaningful label then the best we can do
        // is tell screen readers where the image comes from.
        const imageLabel = label === url ? `A dynamically-specified image located at ${url}` : label;

        return `<img src="${url}" alt="${imageLabel}">`;
      default:
        let linkLabel;

        if (hit && hit.highlight && hit.highlight[field.name]) {
          linkLabel = (0, _highlight_html.getHighlightHtml)(label, hit.highlight[field.name]);
        } else {
          linkLabel = label;
        }

        //DxD Custom
        linkLabel = linkLabel.substring(7,linkLabel.length);
        var splited = linkLabel.split("/");
        if (splited.length > 5) {
          linkLabel = splited[0] +"/" +  splited[1] +"/.../" +  splited[splited.length-2] + "/" + splited[splited.length-1];
        }
        linkLabel = "http://" + linkLabel;
        if(linkLabel.length > 100){
          linkLabel = linkLabel.substring(0,100) + "...";
        }
        //END DxD Custom

        return `<a href="${url}" target="_blank">${linkLabel}</a>`;
    }
  }
};


