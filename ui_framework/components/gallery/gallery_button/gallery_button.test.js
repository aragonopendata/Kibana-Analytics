'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _required_props = require('../../../test/required_props');

var _gallery_button = require('./gallery_button');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('renders KuiGalleryButton href', () => {
  const component = _react2.default.createElement(
    _gallery_button.KuiGalleryButton,
    _extends({ href: '#' }, _required_props.requiredProps),
    'children'
  );
  expect((0, _enzyme.render)(component)).toMatchSnapshot();
});
