"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Engine_options, _Engine_started;
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.Engine = void 0;
const EventEmitter_1 = require("@dom111/typed-event-emitter/EventEmitter");
class Engine extends EventEmitter_1.default {
    constructor() {
        super(...arguments);
        _Engine_options.set(this, {});
        _Engine_started.set(this, false);
    }
    debug(callback) {
        if (!this.option('debug')) {
            return;
        }
        return callback();
    }
    emit(event, ...args) {
        this.debug(() => console.log(`Engine#emit: ${String(event)}: ${args}`));
        return super.emit(event, ...args);
    }
    loadPlugins() {
        this.emit('plugins:load:start');
        return new Promise((resolve, reject) => {
            this.once('plugins:load:end', () => resolve());
        });
    }
    /**
     * Options are per-instance settings that affect only the current instance.
     */
    option(key, defaultValue = null) {
        return __classPrivateFieldGet(this, _Engine_options, "f")[key] || defaultValue;
    }
    setOption(key, value) {
        if (__classPrivateFieldGet(this, _Engine_options, "f")[key] !== value) {
            __classPrivateFieldGet(this, _Engine_options, "f")[key] = value;
            this.emit('option:changed', key, value);
        }
    }
    start() {
        if (__classPrivateFieldGet(this, _Engine_started, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _Engine_started, true, "f");
        this.emit('engine:initialise');
        this.loadPlugins().then(() => {
            this.emit('engine:start');
        });
    }
}
exports.Engine = Engine;
_Engine_options = new WeakMap(), _Engine_started = new WeakMap();
exports.instance = new Engine();
exports.default = Engine;
//# sourceMappingURL=Engine.js.map