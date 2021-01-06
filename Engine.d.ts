/// <reference types="node" />
import { EventEmitter } from 'events';
import * as fsModule from 'fs';
import { IOptions } from 'glob';
interface IGlob {
  sync(pattern: string, options?: IOptions): string[];
}
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
  emit(event: string | symbol, ...args: any[]): boolean;
  getPackages(glob?: IGlob, fs?: typeof fsModule): string[];
  loadPlugins(): Promise<boolean>;
  /**
   * Options are per-instance settings that affect only the current instance.
   */
  option(key: string, defaultValue?: any): any;
  setOption(key: string, value: any): void;
  start(): void;
}
export declare const instance: Engine;
export default Engine;
