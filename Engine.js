"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.Engine = void 0;
const EventEmitter_1 = require("@dom111/typed-event-emitter/EventEmitter");
class Engine extends EventEmitter_1.default {
    constructor() {
        super(...arguments);
        this._options = {};
        this._started = false;
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
        return this._options[key] || defaultValue;
    }
    setOption(key, value) {
        if (this._options[key] !== value) {
            this._options[key] = value;
            this.emit('option:changed', key, value);
        }
    }
    start() {
        if (this._started) {
            return;
        }
        this._started = true;
        this.emit('engine:initialise');
        this.loadPlugins().then(() => {
            this.emit('engine:start');
        });
    }
}
exports.Engine = Engine;
exports.instance = new Engine();
exports.default = Engine;
//# sourceMappingURL=Engine.js.map