import EventEmitter from '@dom111/typed-event-emitter/EventEmitter';

export interface IEngine {
  debug(callback: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
  option(key: string, defaultValue: any): any;
  setOption(key: string, value: any): void;
  start(): void;
}

export class Engine extends EventEmitter implements IEngine {
  #options: {
    [key: string]: any;
  } = {};
  #started: boolean = false;

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
    return this.#options[key] || defaultValue;
  }

  setOption(key: string, value: any): void {
    if (this.#options[key] !== value) {
      this.#options[key] = value;

      this.emit('option:changed', key, value);
    }
  }

  start(): void {
    if (this.#started) {
      return;
    }

    this.#started = true;

    this.emit('engine:initialise');

    this.loadPlugins().then((): void => {
      this.emit('engine:start');
    });
  }
}

export const instance: Engine = new Engine();

export default Engine;
