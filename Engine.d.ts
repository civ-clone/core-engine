import EventEmitter from '@dom111/typed-event-emitter/EventEmitter';
export interface IEngine {
  debug(callback: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
  option(key: string, defaultValue: any): any;
  setOption(key: string, value: any): void;
  start(): void;
}
export declare class Engine extends EventEmitter implements IEngine {
  #private;
  debug(callback: (...args: any[]) => void): void;
  emit(event: string | number, ...args: any[]): void;
  loadPlugins(): Promise<void>;
  /**
   * Options are per-instance settings that affect only the current instance.
   */
  option(key: string, defaultValue?: any): any;
  setOption(key: string, value: any): void;
  start(): void;
}
export declare const instance: Engine;
export default Engine;
