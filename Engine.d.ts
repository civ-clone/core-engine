import EventEmitter from '@dom111/typed-event-emitter/EventEmitter';
/** Package name → exact version, as loaded. */
export declare type PluginManifest = {
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
export declare class Engine extends EventEmitter implements IEngine {
  private _options;
  private _plugins;
  private _started;
  debug(callback: (...args: any[]) => void): void;
  emit(event: string | number, ...args: any[]): void;
  loadPlugins(): Promise<void>;
  /**
   * Options are per-instance settings that affect only the current instance.
   */
  option(key: string, defaultValue?: any): any;
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
  plugins(): PluginManifest;
  /**
   * Merge into the manifest. Additive, because a host may register in more than
   * one batch, and last write wins for a name registered twice.
   */
  registerPlugins(plugins: PluginManifest): void;
  setOption(key: string, value: any): void;
  start(): void;
}
export declare const instance: Engine;
export default Engine;
