import EventEmitter from '@dom111/typed-event-emitter/EventEmitter';

/** Package name → exact version, as loaded. */
export type PluginManifest = {
  [name: string]: string;
};

export interface IEngine {
  debug(callback: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
  option(key: string, defaultValue: any): any;
  plugins(): PluginManifest;
  registerPlugins(plugins: PluginManifest): void;
  setOption(key: string, value: any): void;
  start(): void;
}

export class Engine extends EventEmitter implements IEngine {
  private _options: {
    [key: string]: any;
  } = {};
  private _plugins: PluginManifest = {};
  private _started: boolean = false;

  debug(callback: (...args: any[]) => void): void {
    if (!this.option('debug')) {
      return;
    }

    return callback();
  }

  emit(event: string | number, ...args: any[]): void {
    this.debug((): void =>
      console.log(`Engine#emit: ${String(event)}: ${args}`)
    );

    return super.emit(event, ...args);
  }

  loadPlugins(): Promise<void> {
    this.emit('plugins:load:start');

    return new Promise((resolve, reject) => {
      this.once('plugins:load:end', () => resolve());
    });
  }

  /**
   * Options are per-instance settings that affect only the current instance.
   */
  option(key: string, defaultValue: any = null): any {
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
  plugins(): PluginManifest {
    return { ...this._plugins };
  }

  /**
   * Merge into the manifest. Additive, because a host may register in more than
   * one batch, and last write wins for a name registered twice.
   */
  registerPlugins(plugins: PluginManifest): void {
    Object.assign(this._plugins, plugins);

    this.emit('plugins:registered', plugins);
  }

  setOption(key: string, value: any): void {
    if (this._options[key] !== value) {
      this._options[key] = value;

      this.emit('option:changed', key, value);
    }
  }

  start(): void {
    if (this._started) {
      return;
    }

    this._started = true;

    this.emit('engine:initialise');

    this.loadPlugins().then((): void => {
      this.emit('engine:start');
    });
  }
}

export const instance: Engine = new Engine();

export default Engine;
