'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _required_props = require('../../../test/required_props');

var _gallery_button_label = require('./gallery_button_label');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('renders KuiGalleryButtonLabel', () => {
  const component = _react2.default.createElement(
    _gallery_button_label.KuiGalleryButtonLabel,
    _required_props.requiredProps,
    'children'
  );
  expect((0, _enzyme.render)(component)).toMatchSnapshot();
});
