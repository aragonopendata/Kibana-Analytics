'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.comboBoxKeyCodes = undefined;

var _key_codes = require('../key_codes');

const comboBoxKeyCodes = exports.comboBoxKeyCodes = {
  DOWN: _key_codes.DOWN_KEY_CODE,
  ENTER: _key_codes.ENTER_KEY_CODE,
  ESC: _key_codes.ESC_KEY_CODE,
  TAB: _key_codes.TAB_KEY_CODE,
  UP: _key_codes.UP_KEY_CODE
}; /**
    * These keys are used for navigating combobox UI components.
    *
    * UP: Select the previous item in the list.
    * DOWN: Select the next item in the list.
    * ENTER / TAB: Complete input with the current selection.
    * ESC: Deselect the current selection and hide the list.
    */
