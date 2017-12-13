'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KuiColorPicker = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactColor = require('react-color');

var _color_picker_swatch = require('./color_picker_swatch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class KuiColorPicker extends _react2.default.Component {
  constructor(props) {
    super(props);

    this.closeColorSelector = () => {
      if (this.clickedMyself) {
        this.clickedMyself = false;
        return;
      }
      this.setState({ showColorSelector: false });
    };

    this.toggleColorSelector = () => {
      this.setState({ showColorSelector: !this.state.showColorSelector });
    };

    this.handleColorSelection = color => {
      this.props.onChange(color.hex);
    };

    this.onClickRootElement = () => {
      // This prevents clicking on the element from closing it, due to the event handler on the
      // document object.
      this.clickedMyself = true;
    };

    this.state = {
      showColorSelector: false
    };
    // Use this variable to differentiate between clicks on the element that should not cause the pop up
    // to close, and external clicks that should cause the pop up to close.
    this.clickedMyself = false;
  }

  componentDidMount() {
    // When the user clicks somewhere outside of the color picker, we will dismiss it.
    document.addEventListener('click', this.closeColorSelector);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeColorSelector);
  }

  getColorLabel() {
    const color = this.props.color;

    const colorValue = color === null ? '(transparent)' : color;
    return _react2.default.createElement(
      'div',
      {
        className: 'kuiColorPicker__label',
        'aria-label': `Color selection is ${colorValue}`
      },
      colorValue
    );
  }

  render() {
    var _props = this.props;
    const color = _props.color,
          className = _props.className,
          showColorLabel = _props.showColorLabel;

    const classes = (0, _classnames2.default)('kuiColorPicker', className);
    return _react2.default.createElement(
      'div',
      {
        className: classes,
        'data-test-subj': this.props['data-test-subj'],
        onClick: this.onClickRootElement
      },
      _react2.default.createElement(
        'div',
        {
          className: 'kuiColorPicker__preview',
          onClick: this.toggleColorSelector
        },
        _react2.default.createElement(_color_picker_swatch.KuiColorPickerSwatch, { color: color, 'aria-label': this.props['aria-label'] }),
        showColorLabel ? this.getColorLabel() : null
      ),
      this.state.showColorSelector ? _react2.default.createElement(
        'div',
        { className: 'kuiColorPickerPopUp', 'data-test-subj': 'colorPickerPopup' },
        _react2.default.createElement(_reactColor.ChromePicker, {
          color: color ? color : '#ffffff',
          disableAlpha: true,
          onChange: this.handleColorSelection
        })
      ) : null
    );
  }
}

exports.KuiColorPicker = KuiColorPicker;
KuiColorPicker.propTypes = {
  className: _propTypes2.default.string,
  color: _propTypes2.default.string,
  onChange: _propTypes2.default.func.isRequired,
  showColorLabel: _propTypes2.default.bool
};

KuiColorPicker.defaultProps = {
  'aria-label': 'Select a color',
  showColorLabel: true
};
