'use strict';
exports.__esModule = true;
function requireSelector2(parent, selector) {
    var element = parent.querySelector(selector);
    if (element === null) {
        throw new Error();
    }
    return element;
}
exports.requireSelector2 = requireSelector2;
function requireSelector(parent, selector) {
    return requireSelector2(parent, selector);
}
exports.requireSelector = requireSelector;
