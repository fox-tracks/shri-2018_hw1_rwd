'use strict';
exports.__esModule = true;
function requireSelector(parent, selector) {
    var element = parent.querySelector(selector);
    if (!(element instanceof HTMLElement)) {
        throw new Error();
    }
    return element;
}
exports.requireSelector = requireSelector;
