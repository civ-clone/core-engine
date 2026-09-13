"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.Engine = void 0;
const EventEmitter_1 = require("@dom111/typed-event-emitter/EventEmitter");
class Engine extends EventEmitter_1.default {
    constructor() {
        super(...arguments);
        this._options = {};
        this._plugins = {};
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
    /**
     * Every loaded package and its exact version, for a save to record.
     *
     * Plugins load as bare side-effect imports from a list the host generates —
     * nothing announces itself, so there is no manifest to read back. Rather than
     * have 123 packages each call `registerPlugins` with their own name, the host
     * that generated the import list registers the whole manifest: it is the one
     * place that already knows both the names and the versions, and it cannot
     * drift out of step with the imports it wrote.
     *
     * A save uses this for three-tier compatibility — refuse a missing plugin,
     * allow an extra one, warn on a version change. An empty manifest therefore
     * means "cannot check", not "nothing loaded", and `core-save-game` refuses to
     * *write* a save without one rather than emitting a file that silently
     * cannot be validated.
     */
    plugins() {
        return { ...this._plugins };
    }
    /**
     * Merge into the manifest. Additive, because a host may register in more than
     * one batch, and last write wins for a name registered twice.
     */
    registerPlugins(plugins) {
        Object.assign(this._plugins, plugins);
        this.emit('plugins:registered', plugins);
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