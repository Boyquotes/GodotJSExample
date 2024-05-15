"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tool_ = exports.onready_ = exports.export_ = exports.signal_ = void 0;
/**
 *
 */
function signal_() {
    return function (target, key) {
        jsb.internal.add_script_signal(target, key);
    };
}
exports.signal_ = signal_;
function export_(type, details) {
    return function (target, key) {
        let ebd = Object.assign({ name: key, type: type }, details);
        jsb.internal.add_script_property(target, ebd);
    };
}
exports.export_ = export_;
/**
 * auto initialized on ready (before _ready called)
 * @param evaluator for now, only string is accepted
 */
function onready_(evaluator) {
    return function (target, key) {
        let ebd = { name: key, evaluator: evaluator };
        jsb.internal.add_script_ready(target, ebd);
    };
}
exports.onready_ = onready_;
function tool_() {
    return function (target) {
        jsb.internal.add_script_tool(target);
    };
}
exports.tool_ = tool_;
//# sourceMappingURL=jsb.core.js.map