"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _options, _started;
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.Engine = void 0;
const events_1 = require("events");
const Start_1 = require("./Rules/Start");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const loadJSONSync_1 = require("./lib/loadJSONSync");
const fsModule = require("fs");
const globModule = require("glob");
const path = require("path");
class Engine extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        _options.set(this, {});
        _started.set(this, false);
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
    getPackages(glob = globModule, fs = fsModule) {
        var _a;
        const packageDetails = loadJSONSync_1.default('./package.json'), paths = ((_a = packageDetails === null || packageDetails === void 0 ? void 0 : packageDetails['civ-clone']) === null || _a === void 0 ? void 0 : _a.paths) || [
            './node_modules/@civ-clone/*',
        ], packages = [];
        paths.forEach((pathName) => {
            (glob.sync(pathName) || []).forEach((pathName) => {
                try {
                    fs.accessSync(pathName);
                    const packagePath = path.resolve(pathName, 'package.json');
                    fs.accessSync(packagePath);
                    const packageDetails = loadJSONSync_1.default(packagePath);
                    if (typeof packageDetails.main === 'string') {
                        const main = path.resolve(pathName, packageDetails.main);
                        fs.accessSync(main);
                        packages.push(main);
                        return;
                    }
                    const index = path.resolve(pathName, 'index.js');
                    fs.accessSync(index);
                    packages.push(index);
                    return;
                }
                catch (e) {
                    this.emit('engine:plugins:load:read-path:failed', pathName);
                }
            });
        });
        return packages;
    }
    loadPlugins() {
        this.emit('engine:plugins:load');
        return Promise.all(this.getPackages().map((packageName) => Promise.resolve().then(() => require(packageName)).then(() => this.emit('engine:plugins:load:success', packageName))
            .catch(() => this.emit('engine:plugins:load:failed', packageName)))).then(() => this.emit('engine:plugins-loaded'));
    }
    /**
     * Options are per-instance settings that affect only the current instance.
     */
    option(key, defaultValue = null) {
        return __classPrivateFieldGet(this, _options)[key] || defaultValue;
    }
    setOption(key, value) {
        if (__classPrivateFieldGet(this, _options)[key] !== value) {
            __classPrivateFieldGet(this, _options)[key] = value;
            this.emit('option:changed', key, value);
        }
    }
    start() {
        if (__classPrivateFieldGet(this, _started)) {
            return;
        }
        __classPrivateFieldSet(this, _started, true);
        this.emit('engine:initialise');
        this.loadPlugins().then(() => {
            // TODO: it might be that this can be entirely removed and we don't need to rely on Events at all...
            this.emit('engine:start');
            RuleRegistry_1.instance.process(Start_1.default);
        });
    }
}
exports.Engine = Engine;
_options = new WeakMap(), _started = new WeakMap();
exports.instance = new Engine();
exports.default = Engine;
//# sourceMappingURL=Engine.js.map